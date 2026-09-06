const CACHE_NAME = 'netmap-pro-offline-v1';

const STATIC_SHELL = [
  '/',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg'
];

// Install: Cache essential app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_SHELL);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate: Clean up previous cache versions and claim clients
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
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch: Network-First with Cache Fallback for offline field support
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignore non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Network-first strategy
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // Cache valid responses
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // Network unavailable (e.g. subterranean shelter, field cabinet without reception)
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // For navigation requests, fallback to cached root shell
        if (request.mode === 'navigate') {
          const shellResponse = await caches.match('/');
          if (shellResponse) {
            return shellResponse;
          }
        }

        // Return offline notice if completely uncached
        return new Response(
          JSON.stringify({
            offline: true,
            message: 'NetMap Pro Offline: משאב זה עדיין אינו שמור במטמון המכשיר.'
          }),
          {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
          }
        );
      })
  );
});
