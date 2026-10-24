const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'server.js');

if (!fs.existsSync(file)) {
  throw new Error('server.js not found');
}

if (!fs.existsSync(path.join(__dirname, 'server-local-backup.js'))) {
  throw new Error('Safety backup server-local-backup.js not found. Stopping.');
}

let s = fs.readFileSync(file, 'utf8');

if (s.includes('SYNTH_B2_INTEGRATION_V1')) {
  console.log('B2 integration is already present. No changes made.');
  process.exit(0);
}

/* 1. Add B2 imports */
const oldImport = "const {URL}=require('url');";

const newImport = `const {URL}=require('url');
const os=require('os');
const {S3Client,ListObjectsV2Command,GetObjectCommand,HeadObjectCommand}=require('@aws-sdk/client-s3');`;

if (!s.includes(oldImport)) {
  throw new Error('Could not find URL import');
}

s = s.replace(oldImport, newImport);

/* 2. Add B2 helpers */
const marker = "const ROOT=__dirname, PUBLIC=path.join(__dirname,'public');";

const b2Helpers = `
// SYNTH_B2_INTEGRATION_V1
function b2Configured(){
  return Boolean(
    process.env.BUCKET &&
    process.env.ENDPOINT &&
    process.env.ACCESS_KEY_ID &&
    process.env.SECRET_ACCESS_KEY
  );
}

let b2Client=null;

function getB2Client(){
  if(!b2Configured())return null;
  if(b2Client)return b2Client;

  b2Client=new S3Client({
    region:String(process.env.REGION||'us-east-005').trim(),
    endpoint:String(process.env.ENDPOINT).trim(),
    credentials:{
      accessKeyId:String(process.env.ACCESS_KEY_ID).trim(),
      secretAccessKey:String(process.env.SECRET_ACCESS_KEY).trim()
    },
    forcePathStyle:true
  });

  return b2Client;
}

function b2Bucket(){
  return String(process.env.BUCKET||'').trim();
}

function b2Title(key){
  return path.posix.basename(String(key||'')).replace(/\\.mp3$/i,'');
}

function b2NormalizeName(value){
  return String(value||'')
    .toLowerCase()
    .replace(/\\.mp3$/i,'')
    .replace(/[^a-z0-9]+/g,'');
}

async function syncB2Songs(){
  if(!b2Configured()){
    console.log('SYNTH AUDIO: B2 not configured; keeping local storage only.');
    return;
  }

  const s3=getB2Client();
  if(!s3)return;

  const existingKeys=new Set(
    db.songs
      .map(x=>String(x.storageKey||''))
      .filter(Boolean)
  );

  const existingNames=new Set(
    db.songs.map(x=>b2NormalizeName(x.title))
  );

  let token=undefined;
  let added=0;
  let checked=0;

  do{
    const result=await s3.send(new ListObjectsV2Command({
      Bucket:b2Bucket(),
      ContinuationToken:token
    }));

    for(const item of (result.Contents||[])){
      const key=String(item.Key||'');
      if(!/\\.mp3$/i.test(key))continue;

      checked++;

      if(existingKeys.has(key))continue;

      const title=b2Title(key);
      const normalized=b2NormalizeName(title);

      // Do not duplicate songs already present in the old local V65 library.
      if(existingNames.has(normalized)){
        continue;
      }

      const size=Number(item.Size)||0;
      const basename=path.posix.basename(key);

      const song={
        id:crypto.randomUUID(),
        title,
        artist:'Unknown Artist',
        album:'Single',
        genre:'Other',
        language:'Unknown',
        duration:0,
        cover:'',
        file:'/uploads/'+basename,
        fileSize:size,
        storage:'bucket',
        storageKey:key,
        createdAt:item.LastModified
          ? new Date(item.LastModified).toISOString()
          : new Date().toISOString(),
        plays:0
      };

      db.songs.unshift(song);
      existingKeys.add(key);
      existingNames.add(normalized);
      added++;
    }

    token=result.IsTruncated ? result.NextContinuationToken : undefined;
  }while(token);

  if(added){
    save();
    broadcast('catalog',{kind:'b2_sync',added});
  }

  console.log(
    'SYNTH AUDIO: B2 sync checked '+checked+
    ' MP3 files and added '+added+
    ' new songs.'
  );
}

async function streamB2Song(req,res,song,type){
  if(!b2Configured() || !song.storageKey)return false;

  const s3=getB2Client();
  if(!s3)return false;

  const bucket=b2Bucket();
  const key=String(song.storageKey);
  const range=String(req.headers.range||'');

  try{
    let totalSize=Number(song.fileSize)||0;

    if(!totalSize){
      const head=await s3.send(
        new HeadObjectCommand({
          Bucket:bucket,
          Key:key
        })
      );

      totalSize=Number(head.ContentLength)||0;

      if(totalSize){
        song.fileSize=totalSize;
        save();
      }
    }

    if(range){
      const m=/bytes=(\\d*)-(\\d*)/.exec(range);

      if(!m){
        return streamB2Song(req,res,song,type);
      }

      let start=m[1]!=='' ? Number(m[1]) : 0;
      let end=m[2]!=='' ? Number(m[2]) : totalSize-1;

      if(
        !Number.isFinite(start) ||
        !Number.isFinite(end) ||
        start<0 ||
        end<start ||
        (totalSize && start>=totalSize)
      ){
        res.writeHead(416,{
          'Content-Range':\`bytes */\${totalSize||'*'}\`,
          'Accept-Ranges':'bytes'
        });
        return true;
      }

      if(totalSize)end=Math.min(end,totalSize-1);

      const obj=await s3.send(
        new GetObjectCommand({
          Bucket:bucket,
          Key:key,
          Range:\`bytes=\${Math.floor(start)}-\${Math.floor(end)}\`
        })
      );

      const length=Number(obj.ContentLength)||(
        Number(end)-Number(start)+1
      );

      res.writeHead(206,{
        'Content-Type':type,
        'Content-Length':length,
        'Content-Range':obj.ContentRange||
          \`bytes \${start}-\${end}/\${totalSize}\`,
        'Accept-Ranges':'bytes',
        'Cache-Control':'public, max-age=3600'
      });

      obj.Body.pipe(res);

      req.on('close',()=>{
        if(!res.writableEnded){
          try{obj.Body.destroy?.()}catch{}
        }
      });

      return true;
    }

    const obj=await s3.send(
      new GetObjectCommand({
        Bucket:bucket,
        Key:key
      })
    );

    const length=Number(obj.ContentLength)||totalSize||0;

    const headers={
      'Content-Type':type,
      'Accept-Ranges':'bytes',
      'Cache-Control':'public, max-age=3600'
    };

    if(length)headers['Content-Length']=length;

    res.writeHead(200,headers);
    obj.Body.pipe(res);

    req.on('close',()=>{
      if(!res.writableEnded){
        try{obj.Body.destroy?.()}catch{}
      }
    });

    return true;

  }catch(e){
    console.error(
      'SYNTH AUDIO B2 stream error:',
      e.message||e
    );

    return false;
  }
}

`;

if (!s.includes(marker)) {
  if (!s.includes(marker.replace("'public'", "'public'"))) {
    const rootIndex = s.indexOf("const ROOT=__dirname, PUBLIC=path.join(ROOT,'public');");

    if (rootIndex < 0) {
      throw new Error('Could not find ROOT/PUBLIC declaration');
    }

    s = s.slice(0, rootIndex) + b2Helpers +
        s.slice(rootIndex);
  }
}

/* 3. Add automatic B2 synchronization after startup artwork hydration */
const hydrationLine =
"setImmediate(()=>{try{hydrateMissingArtwork()}catch{}});";

if (!s.includes("syncB2Songs().catch")) {
  if (!s.includes(hydrationLine)) {
    throw new Error('Could not find startup hydration line');
  }

  s=s.replace(
    hydrationLine,
    hydrationLine+
    "\nsetImmediate(()=>{syncB2Songs().catch(e=>console.error('SYNTH AUDIO B2 sync failed:',e.message||e))});"
  );
}

/* 4. Add B2 streaming before the existing local /uploads handling */
const getMarker =
"let fp=rel.startsWith('/uploads/')?path.resolve(UP,'.'+rel.slice('/uploads'.length)):path.resolve(PUBLIC,'.'+rel);";

const b2Route = `
   if(rel.startsWith('/uploads/')){
     const reqName=path.posix.basename(rel);
     const reqExt=path.extname(reqName).toLowerCase();

     if(reqExt==='.mp3'){
       const song=db.songs.find(x=>
         x.storage==='bucket' &&
         (
           x.file===rel ||
           path.posix.basename(String(x.storageKey||''))===reqName
         )
       );

       if(song && song.storageKey){
         const handled=await streamB2Song(
           req,
           res,
           song,
           mime[reqExt]||'audio/mpeg'
         );

         if(handled)return;
       }
     }
   }

`;

if (!s.includes("SYNTH_B2_ROUTE_V1")) {
  if (!s.includes(getMarker)) {
    throw new Error('Could not find local GET file handler');
  }

  s=s.replace(
    getMarker,
    "/* SYNTH_B2_ROUTE_V1 */\n"+b2Route+getMarker
  );
}

/* 5. Write only after all checks passed */
fs.writeFileSync(file,s,'utf8');

console.log('B2 integration added successfully.');
console.log('Original working server was backed up as server-local-backup.js.');