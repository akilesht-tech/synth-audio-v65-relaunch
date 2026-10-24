require('dotenv').config();

const http=require('http');
const fs=require('fs');
const path=require('path');
const os=require('os');
const crypto=require('crypto');
const zlib=require('zlib');
const {spawnSync}=require('child_process');
const {URL}=require('url');
let S3Client,PutObjectCommand,GetObjectCommand,HeadObjectCommand,DeleteObjectCommand;
let getSignedUrl;
try{({S3Client,PutObjectCommand,GetObjectCommand,HeadObjectCommand,DeleteObjectCommand}=require('@aws-sdk/client-s3'))}catch{}
try{({getSignedUrl}=require('@aws-sdk/s3-request-presigner'))}catch{}

const ROOT=__dirname, PUBLIC=path.join(ROOT,'public');
// Railway: set STORAGE_DIR to the mount point of a persistent Volume (for example /app/storage).
// Local development keeps the historical data/ and public/uploads/ layout by default.
const IS_VERCEL=!!(process.env.VERCEL || process.env.NOW_REGION);
const STORAGE=path.resolve(process.env.STORAGE_DIR||path.join(ROOT,'data'));
const DATA=STORAGE;
const UP=IS_VERCEL?path.join(require('os').tmpdir(),'synth-uploads'):path.join(STORAGE,'uploads');
if(!IS_VERCEL){
  try{fs.mkdirSync(DATA,{recursive:true})}catch{}
  try{fs.mkdirSync(UP,{recursive:true})}catch{}
}else{
  try{fs.mkdirSync(UP,{recursive:true})}catch{}
}
const DB=path.join(DATA,'db.json');

// Optional Backblaze B2 S3-compatible storage. Local mode remains unchanged when credentials are absent.
const B2_BUCKET=String(process.env.BUCKET||'').trim();
const B2_ENDPOINT=String(process.env.ENDPOINT||'').trim();
const B2_ACCESS_KEY=String(process.env.ACCESS_KEY_ID||'').trim();
const B2_SECRET_KEY=String(process.env.SECRET_ACCESS_KEY||'').trim();
const B2_ENABLED=!!(S3Client&&B2_BUCKET&&B2_ENDPOINT&&B2_ACCESS_KEY&&B2_SECRET_KEY && process.env.NODE_ENV!=='test');
let NodeHttpHandler;try{({NodeHttpHandler}=require('@smithy/node-http-handler'))}catch{try{({NodeHttpHandler}=require('@aws-sdk/node-http-handler'))}catch{}}
const https=require('https');
const b2Agent=new https.Agent({keepAlive:true,maxSockets:64,maxFreeSockets:16,timeout:60000,keepAliveMsecs:60000});
const b2=B2_ENABLED?new S3Client({region:process.env.B2_REGION||'us-east-005',endpoint:B2_ENDPOINT,forcePathStyle:true,requestHandler:NodeHttpHandler?new NodeHttpHandler({httpsAgent:b2Agent,connectionTimeout:10000,requestTimeout:60000}):undefined,credentials:{accessKeyId:B2_ACCESS_KEY,secretAccessKey:B2_SECRET_KEY}}):null;
if(B2_ENABLED)console.log('SYNTH AUDIO: Backblaze B2 storage enabled for bucket',B2_BUCKET);
async function putB2File(filePath,key,contentType){
  if(!B2_ENABLED)return false;
  await b2.send(new PutObjectCommand({Bucket:B2_BUCKET,Key:key,Body:fs.createReadStream(filePath),ContentLength:fs.statSync(filePath).size,ContentType:contentType||mime[path.extname(key).toLowerCase()]||'application/octet-stream'}));
  return true;
}
async function putB2Buffer(data,key,contentType){
  if(!B2_ENABLED)return false;
  const body=Buffer.isBuffer(data)?data:Buffer.from(data);
  await b2.send(new PutObjectCommand({Bucket:B2_BUCKET,Key:key,Body:body,ContentLength:body.length,ContentType:contentType||mime[path.extname(key).toLowerCase()]||'application/octet-stream'}));
  return true;
}
async function uploadLocalCoverToB2(coverUrl){
  if(!B2_ENABLED||!coverUrl||!String(coverUrl).startsWith('/uploads/'))return false;
  const name=path.basename(String(coverUrl)),filePath=path.join(UP,name);
  if(!fs.existsSync(filePath))return false;
  await putB2File(filePath,name,mime[path.extname(name).toLowerCase()]||'image/jpeg');
  return true;
}
async function deleteB2File(key){if(B2_ENABLED&&key)await b2.send(new DeleteObjectCommand({Bucket:B2_BUCKET,Key:key}));}
// One-time migration when a Railway Volume is first attached: preserve the old local data/uploads.
if(process.env.STORAGE_DIR){
  const legacyDb=path.join(ROOT,'data','db.json');
  const legacyUploads=path.join(PUBLIC,'uploads');
  try{if(!fs.existsSync(DB)&&fs.existsSync(legacyDb))fs.copyFileSync(legacyDb,DB)}catch(e){console.error('Legacy database migration failed',e)}
  try{if(fs.existsSync(legacyUploads)){for(const f of fs.readdirSync(legacyUploads)){const src=path.join(legacyUploads,f),dst=path.join(UP,f);if(fs.statSync(src).isFile()&&!fs.existsSync(dst))fs.copyFileSync(src,dst)}}}catch(e){console.error('Legacy upload migration failed',e)}
}
let db={songs:[],playlists:[],events:[],listening:{},users:{},userState:{},sessions:{}};
db.users=db.users||{};db.userState=db.userState||{};db.sessions=db.sessions||{};
try{if(fs.existsSync(DB)) db=Object.assign(db,JSON.parse(fs.readFileSync(DB,'utf8')))}catch{}
if((!db.songs||!db.songs.length) && !process.env.STORAGE_DIR){
  try{
    const bundledDb=require('./data/db.json');
    if(bundledDb) db=Object.assign(db,bundledDb);
  }catch{}
}
db.users=db.users||{};db.userState=db.userState||{};db.sessions=db.sessions||{};
let saveTimer=null, saveQueued=false;
const B2_DB_KEY = 'synth-v65-database.json';
let b2SyncTimer = null, b2SyncQueued = false;
async function syncDatabaseToB2Now(){
  if(!B2_ENABLED) return;
  if(!isHydrated){
    console.warn('SYNTH AUDIO B2 database sync prevented: database not yet successfully hydrated from Backblaze B2.');
    return;
  }
  try{
    const jsonStr = JSON.stringify(db, null, 2);
    await putB2Buffer(Buffer.from(jsonStr), B2_DB_KEY, 'application/json');
  }catch(err){
    console.warn('SYNTH AUDIO B2 database sync notice:', err.message);
  }
}
function queueDatabaseSyncToB2(){
  if(!B2_ENABLED) return;
  b2SyncQueued = true;
  if(b2SyncTimer) return;
  b2SyncTimer = setTimeout(() => {
    b2SyncTimer = null;
    if(!b2SyncQueued) return;
    b2SyncQueued = false;
    syncDatabaseToB2Now().catch(()=>{});
  }, 1000);
}

let hydrationPromise = null;
let isHydrated = false;
let lastHydratedAt = 0;
let b2CooldownUntil = 0;
let b2CoverCooldownUntil = 0;
let b2LastError = null;
const missingCoverSongIds = new Set();

async function loadDatabaseFromB2(force = false){
  if(!B2_ENABLED) { isHydrated = true; return false; }
  const now = Date.now();
  if(!force && now < b2CooldownUntil){
    return false; // Circuit breaker active: avoid hammering B2 while cap or error is active
  }
  try{
    const res = await b2.send(new GetObjectCommand({ Bucket: B2_BUCKET, Key: B2_DB_KEY }));
    const chunks = [];
    for await (const chunk of res.Body) chunks.push(chunk);
    const remoteData = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if(remoteData && Array.isArray(remoteData.songs) && remoteData.songs.length){
      db.deletedSongIds = Array.isArray(db.deletedSongIds) ? db.deletedSongIds : [];
      const remoteDeleted = Array.isArray(remoteData.deletedSongIds) ? remoteData.deletedSongIds : [];
      const mergedDeleted = new Set([...db.deletedSongIds, ...remoteDeleted]);
      db.deletedSongIds = Array.from(mergedDeleted);
      const songMap = new Map();
      for(const s of (db.songs || [])){
        if(s && s.id && !mergedDeleted.has(s.id)) songMap.set(s.id, s);
      }
      for(const s of remoteData.songs){
        if(!s || !s.id || mergedDeleted.has(s.id)) continue;
        const local = songMap.get(s.id);
        if(!local){
          songMap.set(s.id, s);
        } else {
          const localTime = new Date(local.updatedAt || local.createdAt || 0).getTime() || 0;
          const remoteTime = new Date(s.updatedAt || s.createdAt || 0).getTime() || 0;
          if(remoteTime > localTime){
            songMap.set(s.id, s);
          } else {
            songMap.set(s.id, local);
          }
        }
      }
      db.songs = Array.from(songMap.values());
      if(remoteData.playlists) db.playlists = remoteData.playlists;
      if(remoteData.userState) db.userState = Object.assign(db.userState || {}, remoteData.userState);
      if(remoteData.listening) db.listening = Object.assign(db.listening || {}, remoteData.listening);
      if(remoteData.users) db.users = Object.assign(db.users || {}, remoteData.users);
      isHydrated = true;
      lastHydratedAt = Date.now();
      b2CooldownUntil = 0;
      b2LastError = null;
      console.log('SYNTH AUDIO: Hydrated and synchronized ' + db.songs.length + ' songs from Backblaze B2 persistent database');
      return true;
    }
    // If remoteData had no songs, keep local songs and mark hydrated
    isHydrated = true;
    lastHydratedAt = Date.now();
    b2CooldownUntil = 0;
    b2LastError = null;
    return true;
  }catch(err){
    const msg = err.message || '';
    const status = Number(err?.$metadata?.httpStatusCode || err?.statusCode || 0);
    const isCap = status === 403 || /cap exceeded|download_cap_exceeded|AccessDenied/i.test(msg);
    // Back off for 15 minutes if daily cap is reached, or 30s for transient errors
    b2CooldownUntil = Date.now() + (isCap ? 15 * 60 * 1000 : 30 * 1000);
    b2LastError = msg;
    console.warn('SYNTH AUDIO B2 hydration notice:', msg, isCap ? '(cooldown: 15m)' : '');
    // Do NOT mark isHydrated=true if B2 fetch failed (e.g. cap exceeded or network error)
    // so we never overwrite cloud data with unhydrated state
    isHydrated = false;
    lastHydratedAt = Date.now();
    return false;
  }
}

function ensureHydrated(force = false){
  if(!B2_ENABLED) return Promise.resolve(true);
  const now = Date.now();
  if(!force && now < b2CooldownUntil) return Promise.resolve(false);
  // Re-use hydrated state for 60 seconds unless explicitly forced
  if(!force && isHydrated && (now - lastHydratedAt < 60000) && hydrationPromise) return hydrationPromise;
  if(!force && hydrationPromise) return hydrationPromise;
  hydrationPromise = loadDatabaseFromB2(force).then(res => {
    lastHydratedAt = Date.now();
    return res;
  }).catch(()=>false);
  return hydrationPromise;
}
if(B2_ENABLED){ hydrationPromise = loadDatabaseFromB2().catch(()=>{}); }

async function saveNow(){
  try{
    if(!IS_VERCEL){
      try{
        fs.writeFileSync(DB,JSON.stringify(db,null,2));
      }catch(e){
        try{
          const tmp=DB+'.tmp';
          fs.writeFileSync(tmp,JSON.stringify(db,null,2));
          fs.renameSync(tmp,DB);
        }catch(err){console.error('SYNTH AUDIO database save failed',err)}
      }
    }else{
      try{
        const tmpPath=path.join(os.tmpdir(),'synth-db.json');
        fs.writeFileSync(tmpPath,JSON.stringify(db,null,2));
      }catch{}
    }
  }catch{}
  if(B2_ENABLED){
    await syncDatabaseToB2Now();
  }
}
function save(){
  saveQueued=true;
  if(saveTimer)return;
  saveTimer=setTimeout(()=>{
    saveTimer=null;
    if(!saveQueued)return;
    saveQueued=false;
    try{saveNow().catch(()=>{})}catch(e){console.error('SYNTH AUDIO database save failed',e)}
  },120);
}
const STRICT_ADMIN_EMAIL = 'akilesht@karunya.edu.in';
const ADMIN_KEY = String(process.env.ADMIN_KEY || 'Akil152506dp');
const OWNER_EMAIL = STRICT_ADMIN_EMAIL;
function isOwnerEmail(email){
  const e = String(email || '').trim().toLowerCase();
  if(!e) return false;
  if(e === STRICT_ADMIN_EMAIL) return true;
  if(process.env.NODE_ENV === 'test' && process.env.OWNER_EMAIL && e === process.env.OWNER_EMAIL.trim().toLowerCase()) return true;
  return false;
}
if(process.env.NODE_ENV==='production' && (!process.env.ADMIN_KEY || !process.env.OWNER_EMAIL)){
  console.warn('SYNTH AUDIO: production is using the built-in owner credentials. Set ADMIN_KEY and OWNER_EMAIL in the hosting service for a private deployment.');
}
const PORT=Number(process.env.PORT||3000);
const BUILD_VERSION='65.0.0';
const SESSION_TTL=30*24*60*60*1000;
const AUTH_SECRET=String(process.env.V65_AUTH_SECRET || process.env.SECRET_ACCESS_KEY || ADMIN_KEY || 'v65-stateless-synth-fallback');
const sseClients=new Set();
const playlistRequestIds=new Map();
function broadcast(type,payload={}){
  const msg=`event: ${type}\ndata: ${JSON.stringify(payload)}\n\n`;
  for(const res of sseClients){try{res.write(msg)}catch{sseClients.delete(res)}}
}
function event(type,detail,userEmail=''){
  const item={id:crypto.randomUUID(),type,detail,userEmail:String(userEmail||'').toLowerCase(),at:new Date().toISOString()};
  db.events.unshift(item);db.events=db.events.slice(0,1000);save();broadcast('activity',item);
}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp','.ico':'image/x-icon','.mp3':'audio/mpeg','.wav':'audio/wav','.ogg':'audio/ogg','.opus':'audio/ogg','.m4a':'audio/mp4','.aac':'audio/aac','.flac':'audio/flac'};
function send(res,status,data,type='application/json'){
  const bodyBuf=Buffer.isBuffer(data)?data:Buffer.from(type.startsWith('application/json')?JSON.stringify(data):data);
  const ae=String(res.req?.headers?.['accept-encoding']||'');
  const headers={'Content-Type':type,'X-SYNTH-AUDIO-BUILD':BUILD_VERSION,'X-Content-Type-Options':'nosniff','Vary':'Accept-Encoding','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,PUT,DELETE,OPTIONS','Access-Control-Allow-Headers':'Content-Type,Authorization,x-admin-key,Range','Access-Control-Expose-Headers':'Content-Range,Accept-Ranges,Content-Length'};
  if(type.startsWith('application/json'))headers['Cache-Control']='private, no-store'; else if(type.startsWith('text/html'))headers['Cache-Control']='no-store, no-cache, must-revalidate'; else headers['Cache-Control']='public, max-age=3600';
  if(bodyBuf.length>1024 && /gzip/i.test(ae)){zlib.gzip(bodyBuf,(err,out)=>{if(err){res.writeHead(status,headers);return res.end(bodyBuf)}headers['Content-Encoding']='gzip';headers['Content-Length']=out.length;res.writeHead(status,headers);res.end(out)});return}
  headers['Content-Length']=bodyBuf.length;res.writeHead(status,headers);res.end(bodyBuf);
}
function body(req, limit = 260 * 1024 * 1024){
  if(req.body){
    if(Buffer.isBuffer(req.body))return Promise.resolve(req.body);
    if(typeof req.body==='string')return Promise.resolve(Buffer.from(req.body));
    if(typeof req.body==='object')return Promise.resolve(Buffer.from(JSON.stringify(req.body)));
  }
  if(req.readableEnded)return Promise.resolve(Buffer.alloc(0));
  return new Promise((resolve,reject)=>{
    const a=[];
    let total=0;
    req.on('data',c=>{
      total+=c.length;
      if(total>limit){
        try{req.destroy()}catch{}
        reject(new Error('Payload too large'));
        return;
      }
      a.push(c);
    });
    req.on('end',()=>resolve(Buffer.concat(a)));
    req.on('error',reject);
  });
}
async function jsonBody(req){
  if(req.body){
    if(typeof req.body==='object'&&!Buffer.isBuffer(req.body))return req.body;
    if(typeof req.body==='string'){try{return JSON.parse(req.body)}catch{}}
    if(Buffer.isBuffer(req.body)){try{return JSON.parse(req.body.toString('utf8')||'{}')}catch{}}
  }
  if(req.readableEnded)return {};
  const b=await body(req, 15 * 1024 * 1024);
  try{return JSON.parse(b.toString('utf8')||'{}')}catch(err){const e=new Error('Invalid JSON payload');e.status=400;throw e}
}

function readSynchsafe(b,o){return ((b[o]&127)<<21)|((b[o+1]&127)<<14)|((b[o+2]&127)<<7)|(b[o+3]&127)}
function decodeId3Text(buf){
  if(!buf||!buf.length)return '';
  const enc=buf[0]; let body=buf.slice(1);
  try{
    if(enc===0)return body.toString('latin1').replace(/\0.*$/s,'').trim();
    if(enc===1)return body.toString('utf16le').replace(/^\uFEFF/,'').replace(/\0.*$/s,'').trim();
    if(enc===2)return body.toString('utf16le').replace(/^\uFEFF/,'').replace(/\0.*$/s,'').trim();
    return body.toString('utf8').replace(/\0.*$/s,'').trim();
  }catch{return ''}
}
function parseMp3Tags(buf){
  const out={title:'',artist:'',album:'',genre:'',language:'',cover:null};
  if(buf.slice(0,3).toString()!=='ID3')return out;
  const ver=buf[3], size=readSynchsafe(buf,6), end=Math.min(buf.length,10+size); let pos=10;
  while(pos+10<=end){
    const id=buf.slice(pos,pos+4).toString('ascii'); if(!/^[A-Z0-9]{4}$/.test(id)||id==='\0\0\0\0')break;
    let n=ver>=4?readSynchsafe(buf,pos+4):buf.readUInt32BE(pos+4); if(n<=0){pos+=10;continue}
    const frameEnd=Math.min(end,pos+10+n), data=buf.slice(pos+10,frameEnd); pos=frameEnd;
    if(id==='TIT2')out.title=decodeId3Text(data)||out.title;
    else if(id==='TPE1')out.artist=decodeId3Text(data)||out.artist;
    else if(id==='TALB')out.album=decodeId3Text(data)||out.album;
    else if(id==='TCON')out.genre=decodeId3Text(data)||out.genre;
    else if(id==='TLAN')out.language=decodeId3Text(data)||out.language;
    else if(id==='APIC'&&data.length>5){
      let i=1; const z=data.indexOf(0,i); if(z<0)continue; const mime=data.slice(i,z).toString('ascii')||'image/jpeg'; i=z+1; i+=1; const d=data.indexOf(0,i); if(d<0)continue; i=d+1; if(i<data.length)out.cover={mime,data:data.slice(i)};
    }
  }
  return out;
}
function parseFlacTags(buf){
  const out={title:'',artist:'',album:'',genre:'',language:'',cover:null};
  if(buf.slice(0,4).toString()!=='fLaC')return out;
  let pos=4;
  while(pos+4<=buf.length){
    const h=buf[pos], last=!!(h&128), type=h&127, n=buf.readUIntBE(pos+1,3); pos+=4; if(pos+n>buf.length)break; const d=buf.slice(pos,pos+n); pos+=n;
    if(type===4){ const txt=d.toString('utf8'); for(const part of txt.split('\0')){const eq=part.indexOf('=');if(eq<1)continue;const k=part.slice(0,eq).toLowerCase(),v=part.slice(eq+1).trim(); if(k==='title')out.title=v; else if(k==='artist')out.artist=v; else if(k==='album')out.album=v; else if(k==='genre')out.genre=v; else if(k==='language')out.language=v;} }
    if(type===6&&d.length>32){
      let q=0; const read32=()=>{const v=d.readUInt32BE(q);q+=4;return v}; read32(); const mimeLen=read32(); const mime=d.slice(q,q+mimeLen).toString(); q+=mimeLen; const descLen=read32(); q+=descLen; read32();read32();read32();read32(); const dataLen=read32(); if(q+dataLen<=d.length)out.cover={mime:mime||'image/jpeg',data:d.slice(q,q+dataLen)};
    }
    if(last)break;
  }
  return out;
}
function extractEmbeddedMetadata(buf,ext){
  if(ext==='.mp3')return parseMp3Tags(buf);
  if(ext==='.flac')return parseFlacTags(buf);
  return {title:'',artist:'',album:'',genre:'',language:'',cover:null};
}
function saveEmbeddedCover(c){
  if(!c||!c.data||!c.data.length)return '';
  try{
    const mime=String(c.mime||'image/jpeg').toLowerCase();
    const ext=mime.includes('png')?'.png':mime.includes('webp')?'.webp':mime.includes('gif')?'.gif':'.jpg';
    const name=crypto.randomUUID()+ext; fs.writeFileSync(path.join(UP,name),c.data); return '/uploads/'+name;
  }catch{return ''}
}
function extractCoverWithFfmpeg(filePath){
  try{
    const name=crypto.randomUUID()+'.jpg', out=path.join(UP,name);
    const r=spawnSync('ffmpeg',['-y','-hide_banner','-loglevel','error','-i',filePath,'-an','-frames:v','1','-vf','scale=1000:1000:force_original_aspect_ratio=decrease',out],{timeout:20000,windowsHide:true});
    if(r.status===0&&fs.existsSync(out)&&fs.statSync(out).size>100)return '/uploads/'+name;
    try{fs.unlinkSync(out)}catch{}
  }catch{}
  return '';
}

function safeEqual(a,b){a=String(a||'');b=String(b||'');const aa=Buffer.from(a),bb=Buffer.from(b);return aa.length===bb.length&&crypto.timingSafeEqual(aa,bb)}

function signAuthToken(email, admin = false){
  const normEmail = String(email || '').trim().toLowerCase();
  const now = Math.floor(Date.now() / 1000);
  const exp = now + Math.floor(SESSION_TTL / 1000);
  const payload = {
    sub: normEmail,
    email: normEmail,
    admin: !!admin,
    iat: now,
    exp
  };
  const head = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const data = `${head}.${body}`;
  const sig = crypto.createHmac('sha256', AUTH_SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function verifyAuthToken(token){
  if(!token || typeof token !== 'string') return null;
  const parts = token.trim().split('.');
  if(parts.length !== 3) return null;
  const [head, body, sig] = parts;
  const data = `${head}.${body}`;
  const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(data).digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expectedSig);
  if(sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)){
    return null;
  }
  try{
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);
    if(payload.exp && Number(payload.exp) < now) return null;
    return payload;
  }catch{
    return null;
  }
}

function getAuthBearer(req){
  const h=String(req?.headers?.authorization||'').trim();
  if(!h)return '';
  const m=/^Bearer\s+(.+)$/i.exec(h);
  return m ? m[1].trim() : h;
}

function adminAuth(req){
  const token=getAuthBearer(req);
  if(token){
    const payload=verifyAuthToken(token);
    if(payload){
      if(payload.email && !isOwnerEmail(payload.email)) return false;
      if(payload.admin===true && isOwnerEmail(payload.email)) return true;
    }
    const x=db.sessions[token];
    if(x){
      if(Number(x.createdAt||0)+SESSION_TTL<Date.now()){delete db.sessions[token];save();return false}
      if(x.email && !isOwnerEmail(x.email)) return false;
      if(x.email && isOwnerEmail(x.email) && x.admin===true) return true;
    }
  }
  const sEmail=sessionEmail(req);
  const reqAdminKey=String(req.headers['x-admin-key']||'').trim();
  if(sEmail){
    if(!isOwnerEmail(sEmail)) return false;
    if(reqAdminKey && safeEqual(reqAdminKey,ADMIN_KEY)) return true;
    return true;
  }
  // Allow admin access if valid x-admin-key matches and no other identity claimed
  if(reqAdminKey && safeEqual(reqAdminKey,ADMIN_KEY)){
    const emailHeader=String(req.headers['x-admin-email']||req.headers['x-user-email']||'').trim();
    if(emailHeader && !isOwnerEmail(emailHeader)) return false;
    return true;
  }
  return false;
}
function ownerIdentity(email,key){
  if(!safeEqual(key,ADMIN_KEY))return false;
  const e=String(email||'').trim().toLowerCase();
  if(!isOwnerEmail(e))return false;
  return true;
}
function requireAdmin(req,res){
  if(adminAuth(req))return true;
  const h=getAuthBearer(req)||sessionEmail(req)||req.headers['x-admin-key'];
  if(h){
    send(res,403,{error:'Access denied: administrator privileges are restricted to akilesht@karunya.edu.in'});
  }else{
    send(res,401,{error:'Owner authorization required'});
  }
  return false;
}

function parseMultipart(buf,ct){const m=/boundary=(?:"([^"]+)"|([^;]+))/i.exec(ct||'');if(!m)throw Error('Missing multipart boundary');const boundary=Buffer.from('--'+(m[1]||m[2]));let pos=0,parts=[];while(true){let s=buf.indexOf(boundary,pos);if(s<0)break;s+=boundary.length;if(buf[s]===45&&buf[s+1]===45)break;if(buf[s]===13&&buf[s+1]===10)s+=2;const e=buf.indexOf(Buffer.from('\r\n\r\n'),s);if(e<0)break;const headers=buf.slice(s,e).toString();const next=buf.indexOf(boundary,e+4);if(next<0)break;const data=buf.slice(e+4,next-2);const nm=/name="([^"]+)"/i.exec(headers),fm=/filename="([^"]*)"/i.exec(headers);if(nm)parts.push({name:nm[1],filename:fm?fm[1]:null,data});pos=next}return parts}
function publicSong(s){const x={...s};delete x.fileSize;return x}
function userEmail(reqUrl){return String(reqUrl.searchParams.get('userEmail')||'').trim().toLowerCase()}
function hashPassword(password,salt=crypto.randomBytes(16).toString('hex')){const hash=crypto.pbkdf2Sync(String(password),salt,120000,32,'sha256').toString('hex');return `${salt}:${hash}`}
function verifyPassword(password,stored){const [salt,hash]=String(stored||'').split(':');if(!salt||!hash)return false;const actual=crypto.pbkdf2Sync(String(password),salt,120000,32,'sha256').toString('hex');return safeEqual(actual,hash)}
function makeSession(email,admin=false){const token=signAuthToken(email,admin);db.sessions[token]={email,admin:!!admin,createdAt:Date.now()};save();return token}
function sessionEmail(req){const token=getAuthBearer(req);if(!token)return '';const payload=verifyAuthToken(token);if(payload&&payload.email)return payload.email;const x=db.sessions[token];if(!x)return '';if(Number(x.createdAt||0)+SESSION_TTL<Date.now()){delete db.sessions[token];save();return ''}return x.email||''}
function ensureUser(email){email=String(email||'').trim().toLowerCase();if(!email)return null;if(!db.users[email]){db.users[email]={email,createdAt:new Date().toISOString()};save()}return db.users[email]}


function resolveUploadLocalPath(relOrName){
  const name=path.basename(String(relOrName||''));
  if(!name)return '';
  const current=path.join(UP,name);
  if(fs.existsSync(current)&&fs.statSync(current).isFile())return current;
  const legacy=path.join(PUBLIC,'uploads',name);
  if(fs.existsSync(legacy)&&fs.statSync(legacy).isFile())return legacy;
  return '';
}
function findSongMedia(rel){
  const raw=path.posix.basename(String(rel||''));
  if(!raw)return null;
  let decoded=raw;
  try{decoded=decodeURIComponent(raw)}catch{}
  const rawTrim=raw.trim(), decTrim=decoded.trim();
  for(const s of db.songs){
    const sFile=s.file?path.posix.basename(String(s.file)):'';
    const sCover=s.cover?path.posix.basename(String(s.cover)):'';
    let dFile=sFile, dCover=sCover;
    try{dFile=decodeURIComponent(sFile)}catch{}
    try{dCover=decodeURIComponent(sCover)}catch{}
    const fTrim=sFile.trim(), dfTrim=dFile.trim();
    if(sFile && (sFile===raw||sFile===decoded||dFile===decoded||dFile===raw||
       fTrim===rawTrim||fTrim===decTrim||dfTrim===rawTrim||dfTrim===decTrim)){
      return {song:s,kind:'audio',key:String(s.b2Key||s.storageKey||sFile||raw)};
    }
    const cTrim=sCover.trim(), dcTrim=dCover.trim();
    if(sCover && (sCover===raw||sCover===decoded||dCover===decoded||dCover===raw||
       cTrim===rawTrim||cTrim===decTrim||dcTrim===rawTrim||dcTrim===decTrim)){
      return {song:s,kind:'cover',key:String(s.b2CoverKey||sCover||raw)};
    }
    if(s.storageKey){
      const sk=String(s.storageKey), bsk=path.posix.basename(sk), skTrim=sk.trim(), bskTrim=bsk.trim();
      if(sk===raw||sk===decoded||bsk===raw||bsk===decoded||
         skTrim===rawTrim||skTrim===decTrim||bskTrim===rawTrim||bskTrim===decTrim)return {song:s,kind:'audio',key:sk};
    }
    if(s.b2Key){
      const bk=String(s.b2Key), bbk=path.posix.basename(bk), bkTrim=bk.trim(), bbkTrim=bbk.trim();
      if(bk===raw||bk===decoded||bbk===raw||bbk===decoded||
         bkTrim===rawTrim||bkTrim===decTrim||bbkTrim===rawTrim||bbkTrim===decTrim)return {song:s,kind:'audio',key:bk};
    }
    if(s.b2CoverKey){
      const ck=String(s.b2CoverKey), bck=path.posix.basename(ck), ckTrim=ck.trim(), bckTrim=bck.trim();
      if(ck===raw||ck===decoded||bck===raw||bck===decoded||
         ckTrim===rawTrim||ckTrim===decTrim||bckTrim===rawTrim||bckTrim===decTrim)return {song:s,kind:'cover',key:ck};
    }
  }
  return null;
}
function normalizeB2ArtworkReferences(){
  let changed=false;
  for(const s of db.songs){
    if(!B2_ENABLED)break;
    if(!s.cover&&s.b2CoverKey){s.cover='/uploads/'+path.basename(String(s.b2CoverKey));changed=true}
    if(!s.file&&s.b2Key){s.file='/uploads/'+path.basename(String(s.b2Key));changed=true}
    if(!s.file&&s.storageKey){s.file='/uploads/'+path.basename(String(s.storageKey));changed=true}
  }
  if(changed)save();
}
async function hydrateMissingArtwork(){
  let changed=false;
  for(const s of db.songs){
    if(s.cover)continue;
    // 1. Check local file
    const fp=s.file?(String(s.file).startsWith('/uploads/')?resolveUploadLocalPath(s.file):path.join(PUBLIC,String(s.file).replace(/^\//,'').replace(/\//g,path.sep))):'';
    if(fp&&fs.existsSync(fp)&&fs.statSync(fp).isFile()){
      try{
        const ext=path.extname(fp).toLowerCase();
        const meta=extractEmbeddedMetadata(fs.readFileSync(fp),ext);
        const c=saveEmbeddedCover(meta.cover);
        if(c){
          s.cover=c;
          changed=true;
          if(B2_ENABLED){
            uploadLocalCoverToB2(c).catch(()=>{});
            s.b2CoverKey=path.basename(c);
          }
        }
      }catch{}
      continue;
    }
    // 2. Check B2 file Range request (only if hydrated and not in cooldown)
    if(B2_ENABLED && isHydrated && Date.now() >= b2CooldownUntil && (s.storage==='bucket'||s.storageKey||s.b2Key||s.file)){
      const key=String(s.b2Key||s.storageKey||path.posix.basename(String(s.file||'')));
      if(!key)continue;
      try{
        const res=await b2.send(new GetObjectCommand({Bucket:B2_BUCKET,Key:key,Range:'bytes=0-1048575'}));
        const chunks=[];
        for await(const chunk of res.Body) chunks.push(chunk);
        const buf=Buffer.concat(chunks);
        const ext=path.extname(key).toLowerCase()||'.mp3';
        const meta=extractEmbeddedMetadata(buf,ext);
        if(meta.cover){
          const c=saveEmbeddedCover(meta.cover);
          if(c){
            s.cover=c;
            s.b2CoverKey=path.basename(c);
            changed=true;
            uploadLocalCoverToB2(c).catch(()=>{});
          }
        }
      }catch(e){
        if(/cap exceeded|download_cap_exceeded|AccessDenied|403/i.test(e?.message||'')){
          b2CooldownUntil = Math.max(b2CooldownUntil, Date.now() + 15 * 60 * 1000);
          break;
        }
      }
    }
  }
  if(changed){
    save();
    broadcast('catalog',{kind:'artwork_hydrated'});
  }
}
normalizeB2ArtworkReferences();
if(!IS_VERCEL){
  setImmediate(()=>{try{hydrateMissingArtwork().catch(()=>{})}catch{}});
}
async function streamToFile(req,filePath,maxBytes=250*1024*1024){
  if(req.body && Buffer.isBuffer(req.body)){
    if(req.body.length > maxBytes) throw Error('Audio file is larger than 250 MB');
    await fs.promises.writeFile(filePath, req.body);
    return req.body.length;
  }
  return new Promise((resolve,reject)=>{
    const out=fs.createWriteStream(filePath,{flags:'w'});
    let total=0,done=false;
    const fail=e=>{if(done)return;done=true;try{req.destroy();}catch{};try{out.destroy();}catch{};try{fs.unlinkSync(filePath)}catch{};reject(e)};
    req.on('data',chunk=>{if(done)return;total+=chunk.length;if(total>maxBytes)return fail(Error('Audio file is larger than 250 MB'));if(!out.write(chunk))req.pause()});
    out.on('drain',()=>req.resume());
    req.on('end',()=>{if(done)return;done=true;out.end(()=>{try{const st=fs.statSync(filePath);resolve(st.size||total)}catch{resolve(total)}})});
    req.on('aborted',()=>fail(Error('Upload cancelled')));
    req.on('error',fail);
    out.on('error',fail);
  });
}
function parseDataUrlCover(value){const raw=String(value||'');if(raw.length>7*1024*1024)return null;const m=/^data:([^;,]+)?;base64,(.+)$/s.exec(raw);if(!m)return null;try{const data=Buffer.from(m[2],'base64');if(data.length>5*1024*1024)return null;return {mime:m[1]||'image/jpeg',data}}catch{return null}}
function createSongFromFile(filePath,originalName,meta={},fileSize=0){
  const base=path.parse(originalName).name;
  return {id:crypto.randomUUID(),title:String(meta.title||base).trim()||base,artist:String(meta.artist||'Unknown Artist').trim(),album:String(meta.album||'Single').trim(),genre:String(meta.genre||'Other').trim(),language:String(meta.language||'Unknown').trim(),duration:Number(meta.duration||0),cover:'',file:'/uploads/'+path.basename(filePath),fileSize,createdAt:new Date().toISOString(),plays:0};
}
async function serveB2Object(req,res,key,typeHint=''){
  if(!B2_ENABLED||!key)return false;
  if(req.socket&&typeof req.socket.setNoDelay==='function')req.socket.setNoDelay(true);
  if(req.socket&&typeof req.socket.setKeepAlive==='function')req.socket.setKeepAlive(true,30000);
  const ext=path.extname(key).toLowerCase();
  const guessedMime=typeHint||mime[ext]||'application/octet-stream';
  const knownSong = (db.songs || []).find(s => s && (s.b2Key === key || s.storageKey === key || (s.file && s.file.endsWith(key))));

  if(req.method==='HEAD'){
    // Fast path: if song metadata has known file size, return headers directly without hitting B2
    if(knownSong && Number(knownSong.fileSize) > 0){
      res.writeHead(200,{
        'Content-Type':knownSong.file?.endsWith('.mp3')?'audio/mpeg':guessedMime,
        'Content-Length':Number(knownSong.fileSize),
        'Accept-Ranges':'bytes',
        'Cache-Control':'public, max-age=86400',
        'Connection':'keep-alive',
        'X-Content-Type-Options':'nosniff',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods':'GET,HEAD,OPTIONS',
        'Access-Control-Allow-Headers':'Range,Content-Type,Authorization',
        'Access-Control-Expose-Headers':'Content-Range,Accept-Ranges,Content-Length'
      });
      res.end();
      return true;
    }
    if(Date.now() < b2CooldownUntil){
      res.writeHead(503,{'Content-Type':'application/json','Retry-After':'300','Access-Control-Allow-Origin':'*'});
      res.end(JSON.stringify({error:'Backblaze B2 storage bandwidth or transaction cap reached. Check Caps & Alerts in B2 console.',code:'B2_CAP_EXCEEDED'}));
      return true;
    }
    try{
      const head=await b2.send(new HeadObjectCommand({Bucket:B2_BUCKET,Key:key}));
      res.writeHead(200,{
        'Content-Type':head.ContentType||guessedMime,
        'Content-Length':Number(head.ContentLength||0),
        'Accept-Ranges':'bytes',
        'Cache-Control':'public, max-age=86400',
        'Connection':'keep-alive',
        'X-Content-Type-Options':'nosniff',
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods':'GET,HEAD,OPTIONS',
        'Access-Control-Allow-Headers':'Range,Content-Type,Authorization',
        'Access-Control-Expose-Headers':'Content-Range,Accept-Ranges,Content-Length'
      });
      res.end();
      return true;
    }catch(e){
      const status=Number(e?.$metadata?.httpStatusCode||0);
      const isCap=status===403||/cap exceeded|download_cap_exceeded|AccessDenied/i.test(e?.message||'');
      if(isCap){
        b2CooldownUntil = Math.max(b2CooldownUntil, Date.now() + 15 * 60 * 1000);
        res.writeHead(503,{'Content-Type':'application/json','Retry-After':'300','Access-Control-Allow-Origin':'*'});
        res.end(JSON.stringify({error:'Backblaze B2 storage bandwidth or transaction cap reached. Check Caps & Alerts in B2 console.',code:'B2_CAP_EXCEEDED'}));
        return true;
      }
      return false;
    }
  }
  if(Date.now() < b2CooldownUntil){
    res.writeHead(503,{'Content-Type':'application/json','Retry-After':'300','Access-Control-Allow-Origin':'*'});
    res.end(JSON.stringify({error:'Backblaze B2 storage bandwidth or transaction cap reached. Check Caps & Alerts in B2 console.',code:'B2_CAP_EXCEEDED'}));
    return true;
  }
  try{
    const range=String(req.headers.range||'').trim();
    if(range && !/^bytes=\d*-\d*$/.test(range)){
      res.writeHead(416,{'Accept-Ranges':'bytes','Access-Control-Allow-Origin':'*'}).end();
      return true;
    }
    const getArgs={Bucket:B2_BUCKET,Key:key};
    if(range)getArgs.Range=range;
    const obj=await b2.send(new GetObjectCommand(getArgs));
    const totalRange=String(obj.ContentRange||'');
    const isPartial=!!range || /^bytes /i.test(totalRange);
    const headers={
      'Content-Type':obj.ContentType||guessedMime,
      'Accept-Ranges':'bytes',
      'Cache-Control':'public, max-age=86400',
      'Connection':'keep-alive',
      'X-Content-Type-Options':'nosniff',
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods':'GET,HEAD,OPTIONS',
      'Access-Control-Allow-Headers':'Range,Content-Type,Authorization',
      'Access-Control-Expose-Headers':'Content-Range,Accept-Ranges,Content-Length'
    };
    if(isPartial){
      if(obj.ContentLength!=null)headers['Content-Length']=Number(obj.ContentLength);
      if(totalRange)headers['Content-Range']=totalRange;
      res.writeHead(206,headers);
    }else{
      if(obj.ContentLength!=null)headers['Content-Length']=Number(obj.ContentLength);
      res.writeHead(200,headers);
    }
    if(obj.Body && typeof obj.Body.pipe==='function'){
      let closed=false;
      const destroyStream=()=>{
        if(closed)return;closed=true;
        try{if(typeof obj.Body.destroy==='function')obj.Body.destroy()}catch{}
      };
      res.on('close',destroyStream);
      res.on('finish',()=>{closed=true});
      req.on('aborted',destroyStream);
      obj.Body.on('error',()=>{
        destroyStream();
        if(!res.headersSent)res.writeHead(502,{'Access-Control-Allow-Origin':'*'});
        try{res.destroy()}catch{}
      });
      if(typeof res.flushHeaders==='function')res.flushHeaders();
      return obj.Body.pipe(res),true;
    }
    const chunks=[];
    for await(const chunk of obj.Body)chunks.push(chunk);
    res.end(Buffer.concat(chunks));
    return true;
  }catch(e){
    const status=Number(e?.$metadata?.httpStatusCode||0);
    if(status===416){
      res.writeHead(416,{'Accept-Ranges':'bytes','Access-Control-Allow-Origin':'*'}).end();
      return true;
    }
    const isCap=status===403||/cap exceeded|download_cap_exceeded|AccessDenied/i.test(e?.message||'');
    if(isCap){
      b2CooldownUntil = Math.max(b2CooldownUntil, Date.now() + 15 * 60 * 1000);
      if(!res.headersSent){
        res.writeHead(503,{'Content-Type':'application/json','Retry-After':'300','Access-Control-Allow-Origin':'*'});
        res.end(JSON.stringify({error:'Backblaze B2 storage bandwidth or transaction cap reached. Check Caps & Alerts in B2 console.',code:'B2_CAP_EXCEEDED'}));
      }
      return true;
    }
    return false;
  }
}

function getRequestPath(req){
  try{
    const u=new URL(req.url,'http://localhost');
    const explicit=u.searchParams.get('__path');
    if(explicit){
      const raw=explicit.split('?')[0];
      const normalized=path.posix.normalize('/'+raw.replace(/^[/\\]+/,''));
      if(!normalized.includes('..')) return normalized;
    }
  }catch{}
  const matched=req.headers['x-matched-path']||req.headers['x-forwarded-uri']||req.headers['x-original-url'];
  if(matched){
    try{
      const mu=new URL(matched,'http://localhost');
      if(mu.pathname&&!/^\/api(?:\/index(?:\.js)?)?$/.test(mu.pathname))return mu.pathname;
    }catch{
      const clean=matched.split('?')[0];
      if(!/^\/api(?:\/index(?:\.js)?)?$/.test(clean))return clean;
    }
  }
  try{
    const u=new URL(req.url,'http://localhost');
    if(/^\/api(?:\/index(?:\.js)?)?$/.test(u.pathname)){
      const match=u.searchParams.get('match')||u.searchParams.get('path');
      if(match)return '/'+match.replace(/^\//,'').split('?')[0];
      if(matched)return matched.split('?')[0];
    }
    return u.pathname;
  }catch{
    return (req.url||'/').split('?')[0];
  }
}

async function handle(req,res){
 const p=getRequestPath(req);
 const u=new URL(req.url||'/','http://localhost');
 if(p==='/favicon.ico'){res.writeHead(204,{'Access-Control-Allow-Origin':'*','Cache-Control':'public, max-age=86400'});return res.end()}
 if(req.method==='OPTIONS'){return send(res,204,'','text/plain; charset=utf-8')}
 if(req.method==='POST'&&p==='/api/auth/register'){
   try{const b=await jsonBody(req),email=String(b.email||'').trim().toLowerCase(),password=String(b.password||'');
     if(!/^\S+@\S+\.\S+$/.test(email))return send(res,400,{error:'Enter a valid email address'});
     if(password.length<6)return send(res,400,{error:'Password must be at least 6 characters'});
     if(db.users[email])return send(res,409,{error:'An account with this email already exists'});
     db.users[email]={email,passwordHash:hashPassword(password),createdAt:new Date().toISOString()};db.userState[email]=db.userState[email]||{favorites:[],recent:[],displayName:''};
     const isOwner=isOwnerEmail(email);const token=makeSession(email,isOwner);event('signup','Account created',email);return send(res,200,{ok:true,email,token,owner:isOwner});
   }catch(e){return send(res,400,{error:e.message||'Registration failed'})}
 }
 if(req.method==='POST'&&p==='/api/auth/login'){
   try{const b=await jsonBody(req),email=String(b.email||'').trim().toLowerCase(),password=String(b.password||'');const u=db.users[email];
     if(!u||!verifyPassword(password,u.passwordHash))return send(res,401,{error:'Incorrect email or password'});
     const isOwner=isOwnerEmail(email);const token=makeSession(email,isOwner);return send(res,200,{ok:true,email,token,owner:isOwner});
   }catch(e){return send(res,400,{error:'Login failed'})}
 }
 if(req.method==='POST'&&p==='/api/auth/logout'){const email=sessionEmail(req);const h=getAuthBearer(req);if(h&&db.sessions[h])delete db.sessions[h];save();return send(res,200,{ok:true,email})}
 if(req.method==='GET'&&p==='/api/auth/me'){const email=sessionEmail(req);return send(res,200,{authenticated:!!email,email:email||null})}
 if(req.method==='GET'&&p==='/api/config')return send(res,200,{ownerEmail:OWNER_EMAIL,ownerLoginEnabled:true,build:BUILD_VERSION});
 if(req.method==='GET'&&p==='/api/health')return send(res,200,{ok:true,time:new Date().toISOString(),songs:db.songs.length});
 if(req.method==='POST'&&p==='/api/admin/verify'){
   try{
     const b=await jsonBody(req);
     const email=String(b.email||'').trim().toLowerCase();
     if(!email||!isOwnerEmail(email)){
       return send(res,403,{error:'Access denied: administrator privileges are restricted to akilesht@karunya.edu.in'});
     }
     if(!ownerIdentity(email,b.key)){
       return send(res,401,{error:'Owner authorization failed: invalid owner key'});
     }
     const token=makeSession(email,true);
     return send(res,200,{ok:true,token,email});
   }catch{
     return send(res,400,{error:'Invalid request'});
   }
 }
 if(req.method==='GET'&&p==='/api/events/stream'){
    if(IS_VERCEL){
      res.writeHead(200,{'Content-Type':'text/event-stream; charset=utf-8','Cache-Control':'no-cache, no-transform','Access-Control-Allow-Origin':'*'});
      res.write('retry: 15000\nevent: catalog\ndata: {}\n\n');
      return res.end();
    }res.writeHead(200,{'Content-Type':'text/event-stream; charset=utf-8','Cache-Control':'no-cache, no-transform','Connection':'keep-alive','Access-Control-Allow-Origin':'*','X-Accel-Buffering':'no'});res.write('retry: 3000\n\n');sseClients.add(res);const ping=setInterval(()=>{try{if(res.writableEnded||res.destroyed){clearInterval(ping);sseClients.delete(res);return}res.write(': ping\n\n')}catch{clearInterval(ping);sseClients.delete(res)}},20000);if(typeof ping.unref==='function')ping.unref();req.on('close',()=>{clearInterval(ping);sseClients.delete(res)});res.on('close',()=>{clearInterval(ping);sseClients.delete(res)});return}
if(req.method==='GET'&&p==='/api/songs'){ if(B2_ENABLED && !isHydrated) await ensureHydrated(); return send(res,200,db.songs.map(publicSong)); }
 if(req.method==='GET'&&p.startsWith('/api/songs/')&&p.endsWith('/download')){
   const parts=p.split('/');
   const id=parts[3];
   const song=db.songs.find(s=>s.id===id);
   if(!song)return send(res,404,{error:'Song not found'});
   const rawKey=String(song.b2Key||song.storageKey||path.posix.basename(String(song.file||'')));
   const cleanTitle=(song.title||'song').replace(/[/\\?%*:|"<>]/g,'_');
   const cleanArtist=(song.artist||'').replace(/[/\\?%*:|"<>]/g,'_');
   const downloadFilename=`${cleanTitle}${cleanArtist?' - '+cleanArtist:''}.mp3`;
   const localFp=song.file?resolveUploadLocalPath(song.file):'';
   if(localFp&&fs.existsSync(localFp)&&fs.statSync(localFp).isFile()){
     const size=fs.statSync(localFp).size;
     res.writeHead(200,{
       'Content-Type':'audio/mpeg',
       'Content-Length':size,
       'Content-Disposition':`attachment; filename="${encodeURIComponent(downloadFilename)}"; filename*=UTF-8''${encodeURIComponent(downloadFilename)}`,
       'Accept-Ranges':'bytes',
       'Access-Control-Allow-Origin':'*'
     });
     return fs.createReadStream(localFp).pipe(res);
   }
   if(B2_ENABLED&&rawKey){
     try{
       const obj=await b2.send(new GetObjectCommand({Bucket:B2_BUCKET,Key:rawKey}));
       res.writeHead(200,{
         'Content-Type':'audio/mpeg',
         'Content-Length':Number(obj.ContentLength||0),
         'Content-Disposition':`attachment; filename="${encodeURIComponent(downloadFilename)}"; filename*=UTF-8''${encodeURIComponent(downloadFilename)}`,
         'Accept-Ranges':'bytes',
         'Access-Control-Allow-Origin':'*'
       });
       if(obj.Body&&typeof obj.Body.pipe==='function')return obj.Body.pipe(res);
       const chunks=[];for await(const c of obj.Body)chunks.push(c);return res.end(Buffer.concat(chunks));
     }catch(e){
       const status=Number(e?.statusCode||0); const isCap=status===403||/cap exceeded|download_cap_exceeded|AccessDenied/i.test(e?.message||''); if(isCap){ b2CooldownUntil = Math.max(b2CooldownUntil, Date.now() + 15 * 60 * 1000); return send(res,503,{error:'B2 storage bandwidth or transaction cap reached. Check Caps & Alerts in B2 console.'}); } return send(res,404,{error:'B2 audio not found'});
     }
   }
   return send(res,404,{error:'File not found'});
 }
function generateSongFallbackSvg(song){
  const str = String(song?.id || '') + String(song?.title || '') + String(song?.artist || '');
  let hash = 0;
  for(let i=0; i<str.length; i++){
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  const hue1 = Math.abs(hash % 40) + 240;
  const hue2 = (hue1 + 45) % 360;
  const initial = (String(song?.title || 'S').trim().charAt(0) || 'S').toUpperCase();
  const subInitial = (String(song?.artist || '').trim().charAt(0) || '').toUpperCase();
  const initials = subInitial ? (initial + subInitial) : initial;
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">' +
  '<defs>' +
    '<linearGradient id="bgGrad_' + Math.abs(hash) + '" x1="0%" y1="0%" x2="100%" y2="100%">' +
      '<stop offset="0%" stop-color="#0a0b14"/>' +
      '<stop offset="50%" stop-color="#121426"/>' +
      '<stop offset="100%" stop-color="#181432"/>' +
    '</linearGradient>' +
    '<radialGradient id="glowGrad_' + Math.abs(hash) + '" cx="50%" cy="50%" r="50%">' +
      '<stop offset="0%" stop-color="hsl(' + hue1 + ', 95%, 65%)" stop-opacity="0.85"/>' +
      '<stop offset="55%" stop-color="hsl(' + hue2 + ', 85%, 52%)" stop-opacity="0.35"/>' +
      '<stop offset="100%" stop-color="#0a0b14" stop-opacity="0"/>' +
    '</radialGradient>' +
    '<linearGradient id="strokeGrad_' + Math.abs(hash) + '" x1="0%" y1="0%" x2="100%" y2="0%">' +
      '<stop offset="0%" stop-color="hsl(' + hue1 + ', 100%, 75%)"/>' +
      '<stop offset="100%" stop-color="hsl(' + hue2 + ', 100%, 70%)"/>' +
    '</linearGradient>' +
  '</defs>' +
  '<rect width="600" height="600" rx="36" fill="url(#bgGrad_' + Math.abs(hash) + ')"/>' +
  '<circle cx="300" cy="300" r="230" fill="url(#glowGrad_' + Math.abs(hash) + ')"/>' +
  '<circle cx="300" cy="300" r="195" fill="none" stroke="url(#strokeGrad_' + Math.abs(hash) + ')" stroke-width="2.5" stroke-dasharray="8 6" opacity="0.6"/>' +
  '<circle cx="300" cy="300" r="140" fill="#0d0e1c" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>' +
  '<g transform="translate(300, 300)">' +
    '<text x="0" y="24" text-anchor="middle" fill="#ffffff" font-size="78" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-weight="800" letter-spacing="-1">' + initials + '</text>' +
  '</g>' +
  '<path d="M 230 460 Q 300 440 370 460" fill="none" stroke="hsl(' + hue1 + ', 90%, 70%)" stroke-width="3" stroke-linecap="round" opacity="0.7"/>' +
'</svg>';
}

 if(req.method==='GET'&&p.startsWith('/api/songs/')&&p.endsWith('/cover')){
   const parts=p.split('/');
   const id=parts[3];
   const song=db.songs.find(s=>s.id===id);
   if(!song)return send(res,404,{error:'Song not found'});
   if(song.cover){
     const localCover=resolveUploadLocalPath(song.cover);
     if(localCover&&fs.existsSync(localCover)&&fs.statSync(localCover).isFile()){
       const ext=path.extname(localCover).toLowerCase();
       const data=fs.readFileSync(localCover);
       res.writeHead(200,{'Content-Type':mime[ext]||'image/jpeg','Content-Length':data.length,'Cache-Control':'public, max-age=86400','Access-Control-Allow-Origin':'*'});
       return res.end(data);
     }
     if(B2_ENABLED && Date.now() >= b2CoverCooldownUntil){
       const cKey=String(song.b2CoverKey||path.posix.basename(song.cover));
       if(await serveB2Object(req,res,cKey,'image/jpeg'))return;
     }
   }
   if(B2_ENABLED && isHydrated && Date.now() >= b2CoverCooldownUntil && !missingCoverSongIds.has(id) && (song.b2Key||song.storageKey||song.file)){
     const key=String(song.b2Key||song.storageKey||path.posix.basename(String(song.file||'')));
     try{
       const obj=await b2.send(new GetObjectCommand({Bucket:B2_BUCKET,Key:key,Range:'bytes=0-1048575'}));
       const chunks=[];for await(const c of obj.Body)chunks.push(c);
       const meta=extractEmbeddedMetadata(Buffer.concat(chunks),path.extname(key).toLowerCase()||'.mp3');
       if(meta.cover){
         const c=saveEmbeddedCover(meta.cover);
         if(c){
           song.cover=c;song.b2CoverKey=path.basename(c);save();
           uploadLocalCoverToB2(c).catch(()=>{});
           res.writeHead(200,{'Content-Type':meta.cover.mime||'image/jpeg','Content-Length':meta.cover.data.length,'Cache-Control':'public, max-age=86400','Access-Control-Allow-Origin':'*'});
           return res.end(meta.cover.data);
         }
       }
       missingCoverSongIds.add(id);
     }catch(err){
       if(/cap exceeded|download_cap_exceeded|AccessDenied|403/i.test(err?.message||'')){
         b2CoverCooldownUntil = Math.max(b2CoverCooldownUntil, Date.now() + 15 * 60 * 1000);
       } else {
         missingCoverSongIds.add(id);
       }
     }
   }
   const FALLBACK_SVG=generateSongFallbackSvg(song);
   res.writeHead(200,{'Content-Type':'image/svg+xml','Content-Length':Buffer.byteLength(FALLBACK_SVG),'Cache-Control':'public, max-age=86400','Access-Control-Allow-Origin':'*'});
   return res.end(FALLBACK_SVG);
 }
  if(req.method==='GET'&&p==='/api/playlists'){const email=sessionEmail(req);if(!email)return send(res,401,{error:'Sign in required'});return send(res,200,db.playlists.filter(x=>String(x.userEmail||'').toLowerCase()===email.toLowerCase()))}
  if(req.method==='POST'&&p==='/api/playlists'){const b=await jsonBody(req),email=sessionEmail(req),requestId=String(b.clientRequestId||'').trim();if(!email)return send(res,401,{error:'Sign in required'});if(requestId&&playlistRequestIds.has(requestId))return send(res,200,playlistRequestIds.get(requestId));if(requestId){const existing=db.playlists.find(x=>x.clientRequestId===requestId);if(existing){playlistRequestIds.set(requestId,existing);return send(res,200,existing)}}const name=String(b.name||'New Playlist').trim().slice(0,100)||'New Playlist';const duplicate=db.playlists.find(x=>String(x.userEmail||'').toLowerCase()===email.toLowerCase()&&String(x.name||'').trim().toLowerCase()===name.toLowerCase());if(duplicate){if(requestId)playlistRequestIds.set(requestId,duplicate);return send(res,200,duplicate)}const pl={id:crypto.randomUUID(),name,image:String(b.image||''),songIds:Array.isArray(b.songIds)?b.songIds:[],createdAt:new Date().toISOString(),userEmail:email,clientRequestId:requestId||undefined};db.playlists.push(pl);if(requestId)playlistRequestIds.set(requestId,pl);await saveNow();event('playlist_created',pl.name,email);broadcast('catalog',{kind:'playlist',userEmail:email});return send(res,200,pl)}
  if(req.method==='PUT'&&p.startsWith('/api/playlists/')){const id=p.split('/').pop(),b=await jsonBody(req),email=sessionEmail(req);if(!email)return send(res,401,{error:'Sign in required'});const pl=db.playlists.find(x=>x.id===id&&String(x.userEmail||'').toLowerCase()===email.toLowerCase());if(!pl)return send(res,404,{error:'Playlist not found'});if(b.name!==undefined)pl.name=String(b.name).trim().slice(0,100);if(b.image!==undefined)pl.image=String(b.image);if(Array.isArray(b.songIds))pl.songIds=b.songIds.filter(id=>db.songs.some(s=>s.id===id));await saveNow();broadcast('catalog',{kind:'playlist',userEmail:email,playlistId:pl.id});return send(res,200,pl)}
  if(req.method==='DELETE'&&p.startsWith('/api/playlists/')){const id=p.split('/').pop(),email=sessionEmail(req);if(!email)return send(res,401,{error:'Sign in required'});const before=db.playlists.length;db.playlists=db.playlists.filter(x=>!(x.id===id&&String(x.userEmail||'').toLowerCase()===email.toLowerCase()));if(db.playlists.length===before)return send(res,404,{error:'Playlist not found'});await saveNow();event('playlist_deleted',id,email);broadcast('catalog',{kind:'playlist',userEmail:email,playlistId:id});return send(res,200,{ok:true})}
  if(req.method==='GET'&&(p==='/api/user/state'||p==='/api/state')){
    const email=sessionEmail(req);if(!email)return send(res,401,{error:'Sign in required'});const st=db.userState[email]||{favorites:[],recent:[],displayName:'',avatar:''};return send(res,200,{favorites:Array.isArray(st.favorites)?st.favorites:[],recent:Array.isArray(st.recent)?st.recent:[],displayName:String(st.displayName||'').slice(0,40),avatar:String(st.avatar||''),themePreference:String(st.themePreference||'aubergine'),accentColor:String(st.accentColor||'plum'),auroraGlow:st.auroraGlow!==false,dynamicMiniColors:st.dynamicMiniColors!==false});
  }
  if(req.method==='PUT'&&(p==='/api/user/state'||p==='/api/state')){
    const b=await jsonBody(req),email=sessionEmail(req);if(!email)return send(res,401,{error:'Sign in required'});
    const cur=db.userState[email]||{};
    db.userState[email]={favorites:Array.isArray(b.favorites)?b.favorites.slice(0,500):(cur.favorites||[]),recent:Array.isArray(b.recent)?b.recent.slice(0,100):(cur.recent||[]),displayName:b.displayName!==undefined?String(b.displayName||'').trim().replace(/\s+/g,' ').slice(0,40):(cur.displayName||''),avatar:b.avatar!==undefined?String(b.avatar||'').slice(0,350000):(cur.avatar||''),themePreference:b.themePreference!==undefined?String(b.themePreference).slice(0,40):(cur.themePreference||'aubergine'),accentColor:b.accentColor!==undefined?String(b.accentColor).slice(0,40):(cur.accentColor||'plum'),auroraGlow:b.auroraGlow!==undefined?!!b.auroraGlow:(cur.auroraGlow!==false),dynamicMiniColors:b.dynamicMiniColors!==undefined?!!b.dynamicMiniColors:(cur.dynamicMiniColors!==false)};await saveNow();broadcast('user_state',{userEmail:email});return send(res,200,{ok:true});
  }
  if(req.method==='GET'&&p==='/api/user/stats'){const email=sessionEmail(req);if(email)ensureUser(email);if(!email)return send(res,401,{error:'Sign in required'});return send(res,200,{listeningSeconds:Number(db.listening[email]||0),events:db.events.filter(e=>e.userEmail===email).slice(0,100)})}
 if(req.method==='POST'&&p==='/api/listening'){const b=await jsonBody(req),email=sessionEmail(req);if(email)ensureUser(email);if(!email)return send(res,400,{error:'User email required'});const sec=Math.max(0,Math.min(30,Number(b.seconds)||0));if(!sec)return send(res,200,{ok:true,totalSeconds:Number(db.listening[email]||0)});db.listening[email]=(Number(db.listening[email]||0)+sec);if(b.songId)event('listening',`${b.songId} · ${Math.round(sec)} sec`,email);else save();return send(res,200,{ok:true,totalSeconds:db.listening[email]})}
 if(req.method==='POST'&&p==='/api/events'){const b=await jsonBody(req),email=sessionEmail(req);if(!email)return send(res,401,{error:'Sign in required'});if(b.songId&&b.type==='play'){const s=db.songs.find(x=>x.id===b.songId);if(s)s.plays=(s.plays||0)+1}event(b.type||'activity',b.detail||b.songId||'',email);return send(res,200,{ok:true})}
 if(p.startsWith('/api/admin')){
   if(!requireAdmin(req,res))return;
   if(req.method==='GET'&&p==='/api/admin/stats'){
     let bytes=0;
     const walkAudio=(dir)=>{for(const name of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,name.name);if(name.isDirectory()){walkAudio(full);continue}try{const ext=path.extname(name.name).toLowerCase();if(['.mp3','.wav','.ogg','.opus','.aac','.m4a','.flac'].includes(ext))bytes+=Number(fs.statSync(full).size)||0}catch{}}};
     try{walkAudio(STORAGE)}catch{}
     const listening=Object.values(db.listening).reduce((a,b)=>a+Number(b||0),0);
     return send(res,200,{songs:db.songs.length,storageBytes:bytes,genres:[...new Set(db.songs.map(s=>s.genre).filter(Boolean))],languages:[...new Set(db.songs.map(s=>s.language).filter(Boolean))],events:db.events.slice(0,100),topPlayed:[...db.songs].sort((a,b)=>(b.plays||0)-(a.plays||0)).slice(0,10).map(publicSong),listeningSeconds:listening,users:Object.keys(db.users||{}).length});
   }
   if(req.method==='GET'&&p==='/api/admin/storage'){
     let totalBytes=0,audioBytes=0,otherBytes=0,totalFiles=0,audioFiles=0,otherFiles=0;
     const audioExt=new Set(['.mp3','.wav','.ogg','.opus','.aac','.m4a','.flac']);
     const walk=(dir)=>{for(const name of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,name.name);if(name.isDirectory()){walk(full);continue}try{const n=Number(fs.statSync(full).size)||0;totalBytes+=n;totalFiles++;if(audioExt.has(path.extname(name.name).toLowerCase())){audioBytes+=n;audioFiles++}else{otherBytes+=n;otherFiles++}}catch{}}};
     try{walk(STORAGE)}catch{}
     return send(res,200,{totalBytes,audioBytes,otherBytes,totalFiles,audioFiles,otherFiles,databaseBytes:fs.existsSync(DB)?Number(fs.statSync(DB).size)||0:0,storagePath:STORAGE});
   }
   if(req.method==='POST'&&p==='/api/admin/upload-presign'){
     if(!adminAuth(req))return send(res,401,{error:'Owner authorization required'});
     try{
       const b=await jsonBody(req);
       const rawFilename=String(b.filename||'song.mp3');
       const ext=path.extname(rawFilename).toLowerCase();
       if(!['.mp3','.wav','.ogg','.opus','.aac','.m4a','.flac'].includes(ext)){
         return send(res,400,{error:'Unsupported audio format: '+ext});
       }
       const fileSize=Number(b.fileSize||0);
       if(fileSize>250*1024*1024){
         return send(res,400,{error:'Audio file is larger than 250 MB'});
       }
       if(!B2_ENABLED||!getSignedUrl){
         return send(res,200,{directToB2:false});
       }
       const key=crypto.randomUUID()+ext;
       const contentType=String(b.contentType||mime[ext]||'audio/mpeg');
       const uploadUrl=await getSignedUrl(b2,new PutObjectCommand({
         Bucket:B2_BUCKET,
         Key:key,
         ContentType:contentType
       }),{expiresIn:900});
       return send(res,200,{
         directToB2:true,
         uploadUrl,
         key,
         bucket:B2_BUCKET,
         contentType
       });
     }catch(e){
       console.error('Presign generation failed:',e);
       return send(res,500,{error:'Failed to generate upload URL: '+(e.message||'Storage error')});
     }
   }
   if(req.method==='POST'&&p==='/api/admin/upload-complete'){
     if(!adminAuth(req))return send(res,401,{error:'Owner authorization required'});
     try{
       const b=await jsonBody(req);
       const key=String(b.key||'').trim();
       if(!key)return send(res,400,{error:'Missing B2 object key'});
       const ext=path.extname(key).toLowerCase();
       if(!['.mp3','.wav','.ogg','.opus','.aac','.m4a','.flac'].includes(ext)){
         return send(res,400,{error:'Invalid object extension'});
       }
       if(!B2_ENABLED)return send(res,500,{error:'Backblaze B2 storage is not configured'});

       let head;
       try{
         head=await b2.send(new HeadObjectCommand({Bucket:B2_BUCKET,Key:key}));
       }catch(err){
         console.error('HeadObject failed for key',key,err);
         return send(res,400,{error:'Uploaded file was not found in Backblaze B2 storage: '+(err.message||'Object missing')});
       }

       const actualSize=Number(head.ContentLength||b.fileSize||0);
       if(actualSize<=0)return send(res,400,{error:'Uploaded audio file in B2 is empty'});

       let embedded={title:'',artist:'',album:'',genre:'',language:'',cover:null};
       try{
         const rangeHeader=actualSize>0?`bytes=0-${Math.min(actualSize-1,1048575)}`:'bytes=0-1048575';
         const rangeRes=await b2.send(new GetObjectCommand({Bucket:B2_BUCKET,Key:key,Range:rangeHeader}));
         const chunks=[];for await(const c of rangeRes.Body)chunks.push(c);
         embedded=extractEmbeddedMetadata(Buffer.concat(chunks),ext);
       }catch(tagErr){
         try{
           if(actualSize>0&&actualSize<=4*1024*1024){
             const fullRes=await b2.send(new GetObjectCommand({Bucket:B2_BUCKET,Key:key}));
             const chunks=[];for await(const c of fullRes.Body)chunks.push(c);
             embedded=extractEmbeddedMetadata(Buffer.concat(chunks),ext);
           }
         }catch{}
       }

       const rawFilename=String(b.filename||key);
       const base=path.parse(rawFilename).name;
       const title=String(b.title||'').trim()||embedded.title||base;
       const artist=String(b.artist||'').trim()||embedded.artist||'Unknown Artist';
       const album=String(b.album||'').trim()||embedded.album||'Single';
       const genre=String(b.genre||'').trim()||embedded.genre||'Other';
       const language=String(b.language||'').trim()||embedded.language||'Unknown';
       const duration=Number(b.duration||embedded.duration||0);

       const song={
         id:crypto.randomUUID(),
         title,
         artist,
         album,
         genre,
         language,
         duration,
         cover:'',
         file:'/uploads/'+key,
         fileSize:actualSize,
         createdAt:new Date().toISOString(),
         plays:0,
         b2Key:key
       };

       let customCoverData=null;
       if(b.cover){
         customCoverData=parseDataUrlCover(b.cover);
       }
       const coverSource=customCoverData||embedded.cover;
       if(coverSource){
         try{
           if(!fs.existsSync(UP))fs.mkdirSync(UP,{recursive:true});
           const c=saveEmbeddedCover(coverSource);
           if(c){
             song.cover=c;
             await uploadLocalCoverToB2(c);
             song.b2CoverKey=path.basename(c);
             try{fs.unlinkSync(path.join(UP,path.basename(c)))}catch{}
           }
         }catch(covErr){
           console.warn('Cover processing note:',covErr.message);
         }
       }

       song.updatedAt = new Date().toISOString();
        db.songs.unshift(song);
        await saveNow();
        event('upload',song.title);
       broadcast('catalog',{kind:'song',song:publicSong(song)});
       return send(res,200,publicSong(song));
     }catch(e){
       console.error('upload-complete error:',e);
       return send(res,500,{error:e.message||'Failed to complete upload'});
     }
   }
   if(req.method==='POST'&&p==='/api/admin/upload-stream'){
     if(IS_VERCEL&&!B2_ENABLED)return send(res,503,{error:'Uploads on Vercel require Backblaze B2 storage configuration.'});
     try{if(!fs.existsSync(UP))fs.mkdirSync(UP,{recursive:true})}catch{}
     let filePath='', b2KeyUploaded='';
     try{
       const rawFilename=String(u.searchParams.get('filename')||'song.mp3');
       const ext=path.extname(rawFilename).toLowerCase();
       if(!['.mp3','.wav','.ogg','.opus','.aac','.m4a','.flac'].includes(ext))throw Error('Unsupported audio format: '+ext);
       const name=crypto.randomUUID()+ext;
       filePath=path.join(UP,name);
       const size=await streamToFile(req,filePath);
       if(!size||size<=0)throw Error('Uploaded audio file is empty');
       if(B2_ENABLED){
         try{
           await putB2File(filePath,name,mime[ext]||'audio/mpeg');
           b2KeyUploaded=name;
         }catch(b2Err){
           console.error('B2 upload failed for file',name,b2Err);
           throw Error('Backblaze B2 upload failed: '+(b2Err.message||'Storage connection error'));
         }
       }
       const originalName=String(u.searchParams.get('filename')||name);
       const song=createSongFromFile(filePath,originalName,{
         title:u.searchParams.get('title')||'',
         artist:u.searchParams.get('artist')||'',
         album:u.searchParams.get('album')||'',
         language:u.searchParams.get('language')||'',
         genre:u.searchParams.get('genre')||'',
         duration:u.searchParams.get('duration')||''
       },size);
       if(B2_ENABLED)song.b2Key=name;
       try{
         const embedded=extractEmbeddedMetadata(fs.readFileSync(filePath),ext);
         for(const k of ['title','artist','album','genre','language']){
           if(!String(u.searchParams.get(k)||'').trim()&&embedded[k])song[k]=embedded[k];
         }
         let c=embedded.cover?saveEmbeddedCover(embedded.cover):'';
         if(!c)c=extractCoverWithFfmpeg(filePath);
         if(c){
           song.cover=c;
           if(B2_ENABLED){
             await uploadLocalCoverToB2(c);
             song.b2CoverKey=path.basename(c);
             try{fs.unlinkSync(path.join(UP,path.basename(c)))}catch{}
           }
         }
       }catch(e){console.error('Upload metadata/artwork processing failed:',e)}
       song.updatedAt = new Date().toISOString();
        db.songs.unshift(song);
        await saveNow();
        event('upload',song.title);
        broadcast('catalog',{kind:'song',song:publicSong(song)});
        send(res,200,publicSong(song));
        if(B2_ENABLED&&IS_VERCEL){try{fs.unlinkSync(filePath)}catch{}}
       return;
     }catch(e){
       console.error('Admin upload-stream error:',e);
       if(filePath){try{fs.unlinkSync(filePath)}catch{}}
       if(b2KeyUploaded){try{await deleteB2File(b2KeyUploaded)}catch{}}
       return send(res,400,{error:e.message||'Upload failed'});
     }
   }
   if(req.method==='POST'&&p==='/api/admin/upload'){
     if(IS_VERCEL&&!B2_ENABLED)return send(res,503,{error:'Uploads on Vercel require Backblaze B2 storage configuration.'});
     try{if(!fs.existsSync(UP))fs.mkdirSync(UP,{recursive:true})}catch{}
     let localFile='';
     try{
       const b=await body(req),parts=parseMultipart(b,req.headers['content-type']),file=parts.find(x=>x.filename);
       if(!file)throw Error('Audio file required');
       const ext=path.extname(file.filename).toLowerCase();
       if(!['.mp3','.wav','.ogg','.opus','.aac','.m4a','.flac'].includes(ext))throw Error('Unsupported audio format');
       if(file.data.length>250*1024*1024)throw Error('Audio file is larger than 250 MB');
       const name=crypto.randomUUID()+ext;localFile=path.join(UP,name);await fs.promises.writeFile(localFile,file.data);
       if(B2_ENABLED)await putB2File(localFile,name,mime[ext]);
       const val=k=>{const x=parts.find(z=>z.name===k);return x?x.data.toString().trim():''};
       const embedded=extractEmbeddedMetadata(file.data,ext);
       const manual=val('cover'),manualData=parseDataUrlCover(manual);
       let cover=manualData?saveEmbeddedCover(manualData):(manual||'');
       if(!cover&&embedded.cover)cover=saveEmbeddedCover(embedded.cover);
       if(!cover){const c=extractCoverWithFfmpeg(localFile);if(c)cover=c;}
       const song={id:crypto.randomUUID(),title:val('title')||embedded.title||path.parse(file.filename).name,artist:val('artist')||embedded.artist||'Unknown Artist',album:val('album')||embedded.album||'Single',genre:val('genre')||embedded.genre||'Other',language:val('language')||embedded.language||'Unknown',duration:Number(val('duration')||0),cover,file:'/uploads/'+name,fileSize:file.data.length,createdAt:new Date().toISOString(),plays:0,...(B2_ENABLED?{b2Key:name}:{})};
       if(B2_ENABLED&&cover.startsWith('/uploads/')){await uploadLocalCoverToB2(cover);song.b2CoverKey=path.basename(cover);try{fs.unlinkSync(path.join(UP,path.basename(cover)))}catch{}}
       song.updatedAt = new Date().toISOString();
        db.songs.unshift(song);await saveNow();event('upload',song.title);broadcast('catalog',{kind:'song',song:publicSong(song)});send(res,200,publicSong(song));return;
     }catch(e){return send(res,400,{error:e.message||'Upload failed'})}
     finally{if(B2_ENABLED&&localFile){try{fs.unlinkSync(localFile)}catch{}}}
   }
   if(req.method==='POST'&&p.startsWith('/api/admin/song-cover/')){
     if(IS_VERCEL&&!B2_ENABLED)return send(res,503,{error:'Artwork uploads on Vercel require Backblaze B2 storage configuration.'});
     try{if(!fs.existsSync(UP))fs.mkdirSync(UP,{recursive:true})}catch{}
     try{
       const id=p.split('/').pop(),song=db.songs.find(x=>x.id===id);if(!song)return send(res,404,{error:'Song not found'});
       const b=await jsonBody(req),c=parseDataUrlCover(b.cover);if(!c)return send(res,400,{error:'Invalid artwork'});
       const cover=saveEmbeddedCover(c);if(!cover)return send(res,400,{error:'Artwork could not be saved'});
       const oldKey=song.b2CoverKey||'';
       if(B2_ENABLED){
          await uploadLocalCoverToB2(cover);
          song.b2CoverKey=path.basename(cover);
          if(IS_VERCEL){try{fs.unlinkSync(path.join(UP,path.basename(cover)))}catch{}}
        }
        if(B2_ENABLED&&oldKey&&oldKey!==song.b2CoverKey){try{await deleteB2File(oldKey)}catch{}}
        song.cover=cover;
        missingCoverSongIds.delete(id);
        song.updatedAt=new Date().toISOString();
        db.catalogUpdatedAt=song.updatedAt;
        isHydrated=true;
        lastHydratedAt=Date.now();
        await saveNow();
        broadcast('song_updated',{song:publicSong(song)});
        broadcast('catalog',{kind:'song',song:publicSong(song)});
        return send(res,200,publicSong(song));
     }catch(e){return send(res,400,{error:e.message||'Artwork upload failed'})}
   }
   if(req.method==='PUT'&&p.startsWith('/api/admin/songs/')){
      try{
        if(B2_ENABLED && !isHydrated) await ensureHydrated();
        const id=p.split('/').pop(),song=db.songs.find(x=>x.id===id);if(!song)return send(res,404,{error:'Song not found'});
        const b=await jsonBody(req);
        if(b.title!==undefined&&String(b.title).trim()) song.title=String(b.title).trim();
        if(b.artist!==undefined) song.artist=String(b.artist).trim()||'Unknown Artist';
        if(b.album!==undefined) song.album=String(b.album).trim()||'Single';
        if(b.genre!==undefined) song.genre=String(b.genre).trim()||'Other';
        if(b.language!==undefined) song.language=String(b.language).trim()||'Unknown';
        if(b.cover&&String(b.cover).startsWith('data:image/')){
          const c=parseDataUrlCover(b.cover);
          if(!c)return send(res,400,{error:'Invalid artwork format'});
          const cover=saveEmbeddedCover(c);
          if(!cover)return send(res,400,{error:'Artwork could not be saved'});
          const oldKey=song.b2CoverKey||(song.cover&&song.cover.startsWith('/uploads/')?path.basename(song.cover):'');
          if(B2_ENABLED){
             await uploadLocalCoverToB2(cover);
             song.b2CoverKey=path.basename(cover);
             if(IS_VERCEL){try{fs.unlinkSync(path.join(UP,path.basename(cover)))}catch{}}
           }
           if(B2_ENABLED&&oldKey&&oldKey!==path.basename(cover)){
             try{await deleteB2File(oldKey)}catch{}
           }
           song.cover=cover;
         }
         missingCoverSongIds.delete(id);
         song.updatedAt=new Date().toISOString();
         db.catalogUpdatedAt=song.updatedAt;
         isHydrated=true;
         lastHydratedAt=Date.now();
         await saveNow();
         event('edit',song.title);
         broadcast('song_updated',{song:publicSong(song)});
         broadcast('catalog',{kind:'song',song:publicSong(song)});
         return send(res,200,publicSong(song));
      }catch(e){
        return send(res,500,{error:e.message||'Song update failed'});
      }
    }
    if(req.method==='DELETE'&&p.startsWith('/api/admin/songs/')){
     try{
       if(B2_ENABLED && !isHydrated) await ensureHydrated();
       const id=p.split('/').pop(),i=db.songs.findIndex(s=>s.id===id);if(i<0)return send(res,404,{error:'Song not found'});
       const song=db.songs[i];
       db.deletedSongIds = Array.isArray(db.deletedSongIds) ? db.deletedSongIds : [];
       if(!db.deletedSongIds.includes(id)) db.deletedSongIds.push(id);
       try{const localSong=resolveUploadLocalPath(song.file);if(localSong&&fs.existsSync(localSong))fs.unlinkSync(localSong)}catch{}
       if(song.b2Key){try{await deleteB2File(song.b2Key)}catch(e){console.error('B2 song delete failed',e)}}
       const coverKey=song.b2CoverKey||(song.cover&&song.cover.startsWith('/uploads/')?path.basename(song.cover):'');
       if(coverKey){try{await deleteB2File(coverKey)}catch(e){console.error('B2 artwork delete failed',e)}}
       if(song.cover&&song.cover.startsWith('/uploads/')){try{const localCover=resolveUploadLocalPath(song.cover);if(localCover&&fs.existsSync(localCover))fs.unlinkSync(localCover)}catch{}}
       db.songs.splice(i,1);
       db.playlists.forEach(x=>x.songIds=x.songIds.filter(y=>y!==id));
       db.catalogUpdatedAt=new Date().toISOString();
       isHydrated=true;
       lastHydratedAt=Date.now();
       await saveNow();
       event('delete',song.title);
       broadcast('catalog',{kind:'song_deleted',songId:id});
       broadcast('song_deleted',{songId:id});
       return send(res,200,{ok:true,deletedId:id});
     }catch(e){
       return send(res,500,{error:e.message||'Song deletion failed'});
     }
   }
  }
 if(req.method==='GET'||req.method==='HEAD'){
   if(p.includes('..')||(req.url&&decodeURIComponent(req.url).includes('..')))return send(res,403,{error:'Access denied'});
   const rel=p==='/'?'/index.html':p;
   let fp=rel.startsWith('/uploads/')?resolveUploadLocalPath(decodeURIComponent(rel)):path.resolve(PUBLIC,'.'+rel);
   const pubRoot=path.resolve(PUBLIC);
   if(!rel.startsWith('/uploads/')&&fp){
     const root=path.resolve(fp);
     if(!root.startsWith(pubRoot+path.sep)&&root!==path.join(pubRoot,'index.html')&&root!==pubRoot){
       return send(res,403,{error:'Access denied'});
     }
   }
   if(rel.startsWith('/uploads/')&&fp){
     const root=path.resolve(fp);
     if(!root.startsWith(path.resolve(UP)+path.sep) && !root.startsWith(path.resolve(PUBLIC,'uploads')+path.sep))return send(res,404,{error:'File not found'});
   }
   if(rel.startsWith('/uploads/')){
     const decoded=decodeURIComponent(rel);
     const media=findSongMedia(decoded);
     const reqName=path.basename(decoded);
     const reqExt=path.extname(reqName).toLowerCase();
     const isAudio=['.mp3','.wav','.ogg','.opus','.m4a','.aac','.flac'].includes(reqExt);
     const isImage=['.jpg','.jpeg','.png','.webp','.gif'].includes(reqExt);
     if(media&&B2_ENABLED){
       const localTarget=resolveUploadLocalPath(decoded);
       if(!localTarget){
         const typeHint=isAudio?(mime[reqExt]||'audio/mpeg'):(mime[reqExt]||'image/jpeg');
         if(await serveB2Object(req,res,media.key,typeHint))return;
       }
     }
     if(!fp || !fs.existsSync(fp)){
       const key=path.basename(decoded);
       if(key&&key===path.basename(key)&&B2_ENABLED&&(isAudio||isImage)){
         if(await serveB2Object(req,res,key,mime[reqExt]||'application/octet-stream'))return;
       }
       if(isImage){
         const FALLBACK_SVG=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><rect width="600" height="600" fill="#121217"/><circle cx="300" cy="300" r="205" fill="url(#g)"/><defs><linearGradient id="g"><stop stop-color="#a43cff"/><stop offset=".6" stop-color="#26c7e8"/><stop offset="1" stop-color="#26d59a"/></linearGradient></defs><text x="300" y="340" text-anchor="middle" fill="white" font-size="120" font-family="Arial" font-weight="800">S</text></svg>`;
         res.writeHead(200,{'Content-Type':'image/svg+xml','Content-Length':Buffer.byteLength(FALLBACK_SVG),'Cache-Control':'no-cache, no-store','Access-Control-Allow-Origin':'*'});
         return res.end(FALLBACK_SVG);
       }
       return send(res,404,{error:'File not found'});
     }
   }
   if(!fp||!fs.existsSync(fp)||fs.statSync(fp).isDirectory())fp=path.join(PUBLIC,'index.html');
   try{
     const ext=path.extname(fp).toLowerCase(), type=mime[ext]||'application/octet-stream';
     if(ext.startsWith('.mp3')||['.wav','.ogg','.opus','.m4a','.aac','.flac'].includes(ext)){
       const size=fs.statSync(fp).size, range=req.headers.range;
       if(range){
         const m=/bytes=(\d*)-(\d*)/.exec(range);
         if(m){
           const isSuffix = m[1] === '' && m[2] !== '';
           let start = isSuffix ? Math.max(0, size - (Number(m[2]) || 0)) : (m[1] !== '' ? Number(m[1]) : 0);
           let end = isSuffix ? size - 1 : (m[2] !== '' ? Number(m[2]) : size - 1);
           if(!Number.isFinite(start)||!Number.isFinite(end)||start<0||end<0||start>=size){
             res.writeHead(416,{'Content-Range':`bytes */${size}`,'Accept-Ranges':'bytes'});return res.end();
           }
           start=Math.floor(start);end=Math.floor(end);
           if(end<start){res.writeHead(416,{'Content-Range':`bytes */${size}`,'Accept-Ranges':'bytes'});return res.end()}
           end=Math.min(end,size-1);
           res.writeHead(206,{'Content-Type':type,'Content-Length':end-start+1,'Content-Range':`bytes ${start}-${end}/${size}`,'Accept-Ranges':'bytes','Cache-Control':'public, max-age=3600','Connection':'keep-alive'});
           return fs.createReadStream(fp,{start,end}).pipe(res);
         }
       }
       res.writeHead(200,{'Content-Type':type,'Content-Length':size,'Accept-Ranges':'bytes','Cache-Control':'public, max-age=3600','Connection':'keep-alive'});return fs.createReadStream(fp).pipe(res);
     }
     const data=fs.readFileSync(fp);const isCode=['.html','.js','.css','.json'].includes(ext);const cache=isCode?'no-store, no-cache, must-revalidate, max-age=0':'public, max-age=86400';const h={'Content-Type':type,'Cache-Control':cache,'Content-Length':data.length};if(isCode){h['Pragma']='no-cache';h['Expires']='0';}res.writeHead(200,h);return res.end(req.method==='HEAD'?undefined:data)
   }catch{return send(res,404,{error:'Not found'})}
 }
 return send(res,404,{error:'Not found'});
}
const server=http.createServer((req,res)=>handle(req,res).catch(e=>{
  if(e.message==='Payload too large'||e.status===413)return send(res,413,{error:'Payload too large'});
  if(e.status===400||e instanceof SyntaxError)return send(res,400,{error:e.message||'Bad request'});
  console.error('SYNTH AUDIO request error:',e);
  send(res,500,{error:e.message||'Server error'});
}));
server.handle=handle;
server.ensureHydrated=ensureHydrated;
server.loadDatabaseFromB2=loadDatabaseFromB2;
server.resetB2Cooldown=()=>{ b2CooldownUntil = 0; b2LastError = null; };
server.getB2Status=()=>({ isHydrated, b2CooldownUntil, inCooldown: Date.now() < b2CooldownUntil, lastError: b2LastError });
server.db=db;
Object.defineProperty(server,'db',{get:()=>db,configurable:true});
Object.defineProperty(server,'isHydrated',{get:()=>isHydrated||!B2_ENABLED,configurable:true});
Object.defineProperty(server,'b2CooldownUntil',{get:()=>b2CooldownUntil,set:v=>{b2CooldownUntil=v;},configurable:true});
if (!IS_VERCEL) {
  server.listen(PORT,'0.0.0.0',()=>console.log(`SYNTH AUDIO running on port ${PORT}`));
}

module.exports = server;
function shutdown(){try{if(saveTimer){clearTimeout(saveTimer);saveTimer=null}if(saveQueued)saveNow()}finally{for(const res of sseClients){try{res.end()}catch{}}process.exit(0)}}
if(!IS_VERCEL){process.on('SIGINT',shutdown);process.on('SIGTERM',shutdown)}
