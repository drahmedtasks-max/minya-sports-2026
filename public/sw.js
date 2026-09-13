// Service Worker for Minia Sports Operations Platform (PWA Offline Ready)
const CACHE_NAME = 'minia-sports-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/standalone_minia_portal.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Safe fallback in dev/sandboxed environments
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only cache GET requests for same origin or fonts/cdn
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).catch(() => {
        // If offline and requesting html, fallback to cached index or standalone
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/standalone_minia_portal.html') || caches.match('/');
        }
      });
    })
  );
});
