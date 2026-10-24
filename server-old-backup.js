const http=require('http');
const fs=require('fs');
const path=require('path');
const crypto=require('crypto');
const zlib=require('zlib');
const {spawnSync}=require('child_process');
const {URL}=require('url');

const ROOT=__dirname, PUBLIC=path.join(ROOT,'public');
// Railway: set STORAGE_DIR to the mount point of a persistent Volume (for example /app/storage).
// Local development keeps the historical data/ and public/uploads/ layout by default.
const STORAGE=path.resolve(process.env.STORAGE_DIR||path.join(ROOT,'data'));
const DATA=STORAGE, UP=path.join(STORAGE,'uploads');
fs.mkdirSync(DATA,{recursive:true});fs.mkdirSync(UP,{recursive:true});
const DB=path.join(DATA,'db.json');
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
let saveTimer=null, saveQueued=false;
function saveNow(){
  const tmp=DB+'.tmp';
  fs.writeFileSync(tmp,JSON.stringify(db,null,2));
  fs.renameSync(tmp,DB);
}
function save(){
  saveQueued=true;
  if(saveTimer)return;
  saveTimer=setTimeout(()=>{saveTimer=null;if(!saveQueued)return;saveQueued=false;try{saveNow()}catch(e){console.error('SYNTH AUDIO database save failed',e)}},120);
}
const ADMIN_KEY=String(process.env.ADMIN_KEY||'Akil152506dp');
const OWNER_EMAIL=(process.env.OWNER_EMAIL||'akilesht@karunya.edu.in').trim().toLowerCase();
if(process.env.NODE_ENV==='production' && (!process.env.ADMIN_KEY || !process.env.OWNER_EMAIL)){
  console.warn('SYNTH AUDIO: production is using the built-in owner credentials. Set ADMIN_KEY and OWNER_EMAIL in the hosting service for a private deployment.');
}
const PORT=Number(process.env.PORT||3000);
const BUILD_VERSION='65.0.0';
const SESSION_TTL=30*24*60*60*1000;
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
function body(req){return new Promise((resolve,reject)=>{const a=[];req.on('data',c=>a.push(c));req.on('end',()=>resolve(Buffer.concat(a)));req.on('error',reject)})}
async function jsonBody(req){const b=await body(req);return JSON.parse(b.toString()||'{}')}

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
  const mime=String(c.mime||'image/jpeg').toLowerCase();
  const ext=mime.includes('png')?'.png':mime.includes('webp')?'.webp':mime.includes('gif')?'.gif':'.jpg';
  const name=crypto.randomUUID()+ext; fs.writeFileSync(path.join(UP,name),c.data); return '/uploads/'+name;
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
function adminAuth(req){
  if(safeEqual(req.headers['x-admin-key'],ADMIN_KEY))return true;
  const h=String(req.headers.authorization||'').replace(/^Bearer\s+/i,'');
  const x=h&&db.sessions[h];
  if(!x||x.admin!==true)return false;
  if(Number(x.createdAt||0)+SESSION_TTL<Date.now()){delete db.sessions[h];save();return false}
  return true;
}
function ownerIdentity(email,key){return String(email||'').trim().toLowerCase()===OWNER_EMAIL&&safeEqual(key,ADMIN_KEY)}

function parseMultipart(buf,ct){const m=/boundary=(?:"([^"]+)"|([^;]+))/i.exec(ct||'');if(!m)throw Error('Missing multipart boundary');const boundary=Buffer.from('--'+(m[1]||m[2]));let pos=0,parts=[];while(true){let s=buf.indexOf(boundary,pos);if(s<0)break;s+=boundary.length;if(buf[s]===45&&buf[s+1]===45)break;if(buf[s]===13&&buf[s+1]===10)s+=2;const e=buf.indexOf(Buffer.from('\r\n\r\n'),s);if(e<0)break;const headers=buf.slice(s,e).toString();const next=buf.indexOf(boundary,e+4);if(next<0)break;const data=buf.slice(e+4,next-2);const nm=/name="([^"]+)"/i.exec(headers),fm=/filename="([^"]*)"/i.exec(headers);if(nm)parts.push({name:nm[1],filename:fm?fm[1]:null,data});pos=next}return parts}
function publicSong(s){const x={...s};delete x.fileSize;return x}
function userEmail(reqUrl){return String(reqUrl.searchParams.get('userEmail')||'').trim().toLowerCase()}
function hashPassword(password,salt=crypto.randomBytes(16).toString('hex')){const hash=crypto.pbkdf2Sync(String(password),salt,120000,32,'sha256').toString('hex');return `${salt}:${hash}`}
function verifyPassword(password,stored){const [salt,hash]=String(stored||'').split(':');if(!salt||!hash)return false;const actual=crypto.pbkdf2Sync(String(password),salt,120000,32,'sha256').toString('hex');return safeEqual(actual,hash)}
function makeSession(email){const token=crypto.randomBytes(32).toString('hex');db.sessions[token]={email,createdAt:Date.now()};save();return token}
function sessionEmail(req){const h=String(req.headers.authorization||'');const m=/^Bearer\s+(.+)$/i.exec(h);if(!m)return '';const token=m[1],x=db.sessions[token];if(!x)return '';if(Number(x.createdAt||0)+SESSION_TTL<Date.now()){delete db.sessions[token];save();return ''}return x.email||''}
function ensureUser(email){email=String(email||'').trim().toLowerCase();if(!email)return null;if(!db.users[email]){db.users[email]={email,createdAt:new Date().toISOString()};save()}return db.users[email]}


function hydrateMissingArtwork(){
  let changed=false;
  for(const s of db.songs){
    if(s.cover)continue;
    const fp=s.file?(s.file.startsWith('/uploads/')?path.join(UP,path.basename(s.file)):path.join(PUBLIC,s.file.replace(/^\//,'').replace(/\//g,path.sep))):'';
    if(!fp||!fs.existsSync(fp))continue;
    try{const ext=path.extname(fp).toLowerCase();const meta=extractEmbeddedMetadata(fs.readFileSync(fp),ext);const c=saveEmbeddedCover(meta.cover);if(c){s.cover=c;changed=true}}catch{}
  }
  if(changed)save();
}
setImmediate(()=>{try{hydrateMissingArtwork()}catch{}});
async function streamToFile(req,filePath,maxBytes=250*1024*1024){
  await new Promise((resolve,reject)=>{
    const out=fs.createWriteStream(filePath,{flags:'wx'});let total=0,done=false;
    const fail=e=>{if(done)return;done=true;req.destroy();try{out.destroy();}catch{};try{fs.unlinkSync(filePath)}catch{};reject(e)};
    req.on('data',chunk=>{if(done)return;total+=chunk.length;if(total>maxBytes)return fail(Error('Audio file is larger than 250 MB'));if(!out.write(chunk))req.pause()});
    out.on('drain',()=>req.resume());
    req.on('end',()=>{if(done)return;done=true;out.end(()=>resolve(total))});
    req.on('aborted',()=>fail(Error('Upload cancelled')));req.on('error',fail);out.on('error',fail);
  });
}
function parseDataUrlCover(value){const raw=String(value||'');if(raw.length>7*1024*1024)return null;const m=/^data:([^;,]+)?;base64,(.+)$/s.exec(raw);if(!m)return null;try{const data=Buffer.from(m[2],'base64');if(data.length>5*1024*1024)return null;return {mime:m[1]||'image/jpeg',data}}catch{return null}}
function createSongFromFile(filePath,originalName,meta={},fileSize=0){
  const base=path.parse(originalName).name;
  return {id:crypto.randomUUID(),title:String(meta.title||base).trim()||base,artist:String(meta.artist||'Unknown Artist').trim(),album:String(meta.album||'Single').trim(),genre:String(meta.genre||'Other').trim(),language:String(meta.language||'Unknown').trim(),duration:Number(meta.duration||0),cover:'',file:'/uploads/'+path.basename(filePath),fileSize,createdAt:new Date().toISOString(),plays:0};
}
async function handle(req,res){
 const u=new URL(req.url,'http://localhost'); const p=u.pathname;
 if(req.method==='OPTIONS'){return send(res,204,'','text/plain; charset=utf-8')}
 if(req.method==='POST'&&p==='/api/auth/register'){
   try{const b=await jsonBody(req),email=String(b.email||'').trim().toLowerCase(),password=String(b.password||'');
     if(!/^\S+@\S+\.\S+$/.test(email))return send(res,400,{error:'Enter a valid email address'});
     if(password.length<6)return send(res,400,{error:'Password must be at least 6 characters'});
     if(db.users[email])return send(res,409,{error:'An account with this email already exists'});
     db.users[email]={email,passwordHash:hashPassword(password),createdAt:new Date().toISOString()};db.userState[email]=db.userState[email]||{favorites:[],recent:[],displayName:''};
     const token=makeSession(email);event('signup','Account created',email);return send(res,200,{ok:true,email,token});
   }catch(e){return send(res,400,{error:e.message||'Registration failed'})}
 }
 if(req.method==='POST'&&p==='/api/auth/login'){
   try{const b=await jsonBody(req),email=String(b.email||'').trim().toLowerCase(),password=String(b.password||'');const u=db.users[email];
     if(!u||!verifyPassword(password,u.passwordHash))return send(res,401,{error:'Incorrect email or password'});
     const token=makeSession(email);return send(res,200,{ok:true,email,token});
   }catch(e){return send(res,400,{error:'Login failed'})}
 }
 if(req.method==='POST'&&p==='/api/auth/logout'){const email=sessionEmail(req);const h=String(req.headers.authorization||'').replace(/^Bearer\s+/i,'');if(h)delete db.sessions[h];save();return send(res,200,{ok:true,email})}
 if(req.method==='GET'&&p==='/api/auth/me'){const email=sessionEmail(req);return send(res,200,{authenticated:!!email,email:email||null})}
 if(req.method==='GET'&&p==='/api/config')return send(res,200,{ownerEmail:OWNER_EMAIL,ownerLoginEnabled:true,build:BUILD_VERSION});
 if(req.method==='GET'&&p==='/api/health')return send(res,200,{ok:true,time:new Date().toISOString(),songs:db.songs.length});
 if(req.method==='POST'&&p==='/api/admin/verify'){try{const b=await jsonBody(req);if(!ownerIdentity(b.email,b.key))return send(res,401,{error:'Owner authorization failed'});const token=crypto.randomBytes(32).toString('hex');db.sessions[token]={email:OWNER_EMAIL,admin:true,createdAt:Date.now()};save();return send(res,200,{ok:true,token,email:OWNER_EMAIL})}catch{return send(res,400,{error:'Invalid request'})}}
 if(req.method==='GET'&&p==='/api/events/stream'){res.writeHead(200,{'Content-Type':'text/event-stream; charset=utf-8','Cache-Control':'no-cache, no-transform','Connection':'keep-alive','Access-Control-Allow-Origin':'*','X-Accel-Buffering':'no'});res.write('retry: 3000\n\n');sseClients.add(res);const ping=setInterval(()=>{try{res.write(': ping\n\n')}catch{}},20000);req.on('close',()=>{clearInterval(ping);sseClients.delete(res)});return}
if(req.method==='GET'&&p==='/api/songs')return send(res,200,db.songs.map(publicSong));
 if(req.method==='GET'&&p==='/api/playlists'){const email=sessionEmail(req);if(!email)return send(res,401,{error:'Sign in required'});return send(res,200,db.playlists.filter(x=>x.userEmail===email))}
 if(req.method==='POST'&&p==='/api/playlists'){const b=await jsonBody(req),email=sessionEmail(req),requestId=String(b.clientRequestId||'').trim();if(!email)return send(res,400,{error:'User email required'});if(requestId&&playlistRequestIds.has(requestId))return send(res,200,playlistRequestIds.get(requestId));if(requestId){const existing=db.playlists.find(x=>x.clientRequestId===requestId);if(existing){playlistRequestIds.set(requestId,existing);return send(res,200,existing)}}const name=String(b.name||'New Playlist').trim().slice(0,100)||'New Playlist';const duplicate=db.playlists.find(x=>x.userEmail===email&&String(x.name||'').trim().toLowerCase()===name.toLowerCase());if(duplicate){if(requestId)playlistRequestIds.set(requestId,duplicate);return send(res,200,duplicate)}const pl={id:crypto.randomUUID(),name,image:String(b.image||''),songIds:Array.isArray(b.songIds)?b.songIds:[],createdAt:new Date().toISOString(),userEmail:email,clientRequestId:requestId||undefined};db.playlists.push(pl);if(requestId)playlistRequestIds.set(requestId,pl);save();event('playlist_created',pl.name,email);broadcast('catalog',{kind:'playlist',userEmail:email});return send(res,200,pl)}
 if(req.method==='PUT'&&p.startsWith('/api/playlists/')){const id=p.split('/').pop(),b=await jsonBody(req),email=sessionEmail(req);if(!email)return send(res,401,{error:'Sign in required'});const pl=db.playlists.find(x=>x.id===id&&x.userEmail===email);if(!pl)return send(res,404,{error:'Playlist not found'});if(b.name!==undefined)pl.name=String(b.name).trim().slice(0,100);if(b.image!==undefined)pl.image=String(b.image);if(Array.isArray(b.songIds))pl.songIds=b.songIds.filter(id=>db.songs.some(s=>s.id===id));save();broadcast('catalog',{kind:'playlist',userEmail:email,playlistId:pl.id});return send(res,200,pl)}
 if(req.method==='DELETE'&&p.startsWith('/api/playlists/')){const id=p.split('/').pop(),email=sessionEmail(req);if(!email)return send(res,401,{error:'Sign in required'});const before=db.playlists.length;db.playlists=db.playlists.filter(x=>!(x.id===id&&x.userEmail===email));if(db.playlists.length===before)return send(res,404,{error:'Playlist not found'});event('playlist_deleted',id,email);broadcast('catalog',{kind:'playlist',userEmail:email,playlistId:id});return send(res,200,{ok:true})}
 if(req.method==='GET'&&p==='/api/user/state'){
   const email=sessionEmail(req);if(!email)return send(res,401,{error:'Sign in required'});const st=db.userState[email]||{favorites:[],recent:[],displayName:''};return send(res,200,{favorites:Array.isArray(st.favorites)?st.favorites:[],recent:Array.isArray(st.recent)?st.recent:[],displayName:String(st.displayName||'').slice(0,40)});
 }
 if(req.method==='PUT'&&p==='/api/user/state'){
   const b=await jsonBody(req),email=sessionEmail(req);if(!email)return send(res,401,{error:'Sign in required'});
   db.userState[email]={favorites:Array.isArray(b.favorites)?b.favorites.slice(0,500):[],recent:Array.isArray(b.recent)?b.recent.slice(0,100):[],displayName:String(b.displayName||'').trim().replace(/\s+/g,' ').slice(0,40)};save();broadcast('user_state',{userEmail:email});return send(res,200,{ok:true});
 }
 if(req.method==='GET'&&p==='/api/user/stats'){const email=sessionEmail(req);if(email)ensureUser(email);if(!email)return send(res,400,{error:'User email required'});return send(res,200,{listeningSeconds:Number(db.listening[email]||0),events:db.events.filter(e=>e.userEmail===email).slice(0,100)})}
 if(req.method==='POST'&&p==='/api/listening'){const b=await jsonBody(req),email=sessionEmail(req);if(email)ensureUser(email);if(!email)return send(res,400,{error:'User email required'});const sec=Math.max(0,Math.min(30,Number(b.seconds)||0));if(!sec)return send(res,200,{ok:true,totalSeconds:Number(db.listening[email]||0)});db.listening[email]=(Number(db.listening[email]||0)+sec);if(b.songId)event('listening',`${b.songId} · ${Math.round(sec)} sec`,email);else save();return send(res,200,{ok:true,totalSeconds:db.listening[email]})}
 if(req.method==='POST'&&p==='/api/events'){const b=await jsonBody(req),email=sessionEmail(req);if(!email)return send(res,401,{error:'Sign in required'});if(b.songId&&b.type==='play'){const s=db.songs.find(x=>x.id===b.songId);if(s)s.plays=(s.plays||0)+1}event(b.type||'activity',b.detail||b.songId||'',email);return send(res,200,{ok:true})}
 if(p.startsWith('/api/admin')){
   if(!adminAuth(req))return send(res,401,{error:'Owner authorization required'});
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
   if(req.method==='POST'&&p==='/api/admin/upload-stream'){
     try{
       const ext=path.extname(String(u.searchParams.get('filename')||'song.mp3')).toLowerCase();
       if(!['.mp3','.wav','.ogg','.opus','.aac','.m4a','.flac'].includes(ext))throw Error('Unsupported audio format');
       const name=crypto.randomUUID()+ext,filePath=path.join(UP,name);const size=await streamToFile(req,filePath);
       const meta={title:u.searchParams.get('title')||'',artist:u.searchParams.get('artist')||'',album:u.searchParams.get('album')||'',language:u.searchParams.get('language')||'',genre:u.searchParams.get('genre')||'',duration:u.searchParams.get('duration')||''};
       const originalName=String(u.searchParams.get('filename')||name);const song=createSongFromFile(filePath,originalName,meta,size);db.songs.unshift(song);event('upload',song.title);broadcast('catalog',{kind:'song',song:publicSong(song)});
       send(res,200,publicSong(song));
       setImmediate(()=>{try{const embedded=extractEmbeddedMetadata(fs.readFileSync(filePath),ext);let changed=false;for(const [k,def] of [['title',path.parse(originalName).name],['artist','Unknown Artist'],['album','Single'],['genre','Other'],['language','Unknown']]){if((!u.searchParams.get(k)||String(u.searchParams.get(k)).trim()==='')&&embedded[k]){song[k]=embedded[k];changed=true}}if(embedded.cover){const c=saveEmbeddedCover(embedded.cover);if(c){song.cover=c;changed=true}}if(!song.cover){const c=extractCoverWithFfmpeg(filePath);if(c){song.cover=c;changed=true}}if(changed){save();broadcast('song_updated',{song:publicSong(song)})}}catch(e){console.error('Background metadata processing failed',e)}});
       return;
     }catch(e){return send(res,400,{error:e.message})}
   }
   if(req.method==='POST'&&p==='/api/admin/upload'){
     try{const b=await body(req),parts=parseMultipart(b,req.headers['content-type']);const file=parts.find(x=>x.filename);if(!file)throw Error('Audio file required');const ext=path.extname(file.filename).toLowerCase();if(!['.mp3','.wav','.ogg','.opus','.aac','.m4a','.flac'].includes(ext))throw Error('Unsupported audio format');if(file.data.length>250*1024*1024)throw Error('Audio file is larger than 250 MB');
       const name=crypto.randomUUID()+ext;await fs.promises.writeFile(path.join(UP,name),file.data);const val=k=>{const x=parts.find(z=>z.name===k);return x?x.data.toString().trim():''};
       const embedded=extractEmbeddedMetadata(file.data,ext); const manualCover=val('cover'); let cover=manualCover||saveEmbeddedCover(embedded.cover);
       const song={id:crypto.randomUUID(),title:val('title')||embedded.title||path.parse(file.filename).name,artist:val('artist')||embedded.artist||'Unknown Artist',album:val('album')||embedded.album||'Single',genre:val('genre')||embedded.genre||'Other',language:val('language')||embedded.language||'Unknown',duration:Number(val('duration')||0),cover,file:'/uploads/'+name,fileSize:file.data.length,createdAt:new Date().toISOString(),plays:0};db.songs.unshift(song);event('upload',song.title);broadcast('catalog',{kind:'song',song:publicSong(song)});send(res,200,publicSong(song));
       if(!cover)setImmediate(()=>{try{const c=extractCoverWithFfmpeg(path.join(UP,name));if(c){song.cover=c;save();broadcast('song_updated',{song:publicSong(song)})}}catch{}});
       return;
     }catch(e){return send(res,400,{error:e.message})}
   }
   if(req.method==='POST'&&p.startsWith('/api/admin/song-cover/')){try{const id=p.split('/').pop(),s=db.songs.find(x=>x.id===id);if(!s)return send(res,404,{error:'Song not found'});const b=await jsonBody(req),c=parseDataUrlCover(b.cover);if(!c)return send(res,400,{error:'Invalid artwork'});const cover=saveEmbeddedCover(c);if(!cover)return send(res,400,{error:'Artwork could not be saved'});s.cover=cover;save();broadcast('song_updated',{song:publicSong(s)});return send(res,200,publicSong(s))}catch(e){return send(res,400,{error:e.message||'Artwork upload failed'})}}
   if(req.method==='DELETE'&&p.startsWith('/api/admin/songs/')){const id=p.split('/').pop(),i=db.songs.findIndex(s=>s.id===id);if(i<0)return send(res,404,{error:'Song not found'});const s=db.songs[i];try{fs.unlinkSync(path.join(UP,path.basename(s.file)))}catch{}if(s.cover&&s.cover.startsWith('/uploads/')){try{fs.unlinkSync(path.join(UP,path.basename(s.cover)))}catch{}}db.songs.splice(i,1);db.playlists.forEach(x=>x.songIds=x.songIds.filter(y=>y!==id));event('delete',s.title);broadcast('catalog',{kind:'song_deleted',songId:id});return send(res,200,{ok:true})}
 }
 if(req.method==='GET'){
   const rel=p==='/'?'/index.html':p;
   let fp=rel.startsWith('/uploads/')?path.resolve(UP,'.'+rel.slice('/uploads'.length)):path.resolve(PUBLIC,'.'+rel); if(!fp.startsWith(PUBLIC+path.sep) && !fp.startsWith(UP+path.sep))fp=path.join(PUBLIC,'index.html'); if(!fs.existsSync(fp)||fs.statSync(fp).isDirectory())fp=path.join(PUBLIC,'index.html');
   try{
     const ext=path.extname(fp).toLowerCase(), type=mime[ext]||'application/octet-stream';
     if(ext.startsWith('.mp3')||['.wav','.ogg','.opus','.m4a','.aac','.flac'].includes(ext)){
       const size=fs.statSync(fp).size, range=req.headers.range;
       if(range){
         const m=/bytes=(\d*)-(\d*)/.exec(range);
         if(m){
           let start=m[1]!==''?Number(m[1]):Math.max(0,size-(Number(m[2])||0));
           let end=m[2]!==''?Number(m[2]):size-1;
           if(!Number.isFinite(start)||!Number.isFinite(end)||start<0||end<0||start>=size){
             res.writeHead(416,{'Content-Range':`bytes */${size}`,'Accept-Ranges':'bytes'});return res.end();
           }
           start=Math.floor(start);end=Math.floor(end);
           if(end<start){res.writeHead(416,{'Content-Range':`bytes */${size}`,'Accept-Ranges':'bytes'});return res.end()}
           end=Math.min(end,size-1);
           res.writeHead(206,{'Content-Type':type,'Content-Length':end-start+1,'Content-Range':`bytes ${start}-${end}/${size}`,'Accept-Ranges':'bytes','Cache-Control':'public, max-age=3600'});
           return fs.createReadStream(fp,{start,end}).pipe(res);
         }
       }
       res.writeHead(200,{'Content-Type':type,'Content-Length':size,'Accept-Ranges':'bytes','Cache-Control':'public, max-age=3600'});return fs.createReadStream(fp).pipe(res);
     }
     const data=fs.readFileSync(fp);const cache=['.html','.js','.css','.json'].includes(ext)?'no-store':'public, max-age=86400';res.writeHead(200,{'Content-Type':type,'Cache-Control':cache,'Content-Length':data.length});return res.end(data)
   }catch{return send(res,404,{error:'Not found'})}
 }
 return send(res,404,{error:'Not found'});
}
const server=http.createServer((req,res)=>handle(req,res).catch(e=>{console.error('SYNTH AUDIO request error:',e);send(res,500,{error:e.message||'Server error'})}));
server.listen(PORT,'0.0.0.0',()=>console.log(`SYNTH AUDIO running on port ${PORT}`));
function shutdown(){try{if(saveTimer){clearTimeout(saveTimer);saveTimer=null}if(saveQueued)saveNow()}finally{for(const res of sseClients){try{res.end()}catch{}}process.exit(0)}}
process.on('SIGINT',shutdown);process.on('SIGTERM',shutdown);
