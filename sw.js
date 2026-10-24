const CACHE = 'synth-audio-shell-v65r1';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css?v=65r2',
  '/style.css',
  '/capacitor.js?v=65r4',
  '/capacitor.js',
  '/app.js?v=65r4',
  '/app.js',
  '/native-config.js?v=65r4',
  '/native-config.js',
  '/native-audio-bridge.js?v=65r4',
  '/native-audio-bridge.js',
  '/manifest.json',
  '/logo.svg',
  '/logo.png',
  '/logo-192.png',
  '/logo-512.png',
  '/favicon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(async c => {
      await Promise.allSettled(ASSETS.map(url => c.add(url)));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k.startsWith('synth-audio-shell-') && k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.origin !== self.location.origin) return;

  // Never cache or intercept audio streams, uploads, API responses, or byte ranges
  if (u.pathname.startsWith('/uploads/') || u.pathname.startsWith('/api/') || e.request.headers.has('range')) return;

  // 1. Navigation requests (App Shell loading & offline refresh)
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(r => {
          if (r && r.status === 200) {
            const copy = r.clone();
            caches.open(CACHE).then(c => {
              c.put(e.request, copy);
              c.put('/index.html', r.clone());
              c.put('/', r.clone());
            }).catch(() => {});
          }
          return r;
        })
        .catch(async () => {
          const cached = await caches.match(e.request, { ignoreSearch: true })
            || await caches.match('/index.html')
            || await caches.match('/');
          if (cached) return cached;
          return new Response('<!doctype html><title>SYNTH AUDIO</title><div id="app"></div>', {
            status: 200,
            headers: { 'Content-Type': 'text/html' }
          });
        })
    );
    return;
  }

  // 2. Static Application Shell Assets (CSS, JS, Fonts, Logos, Manifest)
  e.respondWith(
    (async () => {
      const cached = await caches.match(e.request)
        || await caches.match(e.request, { ignoreSearch: true })
        || await caches.match(u.pathname);

      if (cached) {
        // Non-blocking background revalidation
        fetch(e.request).then(r => {
          if (r && r.status === 200) {
            caches.open(CACHE).then(c => c.put(e.request, r)).catch(() => {});
          }
        }).catch(() => {});
        return cached;
      }

      try {
        const r = await fetch(e.request);
        if (r && r.status === 200) {
          const copy = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        }
        return r;
      } catch (err) {
        if (u.pathname.endsWith('.png') || u.pathname.endsWith('.svg') || u.pathname.endsWith('.ico')) {
          const logo = await caches.match('/logo.png') || await caches.match('/logo.svg');
          if (logo) return logo;
        }
        return new Response('', { status: 408, statusText: 'Offline Asset Unavailable' });
      }
    })()
  );
});
