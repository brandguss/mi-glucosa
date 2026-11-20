// Service worker de Mi Glucosa: permite abrir la app sin internet.
// Cambia la versión cada vez que publiques cambios para forzar la actualización.
const CACHE = 'mi-glucosa-v11';
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './firebase-config.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Nunca interceptar las llamadas de datos ni de inicio de sesión de Firebase
  if (/googleapis\.com$/.test(url.hostname) && !url.hostname.startsWith('fonts.')) return;
  if (url.hostname.endsWith('firebaseapp.com')) return;

  // Página principal y configuración: primero red (para recibir actualizaciones), si falla usa la copia guardada
  if (req.mode === 'navigate' || url.pathname.endsWith('firebase-config.js')) {
    e.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })
        .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // Íconos, fuentes y librerías de Firebase: copia guardada y se actualiza en segundo plano
  if (url.origin === location.origin || url.hostname === 'www.gstatic.com' || url.hostname.startsWith('fonts.')) {
    e.respondWith(
      caches.match(req).then(cached => {
        const net = fetch(req).then(res => {
          if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
          return res;
        }).catch(() => cached);
        return cached || net;
      })
    );
  }
});
