require('dotenv').config();
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const { spawnSync } = require('child_process');
const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');

const ROOT = __dirname;
const STORAGE = path.resolve(process.env.STORAGE_DIR || path.join(ROOT, 'data'));
const UP = path.join(STORAGE, 'uploads');
const LEGACY_UP = path.join(ROOT, 'public', 'uploads');
const DB = path.join(STORAGE, 'db.json');
const BUCKET = String(process.env.BUCKET || '').trim();
const ENDPOINT = String(process.env.ENDPOINT || '').trim();
const ACCESS_KEY_ID = String(process.env.ACCESS_KEY_ID || '').trim();
const SECRET_ACCESS_KEY = String(process.env.SECRET_ACCESS_KEY || '').trim();
const REGION = process.env.B2_REGION || 'us-east-005';

if (!BUCKET || !ENDPOINT || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
  console.error('ERROR: B2 environment variables are incomplete.');
  process.exit(1);
}
if (!fs.existsSync(DB)) {
  console.error('ERROR: data\\db.json was not found.');
  process.exit(1);
}

const b2 = new S3Client({
  region: REGION,
  endpoint: ENDPOINT,
  forcePathStyle: true,
  credentials: { accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY }
});

const mime = {
  '.mp3':'audio/mpeg','.wav':'audio/wav','.ogg':'audio/ogg','.opus':'audio/ogg',
  '.m4a':'audio/mp4','.aac':'audio/aac','.flac':'audio/flac',
  '.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png',
  '.webp':'image/webp','.gif':'image/gif'
};

function localFile(name) {
  name = path.basename(String(name || ''));
  if (!name) return '';
  const a = path.join(UP, name);
  const b = path.join(LEGACY_UP, name);
  if (fs.existsSync(a) && fs.statSync(a).isFile()) return a;
  if (fs.existsSync(b) && fs.statSync(b).isFile()) return b;
  return '';
}

async function existsB2(key) {
  try {
    await b2.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch (e) {
    const code = Number(e?.$metadata?.httpStatusCode || 0);
    if (code === 404 || e?.name === 'NotFound' || e?.name === 'NoSuchKey') return false;
    throw e;
  }
}

async function upload(filePath, key) {
  await b2.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: fs.createReadStream(filePath),
    ContentLength: fs.statSync(filePath).size,
    ContentType: mime[path.extname(key).toLowerCase()] || 'application/octet-stream'
  }));
}

function readSynchsafe(b, o) {
  return ((b[o]&127)<<21)|((b[o+1]&127)<<14)|((b[o+2]&127)<<7)|(b[o+3]&127);
}
function decodeId3Text(buf) {
  if (!buf?.length) return '';
  const enc = buf[0]; const body = buf.slice(1);
  try {
    if (enc === 0) return body.toString('latin1').replace(/\0.*$/s,'').trim();
    if (enc === 1 || enc === 2) return body.toString('utf16le').replace(/^\uFEFF/,'').replace(/\0.*$/s,'').trim();
    return body.toString('utf8').replace(/\0.*$/s,'').trim();
  } catch { return ''; }
}
function extractEmbeddedCover(buf, ext) {
  if (ext === '.mp3' && buf.slice(0,3).toString() === 'ID3') {
    const ver = buf[3], size = readSynchsafe(buf,6), end = Math.min(buf.length,10+size);
    for (let pos=10; pos+10<=end;) {
      const id = buf.slice(pos,pos+4).toString('ascii');
      if (!/^[A-Z0-9]{4}$/.test(id) || id === '\0\0\0\0') break;
      const n = ver >= 4 ? readSynchsafe(buf,pos+4) : buf.readUInt32BE(pos+4);
      if (n <= 0) { pos += 10; continue; }
      const data = buf.slice(pos+10, Math.min(end,pos+10+n)); pos += 10+n;
      if (id === 'APIC' && data.length > 5) {
        let i=1; const z=data.indexOf(0,i); if(z<0) continue;
        const mt=data.slice(i,z).toString('ascii') || 'image/jpeg'; i=z+1; i+=1;
        const d=data.indexOf(0,i); if(d<0) continue; i=d+1;
        if(i<data.length) return { mime:mt, data:data.slice(i) };
      }
    }
  }
  if (ext === '.flac' && buf.slice(0,4).toString() === 'fLaC') {
    let pos=4;
    while (pos+4<=buf.length) {
      const h=buf[pos], last=!!(h&128), type=h&127, n=buf.readUIntBE(pos+1,3); pos+=4;
      if(pos+n>buf.length) break;
      const d=buf.slice(pos,pos+n); pos+=n;
      if(type===6 && d.length>32){
        let q=0; const read32=()=>{const v=d.readUInt32BE(q);q+=4;return v;};
        read32(); const ml=read32(); q+=ml; const dl=read32(); q+=dl;
        read32();read32();read32();read32(); const dl2=read32();
        if(q+dl2<=d.length) return {mime:d.slice(4,4+ml).toString()||'image/jpeg',data:d.slice(q,q+dl2)};
      }
      if(last) break;
    }
  }
  return null;
}

async function main(){
  const db = JSON.parse(await fsp.readFile(DB,'utf8'));
  db.songs = Array.isArray(db.songs) ? db.songs : [];
  let uploadedAudio=0, alreadyAudio=0, missingAudio=0, uploadedCovers=0, alreadyCovers=0, extractedCovers=0, missingCovers=0;
  console.log(`B2 migration starting for ${db.songs.length} songs...`);
  for (const song of db.songs) {
    const name = path.basename(String(song.file||''));
    if (!name) continue;
    const fp = localFile(name);
    if (!song.b2Key) song.b2Key = name;
    if (fp) {
      if (await existsB2(name)) alreadyAudio++;
      else { await upload(fp,name); uploadedAudio++; console.log(`AUDIO uploaded: ${name}`); }
    } else if (!(await existsB2(name))) {
      missingAudio++;
      console.warn(`AUDIO missing locally and in B2: ${name}`);
      song.b2Key = undefined;
    }

    let coverName = song.b2CoverKey || (String(song.cover||'').startsWith('/uploads/') ? path.basename(song.cover) : '');
    let coverPath = coverName ? localFile(coverName) : '';

    if (!coverPath && fp) {
      try {
        const ext=path.extname(fp).toLowerCase();
        const c=extractEmbeddedCover(fs.readFileSync(fp),ext);
        if(c && c.data?.length){
          const ce = c.mime.includes('png')?'.png':c.mime.includes('webp')?'.webp':c.mime.includes('gif')?'.gif':'.jpg';
          coverName = coverName || `${song.id || path.parse(name).name}-cover${ce}`;
          coverPath = path.join(UP,coverName);
          fs.mkdirSync(UP,{recursive:true});
          fs.writeFileSync(coverPath,c.data);
          song.cover = '/uploads/' + coverName;
          extractedCovers++;
        }
      } catch (e) { console.warn(`COVER extract failed for ${name}: ${e.message}`); }
    }

    if (coverName) {
      song.b2CoverKey = coverName;
      if (await existsB2(coverName)) alreadyCovers++;
      else if (coverPath) { await upload(coverPath,coverName); uploadedCovers++; console.log(`COVER uploaded: ${coverName}`); }
      else { missingCovers++; console.warn(`COVER missing: ${coverName}`); }
    }
  }

  const tmp=DB+'.tmp';
  await fsp.writeFile(tmp,JSON.stringify(db,null,2));
  await fsp.rename(tmp,DB);
  console.log('');
  console.log('B2 migration complete.');
  console.log(`Audio uploaded: ${uploadedAudio}`);
  console.log(`Audio already in B2: ${alreadyAudio}`);
  console.log(`Audio missing: ${missingAudio}`);
  console.log(`Covers extracted: ${extractedCovers}`);
  console.log(`Covers uploaded: ${uploadedCovers}`);
  console.log(`Covers already in B2: ${alreadyCovers}`);
  console.log(`Covers missing: ${missingCovers}`);
}

main().catch(e=>{console.error('MIGRATION ERROR:',e.message);process.exit(1)});
