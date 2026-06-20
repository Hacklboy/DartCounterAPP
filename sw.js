const CACHE_NAME = 'dartcount-v1';
const ASSETS = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Installieren des Service Workers und Inhalte in den Cache laden
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('DartCount Cache wird aufgebaut...');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Aktivieren und alte Caches löschen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Netzwerk-Anfragen abfangen und bevorzugt aus dem Cache bedienen
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Wenn es im Cache ist, nutze es, andernfalls hole es aus dem Netzwerk
      return cachedResponse || fetch(event.request);
    })
  );
});
