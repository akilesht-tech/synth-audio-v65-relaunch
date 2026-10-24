
(async () => {
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const ROOT = process.cwd();
const DB = path.join(ROOT, 'data', 'db.json');
const SERVER = path.join(ROOT, 'server.js');
const UP = path.join(ROOT, 'data', 'uploads');
const PUBLIC_UP = path.join(ROOT, 'public', 'uploads');
const ENV = path.join(ROOT, '.env');

function ok(name, value){ console.log(`[OK]   ${name}: ${value}`); }
function bad(name, value){ console.log(`[FAIL] ${name}: ${value}`); }
function warn(name, value){ console.log(`[WARN] ${name}: ${value}`); }

console.log('=== SYNTH AUDIO V65 DIAGNOSTIC ===');
console.log(`Folder: ${ROOT}`);
console.log('');

ok('Node', process.version);
if (fs.existsSync(SERVER)) ok('server.js exists', 'yes');
else bad('server.js exists', 'NO');

if (fs.existsSync(SERVER)) {
  const src = fs.readFileSync(SERVER, 'utf8');
  const checks = {
    'dotenv': /require\(['"]dotenv['"]\)|from ['"]dotenv['"]/.test(src),
    'B2/S3 SDK': /@aws-sdk\/client-s3/.test(src),
    'presigner': /@aws-sdk\/s3-request-presigner/.test(src),
    'b2Key support': /b2Key/.test(src),
    'b2CoverKey support': /b2CoverKey/.test(src),
    'signed URL': /getSignedUrl/.test(src),
    'upload route': /\/api\/admin\/upload/.test(src),
    'stream upload route': /\/api\/admin\/upload-stream/.test(src)
  };
  for (const [name, present] of Object.entries(checks)) {
    present ? ok(`server.js ${name}`, 'present') : warn(`server.js ${name}`, 'not found');
  }
}

console.log('');
fs.existsSync(ENV) ? ok('.env exists', 'yes') : warn('.env exists', 'NO');

for (const mod of ['dotenv','@aws-sdk/client-s3','@aws-sdk/s3-request-presigner']) {
  try { require.resolve(mod); ok(`npm package ${mod}`, 'installed'); }
  catch { bad(`npm package ${mod}`, 'NOT installed'); }
}

let songs = [];
try {
  const db = JSON.parse(fs.readFileSync(DB, 'utf8'));
  songs = Array.isArray(db.songs) ? db.songs : [];
  ok('db.json', `loaded, ${songs.length} songs`);
} catch (e) {
  bad('db.json', e.message);
}

if (songs.length) {
  let withB2=0, withCoverB2=0, localAudio=0, localCover=0, b2Only=0;
  const samples = [];

  for (const s of songs) {
    if (s.b2Key) withB2++;
    if (s.b2CoverKey) withCoverB2++;

    if (s.file) {
      const name = path.basename(String(s.file));
      const localA = fs.existsSync(path.join(UP,name)) || fs.existsSync(path.join(PUBLIC_UP,name));
      if (localA) localAudio++;
      else if (s.b2Key) b2Only++;

      if (!localA && s.b2Key && samples.length < 8) {
        samples.push({
          title: s.title || '',
          file: s.file || '',
          b2Key: s.b2Key || '',
          cover: s.cover || '',
          b2CoverKey: s.b2CoverKey || ''
        });
      }
    }

    if (s.cover) {
      const name = path.basename(String(s.cover));
      if (fs.existsSync(path.join(UP,name)) || fs.existsSync(path.join(PUBLIC_UP,name))) localCover++;
    }
  }

  ok('songs with b2Key', withB2);
  ok('songs with b2CoverKey', withCoverB2);
  ok('songs with local audio file', localAudio);
  ok('songs using B2-only audio', b2Only);
  ok('songs with local cover file', localCover);

  if (samples.length) {
    console.log('');
    console.log('--- SAMPLE B2-ONLY SONGS ---');
    for (const s of samples) console.log(JSON.stringify(s));
  }
}

async function request(url, method='HEAD') {
  return await new Promise(resolve => {
    const u = new URL(url);
    const lib = u.protocol === 'https:' ? https : http;
    const req = lib.request({
      hostname: u.hostname,
      port: u.port || (u.protocol === 'https:' ? 443 : 80),
      path: u.pathname + u.search,
      method,
      timeout: 7000,
      headers: {'User-Agent':'v65-diagnostic'}
    }, res => {
      resolve({
        status: res.statusCode || 0,
        location: res.headers.location || '',
        type: res.headers['content-type'] || '',
        len: res.headers['content-length'] || ''
      });
      res.resume();
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({status:0, error:'timeout'});
    });
    req.on('error', e => resolve({status:0, error:e.message}));
    req.end();
  });
}

console.log('');
const health = await request('http://localhost:3000/api/health');
if (health.status) ok('localhost:3000', `HTTP ${health.status}`);
else warn('localhost:3000', health.error || 'not reachable (start the server first)');

let tested = 0;
for (const s of songs) {
  if (tested >= 5) break;
  if (!s.file) continue;

  const r = await request('http://localhost:3000' + s.file);
  console.log(`TEST ${tested + 1}: ${s.title || '(untitled)'}`);
  console.log(`  file=${s.file}`);
  console.log(`  HTTP=${r.status}${r.location ? ` -> ${r.location.slice(0,160)}${r.location.length>160?'...':''}` : ''}`);
  console.log(`  type=${r.type || '-'} len=${r.len || '-'}`);
  tested++;
}

console.log('');
console.log('=== END DIAGNOSTIC ===');
console.log('Copy everything above and send it back here.');
console.log('Do NOT send your .env contents or passwords.');

})().catch(err => {
  console.error('DIAGNOSTIC CRASH:', err && err.stack ? err.stack : err);
  process.exitCode = 1;
});
