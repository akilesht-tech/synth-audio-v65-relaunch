const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const icon={
 home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
 search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
 library:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 6 4 14M12 6v14M8 8v12M4 4v16"/></svg>',
 heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 8.7c0 5.5-8.8 10.3-8.8 10.3S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z"/></svg>',
 clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/></svg>',
 playlist:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h11M4 10h11M4 14h7M17 7v11a3 3 0 1 1-2-2.8V7l5-1v9"/></svg>',
 download:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v10m0 0 4-4m-4 4-4-4M5 19h14"/></svg>',
 activity:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l2-6 4 12 2-6h6"/></svg>',
 stats:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19V9M12 19V5M19 19v-7"/></svg>',
 settings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V20h-2.6v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.6-1H6v-2.6h.4A1.7 1.7 0 0 0 8 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V5H15v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1V14H21a1.7 1.7 0 0 0-1.6 1Z"/></svg>',
 shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 20 6v5c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V6z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></svg>',
 play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="m8 5 11 7-11 7z"/></svg>',
 pause:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>',
 prev:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2.5v12H6zm3.5 6 8.5 6V6z"/></svg>',
 rewind10:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5V1L7 5.5l5 4.5V7a6.5 6.5 0 1 1-6.5 6.5 6.5 6.5 0 0 1 1.2-3.7"/><text x="12" y="15.8" font-size="7.5" font-weight="800" text-anchor="middle" fill="currentColor" stroke="none" font-family="system-ui,-apple-system,sans-serif">10</text></svg>',
 forward10:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5V1l5 4.5-5 4.5V7a6.5 6.5 0 1 0 6.5 6.5 6.5 6.5 0 0 0-1.2-3.7"/><text x="12" y="15.8" font-size="7.5" font-weight="800" text-anchor="middle" fill="currentColor" stroke="none" font-family="system-ui,-apple-system,sans-serif">10</text></svg>',
 next:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM15.5 6v12H18V6z"/></svg>',
 shuffle:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h3c4 0 6 10 10 10h3M17 5l3 2-3 2M17 15l3 2-3 2M4 17h3c1.2 0 2.2-.7 3-1.7"/></svg>',
 repeat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 7H7a3 3 0 0 0 0 6h1M7 17h10a3 3 0 0 0 0-6h-1M15 5l2 2-2 2M9 15l-2 2 2 2"/></svg>',
 queue:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h11M4 10h11M4 14h8M4 18h7M18 14v6m0 0 3-2m-3 2-3-2"/></svg>',
 more:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>',
 sync:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 0 0-14.9-3M4 13a8 8 0 0 0 14.9 3"/><path d="M5 4v4h4M19 20v-4h-4"/></svg>',
 close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 6 12 12M18 6 6 18"/></svg>',
 back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m14 5-7 7 7 7M7 12h13"/></svg>',
 upload:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4m0 0L8 8m4-4 4 4M5 19h14"/></svg>',
 trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7h14M10 11v5M14 11v5M8 7l1-3h6l1 3m-9 0 1 13h8l1-13"/></svg>',
 volume:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
 volumeLow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>',
 volumeMute:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>',
 chevronDown:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
 device:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2"/><circle cx="12" cy="18" r="1"/></svg>',
 cast:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"/><line x1="2" y1="20" x2="2.01" y2="20"/></svg>',
 share:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
 heartFilled:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.8 8.7c0 5.5-8.8 10.3-8.8 10.3S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z"/></svg>'
};
const svg=n=>icon[n]||'';
const audio=$('#audio');
try{if(audio){audio.preload='auto';audio.setAttribute('playsinline','true');audio.setAttribute('webkit-playsinline','true');audio.setAttribute('controlslist','nodownload noplaybackrate');audio.setAttribute('x-webkit-airplay','allow');audio.setAttribute('disableRemotePlayback','false')}}catch{}
let appVolume=Number(localStorage.getItem('synthVolume')??0.8);
if(isNaN(appVolume)||appVolume<0)appVolume=0.8;
if(appVolume>1)appVolume=1;
let appMuted=localStorage.getItem('synthMuted')==='true';
function applyVolumeToAudio(){
  if(audio){
    audio.volume=appMuted?0:appVolume;
    audio.muted=appMuted;
  }
}
function setAppVolume(val){
  const num=Math.max(0,Math.min(1,Number(val)/100));
  appVolume=num;
  if(appMuted&&num>0)appMuted=false;
  localStorage.setItem('synthVolume',String(appVolume));
  localStorage.setItem('synthMuted',String(appMuted));
  applyVolumeToAudio();
  updateVolumeUI();
}
function toggleMute(){
  appMuted=!appMuted;
  localStorage.setItem('synthMuted',String(appMuted));
  applyVolumeToAudio();
  updateVolumeUI();
}
function getVolumeIcon(){
  if(appMuted||appVolume===0)return svg('volumeMute');
  if(appVolume<0.5)return svg('volumeLow');
  return svg('volume');
}
function updateVolumeUI(){
  const volPct=appMuted?0:Math.round(appVolume*100);
  const volIcon=getVolumeIcon();
  document.querySelectorAll('.volumeSlider').forEach(el=>{el.value=volPct});
  document.querySelectorAll('.volumeBtn').forEach(el=>{el.innerHTML=volIcon});
  document.querySelectorAll('.volumeValue').forEach(el=>{el.textContent=volPct+'%'});
}
try{applyVolumeToAudio()}catch{}
const fallback='data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><rect width="600" height="600" fill="#121217"/><circle cx="300" cy="300" r="205" fill="url(#g)"/><defs><linearGradient id="g"><stop stop-color="#a43cff"/><stop offset=".6" stop-color="#26c7e8"/><stop offset="1" stop-color="#26d59a"/></linearGradient></defs><text x="300" y="340" text-anchor="middle" fill="white" font-size="120" font-family="Arial" font-weight="800">S</text></svg>`);
const EMAIL_RE=/^\S+@\S+\.\S+$/;
const normalizeEmail=v=>{const e=String(v??'').trim().toLowerCase();return EMAIL_RE.test(e)?e:''};
const normalizeServerUrl=v=>{try{const u=new URL(String(v||''));if(!/^https?:$/.test(u.protocol))return '';return u.href.replace(/\/$/,'')}catch{return ''}};
let rawStoredUser=localStorage.getItem('synthUser');
let user=normalizeEmail(rawStoredUser)||String(rawStoredUser||'').trim();
let displayName=String(localStorage.getItem('synthDisplayName:'+user)||'').trim().slice(0,40);
let profileAvatar=String(localStorage.getItem('synthAvatar:'+user)||'').trim();
const shownName=()=>displayName||((user||'listener').split('@')[0]||'Listener');
function renderAvatar(size=34, withBorder=false){
  const borderStyle = withBorder ? 'border:2px solid rgba(56,189,248,0.5);box-shadow:0 0 10px rgba(56,189,248,0.3);' : '';
  if(profileAvatar && (profileAvatar.startsWith('data:') || profileAvatar.startsWith('http') || profileAvatar.startsWith('/'))){
    return `<img class="avatarImg" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;${borderStyle}" src="${esc(profileAvatar)}" alt="${esc(shownName())}">`;
  }
  if(profileAvatar){
    return `<div class="avatarLetter avatarEmoji" style="width:${size}px;height:${size}px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#0284c7,#7c3aed);font-size:${Math.round(size*0.48)}px;${borderStyle}">${esc(profileAvatar)}</div>`;
  }
  const letter = (shownName() || user || 'A')[0].toUpperCase();
  return `<div class="avatarLetter" style="width:${size}px;height:${size}px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#0284c7,#7c3aed);color:#fff;font-size:${Math.round(size*0.44)}px;font-weight:700;${borderStyle}">${esc(letter)}</div>`;
}

function triggerEntryAnimation(){
  if(sessionStorage.getItem('synthAppEntered')) return;
  sessionStorage.setItem('synthAppEntered', '1');
  const splash = document.createElement('div');
  splash.id = 'synthSplash';
  splash.className = 'synthSplash';
  splash.innerHTML = `
    <div class="splashBackdropGlow"></div>
    <div class="splashContent">
      <div class="splashIconBox">
        <img src="/logo.png" class="splashLogo" alt="SYNTH AUDIO" onerror="this.src='/logo.svg'">
        <div class="splashEqualizer">
          <i></i><i></i><i></i><i></i><i></i><i></i><i></i>
        </div>
      </div>
      <div class="splashTitleBlock">
        <span class="splashKicker">PERSONAL AUDIO CLOUD</span>
        <h1 class="splashBrandName">SYNTH AUDIO</h1>
        <div class="splashLoadingBar"><span class="splashLoadingFill"></span></div>
      </div>
    </div>
  `;
  document.body.appendChild(splash);
  const dismiss = () => {
    if(!splash.parentNode) return;
    splash.classList.add('splashOut');
    setTimeout(() => { try { splash.remove(); } catch {} }, 550);
  };
  splash.addEventListener('click', dismiss);
  setTimeout(dismiss, 1350);
}
let songs=[],playlists=[],page='home',current=null,queue=[],qIndex=0,shuffle=false,repeat='all',authToken=localStorage.getItem('synthAuthToken')||'',owner=false,ownerCandidate=false,ownerKey=localStorage.getItem('synthOwnerKey')||'',ownerToken=localStorage.getItem('synthOwnerToken')||'',ownerEmail=localStorage.getItem('synthOwnerEmail')||user||'akilesht@karunya.edu.in';
const makeId=()=>{try{if(window.crypto?.randomUUID)return window.crypto.randomUUID()}catch{}return 'req-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)};
function safeJSON(key,fallback){try{const v=JSON.parse(localStorage.getItem(key));return v??fallback}catch{return fallback}}
let userEvents=[];let favorites=new Set(safeJSON('favorites:'+user,[]));let recent=safeJSON('recent:'+user,[]);let listened=Number(localStorage.getItem('listenedSeconds:'+user)||0);let listenTimer=null;let offlineDownloadCount=0;let offlineIds=new Set();let sleepTimerId=null,sleepTimerEndsAt=0,sleepTimerMode='';
const IS_NATIVE_APP=!!(window.Capacitor?.isNativePlatform?.());
const NATIVE_CONFIG_URL=normalizeServerUrl(window.SYNTH_SERVER_URL||'');
const API_BASE=(IS_NATIVE_APP?(NATIVE_CONFIG_URL||window.location.origin||''):(window.location.origin||'')).replace(/\/$/,'');
const resourceUrl=(u,opts={})=>{
  const raw=String(u||'');
  if(!raw)return '';
  const forNative=!!opts.forNative;
  try{
    const base=forNative?(window.SYNTH_SERVER_URL||API_BASE||window.location.origin):window.location.href;
    const x=new URL(raw,base);
    if(forNative)return x.href;
    const host=x.hostname;
    if(host==='localhost'||host==='127.0.0.1'||/^10\./.test(host)||/^192\.168\./.test(host)||/^172\.(1[6-9]|2\d|3[0-1])\./.test(host))return window.location.origin+x.pathname+x.search;
    return x.href;
  }catch{return raw.startsWith('/')?window.location.origin+raw:raw}
};
const apiCache=new Map();
const apiInflight=new Map();
async function refreshOwnerSession(){
  if(!ownerKey)return false;
  const email=String(ownerEmail||localStorage.getItem('synthOwnerEmail')||user||'akilesht@karunya.edu.in').trim().toLowerCase();
  if(!email)return false;
  try{
    const r=await fetch(API_BASE+'/api/admin/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,key:ownerKey}),cache:'no-store'});
    if(!r.ok)return false;
    const v=await r.json();
    if(!v?.token)return false;
    ownerToken=String(v.token);owner=true;ownerCandidate=true;ownerEmail=String(v.email||email).trim().toLowerCase();
    localStorage.setItem('synthOwnerToken',ownerToken);
    localStorage.setItem('synthOwnerEmail',ownerEmail);
    return true;
  }catch{return false}
}
function handleAuthExpiry(target,method){
  if(method==='GET'&&target.includes('/api/auth/me'))return;
  if(target.includes('/api/admin/')){
    owner=false;ownerToken='';localStorage.removeItem('synthOwnerToken');
    return;
  }
  if(authToken){authToken='';localStorage.removeItem('synthAuthToken');user='';localStorage.removeItem('synthUser');owner=false;ownerCandidate=false;ownerKey='';ownerToken='';localStorage.removeItem('synthOwnerKey');localStorage.removeItem('synthOwnerToken');localStorage.removeItem('synthOwnerEmail');
    try{renderLogin()}catch{}
  }
}
const api=async(u,o={})=>{
  const target=/^https?:\/\//i.test(u)?u:(API_BASE+u);
  const method=String(o.method||'GET').toUpperCase();
  const cacheKey=method==='GET'?target:'';
  if(method==='GET' && apiInflight.has(cacheKey) && o.__ownerRetry!==true) return apiInflight.get(cacheKey);
  const run=(async()=>{
    const headers=new Headers(o.headers||{});
    if(target.includes('/api/admin/') && ownerToken)headers.set('Authorization','Bearer '+ownerToken);
    if(authToken && !headers.has('Authorization'))headers.set('Authorization','Bearer '+authToken);
    if(target.includes('/api/admin/') && ownerToken)headers.set('Authorization','Bearer '+ownerToken);
    if(target.includes('/api/admin/') && ownerKey && !headers.has('x-admin-key'))headers.set('x-admin-key',ownerKey);
    const r=await fetch(target,{...o,headers,cache:o.cache||'no-store'});
    if(!r.ok){
      let message='Request failed';
      try{const j=await r.json();message=j.error||message}catch{}
      if(r.status===401 && target.includes('/api/admin/') && o.__ownerRetry!==true && ownerKey){
        if(await refreshOwnerSession()){
          const retryOpts={...o,__ownerRetry:true};
          return api(u,retryOpts);
        }
      }
      if(r.status===401)handleAuthExpiry(target,method);
      const err=new Error(message);
      err.status=r.status;
      throw err;
    }
    if(r.status===204)return null;
    const ct=r.headers.get('content-type')||'';
    if(ct.includes('application/json'))return r.json();
    return r.text();
  })();
  if(cacheKey)apiInflight.set(cacheKey,run);
  try{return await run}finally{if(cacheKey)apiInflight.delete(cacheKey)}
};
const formatBytes=b=>{b=Number(b)||0;if(b<1024)return `${b} B`;if(b<1024**2)return `${(b/1024).toFixed(1)} KB`;if(b<1024**3)return `${(b/1024**2).toFixed(1)} MB`;return `${(b/1024**3).toFixed(2)} GB`};

function getSongFallback(s){
  if(!s) return fallback;
  const str = String(s.id || '') + String(s.title || '') + String(s.artist || '');
  let hash = 0;
  for(let i=0; i<str.length; i++){
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  const hue1 = Math.abs(hash % 40) + 240;
  const hue2 = (hue1 + 45) % 360;
  const initial = (String(s.title || 'S').trim().charAt(0) || 'S').toUpperCase();
  const subInitial = (String(s.artist || '').trim().charAt(0) || '').toUpperCase();
  const initials = subInitial ? (initial + subInitial) : initial;
  const svgXml = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">' +
    '<defs>' +
      '<linearGradient id="bg_' + Math.abs(hash) + '" x1="0%" y1="0%" x2="100%" y2="100%">' +
        '<stop offset="0%" stop-color="#0a0b14"/>' +
        '<stop offset="50%" stop-color="#121426"/>' +
        '<stop offset="100%" stop-color="#181432"/>' +
      '</linearGradient>' +
      '<radialGradient id="gl_' + Math.abs(hash) + '" cx="50%" cy="50%" r="50%">' +
        '<stop offset="0%" stop-color="hsl(' + hue1 + ', 95%, 65%)" stop-opacity="0.85"/>' +
        '<stop offset="55%" stop-color="hsl(' + hue2 + ', 85%, 52%)" stop-opacity="0.35"/>' +
        '<stop offset="100%" stop-color="#0a0b14" stop-opacity="0"/>' +
      '</radialGradient>' +
      '<linearGradient id="st_' + Math.abs(hash) + '" x1="0%" y1="0%" x2="100%" y2="0%">' +
        '<stop offset="0%" stop-color="hsl(' + hue1 + ', 100%, 75%)"/>' +
        '<stop offset="100%" stop-color="hsl(' + hue2 + ', 100%, 70%)"/>' +
      '</linearGradient>' +
    '</defs>' +
    '<rect width="600" height="600" rx="36" fill="url(#bg_' + Math.abs(hash) + ')"/>' +
    '<circle cx="300" cy="300" r="230" fill="url(#gl_' + Math.abs(hash) + ')"/>' +
    '<circle cx="300" cy="300" r="195" fill="none" stroke="url(#st_' + Math.abs(hash) + ')" stroke-width="2.5" stroke-dasharray="8 6" opacity="0.6"/>' +
    '<circle cx="300" cy="300" r="140" fill="#0d0e1c" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>' +
    '<g transform="translate(300, 300)">' +
      '<text x="0" y="24" text-anchor="middle" fill="#ffffff" font-size="78" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-weight="800" letter-spacing="-1">' + initials + '</text>' +
    '</g>' +
    '<path d="M 230 460 Q 300 440 370 460" fill="none" stroke="hsl(' + hue1 + ', 90%, 70%)" stroke-width="3" stroke-linecap="round" opacity="0.7"/>' +
  '</svg>';
  return 'data:image/svg+xml,' + encodeURIComponent(svgXml);
}

function cover(s){
  if(!s)return fallback;
  const v = s.updatedAt ? '?v=' + encodeURIComponent(s.updatedAt) : (s.createdAt ? '?v=' + encodeURIComponent(s.createdAt) : '');
  if(s.cover && !s.cover.startsWith('data:image/svg+xml') && !s.cover.startsWith('data:image/')){
    return s.cover + (s.cover.includes('?') ? '&' : v);
  }
  if(s.cover && s.cover.startsWith('data:image/')) return s.cover;
  if(s.b2CoverKey)return '/uploads/'+encodeURIComponent(s.b2CoverKey)+v;
  if(s.id)return '/api/songs/'+encodeURIComponent(s.id)+'/cover'+v;
  return s.cover||fallback;
}
const fmt=x=>{x=Math.max(0,Math.floor(Number(x)||0));return `${Math.floor(x/60)}:${String(x%60).padStart(2,'0')}`},mins=s=>`${Math.floor(s/60)} min`;
let stateSaveTimer=null;
function saveUserState(){localStorage.setItem('favorites:'+user,JSON.stringify([...favorites]));localStorage.setItem('recent:'+user,JSON.stringify(recent));localStorage.setItem('listenedSeconds:'+user,String(listened));if(user){localStorage.setItem('synthThemePreference:'+user,themePreference);localStorage.setItem('synthAccentColor:'+user,accentColor);localStorage.setItem('synthAuroraGlow:'+user,String(auroraGlow));}clearTimeout(stateSaveTimer);stateSaveTimer=setTimeout(()=>{api('/api/user/state',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({favorites:[...favorites],recent,displayName,avatar:profileAvatar,themePreference,accentColor,auroraGlow,dynamicMiniColors})}).catch(()=>{})},250)}
async function loadRemoteUserState(){try{const st=await api('/api/user/state');if(Array.isArray(st.favorites))favorites=new Set(st.favorites);if(Array.isArray(st.recent))recent=st.recent;if(st.displayName!==undefined){displayName=String(st.displayName||'').trim().slice(0,40);localStorage.setItem('synthDisplayName:'+user,displayName)}if(st.avatar!==undefined){profileAvatar=String(st.avatar||'').trim();localStorage.setItem('synthAvatar:'+user,profileAvatar)}if(st.themePreference!==undefined){themePreference=String(st.themePreference||'aubergine');localStorage.setItem('synthThemePreference',themePreference);if(user)localStorage.setItem('synthThemePreference:'+user,themePreference);}if(st.accentColor!==undefined){accentColor=String(st.accentColor||'plum');localStorage.setItem('synthAccentColor',accentColor);if(user)localStorage.setItem('synthAccentColor:'+user,accentColor);}if(st.auroraGlow!==undefined){auroraGlow=st.auroraGlow!==false;localStorage.setItem('synthAuroraGlow',String(auroraGlow));if(user)localStorage.setItem('synthAuroraGlow:'+user,String(auroraGlow));}if(st.dynamicMiniColors!==undefined){dynamicMiniColors=st.dynamicMiniColors!==false;localStorage.setItem('synthDynamicMiniColors',String(dynamicMiniColors));}applyTheme()}catch{}}
async function migrateLegacyDownloads(){for(const s of songs){const raw=localStorage.getItem('download:'+s.id);if(!raw||!raw.startsWith('data:'))continue;try{const r=await fetch(raw);const b=await r.blob();await putOffline(s.id,b,{song:s,downloadedAt:Date.now()});localStorage.removeItem('download:'+s.id)}catch{}}}

const PLAYBACK_STORAGE_KEY = 'synthPlaybackState';
let playbackSaveTimer = null;
function savePlaybackState(){
  if(!current) return;
  try{
    const state = {
      songId: current.id,
      currentTime: playbackTime(),
      duration: playbackDuration() || current.duration || 0,
      queue: (queue||[]).map(s => s.id),
      qIndex: qIndex,
      shuffle: !!shuffle,
      repeat: repeat || 'all',
      volume: appVolume,
      muted: !!appMuted,
      wasPlaying: !playbackPaused(),
      timestamp: Date.now()
    };
    localStorage.setItem(PLAYBACK_STORAGE_KEY, JSON.stringify(state));
  }catch(e){}
}
function queueSavePlaybackState(){
  clearTimeout(playbackSaveTimer);
  playbackSaveTimer = setTimeout(savePlaybackState, 400);
}
function restorePlaybackState(){
  try{
    const raw = localStorage.getItem(PLAYBACK_STORAGE_KEY);
    if(!raw) return;
    const state = JSON.parse(raw);
    if(!state || !state.songId) return;
    if(state.shuffle !== undefined) shuffle = !!state.shuffle;
    if(state.repeat) repeat = state.repeat;
    if(Array.isArray(state.queue) && state.queue.length && songs.length){
      const restoredQueue = state.queue.map(id => songs.find(s => s.id === id)).filter(Boolean);
      if(restoredQueue.length){
        queue = restoredQueue;
        qIndex = Math.max(0, Math.min(queue.length - 1, Number(state.qIndex) || 0));
      }
    }
    const targetSong = (queue.length && queue[qIndex]?.id === state.songId)
      ? queue[qIndex]
      : songs.find(s => s.id === state.songId);
    if(targetSong){
      current = targetSong;
      if(!queue.length){
        queue = songs.slice();
        const idx = queue.findIndex(s => s.id === current.id);
        qIndex = idx >= 0 ? idx : 0;
      }
      const isDownloaded = offlineIds.has(current.id);
      const offlineSrc = offlineUrls.get(current.id) || '';
      const targetSrc = isDownloaded && offlineSrc ? offlineSrc : resourceUrl(current.file);
      if(!nativeMode() && audio){
        audio.preload = 'auto';
        if(audio.src !== targetSrc){
          audio.src = targetSrc;
        }
        const savedTime = Number(state.currentTime) || 0;
        if(savedTime > 0){
          try{ audio.currentTime = savedTime; }catch{}
        }
      }
      updateMediaSession(current);
      updateMediaPlaybackState();
      updateMediaPosition();
      renderPlayer();
      updateFullPlayer(current);
    }
  }catch(e){console.warn('Playback restore note:', e)}
}

async function init(){
  triggerEntryAnimation();
  ownerEmail=normalizeEmail(localStorage.getItem('synthOwnerEmail'));
  if(!user||!authToken){owner=false;ownerCandidate=false;renderLogin();return}
  displayName=String(localStorage.getItem('synthDisplayName:'+user)||'').trim().slice(0,40);
  profileAvatar=String(localStorage.getItem('synthAvatar:'+user)||'').trim();
  ownerCandidate=!!ownerEmail&&user===ownerEmail;
  if(ownerCandidate){owner=true;if(!ownerToken)ownerToken=authToken;}
  favorites=new Set(safeJSON('favorites:'+user,[]));
  recent=safeJSON('recent:'+user,[]);
  listened=Number(localStorage.getItem('listenedSeconds:'+user)||0);
  const cachedCatalog = safeJSON('synthCachedSongs', []);
  if(cachedCatalog.length && !songs.length) songs = sortSongsAlphabetical(cachedCatalog);
  const userPlaylists = safeJSON('playlists:'+user, []);
  const cachedPlaylists = safeJSON('synthCachedPlaylists', []);
  const initialPlaylists = userPlaylists.length ? userPlaylists : cachedPlaylists;
  if(initialPlaylists.length && !playlists.length) playlists = initialPlaylists;
  render();
  bindMediaSession();restorePlaybackState();
  if(typeof requestIdleCallback === 'function'){
    requestIdleCallback(() => { mergeOfflineCatalog().then(() => { if(offlineIds.size > 0) render(); }).catch(()=>{}); });
  } else {
    setTimeout(() => { mergeOfflineCatalog().then(() => { if(offlineIds.size > 0) render(); }).catch(()=>{}); }, 50);
  }
  (async () => {
    try{
      const [configRes, authRes] = await Promise.allSettled([
        api('/api/config'),
        api('/api/auth/me')
      ]);

      if(configRes.status === 'fulfilled' && configRes.value){
        const newOwner = normalizeEmail(configRes.value.ownerEmail);
        if(newOwner){
          ownerEmail = newOwner;
          localStorage.setItem('synthOwnerEmail', ownerEmail);
          ownerCandidate = !!ownerEmail && user === ownerEmail;
          if(ownerCandidate && !ownerToken) ownerToken = authToken;
        }
      }

      if(authRes.status === 'fulfilled'){
        const me = authRes.value;
        const remoteEmail = normalizeEmail(me?.email);
        if(me && (!me.authenticated || !remoteEmail)){
          const inv = new Error('Session invalid'); inv.status = 401; throw inv;
        }
        if(remoteEmail && remoteEmail !== user){
          user = remoteEmail;
          localStorage.setItem('synthUser', user);
        }
        displayName = String(localStorage.getItem('synthDisplayName:' + user) || '').trim().slice(0, 40);
        profileAvatar = String(localStorage.getItem('synthAvatar:' + user) || '').trim();
      } else if(authRes.status === 'rejected'){
        const err = authRes.reason;
        if(err?.status === 401 || err?.message === 'Session invalid'){
          localStorage.removeItem('synthUser'); localStorage.removeItem('synthAuthToken');
          user = ''; authToken = ''; owner = false; ownerCandidate = false; ownerToken = '';
          renderLogin(); return;
        }
      }
    }catch(err){
      if(err?.status === 401 || err?.message === 'Session invalid'){
        localStorage.removeItem('synthUser'); localStorage.removeItem('synthAuthToken');
        user = ''; authToken = ''; owner = false; ownerCandidate = false; ownerToken = '';
        renderLogin(); return;
      }
    }

    try{
      await Promise.all([
        loadRemoteUserState().catch(()=>{}),
        refreshData({silent:true}).catch(()=>{})
      ]);
    }catch{
      // graceful offline operation - local state already rendered
    }
    if(location.hash==='#owner')ownerGate();
  })();
}
let lastCatalogSignature='';
let downloadMigrationStarted=false;
function savePlaylistsState(){
  try{
    if(user) localStorage.setItem('playlists:'+user, JSON.stringify(playlists));
    localStorage.setItem('synthCachedPlaylists', JSON.stringify(playlists));
  }catch(e){console.error('Failed to save playlists locally', e)}
}
function mergePlaylists(localList, remoteList){
  const local = Array.isArray(localList) ? localList : [];
  const remote = Array.isArray(remoteList) ? remoteList : [];
  if(!remote.length) return local;
  if(!local.length) return remote;
  const map = new Map();
  for(const r of remote){
    if(r && r.id) map.set(r.id, r);
  }
  for(const l of local){
    if(!l || !l.id) continue;
    if(!map.has(l.id)){
      const matchByName = remote.find(r => String(r.name||'').trim().toLowerCase() === String(l.name||'').trim().toLowerCase());
      if(!matchByName){
        map.set(l.id, l);
      }
    }
  }
  return Array.from(map.values());
}
function sortSongsAlphabetical(list){
  return (list||[]).slice().sort((a,b)=>{
    const tA=String(a?.title||'').trim();
    const tB=String(b?.title||'').trim();
    return tA.localeCompare(tB,undefined,{numeric:true,sensitivity:'base'});
  });
}
function catalogSignature(list){return JSON.stringify((list||[]).map(s=>[s.id,s.title,s.artist,s.album,s.genre,s.language,s.cover,s.file,s.plays,s.updatedAt]).sort((a,b)=>String(a[0]).localeCompare(String(b[0]))))}
async function refreshData({silent=false}={}){
  const email=encodeURIComponent(user);
  const [nextSongs,nextPlaylists,stats]=await Promise.all([
    api('/api/songs'),
    api('/api/playlists?userEmail='+email).catch(()=>null),
    api('/api/user/stats?userEmail='+email).catch(()=>null)
  ]);
  const incomingSongs = Array.isArray(nextSongs) ? nextSongs : [];
  const localMap = new Map();
  for (const s of songs) { if (s && s.id) localMap.set(s.id, s); }
  const mergedSongList = incomingSongs.map(inc => {
    if (!inc || !inc.id) return inc;
    const loc = localMap.get(inc.id);
    if (!loc) return inc;
    const locTime = new Date(loc.updatedAt || 0).getTime();
    const incTime = new Date(inc.updatedAt || 0).getTime();
    if (locTime > incTime) {
      return { ...inc, ...loc };
    }
    return inc;
  });
  const normalizedSongs=sortSongsAlphabetical(mergedSongList);
  const remotePlaylists=Array.isArray(nextPlaylists)?nextPlaylists:[];
  const mergedPlaylists=mergePlaylists(playlists, remotePlaylists);
  const changed=catalogSignature(normalizedSongs)!==lastCatalogSignature || JSON.stringify(mergedPlaylists)!==JSON.stringify(playlists);
  for(const id of offlineIds){
    if(!normalizedSongs.some(s=>s.id===id)){
      const existing=songs.find(s=>s.id===id);
      if(existing)normalizedSongs.push(existing);
    }
  }
  songs=normalizedSongs;
  playlists=mergedPlaylists;
  try{localStorage.setItem('synthCachedSongs',JSON.stringify(songs))}catch{}
  savePlaylistsState();
  lastCatalogSignature=catalogSignature(songs);
  if(stats){listened=Number(stats.listeningSeconds||listened);userEvents=Array.isArray(stats.events)?stats.events:[];localStorage.setItem('listenedSeconds:'+user,String(listened))}
  if(!silent||changed)render();
  if(!current)restorePlaybackState();
  // Run legacy migration once, after the first useful paint.
  if(!downloadMigrationStarted){downloadMigrationStarted=true;const run=()=>migrateLegacyDownloads().catch(()=>{});if(window.requestIdleCallback) window.requestIdleCallback(run,{timeout:2500}); else setTimeout(run,1200);}
  return {songs,playlists,changed};
}

function nav(p,ic,label){return `<button class="nav ${page===p?'active':''}" data-nav="${p}" onclick="go('${p}')"><span class="ico">${svg(ic)}</span><span>${label}</span></button>`}
function filterGenreAndGo(g){
  go('library');
  setTimeout(()=>{
    const select = $('#genreFilter');
    if(select){
      select.value = g;
      filterLibrary();
    }
  }, 100);
}

function shell(){
  const canSeeAdmin=owner||ownerCandidate;
  const isOff=!navigator.onLine;
  return `<aside class="side">
    <div class="brand" onclick="go('home')" role="button" tabindex="0">
      <img class="brandLogoImg" src="/logo.png" alt="SYNTH AUDIO" onerror="this.src='/logo.svg'">
      <div class="brandText">
        <b>SYNTH AUDIO</b>
        <span class="brandSubtitle">Personal Cloud</span>
      </div>
    </div>
    <div class="group">DISCOVER</div>
    ${nav('home','home','Home')}
    ${nav('search','search','Search')}
    <div class="group">YOUR LIBRARY</div>
    ${nav('library','library','Library')}
    ${nav('favorites','heart','Favorites')}
    ${nav('recent','clock','Recently Played')}
    ${nav('playlists','playlist','Playlists')}
    ${nav('downloads','download','Downloads & Offline')}
    ${nav('activityStats','activity','Activity')}
    <div class="group">GENERAL</div>
    ${nav('settings','settings','Settings')}
    ${canSeeAdmin?nav('admin','shield','Admin'):''}
    <div class="profile sideProfile" onclick="go('settings')" role="button" tabindex="0" title="Manage profile & settings">
      <div class="avatar">${renderAvatar(36, true)}</div>
      <div class="profileText">
        <b>${esc(shownName())}</b>
        <small><i class="statusDot ${isOff?'offline':'online'}"></i> ${isOff?'Offline':'Online'}</small>
      </div>
    </div>
  </aside>
  <main id="main" class="main">
    <div class="topBar">
      <div class="mobileBrand" onclick="go('home')" role="button" tabindex="0">
        <img src="/logo.png" class="mobileBrandLogo" alt="SYNTH AUDIO" onerror="this.src='/logo.svg'">
        <span class="mobileBrandText">SYNTH</span>
      </div>
      <button class="headerSearch" onclick="go('search');setTimeout(()=>$('#search')?.focus(),60)">
        ${svg('search')}<span>Search songs, artists, albums...</span><kbd>Ctrl /</kbd>
      </button>
      <div class="topBarRight">
        <div class="offlineIndicatorPill ${isOff?'':'hidden'}" id="offlinePill" onclick="go('downloads')" title="Offline mode active">
          <span class="offlineDot"></span><span>Offline</span>
        </div>
        ${canSeeAdmin?`<button class="topAdmin ${owner?'unlocked':''}" onclick="go('admin')" title="Open owner administration">${svg('shield')}<span>${owner?'Admin':'Owner'}</span></button>`:''}
        <button class="topProfileBtn" onclick="go('settings')" title="Your Profile & Settings" aria-label="Profile">
          ${renderAvatar(32, true)}
          <span class="topProfileName">${esc(shownName())}</span>
        </button>
      </div>
    </div>
    <div class="mobileBrowseTabs" aria-label="Browse music">
      <button class="active" data-browse="songs" onclick="mobileBrowse('songs')">Songs</button>
      <button data-browse="playlists" onclick="mobileBrowse('playlists')">Playlists</button>
      <button data-browse="folders" onclick="mobileBrowse('folders')">Offline</button>
      <button data-browse="artists" onclick="mobileBrowse('artists')">Artists</button>
      <button data-browse="albums" onclick="mobileBrowse('albums')">Albums</button>
      <button data-browse="genres" onclick="mobileBrowse('genres')">Genres</button>
    </div>
    <div id="pageContent"></div>
  </main>
  <div id="player"></div>
  <nav class="mobileNav" aria-label="Mobile navigation">
    ${[['home','home','Home'],['search','search','Search'],['library','library','Library'],['downloads','download','Offline'],['playlists','playlist','Playlists']].map(x=>`<button class="mnav ${page===x[0]?'active':''}" data-nav="${x[0]}" onclick="go('${x[0]}')"><span>${svg(x[1])}</span>${x[2]}</button>`).join('')}
    <button class="mnav mnavMore ${['favorites','recent','activityStats','settings','admin'].includes(page)?'active':''}" onclick="toggleMobileMore()" aria-haspopup="menu" aria-expanded="false">
      <span>${svg('more')}</span>More
    </button>
  </nav>
  <div id="mobileMoreMenu" class="mobileMoreMenu" hidden>
    <div class="mobileMoreProfileCard" onclick="go('settings')">
      ${renderAvatar(44, true)}
      <div class="mobileMoreProfileInfo">
        <b>${esc(shownName())}</b>
        <small>${esc(user||'Offline listener')} · ${isOff?'Offline mode':'Online'}</small>
      </div>
      <span class="mobileMoreProfileChevron">›</span>
    </div>
    <div class="mobileMoreDivider"></div>
    <button onclick="go('favorites')">${svg('heart')}<span>Favorites</span></button>
    <button onclick="go('recent')">${svg('clock')}<span>Recently Played</span></button>
    <button onclick="go('downloads')">${svg('download')}<span>Downloads & Offline</span></button>
    <button onclick="go('activityStats')">${svg('activity')}<span>Activity &amp; Stats</span></button>
    <button onclick="go('settings')">${svg('settings')}<span>Settings &amp; Profile</span></button>
    ${canSeeAdmin?`<button onclick="go('admin')">${svg('shield')}<span>Admin Portal</span></button>`:''}
  </div>`;
}

let libraryViewMode = localStorage.getItem('synthLibraryViewMode') || 'grid';
function setLibraryView(mode){
  libraryViewMode = mode === 'list' ? 'list' : 'grid';
  try{ localStorage.setItem('synthLibraryViewMode', libraryViewMode); }catch{}
  if(page === 'library') filterLibrary();
  else if(page === 'favorites' || page === 'recent') render();
}
function card(s,extra=''){
  if(!s) return '';
  const safeExtra=String(extra||'').trim().startsWith('<button')?String(extra).trim():'';
  const isFav = favorites.has(s.id);
  const isDl = offlineIds.has(s.id);
  const isCurrent = (current && current.id === s.id);
  return `<article class="card ${isFav?'isFav':''} ${isCurrent?'current':''}" data-play-direct="${esc(s.id)}" data-play-song="${esc(s.id)}" tabindex="0" role="button" aria-label="Play ${esc(s.title)}"><div class="coverWrap"><img src="${esc(cover(s))}" class="cover" loading="lazy" alt="${esc(s.title)}" onerror="this.onerror=null;this.src=getSongFallback(songs.find(x=>x.id==='${esc(s.id)}'))"><div class="cardGradientOverlay"></div>${safeExtra}<button class="cardfav ${isFav?'fav':''}" type="button" aria-label="Favorite" title="${isFav?'Remove from Favorites':'Add to Favorites'}" onclick="event.stopPropagation();toggleFav('${esc(s.id)}')">${isFav?svg('heartFilled'):svg('heart')}</button><button class="cardplay" type="button" aria-label="Play" title="Play ${esc(s.title)}" onclick="event.stopPropagation();playSong('${esc(s.id)}')">${svg('play')}</button><button class="dots" type="button" aria-label="More options" title="More options" onclick="event.stopPropagation();more('${esc(s.id)}')">${svg('more')}</button>${isDl?`<div class="cardDlBadge" title="Available Offline">${svg('download')}</div>`:''}</div><div class="cardInfo"><div class="title" title="${esc(s.title)}">${esc(s.title)}</div><div class="meta" title="${esc(s.artist||'Unknown Artist')}">${esc(s.artist||'Unknown Artist')}${s.language?' · '+esc(s.language):''}</div></div></article>`;
}
function row(s,extra='',collectionIds=null){
  const ids=Array.isArray(collectionIds)?collectionIds:null;
  const playAttr=ids?`data-play-collection='${esc(JSON.stringify(ids))}'`:`data-play-direct='${esc(s.id)}'`;
  const rawExtra=String(extra||'').trim();
  const removeButton=rawExtra.startsWith('<button')?rawExtra:'';
  const isCurrent=(current && current.id===s.id);
  return `<div class="songrow ${isCurrent?'current isPlaying':''}" ${playAttr} data-play-song="${esc(s.id)}" data-song-id="${esc(s.id)}" role="button" tabindex="0" aria-label="Play ${esc(s.title)}"><img class="thumb" loading="lazy" src="${esc(cover(s))}" onerror="this.onerror=null;this.src=getSongFallback(songs.find(x=>x.id==='${esc(s.id)}'))"><div class="grow"><div class="title">${esc(s.title)}</div><div class="meta">${esc(s.artist||'Unknown Artist')} · ${esc(s.album||'Single')}${s.language?' · '+esc(s.language):''}</div></div><div class="rowActions" data-song-actions="true"><button class="rowbtn ${favorites.has(s.id)?'fav':''}" type="button" onclick="event.stopPropagation();toggleFav('${esc(s.id)}')" title="Favorite" aria-label="Favorite">${favorites.has(s.id)?'♥':'♡'}</button>${removeButton}<button class="rowbtn downloadBtn" type="button" onclick="event.stopPropagation();toggleDownload('${esc(s.id)}')" title="Download or remove" aria-label="Download or remove">${svg('download')}</button><button class="rowbtn moreBtn" type="button" onclick="event.stopPropagation();more('${esc(s.id)}')">${svg('more')}</button></div></div>`;
}

function renderLogin(){document.body.classList.add('loginMode');$('#app').innerHTML=`<div class="login"><div class="loginbox"><div class="welcomeMark"><div class="welcomeBars"><i></i><i></i><i></i><i></i><i></i></div><span>SYNTH AUDIO</span></div><div class="loginGlow"></div><p class="eyebrow">YOUR MUSIC. EVERYWHERE.</p><h1>Welcome to SYNTH AUDIO</h1><p class="sub">Your personal MP3 library hosted on your own server, available across your devices.</p><div class="authTabs"><button id="loginTab" class="active" onclick="authMode('login')">Sign in</button><button id="registerTab" onclick="authMode('register')">Create account</button></div><input id="displayNameAuth" class="field" type="text" maxlength="40" autocomplete="nickname" placeholder="Your name (optional)" hidden><input id="email" class="field" type="email" autocomplete="username" placeholder="User ID / email"><input id="password" class="field" type="password" autocomplete="current-password" placeholder="Password (6+ characters)" onkeydown="if(event.key==='Enter')submitAuth()"><button id="authBtn" class="primary wide authBtn" onclick="submitAuth()">Sign in</button><p id="authMsg" class="loginHint"></p><p class="loginHint">Playlists, favorites and listening time follow your account.</p></div></div>`} 
let authIsRegister=false;
function authMode(mode){authIsRegister=mode==='register';$('#loginTab')?.classList.toggle('active',!authIsRegister);$('#registerTab')?.classList.toggle('active',authIsRegister);$('#authBtn').textContent=authIsRegister?'Create account':'Sign in';$('#password').setAttribute('autocomplete',authIsRegister?'new-password':'current-password');const n=$('#displayNameAuth');if(n)n.hidden=!authIsRegister;}
async function submitAuth(){const e=normalizeEmail($('#email')?.value),pw=$('#password')?.value||'',msg=$('#authMsg'),btn=$('#authBtn');if(!e)return msg.textContent='Enter a valid email/user ID.';if(pw.length<6)return msg.textContent='Password must be at least 6 characters.';btn.disabled=true;msg.textContent=authIsRegister?'Creating your account…':'Signing you in…';try{const r=await api(authIsRegister?'/api/auth/register':'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:e,password:pw})});const returnedEmail=normalizeEmail(r?.email);const returnedToken=String(r?.token||'');if(!returnedEmail||!returnedToken)throw Error('The server returned an invalid login response.');user=returnedEmail;authToken=returnedToken;localStorage.setItem('synthUser',user);localStorage.setItem('synthAuthToken',authToken);displayName=authIsRegister?String($('#displayNameAuth')?.value||'').trim().replace(/\s+/g,' ').slice(0,40):String(localStorage.getItem('synthDisplayName:'+user)||'').trim().slice(0,40);localStorage.setItem('synthDisplayName:'+user,displayName);profileAvatar=String(localStorage.getItem('synthAvatar:'+user)||'').trim();favorites=new Set(safeJSON('favorites:'+user,[]));recent=safeJSON('recent:'+user,[]);listened=Number(localStorage.getItem('listenedSeconds:'+user)||0);try{const c=await api('/api/config');ownerEmail=String(c.ownerEmail||'').trim().toLowerCase()}catch{}if(r?.owner===true||(ownerEmail&&user===ownerEmail)){owner=true;ownerCandidate=true;ownerToken=returnedToken;ownerEmail=returnedEmail;localStorage.setItem('synthOwnerToken',ownerToken);localStorage.setItem('synthOwnerEmail',ownerEmail)}else{ownerCandidate=!!ownerEmail&&user===ownerEmail;}await loadRemoteUserState();if(authIsRegister&&(displayName||profileAvatar)){try{await api('/api/user/state',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({favorites:[...favorites],recent,displayName,avatar:profileAvatar})})}catch{}}await refreshData();render();toast(authIsRegister?'Account created':'Welcome back')}catch(err){msg.textContent=err.message||'Could not sign in'}finally{btn.disabled=false}}
let shellReady=false;
function render(){
  document.body.classList.remove('loginMode');
  if(!user){renderLogin();shellReady=false;return}
  ownerCandidate=!!ownerEmail&&user.trim().toLowerCase()===ownerEmail;
  if(!shellReady || !$('#pageContent')){$('#app').innerHTML=shell();shellReady=true;document.body.classList.add('appEntering');setTimeout(()=>document.body.classList.remove('appEntering'),650);}
  bindMiniPlayerEvents();
  if(page.startsWith('group:')){
    const kind=page.slice(6); renderGroupedCollection(kind==='artists'?'Artists':kind==='albums'?'Albums':'Genres',kind==='artists'?'artist':kind==='albums'?'album':'genre');
  }else{
    renderPage();renderPlayer();updateNavActiveState();
    const browseKey=page==='playlists'?'playlists':page==='downloads'?'folders':'songs';
    setMobileBrowseActive(browseKey);
    requestAnimationFrame(()=>{
      const content=$('#pageContent');
      if(content){
        content.classList.remove('routeSwap');
        content.classList.add('routeSwap');
      }
    });
  }
}



function verifySongActionMarkup(){
  document.querySelectorAll('.songrow .rowActions').forEach(actions=>{
    const labels=[...actions.querySelectorAll(':scope > button')].map(b=>b.getAttribute('aria-label')||'');
    if(!labels.includes('Download or remove')||!labels.includes('More'))console.error('SYNTH AUDIO V65 action markup mismatch',labels);
    const stray=[...actions.childNodes].filter(n=>n.nodeType===3&&/\S/.test(n.nodeValue||'')&&String(n.nodeValue).trim()!=='');
    if(stray.length)console.error('SYNTH AUDIO V65 unexpected text node in song actions',stray.map(n=>n.nodeValue));
  });
}
function renderPage(){
  const m=$('#pageContent');
  if(!m)return;
  if(page==='home'){
    const r=getRecentlyPlayedSongs();
      const recentAdditions=getRecentlyAddedSongs(6);
    const favList=songs.filter(s=>favorites.has(s.id));
    const hr=new Date().getHours();
    const timeGreeting=hr<12?'Good morning':hr<17?'Good afternoon':'Good evening';
    const lastPlayed=current||r[0]||songs[0]||null;

    m.innerHTML=`
    <div class="homeContainer">
      <div class="homeHeroCard dashboardHero">
        <div class="homeHeroGlow"></div>
        <div class="homeHeroContent">
          <div class="homeGreetingRow">
            <div class="homeUserAvatar" onclick="go('settings')" role="button" tabindex="0" title="Profile Settings">
              <div class="avatarRingWrap">
                ${renderAvatar(58, true)}
                <span class="avatarBadgeDot" title="Online"></span>
              </div>
            </div>
            <div class="homeGreetingText">
              <div class="dashboardEyebrowRow">
                <span class="eyebrow"><span class="eyebrowLiveDot"></span> ${timeGreeting.toUpperCase()}</span>
                <span class="cloudStatusTag">${svg('shield')} Verified Cloud</span>
              </div>
              <h1 class="dashboardGreetingTitle">${timeGreeting}, <span class="dashboardUserName">${esc(shownName())}</span></h1>
              <p class="sub dashboardSubtitle">Your personal high-fidelity cloud space · Lossless audio everywhere</p>
            </div>
            <button class="dashboardProfilePill" type="button" onclick="go('settings')" title="Manage Account & Settings">
              ${svg('settings')} <span>Settings</span>
            </button>
          </div>
          <div class="homeQuickPills dashboardMetricGrid">
            <button class="quickPill metricCard" onclick="go('library')" role="button" title="View all songs in library">
              <div class="metricCardTop">
                <span class="pillIcon metricIcon metricIconLibrary">${svg('library')}</span>
                <span class="metricArrow">›</span>
              </div>
              <div class="metricCardBody">
                <span class="pillCount metricValue">${songs.length}</span>
                <b class="metricLabel">All Songs</b>
              </div>
            </button>
            <button class="quickPill metricCard" onclick="go('favorites')" role="button" title="View your favorite songs">
              <div class="metricCardTop">
                <span class="pillIcon metricIcon metricIconFav">${svg('heartFilled')}</span>
                <span class="metricArrow">›</span>
              </div>
              <div class="metricCardBody">
                <span class="pillCount metricValue">${favorites.size}</span>
                <b class="metricLabel">Favorites</b>
              </div>
            </button>
            <button class="quickPill metricCard" onclick="go('playlists')" role="button" title="View your playlists">
              <div class="metricCardTop">
                <span class="pillIcon metricIcon metricIconPlaylist">${svg('playlist')}</span>
                <span class="metricArrow">›</span>
              </div>
              <div class="metricCardBody">
                <span class="pillCount metricValue">${playlists.length}</span>
                <b class="metricLabel">Playlists</b>
              </div>
            </button>
            <button class="quickPill metricCard" onclick="go('downloads')" role="button" title="View offline downloaded songs">
              <div class="metricCardTop">
                <span class="pillIcon metricIcon metricIconDownload">${svg('download')}</span>
                <span class="metricArrow">›</span>
              </div>
              <div class="metricCardBody">
                <span class="pillCount metricValue">${offlineDownloadCount}</span>
                <b class="metricLabel">Downloads</b>
              </div>
            </button>
          </div>
        </div>
      </div>

      ${lastPlayed ? `
      <section class="continueSection">
        <div class="sectionhead">
          <h2>Continue Listening</h2>
          <span class="sectionTag">Quick Resume</span>
        </div>
        <div class="resumeCard" onclick="playSong('${esc(lastPlayed.id)}')">
          <div class="resumeArtWrap">
            <img src="${esc(cover(lastPlayed))}" class="resumeCover" onerror="this.onerror=null;this.src=fallback" alt="${esc(lastPlayed.title)}">
            <div class="resumePlayOverlay">${svg('play')}</div>
          </div>
          <div class="resumeInfo">
            <span class="resumeKicker">${r[0]?.id === lastPlayed.id ? 'RECENTLY PLAYED' : 'FEATURED TRACK'}</span>
            <h3 class="resumeTitle">${esc(lastPlayed.title)}</h3>
            <p class="resumeArtist">${esc(lastPlayed.artist || 'Unknown Artist')}${lastPlayed.album ? ' · ' + esc(lastPlayed.album) : ''}</p>
          </div>
          <div class="resumeWaveBars">
            <i></i><i></i><i></i><i></i><i></i><i></i>
          </div>
          <button class="resumeActionBtn" type="button" onclick="event.stopPropagation();playSong('${esc(lastPlayed.id)}')">
            ${svg('play')} <span>Play</span>
          </button>
        </div>
      </section>
      ` : ''}

      <section class="homeShelf">
        <div class="sectionhead">
          <h2>Recently Played</h2>
          ${r.length ? `<button class="seeAllBtn" onclick="go('recent')">See all <span>›</span></button>` : ''}
        </div>
        <div class="grid">${r.slice(0, 6).map(card).join('') || '<div class="emptyCard"><p class="sub">Your recent listening history will appear here.</p><button class="secondary" onclick="go(\'library\')">Explore music</button></div>'}</div>
      </section>

      ${recentAdditions.length ? `
      <section class="homeShelf">
        <div class="sectionhead">
          <h2>Recently Added</h2>
          <span class="sectionTag">New Additions</span>
        </div>
        <div class="grid">${recentAdditions.map(card).join('')}</div>
      </section>
      ` : ''}

      <section class="homeShelf">
        <div class="sectionhead">
          <h2>Your Playlists</h2>
          <button class="seeAllBtn" onclick="go('playlists')">See all <span>›</span></button>
        </div>
        <div class="grid playlistgrid">
          <article class="card createPlaylistCard" onclick="newPlaylist()">
            <div class="createPlaylistArt">
              <span class="createPlaylistPlus">＋</span>
              <b>New Playlist</b>
            </div>
            <div class="title">Create Playlist</div>
            <div class="meta">Add your favorite tracks</div>
          </article>
          ${playlists.slice(0, 5).map(playlistCard).join('')}
        </div>
      </section>

      ${favList.length ? `
      <section class="homeShelf">
        <div class="sectionhead">
          <h2>Your Favorite Tracks</h2>
          <button class="seeAllBtn" onclick="go('favorites')">See all <span>›</span></button>
        </div>
        <div class="grid">${favList.slice(0, 6).map(card).join('')}</div>
      </section>
      ` : ''}
    </div>
    `;
  }
else if(page==='search')m.innerHTML=`<div class="pageIntro"><h1>Search</h1><p class="sub">Find songs, artists, albums, genres and languages.</p></div><div class="searchbox">${svg('search')}<input id="search" placeholder="What do you want to play?" oninput="searchNow()" autocomplete="off"></div><div class="searchQuickPills"><button type="button" class="searchPill" onclick="quickSearch('Pop')">Pop</button><button type="button" class="searchPill" onclick="quickSearch('Soundtrack')">Soundtrack</button><button type="button" class="searchPill" onclick="quickSearch('Rock')">Rock</button><button type="button" class="searchPill" onclick="quickSearch('Melody')">Melody</button><button type="button" class="searchPill" onclick="quickSearch('Electronic')">Electronic</button></div><div id="results" class="section"><div class="emptyStateCard"><div class="emptyStateIcon">${svg('search')}</div><h3>Search your music</h3><p>Find your favorite songs, artists, albums, or genres.</p></div></div>`;
else if(page==='library')m.innerHTML=`<div class="pageIntro splitIntro"><div><h1>Your Library</h1><p class="sub">All music available to you · ${songs.length} tracks</p></div><div class="librarySortGroup"><div class="viewModeToggle" role="group" aria-label="View Mode"><button type="button" class="viewBtn ${libraryViewMode==='grid'?'active':''}" onclick="setLibraryView('grid')" title="Box Cards Grid" aria-label="Grid view">${svg('activity')}</button><button type="button" class="viewBtn ${libraryViewMode==='list'?'active':''}" onclick="setLibraryView('list')" title="List View" aria-label="List view">${svg('playlist')}</button></div><select id="librarySort" class="glassSelect" onchange="filterLibrary()"><option value="az">A–Z Alphabetical</option><option value="newest">Recently Added</option><option value="plays">Most Played</option></select></div></div><div class="filterbar"><div class="tabs"><button class="active">Songs</button><button onclick="go('favorites')">Favorites</button><button onclick="go('playlists')">Playlists</button><button onclick="go('downloads')">Downloads</button></div><div class="libraryFilters"><select id="genreFilter" class="glassSelect" onchange="filterLibrary()"><option value="">All genres</option>${[...new Set(songs.map(s=>s.genre).filter(Boolean))].sort().map(x=>`<option>${esc(x)}</option>`).join('')}</select><select id="langFilter" class="glassSelect" onchange="filterLibrary()"><option value="">All languages</option>${[...new Set(songs.map(s=>s.language).filter(Boolean))].sort().map(x=>`<option>${esc(x)}</option>`).join('')}</select></div></div><div id="libraryList" class="${libraryViewMode==='grid'?'grid libraryGrid':'list libraryList'}">${songs.map(libraryViewMode==='grid'?card:row).join('')||'<p class="sub">No songs available yet.</p>'}</div>`;
else if(page==='favorites'){const favs=songs.filter(s=>favorites.has(s.id));m.innerHTML=`<div class="pageIntro"><h1>Favorites</h1><p class="sub">Songs you saved for quick access.</p></div><div class="list">${favs.length?favs.map(row).join(''):`<div class="emptyStateCard"><div class="emptyStateIcon">${svg('heart')}</div><h3>No favorite tracks yet</h3><p>Tap the heart icon on any song in your Library or Search to pin it here.</p><button class="primary" onclick="go('library')">Explore Music</button></div>`}</div>`;}
else if(page==='recent'){const rList=recent.map(id=>songs.find(s=>s.id===id)).filter(Boolean);m.innerHTML=`<div class="pageIntro"><h1>Recently Played</h1><p class="sub">Your latest listening history.</p></div><div class="list">${rList.length?rList.map(row).join(''):`<div class="emptyStateCard"><div class="emptyStateIcon">${svg('clock')}</div><h3>No listening history yet</h3><p>Songs you play will appear here so you can easily resume listening.</p><button class="primary" onclick="go('library')">Start Listening</button></div>`}</div>`;}
else if(page==='downloads'){(async()=>{
  try {
    const meta=await getOfflineMetaCatalog();
    const orderedMeta=(meta||[]).filter(x=>x?.song?.id).sort((a,b)=>Number(a.downloadedAt||0)-Number(b.downloadedAt||0));
    const orderedIds=orderedMeta.map(x=>x.song.id);
    const ds=orderedMeta.map(x => {
      const existing = songs.find(s => s.id === x.song.id);
      if(existing) return existing;
      if(x.song){
        songs.push(x.song);
        return x.song;
      }
      return null;
    }).filter(Boolean);
    for(const s of ds){
      offlineIds.add(s.id);
      if(!offlineUrls.has(s.id)){
        try{
          const blob=await getOffline(s.id);
          if(blob) offlineUrls.set(s.id, URL.createObjectURL(blob));
        }catch{}
      }
    }
    offlineDownloadCount=offlineIds.size;
    const isOff=!navigator.onLine;
    m.innerHTML=`<div class="offlinePageContainer">
      <div class="pageIntro splitIntro">
        <div>
          <div class="offlineHeroBadge ${isOff?'isOffline':'isOnline'}">
            <span class="offlinePulseDot"></span>
            <span>${isOff?'OFFLINE MODE ACTIVE':'AVAILABLE OFFLINE'}</span>
          </div>
          <h1>Offline Music Vault</h1>
          <p class="sub">Downloaded songs stored locally on this device · ${ds.length} track${ds.length===1?'':'s'} available without internet</p>
        </div>
        <div class="offlineHeaderActions">
          ${ds.length ? `
            <button class="primary" onclick='playCollection(${JSON.stringify(orderedIds)})'>${svg('play')} Play all</button>
            <button class="secondary" onclick='shuffleCollection(${JSON.stringify(orderedIds)})'>${svg('shuffle')} Shuffle</button>
          ` : ''}
        </div>
      </div>
      <div class="offlineStatusBanner ${isOff?'visible':''}">
        <div class="offlineBannerIcon">${svg('download')}</div>
        <div class="offlineBannerText">
          <b>${isOff?'You are currently offline':'Offline storage ready'}</b>
          <span>${ds.length} downloaded track${ds.length===1?'':'s'} can be played right now without internet.</span>
        </div>
      </div>
      <div class="list offlineList">
        ${ds.length ? ds.map(s=>row(s,'',orderedIds)).join('') : `
          <div class="offlineEmpty">
            <div class="offlineIcon">${svg('download')}</div>
            <h3>No offline downloads yet</h3>
            <p>Tap the download button on any song in your Library or Search. Downloaded songs remain playable on this phone or PC even without internet.</p>
            <button class="primary" onclick="go('library')">Browse Library</button>
          </div>
        `}
      </div>
    </div>`;
  } catch(err) {
    console.error('Downloads page render error', err);
    m.innerHTML=`<div class="offlinePageContainer"><div class="pageIntro"><h1>Offline Music Vault</h1><p class="sub">Could not load offline songs.</p></div><div class="offlineEmpty"><p>Unable to access local offline storage. Please try again.</p><button class="primary" onclick="go('downloads')">Retry</button></div></div>`;
  }
})()}
else if(page==='activityStats')renderActivity(m);
else if(page==='playlists')m.innerHTML=`<div class="pageIntro splitIntro"><div><h1>Playlists</h1><p class="sub">Your personal collections.</p></div><button class="primary playlistHeroCreateBtn" onclick="newPlaylist()">${svg('playlist')} ＋ Create playlist</button></div><div class="grid playlistgrid"><article class="card createPlaylistCard" onclick="newPlaylist()"><div class="createPlaylistArt"><span class="createPlaylistPlus">＋</span><b>New Playlist</b></div><div class="title">Create Playlist</div><div class="meta">Add your favorite tracks</div></article>${playlists.map(playlistCard).join('')}</div>`;
else if(page.startsWith('playlist:'))renderPlaylist(m,page.split(':')[1]);
else if(page==='settings')m.innerHTML=`<div class="pageIntro"><span class="eyebrow">PERSONALIZE</span><h1>Settings</h1><p class="sub">Your account and SYNTH AUDIO preferences.</p></div><div class="accountLayout"><section class="accountCard"><div class="accountAvatar">${renderAvatar(68)}</div><div class="accountIdentity"><span class="accountLabel">SIGNED IN</span><h2>${esc(shownName())}</h2><p>${esc(user||'Not signed in')}</p><span class="statusPill"><i></i> Online</span></div></section><section class="settings settingsClean"><div class="settingRow displayNameSetting nameEditorCard"><div><b>Your name</b><span>Choose the name you want SYNTH AUDIO to show. Your email stays your login ID.</span></div><div class="displayNameForm"><input id="displayNameInput" class="field" maxlength="40" value="${esc(displayName)}" placeholder="Enter your name" onkeydown="if(event.key==='Enter')saveDisplayName()"><button class="secondary" onclick="saveDisplayName()">Save name</button></div></div><div class="settingRow avatarSetting"><div><b>Profile avatar</b><span>Choose an avatar icon or upload a custom picture.</span></div><div class="avatarPickerWrap"><div class="avatarPresets">${['🎧','🎵','⚡','🚀','💜','🌟','🎸','🎹'].map(em=>`<button type="button" class="avatarPresetBtn ${profileAvatar===em?'active':''}" onclick="setAvatarPreset('${em}')">${em}</button>`).join('')}</div><div class="avatarUploadForm"><label class="secondary avatarUploadBtn" for="avatarFileInput">${svg('upload')} Upload image</label><input id="avatarFileInput" type="file" accept="image/*" style="display:none" onchange="uploadAvatarImage(this)">${profileAvatar?`<button type="button" class="secondary dangerBtn" onclick="clearAvatar()">Reset avatar</button>`:''}</div></div></div><div class="settingRow"><div><b>Account email</b><span>Your SYNTH AUDIO account identifier.</span></div><strong>${esc(user||'Not available')}</strong></div><div class="settingRow"><div><b>SYNTH AUDIO version</b><span>Running the current local app build.</span></div><strong>V65</strong></div><div class="settingRow"><div><b>Offline music</b><span>Downloaded songs remain available on this device.</span></div><span class="settingValue">${offlineDownloadCount} downloaded</span></div>
        <div class="settingRow batteryOptimizationRow">
          <div>
            <b>Background Playback & Battery Optimization</b>
            <span>Ensure uninterrupted locked-screen music playback by allowing unrestricted background battery usage.</span>
          </div>
          <button class="secondary" type="button" onclick="toast('Android: Settings > Apps > Chrome/Synth > Battery > Select Unrestricted')">Battery Guide</button>
        </div>
        <div class="settingRow themePaletteSetting">
          <div>
            <b>Luxury Theme Palette</b>
            <span>Choose your preferred Aurora Flow + Editorial Luxury color tone.</span>
          </div>
          <div class="themePickerGrid">
            ${[
              {id:'aubergine', name:'Aubergine Midnight', desc:'Deep plum & wine accents', color:'#7d3b66'},
              {id:'burgundy', name:'Burgundy Velvet', desc:'Rich vintage burgundy tone', color:'#7a2f3f'},
              {id:'indigo', name:'Subdued Indigo', desc:'Calm midnight twilight blue', color:'#4b5584'},
              {id:'plum-noir', name:'Plum Noir', desc:'Ultra-dark dusky mauve', color:'#6b4968'}
            ].map(t=>`
              <button type="button" class="themeCardBtn ${themePreference===t.id?'active':''}" onclick="setAppTheme('${t.id}')">
                <span class="themeColorDot" style="background:${t.color}"></span>
                <div class="themeCardText">
                  <strong>${t.name}</strong>
                  <small>${t.desc}</small>
                </div>
                ${themePreference===t.id?'<span class="themeActiveCheck">✓</span>':''}
              </button>
            `).join('')}
          </div>
        </div>
        <div class="settingRow auroraGlowSetting">
          <div>
            <b>Atmospheric Aurora Glow</b>
            <span>Soft low-opacity ambient light gradient reflecting the theme palette.</span>
          </div>
          <button type="button" class="settingToggleBtn ${auroraGlow?'active':''}" onclick="toggleAuroraGlow()" aria-label="Toggle atmospheric aurora glow">
            <span class="settingToggleTrack"><span class="settingToggleThumb"></span></span>
            <span class="settingToggleText">${auroraGlow?'ON':'OFF'}</span>
          </button>
        </div>
<div class="settingRow dynamicColorsSetting"><div><b>Dynamic Mini Player Colors</b><span>Subtly adapt Mini Player tint and accents from the current song's artwork.</span></div><button type="button" class="settingToggleBtn ${dynamicMiniColors?'active':''}" onclick="toggleDynamicMiniColors()" aria-label="Toggle dynamic mini player colors"><span class="settingToggleTrack"><span class="settingToggleThumb"></span></span><span class="settingToggleText">${dynamicMiniColors?'ON':'OFF'}</span></button></div>
<div class="settingRow playbackRateSetting"><div><b>Playback Speed</b><span>Adjust music playback tempo without altering pitch.</span></div><div class="speedPickerGroup" role="group" aria-label="Playback Speed">${[0.75, 1.0, 1.25, 1.5].map(r => `<button type="button" class="speedBtn ${appPlaybackRate === r ? 'active' : ''}" onclick="setPlaybackRate(${r})">${r}x</button>`).join('')}</div></div>
<div class="settingRow sleepTimerSetting"><div><b>Sleep Timer</b><span>Automatically stop playback after selected duration.</span></div><div class="sleepPickerGroup" role="group" aria-label="Sleep Timer"><button type="button" class="speedBtn ${!sleepTimerEndsAt ? 'active' : ''}" onclick="clearSleepTimer()">Off</button><button type="button" class="speedBtn ${sleepTimerMode==='15 min' ? 'active' : ''}" onclick="setSleepTimer(15)">15m</button><button type="button" class="speedBtn ${sleepTimerMode==='30 min' ? 'active' : ''}" onclick="setSleepTimer(30)">30m</button><button type="button" class="speedBtn ${sleepTimerMode==='45 min' ? 'active' : ''}" onclick="setSleepTimer(45)">45m</button><button type="button" class="speedBtn ${sleepTimerMode==='60 min' ? 'active' : ''}" onclick="setSleepTimer(60)">60m</button></div></div>${IS_NATIVE_APP?`<div class="settingRow serverSetting"><div><b>Server address</b><span>Address used by this phone app to reach SYNTH AUDIO.</span></div><div class="serverSettingForm"><input id="serverUrlInput" class="field" value="${esc(localStorage.getItem('synthServerUrl')||NATIVE_CONFIG_URL||'http://10.90.82.78:3000')}" inputmode="url" placeholder="http://192.168.1.10:3000"><button class="secondary" onclick="saveServerUrl()">Save</button></div></div>`:''}${owner?`<div class="settingRow ownerEnabled"><div><b>Owner access</b><span>Owner controls are currently unlocked for this account.</span></div><button class="secondary" onclick="go('admin')">Open Admin ${svg('shield')}</button></div>`:ownerCandidate?`<div class="settingRow ownerAccess"><div><b>Owner access</b><span>This is the registered owner account. Unlock the private Admin area with your owner key.</span></div><button class="primary" onclick="ownerGate()">Unlock Admin ${svg('shield')}</button></div>`:''}<div class="accountActions"><button class="secondary" onclick="logout()">Log out</button></div></section></div>`;
else if(page==='admin')renderAdmin(m);if(window.__SYNTH_DEV_CHECK)verifySongActionMarkup()}
let appPlaybackRate = Number(localStorage.getItem('synthPlaybackRate') || 1);
function setPlaybackRate(rate){
  appPlaybackRate = Number(rate) || 1;
  localStorage.setItem('synthPlaybackRate', String(appPlaybackRate));
  try { if(audio) audio.playbackRate = appPlaybackRate; } catch {}
  toast(`Playback speed set to ${appPlaybackRate}x`);
  renderPage();
}
function renderActivity(m){
  api('/api/user/stats?userEmail='+encodeURIComponent(user)).then(st=>{
    listened=Number(st.listeningSeconds||0);
    userEvents=Array.isArray(st.events)?st.events:[];
    localStorage.setItem('listenedSeconds:'+user,String(listened));
    const events=userEvents;
    const topSongs=(songs||[]).filter(s=>(s.plays||0)>0).sort((a,b)=>(b.plays||0)-(a.plays||0)).slice(0,4);
    m.innerHTML=`<div class="pageIntro splitIntro"><div><h1>Activity</h1><p class="sub">Track your listening milestones and playtime history.</p></div></div>
<div class="stats">
  <div class="stat accentStat listeningHero"><span>Total listening time</span><b>${mins(listened)}</b><small>${fmt(listened)} listened</small></div>
  <div class="stat"><span>Sessions</span><b>${events.filter(e=>e.type==='play').length}</b><small>play actions</small></div>
  <div class="stat"><span>Favorites</span><b>${favorites.size}</b><small>saved songs</small></div>
  <div class="stat"><span>Downloads</span><b>${offlineDownloadCount}</b><small>on this device</small></div>
</div>
${topSongs.length>0?`<section class="topTracksActivitySection"><div class="sectionhead"><h2>Most Played Tracks</h2><span class="countPill">${topSongs.length} top tracks</span></div><div class="grid topTracksGrid">${topSongs.map(card).join('')}</div></section>`:''}
<section><div class="sectionhead"><h2>Recent activity</h2><span class="countPill">${events.length} events</span></div><div class="activitylist">${events.slice(0,35).map(activityItem).join('')||'<p class="sub emptyText">No activity yet. Play songs to see your history.</p>'}</div></section>`;
  }).catch(()=>{
    const events=userEvents||[];
    const topSongs=(songs||[]).filter(s=>(s.plays||0)>0).sort((a,b)=>(b.plays||0)-(a.plays||0)).slice(0,4);
    m.innerHTML=`<div class="pageIntro"><h1>Activity</h1><p class="sub">Your listening activity, available offline when cached.</p></div>
<div class="stats">
  <div class="stat accentStat listeningHero"><span>Total listening time</span><b>${mins(listened)}</b><small>${fmt(listened)} listened</small></div>
  <div class="stat"><span>Sessions</span><b>${events.filter(e=>e.type==='play').length}</b><small>play actions</small></div>
  <div class="stat"><span>Favorites</span><b>${favorites.size}</b><small>saved songs</small></div>
  <div class="stat"><span>Downloads</span><b>${offlineDownloadCount}</b><small>on this device</small></div>
</div>
${topSongs.length>0?`<section class="topTracksActivitySection"><div class="sectionhead"><h2>Most Played Tracks</h2><span class="countPill">${topSongs.length} top tracks</span></div><div class="grid topTracksGrid">${topSongs.map(card).join('')}</div></section>`:''}
<section><div class="sectionhead"><h2>Recent activity</h2></div><div class="activitylist">${events.slice(0,35).map(activityItem).join('')||'<p class="sub emptyText">No activity yet.</p>'}</div></section>`;
  });
}
function activityItem(e){
  const raw=String(e.detail||'');
  const sid=raw.split(' · ')[0];
  const s=songs.find(x=>x.id===sid)||null;
  const detail=s?`${s.title} · ${s.artist||'Unknown Artist'}`:(raw||'Activity');
  const hasSong=!!s;
  return `<div class="activityItem ${hasSong?'clickableActivity':''}" ${hasSong?`onclick="playSong('${esc(s.id)}')"`:''}>
    ${hasSong?`<img class="activityThumb" src="${esc(cover(s))}" onerror="this.onerror=null;this.src=fallback" alt="${esc(s.title)}">`:`<div class="activityIcon">${svg(e.type==='play'?'play':e.type==='listening'?'activity':'playlist')}</div>`}
    <div class="grow"><b>${esc(e.type.replaceAll('_',' '))}</b><span>${esc(detail)}</span></div>
    <time>${new Date(e.at).toLocaleString()}</time>
    ${hasSong?`<button class="activityPlayBtn" type="button" aria-label="Play ${esc(s.title)}" title="Play ${esc(s.title)}" onclick="event.stopPropagation();playSong('${esc(s.id)}')">${svg('play')}</button>`:''}
  </div>`;
}
function playlistCard(p){const s=songs.find(x=>p.songIds?.includes(x.id));return `<article class="card" onclick="go('playlist:${p.id}')"><img class="cover" src="${esc(p.image||cover(s||{}))}" loading="lazy" onerror="this.onerror=null;this.src=fallback"><div class="title">${esc(p.name)}</div><div class="meta">${p.songIds?.length||0} songs</div></article>`}
let addSongsFilter = '';
function toggleAddSongsPanel(){
  const panel = $('#addSongsPanel');
  if(panel){
    panel.classList.toggle('hidden');
    if(!panel.classList.contains('hidden')){
      $('#addSongsSearch')?.focus();
    }
  }
}

function filterAddSongs(q, pid){
  addSongsFilter = String(q||'').toLowerCase().trim();
  const el = $('#addSongsList');
  if(!el) return;
  const p = playlists.find(x=>x.id===pid);
  if(!p) return;
  const pSongIds = new Set(p.songIds||[]);
  const candidates = songs.filter(s => {
    if(!addSongsFilter) return true;
    return [s.title, s.artist, s.album, s.genre].join(' ').toLowerCase().includes(addSongsFilter);
  }).slice(0, 40);

  el.innerHTML = candidates.map(s => {
    const inPl = pSongIds.has(s.id);
    return `
    <div class="addSongRow">
      <img src="${esc(cover(s))}" class="addSongThumb" onerror="this.onerror=null;this.src=fallback">
      <div class="addSongMeta">
        <b>${esc(s.title)}</b>
        <small>${esc(s.artist||'Unknown Artist')}</small>
      </div>
      <button type="button" class="addSongToggleBtn ${inPl?'added':''}" onclick="togglePlaylistSong('${pid}','${s.id}')">
        ${inPl ? '✓ Added' : '＋ Add'}
      </button>
    </div>
    `;
  }).join('') || '<p class="sub emptyText">No matching songs found.</p>';
}

async function togglePlaylistSong(pid, sid){
  const p = playlists.find(x=>x.id===pid);
  if(!p) return;
  const pSongIds = new Set(p.songIds||[]);
  if(pSongIds.has(sid)){
    await removeSongFromPlaylist(pid, sid);
  } else {
    await addSongToPlaylist(pid, sid);
  }
  filterAddSongs(addSongsFilter, pid);
}

function renderPlaylist(m,id){
  const p=playlists.find(x=>x.id===id);
  if(!p){return go('playlists')}
  const orderedIds=(p.songIds||[]).map(String);
  const ss=orderedIds.map(x=>songs.find(s=>String(s.id)===x)).filter(Boolean);
  const totalDuration = ss.reduce((acc, s) => acc + (Number(s.duration)||0), 0);
  const durationText = totalDuration > 0 ? ` · ${mins(totalDuration)}` : '';

  m.innerHTML=`
  <div class="playlistDetailView">
    <button class="back" onclick="go('playlists')">${svg('back')} Back to Playlists</button>
    
    <div class="playlistDetailHeader">
      <div class="playlistArtworkWrap" onclick="changePlaylistArtwork('${p.id}')" title="Click to change playlist cover artwork">
        <img src="${esc(p.image||cover(ss[0]||{}))}" onerror="this.onerror=null;this.src=fallback" class="playlistDetailCover">
        <div class="artChangeHoverOverlay">
          ${svg('upload')}
          <span>Change Cover</span>
        </div>
      </div>
      
      <div class="playlistInfoBlock">
        <span class="playlistTypeBadge">PLAYLIST</span>
        <div class="playlistTitleRow">
          <input id="playlistName" class="playlistNameInput" value="${esc(p.name)}" placeholder="Playlist name" onblur="renamePlaylist('${p.id}')" onkeydown="if(event.key==='Enter'){this.blur();}">
          <button class="iconBtn renameIconBtn" onclick="$('#playlistName').focus()" title="Rename playlist">✏️</button>
        </div>
        
        <div class="playlistCreatorRow">
          <div class="playlistCreatorAvatar">${renderAvatar(26, true)}</div>
          <span class="playlistCreatorName">${esc(shownName())}</span>
          <span class="playlistDot">•</span>
          <span class="playlistStatsMeta">${ss.length} song${ss.length===1?'':'s'}${durationText}</span>
        </div>

        <div class="playlistActionsBar">
          <button class="primary playlistMainPlayBtn" onclick="playPlaylist('${p.id}')" ${!ss.length?'disabled':''}>
            ${svg('play')} Play
          </button>
          <button class="secondary playlistActionBtn" onclick="shufflePlaylist('${p.id}')" ${!ss.length?'disabled':''}>
            ${svg('shuffle')} Shuffle
          </button>
          <button class="secondary playlistActionBtn addSongsToggleBtn" onclick="toggleAddSongsPanel()">
            ＋ Add Songs
          </button>
          <button class="secondary playlistActionBtn" onclick="changePlaylistArtwork('${p.id}')">
            Artwork
          </button>
          <button class="secondary playlistActionBtn dangerBtn" onclick="deletePlaylist('${p.id}')">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Interactive Add Songs to Playlist Section -->
    <div id="addSongsPanel" class="addSongsPanel hidden">
      <div class="addSongsPanelHead">
        <div>
          <h3>Add songs to "${esc(p.name)}"</h3>
          <p class="sub">Find songs from your library to add with one click.</p>
        </div>
        <button type="button" class="modalClose" onclick="toggleAddSongsPanel()">${svg('close')}</button>
      </div>
      <div class="addSongsSearchBox">
        ${svg('search')}
        <input id="addSongsSearch" placeholder="Search songs to add..." oninput="filterAddSongs(this.value, '${p.id}')">
      </div>
      <div id="addSongsList" class="addSongsList"></div>
    </div>

    <!-- Playlist Song List -->
    <div class="playlistTracklistHead">
      <span class="thNum">#</span>
      <span class="thTitle">TITLE</span>
      <span class="thAlbum">ALBUM</span>
      <span class="thActions">ACTIONS</span>
    </div>
    <div class="list playlistSongs">
      ${ss.length ? ss.map((s, idx)=>row(s,`<button class="rowbtn danger removeSongBtn" onclick="event.stopPropagation();removeSongFromPlaylist('${p.id}','${s.id}')" title="Remove from playlist">${svg('close')}</button>`,orderedIds)).join('') : `
        <div class="playlistEmptyState">
          <div class="playlistEmptyIcon">${svg('playlist')}</div>
          <h3>This playlist is empty</h3>
          <p>Tap "＋ Add Songs" above to select tracks from your library.</p>
          <button class="primary" onclick="toggleAddSongsPanel()">＋ Add Songs Now</button>
        </div>
      `}
    </div>
  </div>`;
  setTimeout(()=>filterAddSongs('', p.id), 50);
}
function showCollection(name,ids){const ss=(ids||[]).map(id=>songs.find(s=>s.id===id)).filter(Boolean);$('#main').innerHTML=`<button class="back" onclick="go('home')">${svg('back')} Back</button><h1>${esc(name)}</h1><p class="sub">${ss.length} songs</p><div class="collectionActions">${ss.length?`<button class="primary" onclick='playCollection(${JSON.stringify(ss.map(s=>s.id))})'>${svg('play')} Play all</button><button class="secondary" onclick='shuffleCollection(${JSON.stringify(ss.map(s=>s.id))})'>${svg('shuffle')} Shuffle</button>`:''}</div><div class="list">${ss.map(row).join('')||'<p class="sub">Nothing here yet.</p>'}</div>`}
let searchTimer=null;
const searchMemo = new Map();
let lastSearchSig='';
function searchNow(){
  if(searchTimer) cancelAnimationFrame(searchTimer);
  searchTimer=requestAnimationFrame(()=>{
    searchTimer=null;
    const input=$('#search');
    const q=(input?.value||'').toLowerCase().trim();
    const results=$('#results');if(!results)return;
    if(!q){
      results.innerHTML=`<div class="emptyStateCard"><div class="emptyStateIcon">${svg('search')}</div><h3>Search your music</h3><p>Find your favorite songs, artists, albums, or genres.</p></div>`;
      return;
    }
    if(lastSearchSig !== lastCatalogSignature){ searchMemo.clear(); lastSearchSig = lastCatalogSignature; }
    let out = searchMemo.get(q);
    if(!out){
      out = songs.filter(s=>[s.title,s.artist,s.album,s.genre,s.language].join(' ').toLowerCase().includes(q));
      searchMemo.set(q, out);
    }
    results.innerHTML=out.length
      ? `<div class="sectionhead"><h2>Results</h2><span class="resultCount">${out.length} song${out.length===1?'':'s'}</span></div><div class="grid">${out.map(card).join('')}</div>`
      : `<div class="emptyStateCard"><div class="emptyStateIcon">${svg('search')}</div><h3>No results found</h3><p>No tracks matched "${esc(q)}". Try searching for another artist or title.</p></div>`;
  });
}

const normFilter=v=>String(v??'').trim().toLowerCase();
function filterLibrary(){
  const g=normFilter($('#genreFilter')?.value);
  const l=normFilter($('#langFilter')?.value);
  const s=$('#librarySort')?.value||'az';
  let out=songs.filter(song=>(!g||normFilter(song.genre)===g)&&(!l||normFilter(song.language)===l));
  if(s==='az'){
    out=sortSongsAlphabetical(out);
  } else if(s==='newest'){
    out.sort((a,b)=>new Date(b.createdAt||0).getTime()-new Date(a.createdAt||0).getTime());
  } else if(s==='plays'){
    out.sort((a,b)=>Number(b.plays||0)-Number(a.plays||0));
  }
  const list=$('#libraryList');
  if(list){
    list.className = libraryViewMode === 'grid' ? 'grid libraryGrid' : 'list libraryList';
    const renderer = libraryViewMode === 'grid' ? card : row;
    list.innerHTML = out.map(renderer).join('') || '<p class="sub emptyText">No songs match those filters.</p>';
  }
}
function setMobileBrowseActive(key){document.querySelectorAll('.mobileBrowseTabs button').forEach(b=>b.classList.toggle('active',b.dataset.browse===key))}
function mobileBrowse(kind){
  if(kind==='songs'){setMobileBrowseActive('songs');return go('library')}
  if(kind==='playlists'){setMobileBrowseActive('playlists');return go('playlists')}
  if(kind==='folders'){setMobileBrowseActive('folders');return go('downloads')}
  const field=kind==='artists'?'artist':kind==='albums'?'album':kind==='genres'?'genre':'';
  if(!field)return go('library');
  page='group:'+kind;
  history.pushState({},'',location.pathname+'#'+page);
  renderGroupedCollection(kind==='artists'?'Artists':kind==='albums'?'Albums':'Genres',field);
}
function renderGroupedCollection(title,field){
  const m=$('#pageContent');if(!m)return;
  const groupMap = new Map();
  for(let i=0; i<songs.length; i++){
    const s = songs[i];
    const g = String(s[field]||'Unknown').trim()||'Unknown';
    let arr = groupMap.get(g);
    if(!arr){ arr = []; groupMap.set(g, arr); }
    arr.push(s);
  }
  const sortedGroups = Array.from(groupMap.keys()).sort((a,b)=>a.localeCompare(b, undefined, {sensitivity:'base'}));
  let html = `<div class="pageIntro"><button class="back" onclick="go('library');setMobileBrowseActive('songs')">${svg('back')} Back to songs</button><h1>${esc(title)}</h1><p class="sub">${sortedGroups.length} ${title.toLowerCase()}</p></div><div class="groupBrowse">`;
  for(let i=0; i<sortedGroups.length; i++){
    const g = sortedGroups[i];
    const list = groupMap.get(g);
    html += `<section class="groupSection"><div class="sectionhead"><h2>${esc(g)}</h2><span class="resultCount">${list.length} songs</span></div><div class="list">`;
    for(let j=0; j<list.length; j++){
      html += row(list[j]);
    }
    html += `</div></section>`;
  }
  html += `</div>`;
  m.innerHTML = html;
  setMobileBrowseActive(field==='artist'?'artists':field==='album'?'albums':'genres');
}
function toggleMobileMore(){const m=document.getElementById('mobileMoreMenu');if(!m)return;const open=m.hidden;m.hidden=!open;document.querySelector('.mobileNav .mnav:last-child')?.setAttribute('aria-expanded',open?'true':'false')}
function closeMobileMore(){const m=document.getElementById('mobileMoreMenu');if(m)m.hidden=true;document.querySelector('.mobileNav .mnav:last-child')?.setAttribute('aria-expanded','false')}

function updateNavActiveState(){
  document.querySelectorAll('.side .nav').forEach(btn => {
    const p = btn.getAttribute('data-nav') || '';
    btn.classList.toggle('active', p === page);
  });
  document.querySelectorAll('.mobileNav .mnav').forEach(btn => {
    const p = btn.getAttribute('data-nav') || '';
    if(p) {
      btn.classList.toggle('active', p === page);
    }
  });
  const moreBtn = document.querySelector('.mobileNav .mnavMore');
  if(moreBtn){
    moreBtn.classList.toggle('active', ['favorites','recent','activityStats','settings','admin'].includes(page));
  }
}

function go(p){closeMobileMore();updateNavActiveState();if(p==='stats'||p==='activity')p='activityStats';if(p==='admin'&&!owner){ownerGate();return}page=p;const hash=p.startsWith('playlist:')?'#playlist-'+p.slice(9):'#'+p;history.pushState({},'',location.pathname+hash);render()}
window.addEventListener('popstate',()=>{const h=location.hash.replace(/^#/,'');if(h.startsWith('playlist-')){page='playlist:'+h.slice(9);render()}else if(h.startsWith('group:')){page=h;render()}else if(h==='playlists'){page='playlists';render()}else if(h==='activityStats'||h==='activity'||h==='stats'){page='activityStats';render()}else if(h==='admin'){page='admin';render()}else{page=h||'home';render()}});
function login(){return submitAuth()}
async function saveDisplayName(){const input=$('#displayNameInput');const next=String(input?.value||'').trim().replace(/\s+/g,' ').slice(0,40);displayName=next;localStorage.setItem('synthDisplayName:'+user,displayName);try{await api('/api/user/state',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({favorites:[...favorites],recent,displayName,avatar:profileAvatar})});toast(displayName?'Name saved':'Name cleared');}catch{toast('Name saved on this device; server sync unavailable')}render();}
function setAvatarPreset(emoji){profileAvatar=emoji;localStorage.setItem('synthAvatar:'+user,profileAvatar);saveUserState();render();toast('Avatar updated')}
function clearAvatar(){profileAvatar='';localStorage.removeItem('synthAvatar:'+user);saveUserState();render();toast('Avatar reset to default')}
function uploadAvatarImage(input){const file=input?.files?.[0];if(!file)return;if(file.size>8*1024*1024){toast('Image must be under 8MB');return}const reader=new FileReader();reader.onload=e=>{const img=new Image();img.onload=()=>{try{const canvas=document.createElement('canvas');const maxDim=256;let w=img.width,h=img.height;if(w>h){if(w>maxDim){h=Math.round((h*maxDim)/w);w=maxDim}}else{if(h>maxDim){w=Math.round((w*maxDim)/h);h=maxDim}}canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,w,h);profileAvatar=canvas.toDataURL('image/jpeg',0.85);localStorage.setItem('synthAvatar:'+user,profileAvatar);saveUserState();render();toast('Profile picture updated')}catch{profileAvatar=String(e.target.result||'');localStorage.setItem('synthAvatar:'+user,profileAvatar);saveUserState();render();toast('Profile picture updated')}};img.src=e.target.result};reader.readAsDataURL(file)}
function ownerGate(){document.body.classList.remove('loginMode');const d=document.createElement('div');d.className='modal ownerModal';const defaultEmail=ownerEmail||user||'akilesht@karunya.edu.in';d.innerHTML=`<div class="modalbox ownerBox"><button class="modalClose" onclick="this.closest('.modal').remove()">${svg('close')}</button><div class="ownerIcon">${svg('shield')}</div><span class="ownerKicker">PRIVATE AREA</span><h2>Owner access</h2><p>Enter your SYNTH AUDIO owner key to open Administration.</p><label class="fieldLabel">Owner account</label><input id="ownerEmail" class="field" type="email" value="${esc(defaultEmail)}" placeholder="Owner email / user ID"><label class="fieldLabel">Owner key</label><input id="ownerKey" class="field" type="password" autocomplete="current-password" placeholder="Enter owner key" onkeydown="if(event.key==='Enter')verifyOwner()"><button class="primary wide" onclick="verifyOwner()">Unlock Admin ${svg('shield')}</button><div id="ownerMsg" class="formMsg"></div></div></div>`;document.body.appendChild(d);setTimeout(()=>$('#ownerKey')?.focus(),60)}
async function verifyOwner(){const e=normalizeEmail($('#ownerEmail')?.value)||ownerEmail||user||'akilesht@karunya.edu.in',k=$('#ownerKey')?.value||'';const x=$('#ownerMsg');if(!k){if(x)x.textContent='Enter your owner key.';return}const btn=document.querySelector('.ownerBox .primary');if(btn){btn.disabled=true;btn.classList.add('loading')}if(x)x.textContent='Verifying owner access…';try{const verified=await api('/api/admin/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:e,key:k})});owner=true;ownerCandidate=true;ownerKey=k;ownerToken=verified.token||'';ownerEmail=verified.email||e;localStorage.setItem('synthOwnerKey',k);if(ownerToken)localStorage.setItem('synthOwnerToken',ownerToken);localStorage.setItem('synthOwnerEmail',ownerEmail);if(!user){user=ownerEmail;localStorage.setItem('synthUser',ownerEmail);favorites=new Set();recent=[];listened=0}document.querySelector('.ownerModal')?.remove();location.hash='';page='admin';render();toast('Owner access verified')}catch{if(x)x.textContent='Owner authorization failed. Check the owner key and try again.';if(btn){btn.disabled=false;btn.classList.remove('loading')}}}
function logout(){stopListenTimer();api('/api/auth/logout',{method:'POST'}).catch(()=>{});localStorage.removeItem('synthUser');localStorage.removeItem('synthAuthToken');localStorage.removeItem('synthOwnerKey');localStorage.removeItem('synthOwnerToken');localStorage.removeItem('synthOwnerEmail');user='';profileAvatar='';owner=false;ownerCandidate=false;ownerKey='';audio.pause();destroyNativePlayer();stopNativePolling();current=null;renderLogin()}
function playSong(id){const s=songs.find(x=>x.id===id);if(!s)return;const i=songs.indexOf(s);queue=songs.slice();qIndex=i>=0?i:0;return startSong(s)}
function playSongInCollection(id,ids){const ordered=(ids||[]).map(x=>songs.find(s=>s.id===x)).filter(Boolean);const s=ordered.find(x=>x.id===id)||songs.find(x=>x.id===id);if(!s)return;queue=ordered.length?ordered:songs.slice();const i=queue.indexOf(s);qIndex=i>=0?i:0;return startSong(s)}
function playCollection(ids){queue=ids.map(id=>songs.find(s=>s.id===id)).filter(Boolean);if(!queue.length)return;qIndex=0;startSong(queue[0])}
function shuffleCollection(ids){queue=ids.map(id=>songs.find(s=>s.id===id)).filter(Boolean).sort(()=>Math.random()-.5);qIndex=0;startSong(queue[0])}
let offlineUrls=new Map();
const IDB_NAME='synth-audio-offline',IDB_STORE='tracks',IDB_META='metadata';
function offlineDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open(IDB_NAME,3);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(IDB_STORE))r.result.createObjectStore(IDB_STORE);if(!r.result.objectStoreNames.contains(IDB_META))r.result.createObjectStore(IDB_META)};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function getOffline(id){try{const db=await offlineDB();return await new Promise((resolve,reject)=>{const q=db.transaction(IDB_STORE,'readonly').objectStore(IDB_STORE).get(id);q.onsuccess=()=>resolve(q.result||null);q.onerror=()=>reject(q.error)})}catch{return null}}
async function putOffline(id,blob,meta={}){const db=await offlineDB();return new Promise((resolve,reject)=>{const tx=db.transaction([IDB_STORE,IDB_META],'readwrite');tx.objectStore(IDB_STORE).put(blob,id);tx.objectStore(IDB_META).put(meta,id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}
async function deleteOffline(id){try{const db=await offlineDB();await new Promise((resolve,reject)=>{const tx=db.transaction([IDB_STORE,IDB_META],'readwrite');tx.objectStore(IDB_STORE).delete(id);tx.objectStore(IDB_META).delete(id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});if(offlineUrls.has(id)){URL.revokeObjectURL(offlineUrls.get(id));offlineUrls.delete(id)}}catch{}}
async function getOfflineMeta(id){try{const db=await offlineDB();return await new Promise((resolve,reject)=>{const q=db.transaction(IDB_META,'readonly').objectStore(IDB_META).get(id);q.onsuccess=()=>resolve(q.result||null);q.onerror=()=>reject(q.error)})}catch{return null}}
async function getOfflineMetaCatalog(){try{const db=await offlineDB();return await new Promise((resolve,reject)=>{const out=[];const q=db.transaction(IDB_META,'readonly').objectStore(IDB_META).openCursor();q.onsuccess=()=>{const c=q.result;if(!c)return resolve(out);out.push(c.value);c.continue()};q.onerror=()=>reject(q.error)})}catch{return []}}
async function hasOffline(id){return !!(await getOffline(id))}
async function mergeOfflineCatalog(){
  const meta = await getOfflineMetaCatalog();
  offlineIds = new Set();
  for(const item of meta){
    const s = item?.song;
    if(!s?.id) continue;
    offlineIds.add(s.id);
    const idx = songs.findIndex(x => x.id === s.id);
    if(idx < 0){
      songs.push({ ...s, offlineOnly: true });
    } else {
      // Server metadata takes precedence; preserve fresh title, artist, album and artwork
      songs[idx] = { ...s, ...songs[idx] };
      // Refresh offline IDB metadata if title or cover was edited on server
      if(s.title !== songs[idx].title || s.cover !== songs[idx].cover){
        putOfflineMeta(s.id, { song: songs[idx], downloadedAt: item.downloadedAt || Date.now() }).catch(()=>{});
      }
    }
  }
  songs = sortSongsAlphabetical(songs);
  offlineDownloadCount = offlineIds.size;
  return meta;
}
// Native & HTML audio engine background management
let isTrackTransitioning = false;
let bgAudioContext = null;
let bgSilentSource = null;
let bgSilentGain = null;
function initWebAudioKeepAlive(){
  if(nativeMode() || (typeof window.AudioContext === 'undefined' && typeof window.webkitAudioContext === 'undefined')) return;
  try{
    if(!bgAudioContext){
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      bgAudioContext = new AudioCtx({ latencyHint: 'playback' });
      bgSilentGain = bgAudioContext.createGain();
      bgSilentGain.gain.value = 0.00001;
      bgSilentGain.connect(bgAudioContext.destination);
      const osc = bgAudioContext.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 20;
      osc.connect(bgSilentGain);
      try { osc.start(0); } catch(e) {}
      bgSilentSource = osc;
    }
    if(bgAudioContext.state === 'suspended'){
      bgAudioContext.resume().catch(()=>{});
    }
  }catch(err){
    console.debug('Web Audio keep-alive init skipped:', err);
  }
}
function ensureBgKeeper(){ return null; }
function startBgKeeper(){
  initWebAudioKeepAlive();
}
function stopBgKeeper(){ /* Preserve continuous audio session across track changes */ }


// Native background playback is enabled inside Capacitor. Browser/Electron uses HTML audio engine with background keep-alive.
const nativeCap=window.Capacitor;
let nativeAudio=window.SYNTH_NATIVE_AUDIO||(()=>{try{return window.Capacitor?.registerPlugin?.('AudioPlayer')||null}catch{return null}})();
function resolveNativeAudio(){
  if(!nativeAudio) nativeAudio=window.SYNTH_NATIVE_AUDIO||(()=>{try{return window.Capacitor?.registerPlugin?.('AudioPlayer')||null}catch{return null}})();
  return nativeAudio;
}
const nativeMode=()=>!!(resolveNativeAudio()&&window.Capacitor?.isNativePlatform?.());
const NATIVE_AUDIO_ID='synth-main';
let nativeReady=false,nativePlaying=false,nativeDuration=0,nativeTime=0,nativeListenersBound=false,nativePolling=null,nativeTransitioning=false;
function playbackPaused(){return nativeMode()&&nativeReady?!nativePlaying:audio.paused}
function playbackTime(){return nativeMode()&&nativeReady?nativeTime:(Number(audio.currentTime)||0)}
function playbackDuration(){return nativeMode()&&nativeReady?nativeDuration:(Number(audio.duration)||0)}
function nativeSource(s){return resourceUrl(s?.file,{forNative:true})}
async function destroyNativePlayer(){if(!nativeMode())return;try{if(nativeReady)await nativeAudio.stop({audioId:NATIVE_AUDIO_ID})}catch{}try{if(nativeReady)await nativeAudio.destroy({audioId:NATIVE_AUDIO_ID})}catch{}nativeReady=false;nativePlaying=false;nativeDuration=0;nativeTime=0}
function startNativePolling(){if(nativePolling||!nativeMode())return;nativePolling=setInterval(async()=>{if(!nativeReady)return;try{const r=await nativeAudio.getCurrentTime({audioId:NATIVE_AUDIO_ID});nativeTime=Number(r?.currentTime)||0}catch{}const r=document.querySelector('#seek');if(r&&nativeDuration)r.value=nativeTime/nativeDuration*100;const t=document.querySelector('#cur');if(t)t.textContent=fmt(nativeTime);const f=document.querySelector('#fpcurr');if(f)f.textContent=fmt(nativeTime);const fp=document.querySelector('#fpseek');if(fp&&nativeDuration)fp.value=nativeTime/nativeDuration*100;updateMediaPosition()},250)}
function stopNativePolling(){if(nativePolling){clearInterval(nativePolling);nativePolling=null}}
async function bindNativeListeners(){
  if(!nativeMode()||nativeListenersBound)return;
  nativeListenersBound=true;
  try{await nativeAudio.onAudioReady({audioId:NATIVE_AUDIO_ID},async()=>{
    try{const r=await nativeAudio.getDuration({audioId:NATIVE_AUDIO_ID});nativeDuration=Number(r?.duration)||0}catch{}
    renderPlayer();
  })}catch(e){console.error('native onAudioReady registration failed',e)}
  try{await nativeAudio.onAudioEnd({audioId:NATIVE_AUDIO_ID},async()=>{
    if(nativeTransitioning)return;
    const endedId=current?.id||'';
    nativePlaying=false;stopListenTimer();
    await handleTrackEnded('native',endedId);
    updateMediaPlaybackState();renderPlayer();
  })}catch(e){console.error('native onAudioEnd registration failed',e)}
  try{if(typeof nativeAudio.onAudioNext==='function')await nativeAudio.onAudioNext({audioId:NATIVE_AUDIO_ID},async()=>{
    await next();
    if(current)updateMediaSession(current);
  })}catch(e){console.warn('native onAudioNext registration failed',e)}
  try{if(typeof nativeAudio.onAudioPrevious==='function')await nativeAudio.onAudioPrevious({audioId:NATIVE_AUDIO_ID},async()=>{
    await prev();
    if(current)updateMediaSession(current);
  })}catch(e){console.warn('native onAudioPrevious registration failed',e)}
  try{await nativeAudio.onPlaybackStatusChange({audioId:NATIVE_AUDIO_ID},async r=>{
    const status=String(r?.status||'');
    if(status==='playing')nativePlaying=true;
    else if(status==='paused'||status==='stopped')nativePlaying=false;
    if(nativePlaying)startListenTimer();else stopListenTimer();
    updateMediaPlaybackState();
    renderPlayer();
  })}catch(e){console.error('native onPlaybackStatusChange registration failed',e)}
  try{await nativeAudio.onAppGainsFocus({audioId:NATIVE_AUDIO_ID},async()=>{
    if(!nativeReady)return;
    try{const r=await nativeAudio.isPlaying({audioId:NATIVE_AUDIO_ID});nativePlaying=!!r?.isPlaying}catch{}
    try{const r=await nativeAudio.getCurrentTime({audioId:NATIVE_AUDIO_ID});nativeTime=Number(r?.currentTime)||nativeTime}catch{}
    updateMediaPlaybackState();renderPlayer();
  })}catch(e){console.error('native onAppGainsFocus registration failed',e)}
}
async function startNativeSong(s,requestToken){
  if(!nativeMode())return false;
  await bindNativeListeners();
  const source=nativeSource(s);
  if(!source)return false;
  const token=requestToken||playRequest;
  const stillCurrent=()=>token===playRequest&&current?.id===s.id;
  try{
    nativeTransitioning=true;
    const artwork=cover(s)?resourceUrl(cover(s),{forNative:true}):undefined;
    const meta={friendlyTitle:String(s.title||'SYNTH AUDIO'),artistName:String(s.artist||'Unknown Artist'),albumTitle:String(s.album||'SYNTH AUDIO'),artworkSource:artwork};
    // Publish the new UI/lock-screen identity before preparing audio so artwork,
    // title and progress never belong to different tracks.
    updateMediaSession(s);
    if(nativeReady){
      // Keep one native notification player alive. changeAudioSource() is the
      // plugin's supported path for changing tracks without destroy/recreate.
      try{await nativeAudio.changeMetadata({audioId:NATIVE_AUDIO_ID,...meta})}catch{}
      if(!stillCurrent()){nativeTransitioning=false;return false;}
      await nativeAudio.changeAudioSource({audioId:NATIVE_AUDIO_ID,source});
      if(!stillCurrent()){nativeTransitioning=false;return false;}
      nativeDuration=0;nativeTime=0;nativePlaying=false;
      await nativeAudio.initialize({audioId:NATIVE_AUDIO_ID});
      if(!stillCurrent()){nativeTransitioning=false;return false;}
      try{await nativeAudio.changeMetadata({audioId:NATIVE_AUDIO_ID,...meta})}catch{}
    }else{
      await nativeAudio.create({audioId:NATIVE_AUDIO_ID,audioSource:source,...meta,useForNotification:true,isBackgroundMusic:false,loop:false,showSeekBackward:true,showSeekForward:true,seekBackwardTime:10,seekForwardTime:10});
      nativeReady=true;
      nativePlaying=false;nativeTime=0;nativeDuration=0;
      if(!stillCurrent())return false;
      await nativeAudio.initialize({audioId:NATIVE_AUDIO_ID});
      if(!stillCurrent()){nativeTransitioning=false;return false;}
    }
    startNativePolling();
    await nativeAudio.play({audioId:NATIVE_AUDIO_ID});
    if(!stillCurrent()){
      nativeTransitioning=false;
      try{await nativeAudio.pause({audioId:NATIVE_AUDIO_ID})}catch{}
      return false;
    }
    nativePlaying=true;
    startListenTimer();
    updateMediaSession(s);
    updateMediaPlaybackState();
    updateMediaPosition();
    renderPlayer();
    nativeTransitioning=false;
    return true;
  }catch(e){
    console.error('SYNTH AUDIO native playback error',e);
    nativeTransitioning=false;
    if(token===playRequest){
      try{await nativeAudio.destroy({audioId:NATIVE_AUDIO_ID})}catch{}
      nativeReady=false;nativePlaying=false;nativeDuration=0;nativeTime=0;stopNativePolling();
    }
    return false;
  }
}
async function skip(seconds){
  const delta=Number(seconds)||0;
  if(nativeMode()&&nativeReady){
    try{
      const d=playbackDuration();
      const nextT=Math.max(0,Math.min(d,playbackTime()+delta));
      await nativeAudio.seek({audioId:NATIVE_AUDIO_ID,timeInSeconds:nextT});
      nativeTime=nextT;
      const f=document.querySelector('#fpcurr');if(f)f.textContent=fmt(nativeTime);
      const fp=document.querySelector('#fpseek');if(fp&&d)fp.value=nativeTime/d*100;
      updateMediaPosition();
      renderPlayer();
      updateFullPlayer(current);
      return;
    }catch{}
  }
  const d=Number(audio?.duration)||0;
  if(d>0){
    const nextT=Math.max(0,Math.min(d,(Number(audio.currentTime)||0)+delta));
    audio.currentTime=nextT;
    const f=document.querySelector('#fpcurr');if(f)f.textContent=fmt(nextT);
    const fp=document.querySelector('#fpseek');if(fp&&d)fp.value=nextT/d*100;
    const cur=document.querySelector('#cur');if(cur)cur.textContent=fmt(nextT);
    const seekEl=document.querySelector('#seek');if(seekEl&&d)seekEl.value=nextT/d*100;
    const fill=document.querySelector('.miniProgressFill');if(fill&&d)fill.style.width=(nextT/d*100)+'%';
    updateMediaPosition();
    renderPlayer();
    updateFullPlayer(current);
  }
}
let playRequest=0;
let trackEndBusy=false;
let userInitiatedPause = false;
let lastEndedSongId='';
let lastEndedAt=0;
let endedTransitionToken=0;
function handleTrackEnded(source='audio',endedId='') {
  if(!current) return;
  const now = Date.now();
  if(trackEndBusy || (now - lastEndedAt < 800)) return;
  const expectedId = String(endedId || current.id);
  if(String(current.id) !== expectedId) return;

  trackEndBusy = true;
  lastEndedSongId = expectedId;
  lastEndedAt = now;
  isTrackTransitioning = true;
  const token = ++endedTransitionToken;
  try {
    next(expectedId, token);
  } finally {
    setTimeout(() => { trackEndBusy = false; }, 800);
  }
}
let remoteNetworkUsable=true;
let publicInternetUsable=true;
let remoteProbeTimer=null;
let internetProbeTimer=null;
async function probeRemoteNetwork(){
  if(document.hidden) return remoteNetworkUsable;
  if(navigator.onLine===false){remoteNetworkUsable=false;return false}
  try{
    const r=await fetch(API_BASE+'/api/health?playbackCheck='+Date.now(),{cache:'no-store',credentials:'same-origin'});
    remoteNetworkUsable=!!r.ok;
  }catch{remoteNetworkUsable=false}
  return remoteNetworkUsable;
}
async function probePublicInternet(){
  if(document.hidden) return publicInternetUsable;
  if(navigator.onLine===false){publicInternetUsable=false;return false}
  try{await fetch('https://www.gstatic.com/generate_204?ts='+Date.now(),{mode:'no-cors',cache:'no-store'});publicInternetUsable=true}catch{publicInternetUsable=false}
  return publicInternetUsable;
}
function startRemoteNetworkProbe(){
  if(remoteProbeTimer)return;
  probeRemoteNetwork().catch(()=>{});probePublicInternet().catch(()=>{});
  remoteProbeTimer=setInterval(()=>{
    if(document.hidden)return;
    probeRemoteNetwork().catch(()=>{});
  },10000);
  internetProbeTimer=setInterval(()=>{
    if(document.hidden)return;
    probePublicInternet().catch(()=>{});
  },15000);
  window.addEventListener('online',()=>{remoteNetworkUsable=true;publicInternetUsable=true;probeRemoteNetwork().catch(()=>{});probePublicInternet().catch(()=>{})},{passive:true});
  window.addEventListener('offline',()=>{remoteNetworkUsable=false;publicInternetUsable=false},{passive:true});
}

let preloadedNextUrl='';
function preloadNextSong(){
  if(!queue.length||repeat==='one')return;
  const nextIdx=shuffle?Math.floor(Math.random()*queue.length):((qIndex+1)%queue.length);
  const nextS=queue[nextIdx];
  if(!nextS||!nextS.file)return;
  const isDownloaded=offlineIds.has(nextS.id);
  const targetSrc=isDownloaded&&offlineUrls.get(nextS.id)?offlineUrls.get(nextS.id):resourceUrl(nextS.file);
  if(targetSrc&&targetSrc!==preloadedNextUrl){
    preloadedNextUrl=targetSrc;
    // Network range prefetch only — never instantiate a second HTMLAudioElement on mobile browsers!
    try{fetch(targetSrc,{headers:{'Range':'bytes=0-131071'},cache:'default',credentials:'same-origin'}).catch(()=>{})}catch{}
  }
  try{
    const nextCover=cover(nextS);
    if(nextCover&&nextCover!==fallback){
      const nextKey=(nextS.id||'')+':'+nextCover;
      // When phone screen is locked (document.hidden), defer canvas image processing to preserve battery & prevent OS kills
      if(!document.hidden && !artworkColorCache.has(nextKey)){
        extractArtworkColors(nextCover,nextKey).catch(()=>{});
      }
    }
  }catch(e){}
}
let wakeLockSentinel=null;
async function requestWakeLock(){
  try{
    if('wakeLock' in navigator&&!wakeLockSentinel&&!document.hidden){
      wakeLockSentinel=await navigator.wakeLock.request('screen');
      wakeLockSentinel.addEventListener('release',()=>{wakeLockSentinel=null});
    }
  }catch(e){}
}
function releaseWakeLock(){
  try{if(wakeLockSentinel){wakeLockSentinel.release().catch(()=>{});wakeLockSentinel=null}}catch(e){}
}
function startSong(s){
  if(!s)return;
  const request=++playRequest;
  const isDownloaded=offlineIds.has(s.id);
  const offlineSrc=offlineUrls.get(s.id)||'';
  if(!isDownloaded && navigator.onLine===false){
    toast('This song is not downloaded. Connect to the SYNTH AUDIO server or download it first.');
    return;
  }
  const targetSrc=isDownloaded && offlineSrc ? offlineSrc : resourceUrl(s.file);
  current=s;

  nativePlaying=false;
  nativeTime=0;
  nativeDuration=0;
  stopNativePolling();

  // Synchronously update BOTH Mini Player and Full Player DOM on the same tick!
  renderPlayer();
  updateFullPlayer(s);
  applyArtworkTheme(s, request);
  updateMediaSession(s, 'playing');

  // Immediately initiate playback in the same user gesture token!
  let playPromise=null;
  if(!nativeMode()){
    startBgKeeper();
    applyVolumeToAudio();
    if(audio) audio.loop = (repeat === 'one');
    isTrackTransitioning = true;
    if(audio.src!==targetSrc){
      audio.src=targetSrc;
    } else {
      try { audio.currentTime=0; } catch {}
    }
    try{
      playPromise=audio.play();
    }catch(e){
      console.warn('Sync play error',e);
    }
  }

  // Automatic buffer recovery for continuous playback when screen is locked
  if(!nativeMode() && audio){
    const onCanPlay = () => {
      audio.removeEventListener('canplay', onCanPlay);
      if(request === playRequest && audio.paused && !userInitiatedPause){
        audio.play().catch(e => console.debug('canplay auto-resume notice', e));
      }
    };
    audio.addEventListener('canplay', onCanPlay, { once: true });
  }

  // Defer non-playback tasks to microtask so gesture token is not delayed
  queueMicrotask(()=>{
    if(request!==playRequest)return;
    if(!playbackPaused())flushListening();
    stopListenTimer();

    if(playPromise){
      playPromise.then(()=>{
        if(request!==playRequest)return;
        startListenTimer();
        updateMediaPlaybackState('playing');
        renderPlayer();
        updateFullPlayer(s);
        preloadNextSong();
      }).catch(e=>{
        if(e?.name!=='AbortError'){
          console.debug('Browser playback notice:', e);
          if(!document.hidden){
            diagnosePlaybackError(targetSrc).then(m=>toast(m)).catch(()=>toast('Tap Play to start playback'));
          }
        }
        renderPlayer();
        updateFullPlayer(s);
      });
    }

    touchRecent(s.id);
    sendEvent('play',s.id);

    if(isDownloaded && !offlineSrc){
      getOffline(s.id).then(blob=>{
        if(blob && request===playRequest){
          const url=URL.createObjectURL(blob);
          offlineUrls.set(s.id,url);
          if(!nativeMode() && audio && (audio.src===resourceUrl(s.file) || !audio.src || audio.error)){
            audio.src=url;
            audio.currentTime=0;
            audio.play().catch(e=>console.warn('Offline blob playback error',e));
          }
        }
      }).catch(()=>{});
    }

    if(nativeMode()){
      startNativeSong(s,request).then(ok=>{
        if(ok)renderPlayer();
        else toast('Native background audio could not start. The Android audio service is not ready.');
      }).catch(()=>{});
    }
  });
}
function touchRecent(id){
  const now = Date.now();
  const filtered = recent.filter(item => (typeof item === 'string' ? item !== id : item?.id !== id));
  recent = [{ id, playedAt: now }, ...filtered].slice(0, 50);
  saveUserState();
}

function getRecentlyPlayedSongs(){
  const seen = new Set();
  const list = [];
  for(const entry of recent){
    const id = typeof entry === 'string' ? entry : entry?.id;
    if(!id || seen.has(id)) continue;
    seen.add(id);
    const song = songs.find(s => s.id === id);
    if(song){
      list.push({ ...song, playedAt: typeof entry === 'object' ? entry.playedAt : undefined });
    }
  }
  return list;
}

function getRecentlyAddedSongs(limit = 12){
  return songs
    .slice()
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, limit);
}
function next(expectedEndedId='', transitionToken=0){
  if(!queue.length){
    if(songs.length){ queue = songs.slice(); qIndex = 0; }
    else return;
  }
  if(expectedEndedId && String(current?.id)!==String(expectedEndedId))return;
  if(transitionToken && transitionToken!==endedTransitionToken)return;
  if(repeat==='one'){
    if(nativeMode()&&nativeReady){
      try{nativeAudio.seek({audioId:NATIVE_AUDIO_ID,timeInSeconds:0});nativeTime=0;nativeAudio.play({audioId:NATIVE_AUDIO_ID});nativePlaying=true;startListenTimer();renderPlayer()}catch(e){console.error('Repeat-one native playback failed',e)}
    }else{try{audio.currentTime=0;audio.play().catch(()=>{});renderPlayer()}catch(e){console.error('Repeat-one playback failed',e)}}
    return;
  }
  if(shuffle){
    let n=Math.floor(Math.random()*queue.length);
    if(queue.length>1&&n===qIndex)n=(n+1)%queue.length;
    qIndex=n;
  }else{
    if(qIndex+1>=queue.length){
      if(repeat==='off' && queue.length >= songs.length){
        if(nativeMode()&&nativeReady){
          try{nativeAudio.pause({audioId:NATIVE_AUDIO_ID});nativePlaying=false}catch{}
        }else if(audio){
          audio.pause();
        }
        stopListenTimer();
        renderPlayer();
        updateMediaPlaybackState('paused');
        return;
      }
      if(queue.length < songs.length && repeat==='off'){
        queue = songs.slice();
        qIndex = (qIndex + 1) % queue.length;
      } else {
        qIndex = 0;
      }
    }else{
      qIndex++;
    }
  }
  startSong(queue[qIndex]);
}
function prev(){if(!queue.length)return;if(playbackTime()>3){skip(-999999);return}qIndex=(qIndex-1+queue.length)%queue.length;startSong(queue[qIndex])}
async function togglePlay(){if(!current)return;if(nativeMode()&&nativeReady){try{if(nativePlaying){nativePlaying=false;renderPlayer();updateFullPlayer(current);await nativeAudio.pause({audioId:NATIVE_AUDIO_ID});}else{nativePlaying=true;renderPlayer();updateFullPlayer(current);await nativeAudio.play({audioId:NATIVE_AUDIO_ID});}}catch{toast('Unable to change playback')}return}try{if(audio.paused){userInitiatedPause=false;renderPlayer();updateFullPlayer(current);await audio.play();}else{userInitiatedPause=true;audio.pause();renderPlayer();updateFullPlayer(current);}}catch{toast('Tap Play to start playback');renderPlayer();updateFullPlayer(current);}}
function seek(v){const d=playbackDuration();if(!d)return;const t=d*Number(v)/100;if(nativeMode()&&nativeReady){nativeAudio.seek({audioId:NATIVE_AUDIO_ID,timeInSeconds:t}).then(()=>{nativeTime=t;renderPlayer()}).catch(()=>{});return}audio.currentTime=t}
function cycleShuffle(){shuffle=!shuffle;toast(shuffle?'Shuffle on':'Shuffle off');renderPlayer()}
function cycleRepeat(){repeat=repeat==='off'?'all':repeat==='all'?'one':'off';if(audio)audio.loop=(repeat==='one');toast(repeat==='off'?'Repeat off':repeat==='all'?'Repeat all':'Repeat one');renderPlayer()}
function clearSleepTimer(show=true){
  if(sleepTimerId){clearTimeout(sleepTimerId);sleepTimerId=null}
  sleepTimerEndsAt=0;sleepTimerMode='';
  if(show)toast('Sleep timer cancelled');
}
async function finishSleepTimer(){
  if(sleepTimerId){clearTimeout(sleepTimerId);sleepTimerId=null}
  sleepTimerEndsAt=0;sleepTimerMode='';
  userInitiatedPause=true;
  try{
    if(nativeMode()&&nativeReady){await nativeAudio.pause({audioId:NATIVE_AUDIO_ID});nativePlaying=false}
    else if(audio){audio.pause()}
  }catch(e){console.error('Sleep timer pause failed',e)}
  stopListenTimer();renderPlayer();updateMediaPlaybackState('paused');toast('Sleep timer ended');
}
function setSleepTimer(minutes){
  const m=Number(minutes)||0;
  if(!m){clearSleepTimer(false);return toast('Sleep timer cancelled')}
  if(sleepTimerId)clearTimeout(sleepTimerId);
  sleepTimerMode=m+' min';sleepTimerEndsAt=Date.now()+m*60000;
  sleepTimerId=setTimeout(()=>finishSleepTimer(),m*60000);
  toast('Sleep timer set for '+m+' minutes');
}
function sleepTimer(){
  const d=document.createElement('div');d.className='modal';
  const remaining=sleepTimerEndsAt?Math.max(0,Math.ceil((sleepTimerEndsAt-Date.now())/60000)):0;
  d.innerHTML=`<div class="modalbox actionBox sleepTimerBox"><div class="modalTitle"><h3>Sleep timer</h3><button onclick="this.closest('.modal').remove()">${svg('close')}</button></div><p class="sub">Stop playback automatically after the selected time.</p>${remaining?`<div class="sleepTimerStatus">Active · about ${remaining} min remaining</div>`:''}<button onclick="setSleepTimer(15);this.closest('.modal').remove()">15 minutes</button><button onclick="setSleepTimer(30);this.closest('.modal').remove()">30 minutes</button><button onclick="setSleepTimer(45);this.closest('.modal').remove()">45 minutes</button><button onclick="setSleepTimer(60);this.closest('.modal').remove()">60 minutes</button><button onclick="setSleepTimer(90);this.closest('.modal').remove()">90 minutes</button>${remaining?`<button class="danger" onclick="clearSleepTimer();this.closest('.modal').remove()">Cancel timer</button>`:''}</div>`;
  document.body.appendChild(d);
}
function closeSongMenu(){
  document.querySelectorAll('.songActionDropdown, .menuOverlay').forEach(el=>el.remove());
  document.removeEventListener('keydown', handleSongMenuEscape);
  document.removeEventListener('click', handleSongMenuClickOutside);
}

function handleSongMenuEscape(e){
  if(e.key==='Escape') closeSongMenu();
}

function handleSongMenuClickOutside(e){
  const menu=document.getElementById('songActionDropdown');
  if(!menu) return;
  if(!menu.contains(e.target) && !e.target.closest('.moreBtn, .dots, .fpHeadMoreBtn, .fpMoreBtn, .fpBottomMoreBtn, [data-mini-action="more"]')){
    closeSongMenu();
  }
}

function openSongMenu(songId, anchorEl, event){
  const evt = event || window.event;
  if(evt){
    try{ evt.stopPropagation(); }catch(err){}
  }
  const existing=document.getElementById('songActionDropdown');
  if(existing){
    const wasSame = existing.dataset.songId === String(songId);
    closeSongMenu();
    if(wasSame) return;
  }
  const s = (songId ? songs.find(x => x.id === songId) : null) || current;
  if(!s) return;
  
  const isFav = favorites.has(s.id);
  const isDl = offlineIds.has(s.id);
  const isCurrent = (current && current.id === s.id);
  const isPlayingNow = isCurrent && !playbackPaused();
  const canEdit = !!(owner || ownerCandidate || (ownerEmail && user === ownerEmail));

  const isMobile = window.innerWidth <= 600;
  if(isMobile){
    const overlay = document.createElement('div');
    overlay.className = 'menuOverlay';
    overlay.onclick = closeSongMenu;
    document.body.appendChild(overlay);
  }

  const menu = document.createElement('div');
  menu.id = 'songActionDropdown';
  menu.dataset.songId = s.id;
  menu.className = 'songActionDropdown fpHeadMenuDropdown';
  menu.setAttribute('role', 'menu');

  menu.innerHTML = `
    <div class="songMenuHeader">
      <img class="songMenuThumb" src="${esc(cover(s))}" onerror="this.onerror=null;this.src=fallback" alt="">
      <div class="songMenuMeta">
        <b title="${esc(s.title)}">${esc(s.title)}</b>
        <small title="${esc(s.artist||'Unknown Artist')}">${esc(s.artist||'Unknown Artist')}${s.album ? ' · ' + esc(s.album) : ''}</small>
      </div>
      <button type="button" class="songMenuCloseBtn" onclick="closeSongMenu()" aria-label="Close menu">${svg('close')}</button>
    </div>
    <div class="fpMenuDivider"></div>
    <div class="songMenuItems">
      ${!isPlayingNow ? `<button type="button" onclick="closeSongMenu();playSong('${s.id}')"><span class="fpMenuIco">${svg('play')}</span> Play Now</button>` : ''}
      <button type="button" onclick="closeSongMenu();nextAdd('${s.id}')"><span class="fpMenuIco">${svg('next')}</span> Play Next</button>
      <button type="button" onclick="closeSongMenu();addToQueue('${s.id}')"><span class="fpMenuIco">${svg('queue')}</span> Add to Queue</button>
      <button type="button" onclick="closeSongMenu();queueView()"><span class="fpMenuIco">${svg('stats')}</span> Playback Queue</button>
      <button type="button" onclick="closeSongMenu();addToPlaylist('${s.id}')"><span class="fpMenuIco">${svg('playlist')}</span> Add to Playlist</button>
      <button type="button" onclick="closeSongMenu();toggleDownload('${s.id}')"><span class="fpMenuIco">${svg('download')}</span> ${isDl?'Remove Download':'Download Offline'}</button>
      <button type="button" onclick="closeSongMenu();showAudioOutputInfo('${s.id}')"><span class="fpMenuIco">${svg('cast')}</span> Audio Output</button>
      <button type="button" onclick="closeSongMenu();toggleFav('${s.id}')"><span class="fpMenuIco">${isFav?svg('heartFilled'):svg('heart')}</span> ${isFav?'Remove from Favorites':'Add to Favorites'}</button>
      ${isCurrent ? `<button type="button" onclick="closeSongMenu();sleepTimer()"><span class="fpMenuIco">${svg('clock')}</span> Sleep Timer</button>` : ''}
      ${canEdit ? `
      <div class="fpMenuDivider"></div>
      <button type="button" class="fpMenuAdminBtn" onclick="closeSongMenu();adminEditSong('${s.id}')"><span class="fpMenuIco">${svg('shield')}</span> Edit Song Details</button>
      <button type="button" class="fpMenuAdminBtn danger" onclick="closeSongMenu();adminDeleteSong('${s.id}')"><span class="fpMenuIco">${svg('trash')}</span> Delete Song</button>
      ` : ''}
    </div>
  `;

  document.body.appendChild(menu);

  const anchor = anchorEl || (evt?.currentTarget) || (evt?.target?.closest('button'));
  if(!isMobile){
    const menuWidth = 244;
    const menuHeight = menu.offsetHeight || 380;
    let left = Math.round(window.innerWidth / 2 - menuWidth / 2);
    let top = 180;
    if(anchor && typeof anchor.getBoundingClientRect === 'function'){
      const rect = anchor.getBoundingClientRect();
      left = rect.right - menuWidth;
      if(left < 12) left = 12;
      if(left + menuWidth > window.innerWidth - 12) left = window.innerWidth - menuWidth - 12;
      
      top = rect.bottom + 6;
      if(top + menuHeight > window.innerHeight - 12 && rect.top > menuHeight + 12){
        top = rect.top - menuHeight - 6;
      }
      if(top < 12) top = 12;
      if(top + menuHeight > window.innerHeight - 12) {
        top = Math.max(12, window.innerHeight - menuHeight - 12);
      }
    }
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';
    menu.style.right = 'auto';
    menu.style.bottom = 'auto';
    menu.style.position = 'fixed';
  }

  document.addEventListener('keydown', handleSongMenuEscape);
  setTimeout(()=>{
    document.addEventListener('click', handleSongMenuClickOutside);
  }, 40);
}

function musicMore(id, anchorEl, event){
  const evt = event || window.event;
  const anchor = anchorEl || (evt?.currentTarget) || (evt?.target?.closest('button'));
  openSongMenu(id || current?.id, anchor, evt);
}

function queueView(){const d=document.createElement('div');d.className='modal';d.innerHTML=`<div class="modalbox queueBox"><div class="modalTitle"><h3>Queue</h3><button onclick="this.closest('.modal').remove()">${svg('close')}</button></div><div class="queueList">${queue.map((s,i)=>`<button class="queueItem ${i===qIndex?'current':''}" onclick="startFromQueue(${i});this.closest('.modal').remove()"><img src="${esc(cover(s))}"><span class="grow"><b>${esc(s.title)}</b><small>${esc(s.artist)}</small></span>${i===qIndex?'<em>Playing</em>':''}</button>`).join('')||'<p class="sub">Queue is empty.</p>'}</div></div>`;document.body.appendChild(d);
document.body.classList.add('fullPlayerOpen');
}
function startFromQueue(i){if(!queue[i])return;qIndex=i;startSong(queue[i])}
function addToQueue(id){const s=songs.find(x=>x.id===id);if(s){queue.push(s);toast('Added to queue');renderPlayer()}}
function nextAdd(id){const s=songs.find(x=>x.id===id);if(s){if(!queue.length){queue=[s];qIndex=0}else queue.splice(Math.min(qIndex+1,queue.length),0,s);toast('Added to play next');renderPlayer()}}
function more(id, anchorEl, event){
  const evt = event || window.event;
  const anchor = anchorEl || (evt?.currentTarget) || (evt?.target?.closest('button'));
  openSongMenu(id, anchor, evt);
}

function renderSongActionSheet(s, isCurrentTrack=false){
  if(!s)return;
  openSongMenu(s.id);
}

function toggleMiniMore(){
  const p=document.querySelector('#player .compactMini');
  if(!p)return;
  const open=p.classList.toggle('moreOpen');
  p.querySelector('[data-mini-action=\"more\"]')?.setAttribute('aria-expanded',open?'true':'false');
}

function bindMiniPlayerEvents(){
  const host=$('#player');if(!host)return;
  if(host.__miniBound)return;
  host.__miniBound=true;
  host.addEventListener('click',async e=>{
    const el=e.target.closest('[data-mini-action]');
    if(!el||!host.contains(el))return;
    e.preventDefault();e.stopPropagation();
    const action=el.dataset.miniAction;
    try{
      if(action==='full-player'){fullPlayer();return}
      if(action==='prev'){await prev();return}
      if(action==='rewind'){await skip(-10);return}
      if(action==='toggle-play'){await togglePlay();return}
      if(action==='forward'){await skip(10);return}
      if(action==='next'){await next();return}
      if(action==='sync'){await fastSync();return}
      if(action==='more'){toggleMiniMore(current?.id);return}
    }catch(err){console.error('Mini-player action failed',err);toast('Action failed')}
  },{passive:false});
  host.addEventListener('click',async e=>{
    const el=e.target.closest('[data-mini-more]');
    if(!el||!host.contains(el))return;
    e.preventDefault();e.stopPropagation();
    const action=el.dataset.miniMore;
    try{
      if(action==='favorite'){toggleFav(current.id);toggleMiniMore(current.id);return}
      if(action==='download'){await toggleDownload(current.id);toggleMiniMore(current.id);return}
      if(action==='playlist'){await addToPlaylist(current.id);toggleMiniMore(current.id);return}
      if(action==='fullplayer'){fullPlayer();toggleMiniMore(current.id);return}
      if(action==='next'){nextAdd(current.id);toggleMiniMore(current.id);return}
    }catch(err){console.error('Mini more action failed',err);toast('Action failed')}
  },{passive:false});

  host.addEventListener('input',e=>{
    const el=e.target.closest('[data-mini-action="seek"]');
    if(!el||!host.contains(el))return;
    e.stopPropagation();
    const fill=host.querySelector('.miniProgressFill');
    if(fill) fill.style.width=el.value+'%';
    seek(el.value);
  },{passive:true});
  host.addEventListener('keydown',e=>{
    const el=e.target.closest('[data-mini-action="full-player"]');
    if(el&&(e.key==='Enter'||e.key===' ')){e.preventDefault();fullPlayer();}
  });
}

function hasOfflineSync(id){return offlineIds.has(id)}


function saveServerUrl(){const v=normalizeServerUrl($('#serverUrlInput')?.value);if(!v)return toast('Enter a valid http:// or https:// server address');localStorage.setItem('synthServerUrl',v);toast('Server address saved. Reloading…');setTimeout(()=>location.reload(),150)}

function toggleFav(id){favorites.has(id)?favorites.delete(id):favorites.add(id);saveUserState();render();toast(favorites.has(id)?'Added to favorites':'Removed from favorites')}
function previewPlaylistArtwork(files){
  const f=files?.[0];if(!f)return;
  const r=new FileReader();
  r.onload=()=>{
    const p=$('#artPreviewImg'),w=$('#artPreviewWrap'),prompt=$('#artUploadPrompt');
    if(p&&w&&prompt){p.src=r.result;w.classList.remove('hidden');prompt.classList.add('hidden')}
  };
  r.readAsDataURL(f);
}
function clearPlaylistArtwork(e){
  e?.stopPropagation();
  const input=$('#newPlaylistImage'),p=$('#artPreviewImg'),w=$('#artPreviewWrap'),prompt=$('#artUploadPrompt');
  if(input)input.value='';
  if(p)p.src='';
  if(w)w.classList.add('hidden');
  if(prompt)prompt.classList.remove('hidden');
}
async function newPlaylist(){
  const d=document.createElement('div');
  d.className='modal playlistCreateModal';
  d.innerHTML=`<div class="modalbox formBox playlistModalBox">
    <div class="modalTitle">
      <div class="modalIconTitle">
        <div class="modalHeaderBadge">${svg('playlist')}</div>
        <div>
          <h3>Create Playlist</h3>
          <p class="modalSubtitle">Create a custom collection for your music</p>
        </div>
      </div>
      <button class="modalClose" onclick="this.closest('.modal').remove()" aria-label="Close">${svg('close')}</button>
    </div>
    <div class="playlistInputWrap">
      <label class="fieldLabel">Playlist Name</label>
      <input id="newPlaylistName" class="field playlistNameField" placeholder="e.g. Favorites, Gym Energy, Roadtrip..." maxlength="80" autocomplete="off">
    </div>
    <div class="artworkPickerGroup">
      <label class="fieldLabel">Cover Artwork <span class="optional">optional</span></label>
      <div class="artUploadZone" id="artDropZone" onclick="$('#newPlaylistImage').click()">
        <div id="artPreviewWrap" class="artPreviewWrap hidden"><img id="artPreviewImg" src="" alt="Preview"><button type="button" class="removeArtBtn" onclick="clearPlaylistArtwork(event)" title="Remove image">${svg('close')}</button></div>
        <div id="artUploadPrompt" class="artUploadPrompt">
          <div class="uploadIconSmall">${svg('upload')}</div>
          <span>Choose image or click to browse</span>
          <small>Optional custom cover art</small>
        </div>
        <input id="newPlaylistImage" type="file" accept="image/*" hidden onchange="previewPlaylistArtwork(this.files)">
      </div>
    </div>
    <div class="modalActions">
      <button class="secondary" type="button" onclick="this.closest('.modal').remove()">Cancel</button>
      <button class="primary playlistSubmitBtn" onclick="createPlaylistFromForm()">${svg('playlist')} Create playlist</button>
    </div>
  </div>`;
  document.body.appendChild(d);
  setTimeout(()=>$('#newPlaylistName')?.focus(),80);
}
let playlistCreateBusy=false;
async function createPlaylistFromForm(){
  if(playlistCreateBusy)return;
  const name=$('#newPlaylistName')?.value.trim();
  if(!name)return toast('Enter a playlist name');
  playlistCreateBusy=true;
  const btn=document.querySelector('.formBox .primary');
  if(btn){btn.disabled=true;btn.textContent='Creating…'}
  let image='';
  const f=$('#newPlaylistImage')?.files?.[0];
  try{
    if(f)image=await fileData(f);
    const tempId='local-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);
    const tempPl={id:tempId,name,image,songIds:[],createdAt:new Date().toISOString(),userEmail:user};
    playlists=[tempPl,...playlists.filter(x=>x.id!==tempId)];
    savePlaylistsState();
    document.querySelector('.modal')?.remove();
    page='playlists';
    render();
    go('playlist:'+tempId);
    try{
      const p=await api('/api/playlists',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,image,clientRequestId:makeId()})});
      if(p?.id){
        playlists=playlists.map(x=>x.id===tempId?p:x);
        savePlaylistsState();
        render();
        go('playlist:'+p.id);
      }
    }catch(err){console.warn('Playlist server sync warning, preserved in local storage:',err)}
    toast('Playlist created');
  }catch(e){
    console.error('Playlist creation error:',e);
    toast(e.message||'Could not create playlist');
  }finally{
    playlistCreateBusy=false;
    if(btn){btn.disabled=false;btn.textContent='Create playlist'}
  }
}
async function renamePlaylist(id){
  const name=$('#playlistName')?.value.trim();
  if(!name)return toast('Playlist name cannot be empty');
  playlists=playlists.map(p=>p.id===id?{...p,name}:p);
  savePlaylistsState();
  render();
  try{
    const updated=await api('/api/playlists/'+id,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({name})});
    if(updated?.id){
      playlists=playlists.map(p=>p.id===id?updated:p);
      savePlaylistsState();
    }
    toast('Playlist renamed');
  }catch(e){
    toast(e.message||'Could not rename playlist');
  }
}
async function changePlaylistArtwork(id){const d=document.createElement('div');d.className='modal';d.innerHTML=`<div class="modalbox formBox"><div class="modalTitle"><h3>Playlist artwork</h3><button onclick="this.closest('.modal').remove()">${svg('close')}</button></div><input id="artFile" type="file" accept="image/*" class="field"><button class="primary wide" onclick="savePlaylistArtwork('${id}')">Save artwork</button></div>`;document.body.appendChild(d)}
async function savePlaylistArtwork(id){
  const f=$('#artFile')?.files?.[0];
  if(!f)return toast('Choose an image');
  try{
    const image=await fileData(f);
    playlists=playlists.map(p=>p.id===id?{...p,image}:p);
    savePlaylistsState();
    document.querySelector('.modal')?.remove();
    render();
    const updated=await api('/api/playlists/'+id,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({image})});
    if(updated?.id){
      playlists=playlists.map(p=>p.id===id?updated:p);
      savePlaylistsState();
    }
    toast('Artwork updated');
  }catch(e){
    toast(e.message||'Could not update artwork');
  }
}
async function deletePlaylist(id){
  if(!confirm('Delete this playlist?'))return;
  playlists=playlists.filter(p=>p.id!==id);
  savePlaylistsState();
  go('playlists');
  try{
    await api('/api/playlists/'+id,{method:'DELETE'});
    toast('Playlist deleted');
  }catch(e){
    toast(e.message||'Could not delete playlist');
  }
}
function playPlaylist(id){const p=playlists.find(x=>x.id===id);if(!p)return;playCollection(p.songIds||[])}
function shufflePlaylist(id){const p=playlists.find(x=>x.id===id);if(!p)return;shuffleCollection(p.songIds||[])}
function addAllToQueue(id){const p=playlists.find(x=>x.id===id);if(!p)return;queue.push(...(p.songIds||[]).map(x=>songs.find(s=>s.id===x)).filter(Boolean));toast('Playlist added to queue')}
async function addToPlaylist(id){
  const s=songs.find(x=>x.id===id);
  const d=document.createElement('div');
  d.className='modal playlistPickerModal';
  const playlistItems=playlists.map(p=>{
    const has=(p.songIds||[]).includes(id);
    const coverSong=songs.find(x=>p.songIds?.includes(x.id));
    const pCover=p.image||cover(coverSong||{});
    return `<button type="button" class="playlistPickRow ${has?'inPlaylist':''}" onclick="${has?`removeSongFromPlaylist('${p.id}','${id}')`:`addSongToPlaylist('${p.id}','${id}')`};this.closest('.modal').remove()">
      <img class="playlistPickThumb" src="${esc(pCover)}" onerror="this.onerror=null;this.src=fallback" alt="">
      <div class="playlistPickMeta">
        <b>${esc(p.name)}</b>
        <small>${(p.songIds||[]).length} song${(p.songIds||[]).length===1?'':'s'}</small>
      </div>
      <span class="playlistPickBadge ${has?'removeBadge':'addBadge'}">${has?'✓ Added':'+ Add'}</span>
    </button>`;
  }).join('');

  d.innerHTML=`<div class="modalbox actionBox playlistPickerBox">
    <div class="modalTitle">
      <div class="modalIconTitle">
        <div class="modalHeaderBadge">${svg('playlist')}</div>
        <div>
          <h3>Add to Playlist</h3>
          <p class="modalSubtitle">${s?esc(s.title):'Choose playlist'}</p>
        </div>
      </div>
      <button class="modalClose" onclick="this.closest('.modal').remove()" aria-label="Close">${svg('close')}</button>
    </div>
    <button type="button" class="actionOptionBtn createNewPlaylistQuickBtn" onclick="this.closest('.modal').remove();newPlaylist()">
      <span class="optBadge badgeNewPlaylist">＋</span>
      <div class="optText"><b>Create New Playlist</b><small>Create empty collection and add track</small></div>
    </button>
    <div class="playlistPickList">
      ${playlistItems || '<p class="sub emptyText">No playlists yet. Create your first playlist above!</p>'}
    </div>
  </div>`;
  document.body.appendChild(d);
}
async function removeSongFromPlaylist(pid,sid){
  const p=playlists.find(x=>x.id===pid);
  if(!p)return;
  const nextIds=(p.songIds||[]).filter(x=>x!==sid);
  playlists=playlists.map(x=>x.id===pid?{...x,songIds:nextIds}:x);
  savePlaylistsState();
  render();
  try{
    const updated=await api('/api/playlists/'+pid,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({songIds:nextIds})});
    if(updated?.id){
      playlists=playlists.map(x=>x.id===pid?updated:x);
      savePlaylistsState();
    }
    toast('Removed from playlist');
  }catch(e){
    toast(e.message||'Could not update playlist');
  }
}
async function addSongToPlaylist(pid,sid){
  const p=playlists.find(x=>x.id===pid);
  if(!p)return;
  const nextIds=[...(p.songIds||[])];
  if(nextIds.includes(sid))return toast('Song is already in this playlist');
  nextIds.push(sid);
  playlists=playlists.map(x=>x.id===pid?{...x,songIds:nextIds}:x);
  savePlaylistsState();
  render();
  try{
    const updated=await api('/api/playlists/'+pid,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({songIds:nextIds})});
    if(updated?.id){
      playlists=playlists.map(x=>x.id===pid?updated:x);
      savePlaylistsState();
    }
    toast('Added to playlist');
  }catch(e){
    toast(e.message||'Could not update playlist');
  }
}
async function downloadSong(id){
  const s=songs.find(x=>x.id===id);
  if(!s)return;
  if(offlineIds.has(id))return toast('Already saved offline in app');
  const btn=document.querySelector(`.downloadBtn[onclick*="${id}"]`);
  if(btn)btn.disabled=true;
  toast('Saving inside app…');
  try{
    let r=await fetch('/api/songs/'+encodeURIComponent(id)+'/download',{cache:'no-store'});
    if(!r.ok){r=await fetch(resourceUrl(s.file),{cache:'no-store',credentials:'same-origin'})}
    if(!r.ok)throw Error('Server returned '+r.status);
    const ct=r.headers.get('content-type')||'';
    if(ct.includes('html')||ct.includes('json'))throw Error('Invalid audio response received');
    const b=await r.blob();
    if(b.size<1024)throw Error('Empty audio file');
    let offlineCover=s.cover||'';
    try{
      const cUrl=cover(s);
      if(cUrl && !cUrl.startsWith('data:') && cUrl!==fallback){
        const cr=await fetch(cUrl,{cache:'force-cache'}).catch(()=>null);
        if(cr&&cr.ok){
          const cb=await cr.blob();
          if(cb.size>0&&cb.size<2*1024*1024){
            offlineCover=await new Promise(res=>{const fr=new FileReader();fr.onload=()=>res(fr.result);fr.onerror=()=>res('');fr.readAsDataURL(cb)});
          }
        }
      }
    }catch{}
    const offlineSong={...s,cover:offlineCover||s.cover};
    await putOffline(id,b,{song:offlineSong,downloadedAt:Date.now()});
    const cached=await getOffline(id);
    if(!cached)throw Error('Offline storage write failed');
    if(offlineUrls.has(id))URL.revokeObjectURL(offlineUrls.get(id));
    offlineUrls.set(id,URL.createObjectURL(cached));
    offlineIds.add(id);
    offlineDownloadCount=offlineIds.size;
    sendEvent('download',id);
    toast('Saved inside app: ready for offline playback');
    render();
  }catch(e){
    console.error('In-app offline save failed',e);
    const msg=String(e?.name||'').includes('Quota')||/storage/i.test(String(e?.message||''))?'Storage full: remove an offline track to free space.':String(e?.message||'').includes('404')?'Song file is missing on the server.':'Failed to save song inside the app.';
    toast(msg);
  }finally{
    if(btn)btn.disabled=false;
  }
}
async function toggleDownload(id){if(await hasOffline(id)){await deleteOffline(id);offlineIds.delete(id);offlineDownloadCount=offlineIds.size;sendEvent('download_removed',id);toast('Removed from downloads');render();return}return downloadSong(id)}
function fileData(f){return new Promise((res,rej)=>{if(!f)return res('');const img=new Image();const r=new FileReader();r.onload=()=>{img.onload=()=>{const max=900,scale=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.width*scale));c.height=Math.max(1,Math.round(img.height*scale));const ctx=c.getContext('2d');ctx.drawImage(img,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.82))};img.onerror=rej;img.src=r.result};r.onerror=rej;r.readAsDataURL(f)})}


// --- Aurora Flow + Editorial Luxury Appearance State ---
let themePreference = localStorage.getItem('synthThemePreference:'+user) || localStorage.getItem('synthThemePreference') || 'aubergine';
let accentColor = localStorage.getItem('synthAccentColor:'+user) || localStorage.getItem('synthAccentColor') || 'plum';
let auroraGlow = (localStorage.getItem('synthAuroraGlow:'+user) || localStorage.getItem('synthAuroraGlow')) !== 'false';

function applyTheme(){
  try{
    document.documentElement.setAttribute('data-theme', themePreference);
    document.body.setAttribute('data-theme', themePreference);
    document.body.classList.toggle('auroraGlow-off', !auroraGlow);
  }catch(e){}
}
applyTheme();

function setAppTheme(theme){
  themePreference = String(theme||'aubergine');
  localStorage.setItem('synthThemePreference', themePreference);
  if(user) localStorage.setItem('synthThemePreference:'+user, themePreference);
  applyTheme();
  saveUserState();
  if(page==='settings') renderPage();
  const label = theme==='burgundy'?'Burgundy Velvet':theme==='indigo'?'Subdued Indigo':theme==='plum-noir'?'Plum Noir':'Aubergine Midnight';
  toast('Theme set: ' + label);
}

function toggleAuroraGlow(){
  auroraGlow = !auroraGlow;
  localStorage.setItem('synthAuroraGlow', String(auroraGlow));
  if(user) localStorage.setItem('synthAuroraGlow:'+user, String(auroraGlow));
  applyTheme();
  if(page==='settings') renderPage();
  toast(auroraGlow ? 'Atmospheric Aurora Glow on' : 'Atmospheric Aurora Glow off');
}

let dynamicMiniColors = localStorage.getItem('synthDynamicMiniColors') !== 'false';
const artworkColorCache = new Map();
try {
  const savedThemes = JSON.parse(localStorage.getItem('synthArtworkThemes') || '{}');
  Object.entries(savedThemes).forEach(([k, v]) => artworkColorCache.set(k, v));
} catch {}

function saveArtworkThemeToCache(key, theme) {
  if (!key || !theme) return;
  artworkColorCache.set(key, theme);
  try {
    const keys = Array.from(artworkColorCache.keys()).slice(-50);
    const obj = {};
    keys.forEach(k => { obj[k] = artworkColorCache.get(k); });
    localStorage.setItem('synthArtworkThemes', JSON.stringify(obj));
  } catch {}
}

function getDefaultThemeColors(themeName) {
  const t = themeName || themePreference || 'aubergine';
  switch (t) {
    case 'burgundy':
      return {
        bg: 'linear-gradient(180deg, rgba(106, 44, 62, 0.22) 0%, rgba(12, 13, 18, 0.98) 100%)',
        border: 'rgba(106, 44, 62, 0.30)',
        glow: 'rgba(106, 44, 62, 0.18)',
        accent: 'rgb(106, 44, 62)',
        accentLight: 'rgb(142, 62, 85)',
        playBg: 'linear-gradient(135deg, rgb(106, 44, 62) 0%, rgb(80, 32, 46) 100%)',
        playShadow: '0 4px 14px rgba(106, 44, 62, 0.25)',
        fpBg: 'radial-gradient(ellipse 90% 70% at 50% 18%, rgba(106, 44, 62, 0.28) 0%, rgba(42, 18, 26, 0.18) 48%, #08090d 86%), #08090d',
        fpGlow: 'rgba(106, 44, 62, 0.22)',
        rawRgb: [106, 44, 62]
      };
    case 'indigo':
      return {
        bg: 'linear-gradient(180deg, rgba(76, 85, 132, 0.22) 0%, rgba(12, 13, 18, 0.98) 100%)',
        border: 'rgba(76, 85, 132, 0.30)',
        glow: 'rgba(76, 85, 132, 0.18)',
        accent: 'rgb(76, 85, 132)',
        accentLight: 'rgb(102, 114, 172)',
        playBg: 'linear-gradient(135deg, rgb(76, 85, 132) 0%, rgb(56, 62, 98) 100%)',
        playShadow: '0 4px 14px rgba(76, 85, 132, 0.25)',
        fpBg: 'radial-gradient(ellipse 90% 70% at 50% 18%, rgba(76, 85, 132, 0.28) 0%, rgba(28, 32, 54, 0.18) 48%, #08090d 86%), #08090d',
        fpGlow: 'rgba(76, 85, 132, 0.22)',
        rawRgb: [76, 85, 132]
      };
    case 'plum-noir':
      return {
        bg: 'linear-gradient(180deg, rgba(125, 59, 102, 0.22) 0%, rgba(12, 13, 18, 0.98) 100%)',
        border: 'rgba(125, 59, 102, 0.30)',
        glow: 'rgba(125, 59, 102, 0.18)',
        accent: 'rgb(125, 59, 102)',
        accentLight: 'rgb(162, 78, 132)',
        playBg: 'linear-gradient(135deg, rgb(125, 59, 102) 0%, rgb(92, 42, 75) 100%)',
        playShadow: '0 4px 14px rgba(125, 59, 102, 0.25)',
        fpBg: 'radial-gradient(ellipse 90% 70% at 50% 18%, rgba(125, 59, 102, 0.28) 0%, rgba(48, 22, 39, 0.18) 48%, #08090d 86%), #08090d',
        fpGlow: 'rgba(125, 59, 102, 0.22)',
        rawRgb: [125, 59, 102]
      };
    case 'aubergine':
    default:
      return {
        bg: 'linear-gradient(180deg, rgba(99, 45, 81, 0.22) 0%, rgba(12, 13, 18, 0.98) 100%)',
        border: 'rgba(99, 45, 81, 0.30)',
        glow: 'rgba(99, 45, 81, 0.18)',
        accent: 'rgb(99, 45, 81)',
        accentLight: 'rgb(132, 60, 108)',
        playBg: 'linear-gradient(135deg, rgb(99, 45, 81) 0%, rgb(72, 32, 59) 100%)',
        playShadow: '0 4px 14px rgba(99, 45, 81, 0.25)',
        fpBg: 'radial-gradient(ellipse 90% 70% at 50% 18%, rgba(99, 45, 81, 0.28) 0%, rgba(38, 17, 31, 0.18) 48%, #08090d 86%), #08090d',
        fpGlow: 'rgba(99, 45, 81, 0.22)',
        rawRgb: [99, 45, 81]
      };
  }
}

function toggleDynamicMiniColors(){
  dynamicMiniColors = !dynamicMiniColors;
  localStorage.setItem('synthDynamicMiniColors', String(dynamicMiniColors));
  applyMiniTheme(current);
  if(page==='settings')render();
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function getMiniThemeInlineStyle(song) {
  if (!dynamicMiniColors || !song) return '';
  const cacheKey = (song.id || '') + ':' + (cover(song) || '');
  const cached = artworkColorCache.get(cacheKey) || getDefaultThemeColors(themePreference);
  return `--mini-bg:${cached.bg};--mini-border:${cached.border};--mini-glow:${cached.glow};--mini-accent:${cached.accent};--mini-play-bg:${cached.playBg};--mini-play-shadow:${cached.playShadow};`;
}

function getFullPlayerThemeInlineStyle(song) {
  if (!dynamicMiniColors || !song) return '';
  const cacheKey = (song.id || '') + ':' + (cover(song) || '');
  const cached = artworkColorCache.get(cacheKey) || getDefaultThemeColors(themePreference);
  return `--fp-bg:${cached.fpBg};--fp-glow:${cached.fpGlow};--fp-accent:${cached.accent};--fp-accent-light:${cached.accentLight};--fp-play-bg:${cached.playBg};--fp-play-shadow:${cached.playShadow};`;
}

function extractArtworkColors(src, cacheKey) {
  return new Promise((resolve) => {
    if (!src || src === fallback) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = 32;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) { resolve(null); return; }
        ctx.drawImage(img, 0, 0, size, size);
        const imgData = ctx.getImageData(0, 0, size, size).data;

        // Collect colors and compute vibrant representative palette
        const bins = Array.from({ length: 16 }, () => ({ count: 0, r: 0, g: 0, b: 0, sTotal: 0, lTotal: 0 }));
        let totalValid = 0;
        let avgR = 0, avgG = 0, avgB = 0;
        let totalSaturation = 0;

        for (let i = 0; i < imgData.length; i += 4) {
          const a = imgData[i + 3];
          if (a < 180) continue;
          const r = imgData[i], g = imgData[i + 1], b = imgData[i + 2];
          const [h, s, l] = rgbToHsl(r, g, b);

          avgR += r; avgG += g; avgB += b;
          totalValid++;
          totalSaturation += s;

          if (l < 10 || l > 92) continue;
          if (s < 8) continue;

          const binIdx = Math.min(15, Math.floor(h / 22.5));
          const weight = 1 + (s / 40) + (1 - Math.abs(l - 50) / 50);
          bins[binIdx].count += weight;
          bins[binIdx].r += r * weight;
          bins[binIdx].g += g * weight;
          bins[binIdx].b += b * weight;
          bins[binIdx].sTotal += s * weight;
          bins[binIdx].lTotal += l * weight;
        }

        let bestBin = null;
        let maxCount = 0;
        for (const bin of bins) {
          if (bin.count > maxCount) {
            maxCount = bin.count;
            bestBin = bin;
          }
        }

        let chosenRgb;
        if (!bestBin || maxCount < 2 || (totalValid && (totalSaturation / totalValid) < 10)) {
          // Monochromatic or dark artwork: elegant deep plum
          chosenRgb = [110, 52, 92];
        } else {
          const rawR = Math.round(bestBin.r / bestBin.count);
          const rawG = Math.round(bestBin.g / bestBin.count);
          const rawB = Math.round(bestBin.b / bestBin.count);
          const [h, s, l] = rgbToHsl(rawR, rawG, rawB);
          // Preserve genuine hue but clamp saturation and lightness to luxurious cinematic bounds
          const tunedS = Math.max(22, Math.min(55, s));
          const tunedL = Math.max(26, Math.min(48, l));
          chosenRgb = hslToRgb(h, tunedS, tunedL);
        }

        const [ar, ag, ab] = chosenRgb;
        // Secondary complement color for multi-layered cinematic gradients
        const [h2] = rgbToHsl(ar, ag, ab);
        const [sr, sg, sb] = hslToRgb((h2 + 45) % 360, 30, 24);

        const theme = {
          // Mini Player: sleek translucent glass with subtle track accent
          bg: `linear-gradient(180deg, rgba(${ar}, ${ag}, ${ab}, 0.20) 0%, rgba(14, 15, 22, 0.94) 100%)`,
          border: `rgba(${ar}, ${ag}, ${ab}, 0.26)`,
          glow: `rgba(${ar}, ${ag}, ${ab}, 0.20)`,
          accent: `rgb(${ar}, ${ag}, ${ab})`,
          accentLight: `rgb(${Math.min(255, Math.round(ar * 1.25))}, ${Math.min(255, Math.round(ag * 1.25))}, ${Math.min(255, Math.round(ab * 1.25))})`,
          playBg: `linear-gradient(135deg, rgb(${ar}, ${ag}, ${ab}) 0%, rgb(${Math.round(ar * 0.7)}, ${Math.round(ag * 0.7)}, ${Math.round(ab * 0.7)}) 100%)`,
          playShadow: `0 4px 14px rgba(${ar}, ${ag}, ${ab}, 0.35)`,
          // Full Player: Movie-style cinematic backdrop variables
          fpBg: `radial-gradient(ellipse 90% 65% at 50% 15%, rgba(${ar}, ${ag}, ${ab}, 0.42) 0%, rgba(${sr}, ${sg}, ${sb}, 0.22) 55%, #07080b 90%), #07080b`,
          fpGlow: `rgba(${ar}, ${ag}, ${ab}, 0.32)`,
          rawRgb: [ar, ag, ab]
        };

        if (cacheKey) saveArtworkThemeToCache(cacheKey, theme);
        resolve(theme);
      } catch (err) {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function applyArtworkTheme(song, generation) {
  if (!song) return;
  const miniEl = document.querySelector('.bottom.appleMini.compactMini');
  const fpEl = document.querySelector('.fullplayer');
  if (!miniEl && !fpEl) return;

  if (!dynamicMiniColors) {
    if (miniEl) {
      miniEl.style.removeProperty('--mini-bg');
      miniEl.style.removeProperty('--mini-border');
      miniEl.style.removeProperty('--mini-glow');
      miniEl.style.removeProperty('--mini-accent');
      miniEl.style.removeProperty('--mini-play-bg');
      miniEl.style.removeProperty('--mini-play-shadow');
    }
    if (fpEl) {
      fpEl.style.removeProperty('--fp-bg');
      fpEl.style.removeProperty('--fp-glow');
      fpEl.style.removeProperty('--fp-accent');
      fpEl.style.removeProperty('--fp-accent-light');
      fpEl.style.removeProperty('--fp-play-bg');
      fpEl.style.removeProperty('--fp-play-shadow');
    }
    return;
  }

  const cacheKey = (song.id || '') + ':' + (cover(song) || '');
  const cached = artworkColorCache.get(cacheKey);
  const activeTheme = cached || getDefaultThemeColors(themePreference);

  // Synchronously apply active theme (either cached or default) so old song's colors NEVER linger!
  if (miniEl) {
    miniEl.style.setProperty('--mini-bg', activeTheme.bg);
    miniEl.style.setProperty('--mini-border', activeTheme.border);
    miniEl.style.setProperty('--mini-glow', activeTheme.glow);
    miniEl.style.setProperty('--mini-accent', activeTheme.accent);
    miniEl.style.setProperty('--mini-play-bg', activeTheme.playBg);
    miniEl.style.setProperty('--mini-play-shadow', activeTheme.playShadow);
  }
  if (fpEl) {
    fpEl.style.setProperty('--fp-bg', activeTheme.fpBg);
    fpEl.style.setProperty('--fp-glow', activeTheme.fpGlow);
    fpEl.style.setProperty('--fp-accent', activeTheme.accent);
    fpEl.style.setProperty('--fp-accent-light', activeTheme.accentLight);
    fpEl.style.setProperty('--fp-play-bg', activeTheme.playBg);
    fpEl.style.setProperty('--fp-play-shadow', activeTheme.playShadow);
  }

  if (cached) return;

  // When phone is locked, defer heavy Canvas pixel analysis to preserve battery and prevent OS kills
  if (document.hidden) return;
  const coverUrl = cover(song);
  if (!coverUrl || coverUrl === fallback) return;

  extractArtworkColors(coverUrl, cacheKey).then(theme => {
    if (generation !== undefined && generation !== playRequest) return;
    if (!current || current.id !== song.id) return;
    const finalTheme = theme || getDefaultThemeColors(themePreference);
    const targetMini = document.querySelector('.bottom.appleMini.compactMini');
    const targetFp = document.querySelector('.fullplayer');
    if (targetMini) {
      targetMini.style.setProperty('--mini-bg', finalTheme.bg);
      targetMini.style.setProperty('--mini-border', finalTheme.border);
      targetMini.style.setProperty('--mini-glow', finalTheme.glow);
      targetMini.style.setProperty('--mini-accent', finalTheme.accent);
      targetMini.style.setProperty('--mini-play-bg', finalTheme.playBg);
      targetMini.style.setProperty('--mini-play-shadow', finalTheme.playShadow);
    }
    if (targetFp) {
      targetFp.style.setProperty('--fp-bg', finalTheme.fpBg);
      targetFp.style.setProperty('--fp-glow', finalTheme.fpGlow);
      targetFp.style.setProperty('--fp-accent', finalTheme.accent);
      targetFp.style.setProperty('--fp-accent-light', finalTheme.accentLight);
      targetFp.style.setProperty('--fp-play-bg', finalTheme.playBg);
      targetFp.style.setProperty('--fp-play-shadow', finalTheme.playShadow);
    }
  });
}

function applyMiniTheme(song, miniEl) {
  applyArtworkTheme(song, playRequest);
}

function renderPlayer(){
  const p=$('#player');
  if(!p)return;
  if(!current){p.innerHTML='';return}
  const d=playbackDuration(),t=playbackTime(),pct=d?t/d*100:0,paused=playbackPaused();
  updateMediaPlaybackState();
  updateMediaPosition();
  const isFav = favorites.has(current.id);
  const isDl = offlineIds.has(current.id);

  const existingRoot = p.querySelector('.bottom.appleMini.compactMini');
  if(existingRoot){
    const fill = existingRoot.querySelector('.miniProgressFill');
    if(fill) fill.style.width = pct + '%';
    const seekInput = existingRoot.querySelector('#seek');
    if(seekInput && document.activeElement !== seekInput) seekInput.value = pct;
    
    const artImg = existingRoot.querySelector('.miniart');
    const targetCover = cover(current);
    if(artImg && (artImg.dataset.coverUrl !== targetCover || artImg.dataset.songId !== current.id)){
      artImg.dataset.songId = current.id;
      artImg.dataset.coverUrl = targetCover;
      artImg.classList.add('artLoading');
      artImg.onload = () => artImg.classList.remove('artLoading');
      artImg.onerror = () => { artImg.classList.remove('artLoading'); artImg.src = fallback; };
      artImg.src = targetCover;
      artImg.alt = current.title;
    }
    const pulse = existingRoot.querySelector('.miniPulse');
    if(pulse){
      pulse.className = 'miniPulse ' + (paused ? 'paused' : 'playing');
    }
    const titleEl = existingRoot.querySelector('.miniCopy .title');
    if(titleEl && titleEl.textContent !== current.title){
      titleEl.textContent = current.title;
      titleEl.title = current.title;
    }
    const metaEl = existingRoot.querySelector('.miniCopy .meta');
    const artistStr = current.artist || 'Unknown Artist';
    if(metaEl && metaEl.textContent !== artistStr){
      metaEl.textContent = artistStr;
      metaEl.title = artistStr;
    }
    const playBtn = existingRoot.querySelector('.bigplay');
    if(playBtn){
      playBtn.title = paused ? 'Play' : 'Pause';
      playBtn.setAttribute('aria-label', paused ? 'Play' : 'Pause');
      playBtn.innerHTML = paused ? svg('play') : svg('pause');
    }
    const favBtn = existingRoot.querySelector('.miniFavBtn');
    if(favBtn){
      favBtn.className = 'miniFavBtn ' + (isFav ? 'active' : '');
      favBtn.setAttribute('onclick', "event.stopPropagation();toggleFav('" + current.id + "')");
      favBtn.textContent = isFav ? '♥' : '♡';
    }
    const volSlider = existingRoot.querySelector('.volumeSlider');
    if(volSlider && document.activeElement !== volSlider){
      volSlider.value = appMuted ? 0 : Math.round(appVolume * 100);
    }
    const volBtn = existingRoot.querySelector('.volumeBtn');
    if(volBtn) volBtn.innerHTML = getVolumeIcon();
    applyMiniTheme(current, existingRoot);
    return;
  }

  p.innerHTML=`<div class="bottom appleMini compactMini" role="region" aria-label="Mini player" style="${getMiniThemeInlineStyle(current)}">
    <div class="miniProgressWrap" title="Scrub track">
      <div class="miniProgressFill" style="width:${pct}%"></div>
      <input id="seek" type="range" min="0" max="100" value="${pct}" data-mini-action="seek" aria-label="Seek track position">
    </div>
    <div class="miniPlayerBody">
      <div class="miniNow" data-mini-action="full-player" role="button" tabindex="0" aria-label="Open full player">
        <div class="miniArtWrap">
          <img class="miniart" data-song-id="${esc(current.id)}" src="${esc(cover(current))}" onerror="this.onerror=null;this.src=fallback" alt="${esc(current.title)}">
          <span class="miniPulse ${paused?'paused':'playing'}"><i></i><i></i><i></i></span>
        </div>
        <div class="grow miniCopy">
          <div class="title" title="${esc(current.title)}">${esc(current.title)}</div>
          <div class="meta" title="${esc(current.artist||'Unknown Artist')}">${esc(current.artist||'Unknown Artist')}</div>
        </div>
      </div>
      <div class="transport">
        <button type="button" class="miniNavBtn miniPrevBtn" data-mini-action="prev" title="Previous" aria-label="Previous">${svg('prev')}</button>
        <button type="button" class="bigplay" data-mini-action="toggle-play" title="${paused?'Play':'Pause'}" aria-label="${paused?'Play':'Pause'}">${paused?svg('play'):svg('pause')}</button>
        <button type="button" class="miniNavBtn miniNextBtn" data-mini-action="next" title="Next" aria-label="Next">${svg('next')}</button>
      </div>
      <div class="miniTools">
        <button type="button" class="miniFavBtn ${isFav?'active':''}" onclick="event.stopPropagation();toggleFav('${current.id}')" title="${isFav?'Remove from favorites':'Add to favorites'}" aria-label="Favorite">${isFav?'♥':'♡'}</button>
        <div class="miniVolumeControl" title="Volume">
          <button type="button" class="volumeBtn" onclick="toggleMute()" title="Mute / Unmute" aria-label="Mute / Unmute">${getVolumeIcon()}</button>
          <input type="range" class="volumeSlider" min="0" max="100" value="${appMuted?0:Math.round(appVolume*100)}" oninput="setAppVolume(this.value)" aria-label="Volume">
        </div>
      </div>
    </div>
    <div class="miniMorePanel hidden" id="miniMorePanel" style="display:none" aria-hidden="true"></div>
    <div class="progress" style="display:none">
      <span id="cur">${fmt(t)}</span>
      <span id="dur">${fmt(d)}</span>
    </div>
  </div>`;
  applyMiniTheme(current, p.firstElementChild);
}

function closeFullPlayer(){
  const fp=document.querySelector('.fullplayer');
  if(fp)fp.remove();
  document.body.classList.remove('fullPlayerOpen');
}

function showAudioOutputInfo(target){
  const s=(typeof target==='string'?songs.find(x=>x.id===target):(target||current))||current;
  const isDl=s&&offlineIds.has(s.id);
  const info=isDl?'Local Offline Vault (Lossless)':'Backblaze B2 Direct High-Speed Stream';
  toast('Audio Output: Stereo Hi-Fi • '+info);
}

function toggleLyricsModal(target){
  const s=(typeof target==='string'?songs.find(x=>x.id===target):(target||current))||current;
  if(!s)return;
  const existing=document.querySelector('.lyricsModalBox');
  if(existing){existing.closest('.modal')?.remove();return;}
  const d=document.createElement('div');
  d.className='modal';
  const lyricsText=s.lyrics||`[Verse 1]\nListening to ${s.title}\nBy ${s.artist||'Unknown Artist'}\n\n[Chorus]\nHigh-fidelity sound on Synth Audio\nLossless streaming powered by Backblaze B2\n\n[Outro]\nPure music, pure vibes.`;
  d.innerHTML=`<div class="modalbox lyricsModalBox"><div class="modalTitle"><div class="modalIconTitle"><div class="modalHeaderBadge">${svg('playlist')}</div><div><h3>Lyrics</h3><p class="modalSubtitle">${esc(s.title)} • ${esc(s.artist||'Unknown Artist')}</p></div></div><button class="modalClose" onclick="this.closest('.modal').remove()" aria-label="Close">${svg('close')}</button></div><div class="lyricsContent"><pre>${esc(lyricsText)}</pre></div></div>`;
  document.body.appendChild(d);
}

function toggleXrayModal(target){
  const s=(typeof target==='string'?songs.find(x=>x.id===target):(target||current))||current;
  if(!s)return;
  const existing=document.querySelector('.xrayModalBox');
  if(existing){existing.closest('.modal')?.remove();return;}
  const isDl=offlineIds.has(s.id);
  const isCurrentPlaying=(s===current&&!playbackPaused());
  const dur=fmt(s.duration||(s===current?playbackDuration():0));
  const d=document.createElement('div');
  d.className='modal';
  d.innerHTML=`<div class="modalbox xrayModalBox"><div class="modalTitle"><div class="modalIconTitle"><div class="modalHeaderBadge">${svg('stats')}</div><div><h3>X-Ray & Track Details</h3><p class="modalSubtitle">${esc(s.title)}</p></div></div><button class="modalClose" onclick="this.closest('.modal').remove()" aria-label="Close">${svg('close')}</button></div><div class="xrayDetailsList"><div class="xrayRow"><span>Title</span><b>${esc(s.title)}</b></div><div class="xrayRow"><span>Artist</span><b>${esc(s.artist||'Unknown Artist')}</b></div><div class="xrayRow"><span>Album</span><b>${esc(s.album||'Single')}</b></div><div class="xrayRow"><span>Duration</span><b>${dur}</b></div><div class="xrayRow"><span>Audio Source</span><b>${isDl?'Local Download (Offline Vault)':'Backblaze B2 Direct Stream'}</b></div><div class="xrayRow"><span>Audio Quality</span><b>320 kbps (High Fidelity MP3)</b></div><div class="xrayRow"><span>Genre</span><b>${esc(s.genre||'Music')}</b></div><div class="xrayRow"><span>Language</span><b>${esc(s.language||'Universal')}</b></div><div class="xrayRow"><span>Status</span><b>${isCurrentPlaying?'Playing':(s===current?'Paused':'Ready')}</b></div></div></div>`;
  document.body.appendChild(d);
}

function shareCurrentSong(target){
  const s=(typeof target==='string'?songs.find(x=>x.id===target):(target||current))||current;
  if(!s)return;
  const shareData={
    title:s.title,
    text:`Listening to ${s.title} by ${s.artist||'Unknown'} on Synth Audio`,
    url:window.location.origin+'/#song:'+s.id
  };
  if(navigator.share){
    navigator.share(shareData).catch(()=>{});
  }else{
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(shareData.url).then(()=>toast('Song link copied to clipboard')).catch(()=>toast('Song: '+s.title));
    }else{
      toast('Song: '+s.title);
    }
  }
}

function updateFullPlayer(s){
  if(!s)return;
  const fp=document.querySelector('.fullplayer');
  if(!fp)return;
  const isFav=favorites.has(s.id);
  const img=fp.querySelector('.fpcover');
  const blurredArt=fp.querySelector('.fpBlurredArt');
  const songCoverUrl = cover(s);
  if(blurredArt && (blurredArt.dataset.coverUrl !== songCoverUrl || blurredArt.dataset.songId !== s.id)){
    blurredArt.dataset.songId = s.id;
    blurredArt.dataset.coverUrl = songCoverUrl;
    blurredArt.src = songCoverUrl;
  }
  if(img && (img.dataset.coverUrl !== songCoverUrl || img.dataset.songId !== s.id)){
    img.dataset.songId = s.id;
    img.dataset.coverUrl = songCoverUrl;
    img.classList.add('artLoading');
    img.onload = () => img.classList.remove('artLoading');
    img.onerror = () => { img.classList.remove('artLoading'); img.src = fallback; };
    img.src = songCoverUrl;
    img.alt = s.title;
  }
  const titleEl=fp.querySelector('.fptitle')||fp.querySelector('.fpmeta h2');
  if(titleEl){titleEl.textContent=s.title;titleEl.title=s.title;}
  const artistEl=fp.querySelector('.fpartist')||fp.querySelector('.fpmeta p');
  if(artistEl){artistEl.textContent=s.artist||'Unknown Artist';artistEl.title=s.artist||'Unknown Artist';}
  const favBtn=fp.querySelector('.fpFavBtn');
  if(favBtn){favBtn.classList.toggle('active',isFav);favBtn.setAttribute('onclick',`toggleFav('${s.id}');this.classList.toggle('active')`);favBtn.innerHTML=isFav?svg('heartFilled'):svg('heart');}
  const moreBtn=fp.querySelector('.fpMoreBtn');
  if(moreBtn){moreBtn.setAttribute('onclick',`musicMore('${s.id}')`);}
  const fpseek=fp.querySelector('#fpseek');
  if(fpseek)fpseek.value=playbackDuration()?playbackTime()/playbackDuration()*100:0;
  const fpcurr=fp.querySelector('#fpcurr');
  if(fpcurr)fpcurr.textContent=fmt(playbackTime());
  const fpdur=fp.querySelector('#fpdur');
  if(fpdur)fpdur.textContent=fmt(playbackDuration()||s.duration||0);
  const playBtn=fp.querySelector('.fpplay');
  if(playBtn){playBtn.title=playbackPaused()?'Play':'Pause';playBtn.setAttribute('aria-label',playbackPaused()?'Play':'Pause');playBtn.innerHTML=playbackPaused()?svg('play'):svg('pause');}
  const shufBtn=fp.querySelector('.fpShuffleBtn');
  if(shufBtn)shufBtn.classList.toggle('on',shuffle);
  const repBtn=fp.querySelector('.fpRepeatBtn');
  if(repBtn)repBtn.classList.toggle('on',repeat!=='off');
  applyArtworkTheme(s,playRequest);
}

function toggleFullPlayerMenu(e){
  const evt = e || window.event;
  if(evt) evt.stopPropagation();
  const anchor = evt?.currentTarget || document.querySelector('.fpHeadMoreBtn') || document.querySelector('.fpBottomMoreBtn');
  openSongMenu(current?.id, anchor, evt);
}

function fullPlayer(){
  if(!current)return;
  const existing=document.querySelector('.fullplayer');
  if(existing){updateFullPlayer(current);return}
  const d=document.createElement('div');
  d.className='fullplayer';
  d.setAttribute('role','region');
  d.setAttribute('aria-label','Full player');
  const inlineTheme=getFullPlayerThemeInlineStyle(current);
  if(inlineTheme)d.style.cssText=inlineTheme;
  const isFav=favorites.has(current.id);
  const isDl=offlineIds.has(current.id);
  const pct=playbackDuration()?playbackTime()/playbackDuration()*100:0;
  
  d.innerHTML=`
    <!-- Cinematic Movie-Style Dynamic Blurred Backdrop -->
    <div class="fpCinematicBackdrop">
      <img class="fpBlurredArt" src="${esc(cover(current))}" alt="" onerror="this.onerror=null;this.src=fallback">
      <div class="fpCinematicGlow"></div>
      <div class="fpCinematicVignette"></div>
    </div>
    
    <!-- Top Bar with Top-Right 3-Dot Menu -->
    <div class="fphead">
      <button type="button" class="fpTopCircleBtn fpCloseBtn" onclick="closeFullPlayer()" title="Collapse" aria-label="Collapse">${svg('chevronDown')}</button>
      <div class="fpHeadCenter">
        <span class="fpNowPlayingLabel">NOW PLAYING</span>
      </div>
      <div class="fpHeadRight">
        <button type="button" class="fpTopCircleBtn fpHeadMoreBtn" onclick="toggleFullPlayerMenu(event)" title="Song options" aria-label="More options">${svg('more')}</button>
      </div>
    </div>

    <!-- Main Content Above Cinematic Backdrop -->
    <div class="fpbody">
      <div class="fpcoverWrap">
        <img src="${esc(cover(current))}" data-song-id="${esc(current.id)}" class="fpcover" onerror="this.onerror=null;this.src=fallback" alt="${esc(current.title)}">
      </div>
      <div class="fpPillsRow">
        <button type="button" class="fpPillBtn" onclick="toggleLyricsModal()">${svg('playlist')} <span>Lyrics</span></button>
        <button type="button" class="fpPillBtn" onclick="toggleXrayModal()">${svg('stats')} <span>X-Ray</span></button>
      </div>
      <div class="fpMetaRow">
        <div class="fpMetaInfo">
          <h2 class="fptitle" title="${esc(current.title)}">${esc(current.title)}</h2>
          <p class="fpartist" title="${esc(current.artist||'Unknown Artist')}">${esc(current.artist||'Unknown Artist')}</p>
        </div>
        <button type="button" class="fpFavBtn ${isFav?'active':''}" onclick="toggleFav('${current.id}');this.classList.toggle('active')" title="Favorite" aria-label="Favorite">${isFav?svg('heartFilled'):svg('heart')}</button>
      </div>
      <div class="fpseek">
        <input id="fpseek" type="range" min="0" max="100" value="${pct}" oninput="seek(this.value)" aria-label="Seek position">
        <div class="fpTimeRow">
          <span id="fpcurr">${fmt(playbackTime())}</span>
          <span class="fpQualityBadge">Hi-Fi</span>
          <span id="fpdur">${fmt(playbackDuration()||current.duration||0)}</span>
        </div>
      </div>
      <div class="fpcontrols">
        <button type="button" class="toggleSmall fpShuffleBtn ${shuffle?'on':''}" onclick="cycleShuffle();this.classList.toggle('on',shuffle)" title="Shuffle" aria-label="Shuffle">${svg('shuffle')}</button>
        <button type="button" class="fpNavBtn fpPrevBtn" onclick="prev()" title="Previous song" aria-label="Previous song">${svg('prev')}</button>
        <button type="button" class="fpNavBtn fpSeekBtn fpRewindBtn" onclick="skip(-10)" title="Rewind 10 seconds" aria-label="Rewind 10 seconds">${svg('rewind10')}</button>
        <button type="button" class="fpplay" onclick="togglePlay()" title="${playbackPaused()?'Play':'Pause'}" aria-label="${playbackPaused()?'Play':'Pause'}">${playbackPaused()?svg('play'):svg('pause')}</button>
        <button type="button" class="fpNavBtn fpSeekBtn fpForwardBtn" onclick="skip(10)" title="Forward 10 seconds" aria-label="Forward 10 seconds">${svg('forward10')}</button>
        <button type="button" class="fpNavBtn fpNextBtn" onclick="next()" title="Next song" aria-label="Next song">${svg('next')}</button>
        <button type="button" class="toggleSmall fpRepeatBtn ${repeat!=='off'?'on':''}" onclick="cycleRepeat();this.classList.toggle('on',repeat!=='off')" title="Repeat" aria-label="Repeat">${svg('repeat')}</button>
      </div>
      <div class="fpvolume">
        <button type="button" class="volumeBtn" onclick="toggleMute()" title="Mute / Unmute" aria-label="Mute / Unmute">${getVolumeIcon()}</button>
        <input type="range" class="volumeSlider" min="0" max="100" value="${appMuted?0:Math.round(appVolume*100)}" oninput="setAppVolume(this.value)" aria-label="Volume">
        <span class="volumeValue">${appMuted?0:Math.round(appVolume*100)}%</span>
      </div>
      <div class="fpsecondary">
        <button type="button" class="fpCircleBtn" onclick="shareCurrentSong()" title="Share" aria-label="Share">${svg('share')}</button>
        <button type="button" class="fpCircleBtn" onclick="showAudioOutputInfo()" title="AirPlay / Cast" aria-label="AirPlay / Cast">${svg('cast')}</button>
        <button type="button" class="fpCircleBtn" onclick="queueView()" title="Queue" aria-label="Queue">${svg('queue')}</button>
        <button type="button" class="fpCircleBtn fpBottomMoreBtn" onclick="toggleFullPlayerMenu(event)" title="Song options" aria-label="Song options">${svg('more')}</button>
      </div>
    </div>
  `;
  applyArtworkTheme(current,playRequest);
  document.body.appendChild(d);
}
let lastTick=Date.now();
function flushListening(){if(!user||!current||playbackPaused())return;const now=Date.now();const sec=Math.max(0,Math.min(30,Math.floor((now-lastTick)/1000)));lastTick=now;if(sec>0){listened+=sec;localStorage.setItem('listenedSeconds:'+user,String(listened));api('/api/listening',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userEmail:user,songId:current.id,seconds:sec})}).catch(()=>{});updateVisibleListening()}}
function startListenTimer(){if(listenTimer||!user)return;lastTick=Date.now();listenTimer=setInterval(()=>{if(!playbackPaused()&&current){const now=Date.now();const sec=Math.max(1,Math.min(5,Math.floor((now-lastTick)/1000)));lastTick=now;listened+=sec;localStorage.setItem('listenedSeconds:'+user,String(listened));if(!document.hidden){api('/api/listening',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userEmail:user,songId:current.id,seconds:sec})}).catch(()=>{});}updateVisibleListening()}},10000)}
function stopListenTimer(){if(listenTimer){clearInterval(listenTimer);listenTimer=null}}
function updateVisibleListening(){document.querySelectorAll('[data-listened]').forEach(n=>n.textContent=mins(listened))}
function sendEvent(type,songId){api('/api/events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type,songId,userEmail:user})}).catch(()=>{})}
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){
    flushListening();
  }else{
    lastTick=Date.now();
    if(!playbackPaused()){
      requestWakeLock();
      startBgKeeper();
    }
    probeRemoteNetwork().catch(()=>{});
    updateMediaPlaybackState();
    updateMediaPosition();
    renderPlayer();
    updateFullPlayer(current);
  }
});
window.addEventListener('pageshow',()=>{if(!playbackPaused()){requestWakeLock();startBgKeeper();}updateMediaPlaybackState();updateMediaPosition();renderPlayer();updateFullPlayer(current)});
window.addEventListener('pagehide',()=>{releaseWakeLock();flushListening()});
window.addEventListener('beforeunload',()=>{releaseWakeLock();flushListening()});
audio.addEventListener('play',()=>{
  startBgKeeper();
  requestWakeLock();
  updateMediaPlaybackState('playing');
  updateMediaPosition();
  startListenTimer();
  renderPlayer();
  updateFullPlayer(current);
  queueSavePlaybackState();
});
audio.addEventListener('playing',()=>{
  isTrackTransitioning = false;
  userInitiatedPause = false;
  startBgKeeper();
  updateMediaPlaybackState('playing');
  updateMediaPosition();
  startListenTimer();
  renderPlayer();
  updateFullPlayer(current);
  queueSavePlaybackState();
});
audio.addEventListener('pause',()=>{
  if(!isTrackTransitioning && !trackEndBusy && !audio.ended && userInitiatedPause){
    releaseWakeLock();
    stopBgKeeper();
  }
  if(!nativeReady){
    flushListening();
    stopListenTimer();
    // CRITICAL LOCK-SCREEN FIX: Never notify mobile OS of 'paused' during transitions or buffering
    if(!isTrackTransitioning && !trackEndBusy && !audio.ended && userInitiatedPause){
      updateMediaPlaybackState('paused');
    }
    renderPlayer();
    updateFullPlayer(current);
    savePlaybackState();
  }
});
audio.addEventListener('waiting',()=>{
  updateMediaPlaybackState('playing');
  startBgKeeper();
});
audio.addEventListener('stalled',()=>{
  startBgKeeper();
  if(!current||nativeMode()||audio.paused)return;
  try{audio.play().catch(()=>{})}catch{}
});
audio.addEventListener('ended',()=>{
  // Maintain background keeper and wake lock during transition
  const endedId=current?.id||'';
  queueSavePlaybackState();
  if(!nativeReady)handleTrackEnded('html',endedId);
  else updateMediaPlaybackState();
});
audio.addEventListener('loadedmetadata',()=>{
  const d=$('#dur');if(d&&!nativeReady)d.textContent=fmt(audio.duration);
  const fpd=$('#fpdur');if(fpd&&!nativeReady)fpd.textContent=fmt(audio.duration);
  updateMediaPosition();
  updateMediaPlaybackState();
});
audio.addEventListener('durationchange',()=>{
  updateMediaPosition();
});
audio.addEventListener('seeked',()=>{
  updateMediaPosition();
  queueSavePlaybackState();
});
let lastTimeUpdateSync=0;
audio.addEventListener('timeupdate',()=>{
  if(nativeReady)return;
  const pct=audio.duration?audio.currentTime/audio.duration*100:0;
  const r=$('#seek');if(r&&audio.duration)r.value=pct;
  const fill=$('.miniProgressFill');if(fill)fill.style.width=pct+'%';
  const t=$('#cur');if(t)t.textContent=fmt(audio.currentTime);
  const f=$('#fpcurr');if(f)f.textContent=fmt(audio.currentTime);
  const fp=$('#fpseek');if(fp&&audio.duration)fp.value=pct;
  const now=Date.now();
  if(now-lastTimeUpdateSync>1000){
    lastTimeUpdateSync=now;
    updateMediaPosition();
    updateMediaPlaybackState();
    queueSavePlaybackState();
  }
  // Watchdog eliminated: authoritative audio.ended event drives track progression
});
let lastSongActivationId='';
let lastSongActivationAt=0;
let touchStartX=0;
let touchStartY=0;
let touchMoved=false;
function activateSongTap(el,event){
  if(!el)return;
  if(event){
    if(event.target?.closest?.('button,a,input,select,textarea,[data-song-actions],.rowActions,.cardplay,.dots,.miniTools'))return;
    if((event.pointerType==='touch'||event.pointerType==='pen')&&touchMoved)return;
  }
  const id=String(el.dataset.playDirect||el.dataset.playSong||'');
  const ids=el.dataset.playCollection||'';
  if(!id)return;
  const now=Date.now();
  // Touch/pointer activation can be followed by a synthetic click. Treat that
  // click as the same gesture so one tap cannot start the track twice.
  if(lastSongActivationId===id && now-lastSongActivationAt<600)return;
  lastSongActivationId=id;
  lastSongActivationAt=now;
  if(ids){
    try{const list=JSON.parse(ids);playSongInCollection(id,list)}
    catch(err){console.error('Invalid collection playback data',err)}
  }else{
    playSong(id);
  }
}
function bindSongActivation(){
  if(bindSongActivation.bound)return;
  bindSongActivation.bound=true;
  const isActionTarget=e=>!!e.target?.closest?.('button,a,input,select,textarea,[data-song-actions],.rowActions,.cardplay,.dots,.miniTools');

  document.addEventListener('pointerdown',e=>{
    if(e.pointerType==='touch'||e.pointerType==='pen'){
      touchStartX=e.clientX;
      touchStartY=e.clientY;
      touchMoved=false;
    }
  },{passive:true});

  document.addEventListener('pointermove',e=>{
    if(e.pointerType==='touch'||e.pointerType==='pen'){
      if(Math.hypot(e.clientX-touchStartX,e.clientY-touchStartY)>12){
        touchMoved=true;
      }
    }
  },{passive:true});

  const activate=e=>{
    if(isActionTarget(e))return;
    if((e.pointerType==='touch'||e.pointerType==='pen')&&touchMoved)return;
    const el=e.target?.closest?.('[data-play-song]');
    if(!el)return;
    activateSongTap(el,e);
  };
  // Mobile: pointerup is reliable for a completed tap and avoids starting
  // playback while the user is scrolling. The row also has an inline handler
  // so dynamically-rendered rows work without another binding pass.
  document.addEventListener('pointerup',e=>{
    if(e.pointerType==='touch'||e.pointerType==='pen')activate(e);
  },{passive:true});
  // Desktop mouse / browsers without pointer events.
  document.addEventListener('click',e=>{
    if(e.pointerType==='mouse'||e.pointerType===''||e.pointerType==null)activate(e);
  },{passive:true});
  // Older mobile browsers without Pointer Events.
  if(!window.PointerEvent){
    let tX=0,tY=0,tMoved=false;
    document.addEventListener('touchstart',e=>{if(e.touches&&e.touches[0]){tX=e.touches[0].clientX;tY=e.touches[0].clientY;tMoved=false}},{passive:true});
    document.addEventListener('touchmove',e=>{if(e.touches&&e.touches[0]&&Math.hypot(e.touches[0].clientX-tX,e.touches[0].clientY-tY)>12){tMoved=true}},{passive:true});
    document.addEventListener('touchend',e=>{if(!tMoved)activate(e)},{passive:true});
  }
  document.addEventListener('keydown',e=>{
    if(e.key!=='Enter'&&e.key!==' ')return;
    const el=e.target?.closest?.('[data-play-song]');
    if(!el||isActionTarget(e))return;
    e.preventDefault();activateSongTap(el,e);
  });
}

function toast(t){const x=document.createElement('div');x.className='toast';x.textContent=t;document.body.appendChild(x);requestAnimationFrame(()=>x.classList.add('show'));setTimeout(()=>{x.classList.remove('show');setTimeout(()=>x.remove(),180)},2200)}
async function renderAdmin(m){if(!owner){ownerGate();return}let st;try{st=await api('/api/admin/stats',{headers:ownerToken?{'Authorization':'Bearer '+ownerToken}:{'x-admin-key':ownerKey}})}catch{if(ownerKey&&await refreshOwnerSession()){try{st=await api('/api/admin/stats',{headers:{'Authorization':'Bearer '+ownerToken}})}catch{}}if(!st){owner=false;ownerToken='';localStorage.removeItem('synthOwnerToken');toast('Owner authorization required. Unlock Admin again.');ownerGate();return}}m.innerHTML=`<div class="adminPage"><div class="adminTopbar"><button class="adminBack" onclick="go('home')">${svg('home')}<span>Back to music</span></button><div class="adminTopIdentity"><span class="adminShield">${svg('shield')}</span><div><b>Owner Administration</b><small style="display:block;opacity:0.8;font-size:12px;margin-top:2px;">${esc(ownerEmail)}</small></div></div><button class="secondary adminExport" onclick="exportData()">${svg('download')} Export</button></div><div class="adminHero"><div><span class="eyebrow">SYNTH AUDIO · OWNER ONLY</span><h1>Administration</h1><p class="sub">Manage your personal MP3 library, uploads and activity.</p></div><div class="adminHeroActions"><span class="ownerStatus"><i></i> Secure owner session</span><button class="primary" onclick="adminAdd()">${svg('upload')} Add music</button></div></div><div class="adminOverview"><div class="adminStatPrimary"><span>Music library</span><b>${st.songs}</b><small>songs available to users</small></div><div class="adminStat"><span>Storage used</span><b>${formatBytes(st.storageBytes)}</b><small>uploaded audio storage</small></div><div class="adminStat"><span>Listening time</span><b>${mins(st.listeningSeconds)}</b><small>total tracked listening</small></div><div class="adminStat"><span>Listeners</span><b>${st.users}</b><small>registered accounts</small></div></div><div class="adminTabs"><button class="active" onclick="adminTab(this,'manage')">${svg('library')} <span>Music library</span></button><button onclick="adminTab(this,'add')">${svg('upload')} <span>Add music</span></button><button onclick="adminTab(this,'delete')">${svg('trash')} <span>Delete music</span></button><button onclick="adminTab(this,'activity')">${svg('activity')} <span>Activity</span></button></div><div id="adminbody"></div></div>`;adminManage()}
function adminTab(btn,tab){document.querySelectorAll('.adminTabs button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');if(tab==='manage')adminManage();else if(tab==='add')adminAdd();else if(tab==='delete')adminDelete();else if(tab==='activity')adminActivity()}
function adminManage(){const b=$('#adminbody');if(!b)return;const list=songs.map(adminRow).join('');const empty=`<div class="adminEmpty"><div>${svg('library')}</div><h3>Your library is empty</h3><p>Use Add music to publish the first song.</p><button class="primary" onclick="adminAdd()">${svg('upload')} Add music</button></div>`;b.innerHTML=`<div class="adminPanel"><div class="adminPanelHead"><div><h2>Music library</h2><p class="sub">Every uploaded song shared with authorized users.</p></div><span class="countPill">${songs.length} songs</span></div><div class="adminSearchRow"><div class="searchbox">${svg('search')}<input placeholder="Search title, artist, album, language or genre..." oninput="filterAdmin(this.value)"></div></div><div id="adminsongs" class="list adminList">${list||empty}</div></div>`}
function adminRow(s){return `<div class="songrow adminrow"><img class="thumb" loading="lazy" decoding="async" src="${esc(cover(s))}" onerror="this.onerror=null;this.src=fallback" alt="${esc(s.title)}"><div class="grow"><div class="title">${esc(s.title)}</div><div class="meta">${esc(s.artist||'Unknown Artist')} · ${esc(s.album||'Single')}${s.genre?' · '+esc(s.genre):''}${s.language?' · '+esc(s.language):''}</div></div><div class="rowActions"><button class="rowbtn adminPlayBtn" onclick="playSong('${s.id}')" title="Play song" aria-label="Play">${svg('play')}</button><button class="rowbtn adminEditBtn" onclick="adminEditSong('${s.id}')" title="Edit song metadata & artwork" aria-label="Edit song">${svg('stats')}</button><button class="rowbtn danger adminDeleteBtn" onclick="adminDeleteSong('${s.id}')" title="Delete song" aria-label="Delete">${svg('trash')}</button></div></div>`}
let adminSearchTimer=null;
function filterAdmin(q){
  clearTimeout(adminSearchTimer);adminSearchTimer=setTimeout(()=>{
    q=String(q||'').toLowerCase().trim();const el=$('#adminsongs');if(!el)return;
    const list=songs.filter(s=>[s.title,s.artist,s.album,s.language,s.genre].join(' ').toLowerCase().includes(q)).map(adminRow).join('');
    el.innerHTML=list||'<div class="adminEmpty compact"><h3>No matching music</h3><p>Try another title, artist, album, language or genre.</p></div>';
  },120);
}

function adminAdd(){
  selectedAudioFile = null;
  selectedCoverFile = null;
  const b=$('#adminbody');
  if(!b)return;
  b.innerHTML=`<div class="adminPanel">
    <div class="adminPanelHead">
      <div>
        <h2>Publish Music to Backblaze B2</h2>
        <p class="sub">Upload audio directly to B2 storage. Embedded ID3 artwork and song tags will be extracted automatically.</p>
      </div>
    </div>
    <div class="uploadBox adminUploadPro">
      <div class="uploadStepBar" id="uploadStepBar">
        <div class="uploadStep active" id="stepIndicator1"><span class="stepNum">1</span><span>Select Audio</span></div>
        <div class="uploadStepArrow">›</div>
        <div class="uploadStep" id="stepIndicator2"><span class="stepNum">2</span><span>Validate</span></div>
        <div class="uploadStepArrow">›</div>
        <div class="uploadStep" id="stepIndicator3"><span class="stepNum">3</span><span>B2 Storage</span></div>
        <div class="uploadStepArrow">›</div>
        <div class="uploadStep" id="stepIndicator4"><span class="stepNum">4</span><span>Save Metadata</span></div>
        <div class="uploadStepArrow">›</div>
        <div class="uploadStep" id="stepIndicator5"><span class="stepNum">5</span><span>Ready</span></div>
      </div>

      <div id="dropZone" class="dropZone proDropZone" onclick="$('#ufile').click()" ondragover="event.preventDefault();this.classList.add('dragging')" ondragleave="this.classList.remove('dragging')" ondrop="event.preventDefault();this.classList.remove('dragging');handleAudioDrop(event.dataTransfer.files)">
        <div class="uploadIcon">${svg('upload')}</div>
        <h3>Choose or drop your music file</h3>
        <p>Supports MP3, FLAC, WAV, M4A, AAC · Up to 250 MB</p>
        <input id="ufile" type="file" accept="audio/*,.mp3,.flac,.wav,.m4a,.aac,.ogg,.opus" hidden onchange="handleAudioFile(this.files)">
      </div>

      <div id="selectedAudio" class="selectedAudio hidden"></div>

      <div class="uploadSectionCard">
        <div class="uploadSectionTitle">
          <h4>Cover Artwork</h4>
          <span class="optionalBadge">Automatic from MP3 or Custom</span>
        </div>
        <div class="coverUploadRow">
          <div class="coverUploadPreview" id="coverUploadPreview" onclick="$('#ucov').click()" ondragover="event.preventDefault();this.classList.add('dragging')" ondragleave="this.classList.remove('dragging')" ondrop="event.preventDefault();this.classList.remove('dragging');handleCoverDrop(event.dataTransfer.files)" title="Click or drop custom artwork">
            <span class="coverUploadPlaceholder">${svg('camera')}</span>
            <img id="coverUploadImg" class="hidden" alt="Custom cover preview">
          </div>
          <div class="coverUploadActions">
            <label class="secondary btnUploadCover" for="ucov">${svg('upload')} Select Custom Cover</label>
            <input id="ucov" type="file" accept="image/png,image/jpeg,image/webp,image/jpg" style="display:none" onchange="handleCoverFile(this.files)">
            <small class="subText">Optional. If left blank, the embedded artwork inside your audio file is extracted automatically.</small>
          </div>
        </div>
      </div>

      <div class="uploadSectionCard">
        <div class="uploadSectionTitle">
          <h4>Song Details</h4>
          <span class="optionalBadge">Auto-detected from tags</span>
        </div>
        <div class="twocol">
          <label class="fieldLabel">Song Title <span class="optional">optional</span>
            <input id="utitle" class="fieldInput" placeholder="Auto-detected from file">
          </label>
          <label class="fieldLabel">Artist <span class="optional">optional</span>
            <input id="uartist" class="fieldInput" placeholder="Artist name (e.g. A.R. Rahman)">
          </label>
        </div>
        <div class="twocol">
          <label class="fieldLabel">Album <span class="optional">optional</span>
            <input id="ualbum" class="fieldInput" placeholder="Album name (e.g. Single)">
          </label>
          <label class="fieldLabel">Language <span class="optional">optional</span>
            <input id="ulang" class="fieldInput" placeholder="Tamil, Hindi, English...">
          </label>
        </div>
        <div class="twocol">
          <label class="fieldLabel">Genre <span class="optional">optional</span>
            <input id="ugenre" class="fieldInput" placeholder="Melody, Pop, Soundtrack...">
          </label>
        </div>
      </div>

      <div class="uploadActionsWrap">
        <button id="publishBtn" class="primary wide publishBtn" onclick="upload()" disabled>
          ${svg('upload')} Upload to Backblaze B2 & Publish
        </button>
        <div id="uploadMsg" class="formMsg"></div>
      </div>
    </div>
  </div>`;
}
let selectedAudioFile=null;
let selectedCoverFile=null;
function handleAudioDrop(files){handleAudioFile(files)}
function handleCoverDrop(files){
  if(files && files[0]){
    handleCoverFile(files);
    toast('Cover image dropped: ' + files[0].name);
  }
}
function handleAudioFile(files){
  const f=files?.[0];
  if(!f)return;
  selectedAudioFile=f;
  const input=$('#ufile');
  if(input && files instanceof FileList){try{input.files=files}catch{}}
  const box=$('#selectedAudio');
  if(box){
    box.classList.remove('hidden');
    box.innerHTML=`<span class="selectedIcon">${svg('play')}</span><div class="selectedInfo"><b>${esc(f.name)}</b><small>${formatBytes(f.size)} · Ready to upload</small></div><button type="button" class="clearSelectedBtn" onclick="clearSelectedAudio(event)" title="Remove">${svg('close')}</button>`;
  }
  const btn=$('#publishBtn');
  if(btn)btn.disabled=false;
  const title=$('#utitle');
  if(title && !title.value) title.value=f.name.replace(/\.[^.]+$/,'').replace(/[_-]+/g,' ').trim();
  setUploadStep(1);
  toast('Audio selected: '+f.name);
}
function handleCoverFile(files){
  const f=files?.[0];
  if(!f)return;
  selectedCoverFile=f;
  const img=$('#coverUploadImg');
  const placeholder=$('.coverUploadPlaceholder');
  if(img && placeholder){
    const url=URL.createObjectURL(f);
    img.src=url;
    img.classList.remove('hidden');
    placeholder.classList.add('hidden');
  }
}
function clearSelectedAudio(e){
  e?.stopPropagation();
  selectedAudioFile=null;
  const input=$('#ufile');if(input)input.value='';
  const box=$('#selectedAudio');if(box){box.classList.add('hidden');box.innerHTML='';}
  const btn=$('#publishBtn');if(btn)btn.disabled=true;
  setUploadStep(1);
}
function setUploadStep(stepNum, statusText=''){
  for(let i=1;i<=5;i++){
    const el=$('#stepIndicator'+i);
    if(el){
      el.classList.toggle('active', i===stepNum);
      el.classList.toggle('completed', i<stepNum);
    }
  }
  const msg=$('#uploadMsg');
  if(msg && statusText){
    msg.innerHTML=`<div class="uploadStatusRow"><span class="uploadStatusSpinner"></span><span>${esc(statusText)}</span></div>`;
  }
}

async function upload(){
  const f=$('#ufile')?.files?.[0]||selectedAudioFile;
  if(!f)return toast('Please select an audio file (MP3, WAV, FLAC, M4A)');
  const btn=$('#publishBtn');
  if(btn){btn.disabled=true;btn.classList.add('loading')}
  
  // Step 2: Validate
  setUploadStep(2, 'Validating audio file format and size ('+formatBytes(f.size)+')...');
  const ext=f.name.slice(f.name.lastIndexOf('.')).toLowerCase();
  if(!['.mp3','.wav','.ogg','.opus','.aac','.m4a','.flac'].includes(ext)){
    if(btn){btn.disabled=false;btn.classList.remove('loading')}
    $('#uploadMsg').innerHTML=`<div class="uploadErrorCard"><div class="errorBadge">⚠ Unsupported Format</div><p>Please select an MP3, FLAC, WAV, M4A, or AAC file.</p></div>`;
    return;
  }
  if(f.size > 250*1024*1024){
    if(btn){btn.disabled=false;btn.classList.remove('loading')}
    $('#uploadMsg').innerHTML=`<div class="uploadErrorCard"><div class="errorBadge">⚠ File Too Large</div><p>Audio file exceeds the maximum 250 MB limit.</p></div>`;
    return;
  }
  
  const msg=$('#uploadMsg');
  if(msg){
    msg.innerHTML=`<div class="uploadProgress">
      <div class="uploadProgressHeader"><span>Uploading ${esc(f.name)} (${formatBytes(f.size)}) to Backblaze B2</span><b id="uploadPct">0%</b></div>
      <div class="progressBar"><i id="uploadBar" style="width:0%"></i></div>
    </div>`;
  }
  
  // Step 3: Uploading to B2 Storage
  setUploadStep(3, 'Connecting to Backblaze B2 storage...');
  
  try{
    const effectiveToken = ownerToken || authToken;
    const effectiveKey = ownerKey;
    const authHeaders = {
      ...(effectiveToken ? {'Authorization': 'Bearer ' + effectiveToken} : {}),
      ...(effectiveKey ? {'x-admin-key': effectiveKey} : {})
    };

    // Attempt direct-to-B2 presigned upload first (bypasses Vercel request body limits!)
    let presign = null;
    try{
      presign = await api('/api/admin/upload-presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({
          filename: f.name,
          contentType: f.type || 'audio/mpeg',
          fileSize: f.size
        })
      });
    }catch(presignErr){
      console.warn('Presign endpoint notice, checking fallback:', presignErr);
    }

    let added = null;
    if(presign && presign.directToB2 && presign.uploadUrl){
      // DIRECT-TO-B2 FLOW
      setUploadStep(3, 'Uploading directly to Backblaze B2 (' + formatBytes(f.size) + ')...');
      await new Promise((resolve, reject)=>{
        const x = new XMLHttpRequest();
        x.open('PUT', presign.uploadUrl);
        x.setRequestHeader('Content-Type', presign.contentType || 'audio/mpeg');
        x.upload.onprogress = e => {
          if(!e.lengthComputable) return;
          const pct = Math.round(e.loaded / e.total * 100);
          const pText = $('#uploadPct'); if(pText) pText.textContent = pct + '%';
          const pBar = $('#uploadBar'); if(pBar) pBar.style.width = pct + '%';
          if(pct >= 99) setUploadStep(4, 'Verifying B2 storage and extracting tags...');
        };
        x.onload = () => {
          if(x.status >= 200 && x.status < 300) resolve();
          else reject(new Error('Direct B2 upload failed with HTTP ' + x.status));
        };
        x.onerror = () => reject(new Error('Network connection error during direct B2 storage upload'));
        x.send(f);
      });

      // Complete song record on server
      setUploadStep(4, 'Processing tags and artwork...');
      let customCover = '';
      const covFile = $('#ucov')?.files?.[0] || selectedCoverFile;
      if(covFile){
        try{ customCover = await fileData(covFile); }catch{}
      }

      added = await api('/api/admin/upload-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({
          key: presign.key,
          filename: f.name,
          title: $('#utitle')?.value || '',
          artist: $('#uartist')?.value || '',
          album: $('#ualbum')?.value || '',
          language: $('#ulang')?.value || '',
          genre: $('#ugenre')?.value || '',
          fileSize: f.size,
          cover: customCover || undefined
        })
      });
    } else {
      // STREAMING FALLBACK (Local / offline dev)
      const qs=new URLSearchParams({
        filename: f.name,
        title: $('#utitle')?.value||'',
        artist: $('#uartist')?.value||'',
        album: $('#ualbum')?.value||'',
        language: $('#ulang')?.value||'',
        genre: $('#ugenre')?.value||''
      });

      added = await new Promise((resolve,reject)=>{
        const x=new XMLHttpRequest();
        x.open('POST', API_BASE+'/api/admin/upload-stream?'+qs.toString());
        if(effectiveToken) x.setRequestHeader('Authorization', 'Bearer '+effectiveToken);
        if(effectiveKey) x.setRequestHeader('x-admin-key', effectiveKey);
        
        x.upload.onprogress=e=>{
          if(!e.lengthComputable)return;
          const pct=Math.round(e.loaded/e.total*100);
          const pText=$('#uploadPct');if(pText)pText.textContent=pct+'%';
          const pBar=$('#uploadBar');if(pBar)pBar.style.width=pct+'%';
          if(pct>=99) setUploadStep(4, 'Saving song metadata and extracting tags...');
        };
        
        x.onload=async()=>{
          try{
            const r=JSON.parse(x.responseText||'{}');
            if(x.status>=200 && x.status<300){ resolve(r); return; }
            if(x.status===401 && effectiveKey && await refreshOwnerSession()){
              const y=new XMLHttpRequest();
              y.open('POST', API_BASE+'/api/admin/upload-stream?'+qs.toString());
              y.setRequestHeader('Authorization', 'Bearer '+(ownerToken||authToken));
              if(effectiveKey) y.setRequestHeader('x-admin-key', effectiveKey);
              y.upload.onprogress=x.upload.onprogress;
              y.onload=()=>{
                try{
                  const z=JSON.parse(y.responseText||'{}');
                  if(y.status>=200&&y.status<300)resolve(z);
                  else reject(Error(z.error||'Upload failed with status '+y.status));
                }catch{reject(Error('Upload failed: Invalid server response'))}
              };
              y.onerror=()=>reject(Error('Network error during upload retry'));
              y.send(f);
              return;
            }
            reject(Error(r.error||'Upload failed with status '+x.status));
          }catch(parseErr){reject(Error('Invalid server response during upload: '+parseErr.message))}
        };
        x.onerror=()=>reject(Error('Network connection error during audio upload'));
        x.send(f);
      });

      // Upload custom cover for fallback stream flow
      const covFile = $('#ucov')?.files?.[0] || selectedCoverFile;
      if(covFile && added?.id){
        setUploadStep(4, 'Uploading custom cover artwork to B2...');
        try{
          const coverBase64 = await fileData(covFile);
          if(coverBase64){
            const covHeaders = { 'Content-Type': 'application/json', ...authHeaders };
            const updated = await api('/api/admin/song-cover/'+added.id, {
              method: 'POST',
              headers: covHeaders,
              body: JSON.stringify({ cover: coverBase64 })
            });
            if(updated?.cover) added.cover = updated.cover;
          }
        }catch(e){console.warn('Cover upload note:', e);}
      }
    }

    // Step 5: Complete & Update Library
    setUploadStep(5, 'Published successfully to library!');
    songs = sortSongsAlphabetical([added, ...songs.filter(s=>s.id!==added.id)]);
    try{localStorage.setItem('synthCachedSongs', JSON.stringify(songs))}catch{}
    
    if(msg){
      msg.innerHTML=`<div class="uploadSuccessCard">
        <div class="successBadge">✓ Published to Music Library</div>
        <div class="successSongRow">
          <img class="thumb" src="${esc(cover(added))}" onerror="this.onerror=null;this.src=fallback" alt="${esc(added.title)}">
          <div class="successInfo">
            <b>${esc(added.title)}</b>
            <small>${esc(added.artist || 'Unknown Artist')}</small>
          </div>
          <button class="primary playNowBtn" onclick="playSong('${added.id}')">${svg('play')} Play now</button>
        </div>
        <button class="secondary uploadAnotherBtn" onclick="adminAdd()">${svg('upload')} Upload another track</button>
      </div>`;
    }
    toast('Song published: ' + (added.title || f.name));
  }catch(e){
    console.error('Upload flow exception:', e);
    if(msg){
      msg.innerHTML=`<div class="uploadErrorCard">
        <div class="errorBadge">⚠ Upload failed</div>
        <p class="errorMsg">${esc(e.message)}</p>
        <button class="primary retryBtn" onclick="upload()">${svg('repeat')} Retry Upload</button>
      </div>`;
    }
    toast('Upload failed: ' + e.message);
  }finally{
    if(btn){btn.disabled=false;btn.classList.remove('loading')}
  }
}

async function adminDeleteSong(id){
  const s=songs.find(x=>x.id===id);
  const title=s?.title||'this song';
  if(!confirm(`Delete "${title}" permanently from the catalog?\n\nThis action cannot be undone and will remove it from all playlists.`)) return;

  const originalSongs=[...songs];
  const originalPlaylists=playlists.map(p=>({...p,songIds:[...(p.songIds||[])]}));

  // Immediately remove from in-memory state
  songs=songs.filter(x=>x.id!==id);
  try{localStorage.setItem('synthCachedSongs',JSON.stringify(songs));}catch{}
  lastCatalogSignature=catalogSignature(songs);

  // Invalidate any in-flight /api/songs cache
  for(const [k] of apiInflight.entries()){
    if(k.includes('/api/songs'))apiInflight.delete(k);
  }

  // Remove from favorites & recent
  if(favorites.has(id)){
    favorites.delete(id);
    saveUserState();
  }
  recent=recent.filter(item=>(typeof item==='string'?item!==id:item?.id!==id));
  saveUserState();

  // Remove from local playlists
  playlists.forEach(p=>{
    if(Array.isArray(p.songIds)){
      p.songIds=p.songIds.filter(x=>x!==id);
    }
  });

  // Remove from offline storage if downloaded
  if(offlineIds.has(id)){
    offlineIds.delete(id);
    deleteOffline(id).catch(()=>{});
  }

  // If deleted song was currently playing, transition smoothly to next song or stop cleanly
  if(current&&current.id===id){
    if(queue.length>1){
      queue=queue.filter(x=>x.id!==id);
      qIndex=Math.min(qIndex,queue.length-1);
      next();
    }else{
      if(audio){audio.pause();audio.src='';}
      current=null;
      queue=[];
      qIndex=0;
      stopListenTimer();
      updateMediaPlaybackState('none');
      renderPlayer();
    }
  }else{
    queue=queue.filter(x=>x.id!==id);
    if(qIndex>=queue.length)qIndex=Math.max(0,queue.length-1);
  }

  // Update UI immediately
  if(page==='admin')adminManage();
  else renderPage();
  renderPlayer();

  toast(`Deleting "${title}"...`);

  try{
    const tokenToSend=ownerToken||authToken;
    const storedKey=ownerKey||localStorage.getItem('synthOwnerKey')||'';
    const authHeaders={};
    if(tokenToSend)authHeaders['Authorization']='Bearer '+tokenToSend;
    if(storedKey)authHeaders['x-admin-key']=storedKey;

    await api('/api/admin/songs/'+id,{
      method:'DELETE',
      headers:authHeaders
    });

    toast(`Song deleted: "${title}"`);
    if(page==='admin')adminManage();
  }catch(err){
    console.error('Delete failed',err);
    // Rollback local state on error
    songs=originalSongs;
    playlists=originalPlaylists;
    try{localStorage.setItem('synthCachedSongs',JSON.stringify(songs));}catch{}
    if(page==='admin')adminManage();
    else renderPage();
    renderPlayer();
    toast(err.message||'Song deletion failed. Check owner authorization.');
  }
}
function adminDelete(){const b=$('#adminbody');if(!b)return;const list=songs.map(adminRow).join('');b.innerHTML=`<div class="adminPanel"><div class="adminPanelHead"><div><h2>Delete music</h2><p class="sub">Remove songs permanently from the shared server library.</p></div></div><div class="list adminList">${list||'<div class="adminEmpty"><h3>No music to delete</h3><p>Your shared library is currently empty.</p></div>'}</div></div>`}
async function adminActivity(){const b=$('#adminbody');try{const st=await api('/api/admin/stats',{headers:ownerToken?{'Authorization':'Bearer '+ownerToken}:{'x-admin-key':ownerKey}});const events=st.events.map(activityItem).join('');b.innerHTML=`<div class="adminPanel"><div class="adminPanelHead"><div><h2>Activity overview</h2><p class="sub">A clear overview of listening and library activity.</p></div></div><div class="stats adminStats"><div class="stat"><span>Total listening</span><b>${mins(st.listeningSeconds)}</b><small>${fmt(st.listeningSeconds)} tracked</small></div><div class="stat"><span>Languages</span><b>${st.languages.length}</b><small>${esc(st.languages.join(', ')||'None yet')}</small></div><div class="stat"><span>Genres</span><b>${st.genres.length}</b><small>${esc(st.genres.join(', ')||'None yet')}</small></div><div class="stat"><span>Listeners</span><b>${st.users}</b><small>accounts with listening data</small></div></div><div class="activityHead"><h3>Recent activity</h3><span class="countPill">${st.events.length} events</span></div><div class="activitylist adminActivityList">${events||'<div class="adminEmpty compact"><h3>No activity yet</h3><p>Listening and library events will appear here.</p></div>'}</div></div>`}catch{toast('Could not load admin activity')}}
function exportData(){const blob=new Blob([JSON.stringify({songs,playlists},null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='synth-audio-export.json';a.click();URL.revokeObjectURL(a.href)}
function updateMediaSession(s, forceState){
  if(!('mediaSession' in navigator)||!s)return;
  try{
    const art=cover(s);
    let artworkList=[];
    if(art && !art.startsWith('data:image/svg')){
      const artUrl=new URL(art,window.location.origin).href;
      const isPng=/\.png($|\?)/i.test(artUrl);
      const mimeType=isPng?'image/png':'image/jpeg';
      artworkList=[
        {src:artUrl,sizes:'96x96',type:mimeType},
        {src:artUrl,sizes:'128x128',type:mimeType},
        {src:artUrl,sizes:'192x192',type:mimeType},
        {src:artUrl,sizes:'256x256',type:mimeType},
        {src:artUrl,sizes:'384x384',type:mimeType},
        {src:artUrl,sizes:'512x512',type:mimeType}
      ];
    }else{
      const logoUrl=new URL('/logo-512.png',window.location.origin).href;
      const logo192=new URL('/logo-192.png',window.location.origin).href;
      artworkList=[
        {src:logo192,sizes:'192x192',type:'image/png'},
        {src:logoUrl,sizes:'512x512',type:'image/png'}
      ];
    }
    navigator.mediaSession.metadata=new MediaMetadata({
      title:String(s.title||'SYNTH AUDIO'),
      artist:String(s.artist||'Unknown Artist'),
      album:String(s.album||'SYNTH AUDIO'),
      artwork:artworkList
    });
    updateMediaPlaybackState(forceState);
    updateMediaPosition();
  }catch(e){console.debug('Media Session metadata update skipped',e)}
}
async function syncPlaybackEngineState(){
  if(nativeMode()&&nativeReady){
    try{const r=await nativeAudio.isPlaying({audioId:NATIVE_AUDIO_ID});nativePlaying=!!r?.isPlaying}catch{}
    try{const r=await nativeAudio.getCurrentTime({audioId:NATIVE_AUDIO_ID});nativeTime=Number(r?.currentTime)||nativeTime}catch{}
  }else if(audio){
    // If the browser audio engine and UI ever diverge, trust the actual audio
    // source and reconcile current to it instead of rendering stale player state.
    const actual=String(audio.currentSrc||audio.src||'');
    if(actual){
      const match=songs.find(song=>{
        try{return resourceUrl(song.file)===actual}catch{return false}
      });
      if(match && (!current||String(current.id)!==String(match.id))) current=match;
    }
  }
  if(current)updateMediaSession(current);
  updateMediaPlaybackState();
  updateMediaPosition();
}
async function fastSync(){
  if(!current){toast('Nothing is playing yet');return}
  try{
    await syncPlaybackEngineState();
    updateMediaSession(current);
    renderPlayer();
    toast('Player synced');
  }catch(err){console.error('Fast Sync failed',err);toast('Fast Sync could not complete')}
}
function bindMediaSession(){
  if(!('mediaSession' in navigator)||bindMediaSession.bound)return;
  bindMediaSession.bound=true;
  try{navigator.mediaSession.playbackState='none'}catch{}
  const actions={
    play:async()=>{
      if(!current)return;
      if(nativeMode()&&nativeReady){
        try{
          await nativeAudio.play({audioId:NATIVE_AUDIO_ID});
          nativePlaying=true;
          startListenTimer();
          updateMediaPlaybackState();
          updateMediaPosition();
          renderPlayer();
          updateFullPlayer(current);
        }catch{}
      }else{
        try{
          await audio.play();
          startListenTimer();
          updateMediaPlaybackState();
          updateMediaPosition();
          renderPlayer();
          updateFullPlayer(current);
        }catch{}
      }
    },
    pause:async()=>{
      if(!current)return;
      if(nativeMode()&&nativeReady){
        try{
          await nativeAudio.pause({audioId:NATIVE_AUDIO_ID});
          nativePlaying=false;
          stopListenTimer();
          updateMediaPlaybackState();
          updateMediaPosition();
          renderPlayer();
          updateFullPlayer(current);
        }catch{}
      }else{
        audio.pause();
        stopListenTimer();
        updateMediaPlaybackState();
        updateMediaPosition();
        renderPlayer();
        updateFullPlayer(current);
      }
    },
    previoustrack:async()=>{await prev();if(current)updateMediaSession(current);},
    nexttrack:async()=>{await next();if(current)updateMediaSession(current);},
    seekbackward:async e=>{
      const delta=Number(e?.seekOffset)||10;
      await skip(-delta);
      updateMediaPosition();
      renderPlayer();
      updateFullPlayer(current);
    },
    seekforward:async e=>{
      const delta=Number(e?.seekOffset)||10;
      await skip(delta);
      updateMediaPosition();
      renderPlayer();
      updateFullPlayer(current);
    },
    seekto:e=>{
      if(e.seekTime!=null){
        const d=playbackDuration();
        if(d){
          const t=Math.max(0,Math.min(d,e.seekTime));
          if(nativeMode()&&nativeReady){
            nativeAudio.seek({audioId:NATIVE_AUDIO_ID,timeInSeconds:t}).then(()=>{
              nativeTime=t;
              updateMediaPosition();
              renderPlayer();
              updateFullPlayer(current);
            }).catch(()=>{});
          }else{
            audio.currentTime=t;
            updateMediaPosition();
            renderPlayer();
            updateFullPlayer(current);
          }
        }
      }
    },
    stop:async()=>{
      if(!current)return;
      if(nativeMode()&&nativeReady){
        try{await nativeAudio.pause({audioId:NATIVE_AUDIO_ID})}catch{}
        nativePlaying=false;
      }else audio.pause();
      stopListenTimer();
      updateMediaPlaybackState();
      renderPlayer();
      updateFullPlayer(current);
    }
  };
  for(const [name,fn] of Object.entries(actions)){try{navigator.mediaSession.setActionHandler(name,fn)}catch{}}
}
function updateMediaPlaybackState(forceState){
  if(!('mediaSession' in navigator)) return;
  try {
    let state = forceState;
    if(!state){
      if(!current) state = 'none';
      else if(isTrackTransitioning || !userInitiatedPause) state = 'playing';
      else state = playbackPaused() ? 'paused' : 'playing';
    }
    navigator.mediaSession.playbackState = state;
  } catch(e){}
}
function updateMediaPosition(){if(!('mediaSession' in navigator))return;const d=playbackDuration(),p=playbackTime();if(!current||!Number.isFinite(d)||d<=0||!Number.isFinite(p))return;try{if(typeof navigator.mediaSession.setPositionState==='function')navigator.mediaSession.setPositionState({duration:d,playbackRate:1,position:Math.max(0,Math.min(p,d))})}catch{}}
function startMediaSessionSync(){
  if(!('mediaSession' in navigator))return;
  // Position and playback state are synchronized authoritatively by native audio events
  // (playing, pause, seeked, timeupdate, loadedmetadata).
  updateMediaPlaybackState();
  updateMediaPosition();
}
bindSongActivation();
function startLiveRefresh(){
  if(startLiveRefresh.started)return;startLiveRefresh.started=true;bindMediaSession();startMediaSessionSync();
  let refreshing=false,fallbackTimer=null;
  const refresh=(force=false)=>{if(!user||!navigator.onLine||refreshing)return;if(document.hidden&&!force)return;refreshing=true;refreshData({silent:true}).then(({changed})=>{if(!changed)return;if(['home','library','downloads','favorites','recent','playlists','activityStats'].includes(page)||page.startsWith('playlist:')){renderPage();renderPlayer()}}).catch(()=>{}).finally(()=>{refreshing=false})};
  const connect=()=>{
    if(!user||!('EventSource' in window)||!navigator.onLine)return;
    try{if(window.__synthEvents)try{window.__synthEvents.close()}catch{};
      const es=new EventSource(API_BASE+'/api/events/stream');window.__synthEvents=es;
      es.addEventListener('catalog',ev=>{try{const e=JSON.parse(ev.data||'{}');if(e.kind==='playlist'&&e.userEmail&&e.userEmail!==user)return;refresh(true)}catch{refresh(true)}});
      es.addEventListener('song_updated',()=>refresh(true));
      es.addEventListener('user_state',ev=>{try{const e=JSON.parse(ev.data||'{}');if(e.userEmail===user)loadRemoteUserState().catch(()=>{})}catch{}});
      es.onerror=()=>{try{es.close()}catch{};if(navigator.onLine)setTimeout(connect,5000)};
    }catch{}
  };
  fallbackTimer=setInterval(()=>refresh(false),15000);
  window.addEventListener('focus',()=>refresh(true),{passive:true});document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh(true)});window.addEventListener('online',()=>{refresh(true);connect()},{passive:true});connect();
}
async function diagnosePlaybackError(src){if(navigator.onLine===false)return 'Offline: Connect to network or play downloaded songs';try{const r=await fetch(src,{method:'HEAD'});if(r.status===503||r.status===403)return 'B2 storage bandwidth or transaction cap reached. Check Backblaze Caps & Alerts.';if(r.status===404)return 'Song audio file not found on server.';if(r.status>=500)return 'Storage server error. Please try again.';}catch(err){return 'Network connection interrupted while reaching audio server.';}return 'The audio file could not be played. Tap Play to try again.';}
let audioErrorRetryCount=0;
audio?.addEventListener('playing',()=>{audioErrorRetryCount=0;});
audio?.addEventListener('error',async()=>{
  if(!current||nativeMode())return;
  if(audioErrorRetryCount<3){
    audioErrorRetryCount++;
    const resumeTime=Number(audio.currentTime)||0;
    const targetSrc=offlineIds.has(current.id)&&offlineUrls.get(current.id)?offlineUrls.get(current.id):resourceUrl(current.file);
    setTimeout(async()=>{
      try{
        if(audio.src!==targetSrc) audio.src=targetSrc;
        if(resumeTime>0) try{audio.currentTime=resumeTime;}catch{}
        await audio.play();
      }catch(err){
        console.warn('Audio auto-recovery retry',audioErrorRetryCount,'failed',err);
      }
    }, audioErrorRetryCount*800);
    return;
  }
  audioErrorRetryCount=0;
  const targetSrc=offlineIds.has(current.id)&&offlineUrls.get(current.id)?offlineUrls.get(current.id):resourceUrl(current.file);
  const msg=await diagnosePlaybackError(targetSrc);
  toast(msg);
});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='/'){e.preventDefault();go('search');setTimeout(()=>$('#search')?.focus(),60)}});
window.addEventListener('error',e=>console.error('SYNTH AUDIO runtime error',e.error||e.message));
window.addEventListener('unhandledrejection',e=>console.error('SYNTH AUDIO promise error',e.reason));
init();startLiveRefresh();

/* SYNTH AUDIO v56 usability layer — additive only; existing features remain intact. */
(function(){
  const originalGo=window.go;
  if(typeof originalGo==='function'){
    window.go=function(p){
      try{document.querySelector('#pageContent')?.classList.remove('routeSwap');}catch{}
      const r=originalGo.apply(this,arguments);
      requestAnimationFrame(()=>document.querySelector('#pageContent')?.classList.add('routeSwap'));
      return r;
    };
  }
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      const modal=document.querySelector('.modal');
      if(modal)modal.remove();
      const fp=document.querySelector('.fullplayer');
      if(fp)fp.remove();
    }
  });
  document.addEventListener('click',e=>{
    const modal=e.target.closest('.modal');
    if(modal && e.target===modal) modal.remove();
  });
  document.addEventListener('DOMContentLoaded',()=>{
    document.body.setAttribute('data-app','synth-audio');
  });
  // Direct inline play handlers are attached to each song/card. This avoids duplicate touch/click handlers and preserves user activation for audio.play().
})();

document.addEventListener('visibilitychange',()=>{
  if(document.visibilityState==='visible' && sleepTimerEndsAt && Date.now()>=sleepTimerEndsAt) finishSleepTimer();
});
window.addEventListener('click',e=>{const m=document.getElementById('mobileMoreMenu');if(m&&!m.hidden&&!e.target.closest('.mobileMoreMenu')&&!e.target.closest('.mobileNav .mnav:last-child'))closeMobileMore()},{passive:true});


window.addEventListener('offline', () => {
  document.querySelectorAll('.offlineIndicatorPill').forEach(el => el.classList.remove('hidden'));
  document.querySelectorAll('.statusDot').forEach(el => { el.className = 'statusDot offline'; });
  toast('Offline mode: playing downloaded music');
});
window.addEventListener('online', () => {
  document.querySelectorAll('.offlineIndicatorPill').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.statusDot').forEach(el => { el.className = 'statusDot online'; });
  toast('Back online! Syncing library...');
  refreshData({ silent: true });
});

// Prevent drag & drop from navigating away from the application
window.addEventListener('dragover', function(e){ e.preventDefault(); }, false);
window.addEventListener('drop', function(e){ e.preventDefault(); }, false);

// Clipboard file/image paste support in Admin Portal
window.addEventListener('paste', function(e){
  if (page !== 'admin') return;
  const items = e.clipboardData?.items;
  if (!items || !items.length) return;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.kind === 'file') {
      const file = item.getAsFile();
      if (!file) continue;
      const ext = (file.name || '').slice((file.name || '').lastIndexOf('.')).toLowerCase();
      if (['.mp3','.wav','.ogg','.opus','.aac','.m4a','.flac'].includes(ext) || file.type.startsWith('audio/')) {
        e.preventDefault();
        handleAudioFile([file]);
        toast('Pasted audio: ' + (file.name || 'audio track'));
        break;
      } else if (['.jpg','.jpeg','.png','.webp','.gif'].includes(ext) || file.type.startsWith('image/')) {
        e.preventDefault();
        handleCoverFile([file]);
        toast('Pasted artwork: ' + (file.name || 'cover image'));
        break;
      }
    }
  }
});


async function adminEditSong(songId){
  const s = songs.find(x => x.id === songId);
  if(!s){ toast('Song not found'); return; }
  const songToEdit = s;
  const existing = document.querySelector('.editSongModal');
  if(existing) existing.remove();

  let replacementCoverBase64 = '';
  const d = document.createElement('div');
  d.className = 'modal editSongModal';
  d.innerHTML = `
    <div class="modalbox editSongModalBox">
      <div class="modalTitle">
        <div class="modalIconTitle">
          <div class="modalHeaderBadge">${svg('shield')}</div>
          <div>
            <h3>Edit Song</h3>
            <p class="modalSubtitle">Update metadata & replacement artwork</p>
          </div>
        </div>
        <button class="modalClose" onclick="this.closest('.modal').remove()" aria-label="Close">${svg('close')}</button>
      </div>
      <div class="editSongForm">
        <div class="editCoverSection">
          <div class="editCoverPreviewWrap">
            <img id="editCoverPreview" src="${esc(cover(s))}" class="editCoverPreview" onerror="this.onerror=null;this.src=fallback" alt="Artwork preview">
          </div>
          <div class="editCoverControls">
            <label class="secondary editCoverUploadBtn" for="editCoverFileInput">${svg('upload')} Replace Artwork</label>
            <input type="file" id="editCoverFileInput" accept="image/jpeg,image/png,image/webp" style="display:none">
            <small class="subText">JPEG, PNG, or WebP. Synced to Backblaze B2.</small>
          </div>
        </div>
        <div class="formRow">
          <label class="fieldLabel">Song Title *</label>
          <input type="text" id="editSongTitle" class="field" value="${esc(s.title||'')}" placeholder="Track title">
        </div>
        <div class="formRow">
          <label class="fieldLabel">Artist *</label>
          <input type="text" id="editSongArtist" class="field" value="${esc(s.artist||'')}" placeholder="Artist name">
        </div>
        <div class="formRow">
          <label class="fieldLabel">Album</label>
          <input type="text" id="editSongAlbum" class="field" value="${esc(s.album||'')}" placeholder="Album or Single">
        </div>
        <div class="formTwoCols">
          <div class="formRow">
            <label class="fieldLabel">Genre</label>
            <input type="text" id="editSongGenre" class="field" value="${esc(s.genre||'')}" placeholder="e.g. Pop, Soundtrack">
          </div>
          <div class="formRow">
            <label class="fieldLabel">Language</label>
            <input type="text" id="editSongLanguage" class="field" value="${esc(s.language||'')}" placeholder="e.g. English, Tamil">
          </div>
        </div>
        <div id="editSongMsg" class="formMsg"></div>
        <div class="modalActions">
          <button type="button" class="secondary" onclick="this.closest('.modal').remove()">Cancel</button>
          <button type="button" id="saveEditSongBtn" class="primary">Save Changes</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(d);

  const fileInput = d.querySelector('#editCoverFileInput');
  const previewImg = d.querySelector('#editCoverPreview');
  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if(!file) return;
    if(file.size > 10 * 1024 * 1024){ toast('Artwork image must be under 10 MB'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      replacementCoverBase64 = e.target.result;
      previewImg.src = replacementCoverBase64;
    };
    reader.readAsDataURL(file);
  });

  const saveBtn = d.querySelector('#saveEditSongBtn');
  const msgEl = d.querySelector('#editSongMsg');
  saveBtn.addEventListener('click', async () => {
    const title = d.querySelector('#editSongTitle').value.trim();
    const artist = d.querySelector('#editSongArtist').value.trim();
    const album = d.querySelector('#editSongAlbum').value.trim();
    const genre = d.querySelector('#editSongGenre').value.trim();
    const language = d.querySelector('#editSongLanguage').value.trim();
    if(!title){
      msgEl.innerHTML = '<span class="editSongError">Song title is required.</span>';
      return;
    }
    if(!artist){
      msgEl.innerHTML = '<span class="editSongError">Artist name is required.</span>';
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving changes...';
    msgEl.innerHTML = '<span class="editSongProgress"><span class="spinnerSmall"></span> Saving metadata & uploading artwork to Backblaze B2...</span>';

    try {
      const payload = { title, artist, album, genre, language };
      if(replacementCoverBase64) payload.cover = replacementCoverBase64;

      const tokenToSend = ownerToken || authToken;
      const storedKey = ownerKey || localStorage.getItem('synthOwnerKey') || '';
      const authHeaders = {
        'Content-Type': 'application/json'
      };
      if(tokenToSend) authHeaders['Authorization'] = 'Bearer ' + tokenToSend;
      if(storedKey) authHeaders['x-admin-key'] = storedKey;

      const updated = await api('/api/admin/songs/' + songId, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(payload)
      });

      // Invalidate any in-flight /api/songs cache
      for (const [k] of apiInflight.entries()) {
        if (k.includes('/api/songs')) apiInflight.delete(k);
      }

      // Update in local songs array with guaranteed fresh timestamp
      const freshUpdatedAt = updated?.updatedAt || new Date().toISOString();
      const localIdx = songs.findIndex(x => x.id === songId);
      if(localIdx >= 0){
        songs[localIdx] = { ...songs[localIdx], ...updated, updatedAt: freshUpdatedAt };
      }
      // Immediately persist updated catalog locally so refresh never reverts!
      try{ localStorage.setItem('synthCachedSongs', JSON.stringify(songs)); }catch{}
      lastCatalogSignature = catalogSignature(songs);

      // If downloaded offline, update IndexedDB metadata store too!
      if(offlineIds.has(songId)){
        putOfflineMeta(songId, { song: songs[localIdx], downloadedAt: Date.now() }).catch(()=>{});
      }

      // Invalidate cached artwork theme for old and new covers so colors compute immediately!
      const oldCacheKey = songId + ':' + (songToEdit?.cover || s?.cover || '');
      artworkColorCache.delete(oldCacheKey);
      if(updated?.cover){
        artworkColorCache.delete(songId + ':' + updated.cover);
      }

      // Update in queue if present
      queue = queue.map(x => x.id === songId ? { ...x, ...updated, updatedAt: freshUpdatedAt } : x);

      if(current && current.id === songId){
        current = { ...current, ...updated, updatedAt: freshUpdatedAt };
        renderPlayer();
        updateFullPlayer(current);
        updateMediaSession(current);
      }
      d.remove();
      toast('Song updated successfully!');
      if(page === 'admin') adminManage();
      else render();
    } catch(err) {
      console.error('Save edit song failed', err);
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Changes';
      msgEl.innerHTML = '<span class="editSongError">' + esc(err.message || 'Failed to save changes. Please try again.') + '</span>';
    }
  });
}

function quickSearch(val){ const input=$('#search'); if(input){ input.value=val; searchNow(); } }