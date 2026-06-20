const CACHE_NAME = 'eduattend-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/login.html',
  '/js/api.js',
  '/js/utils.js',
  '/js/theme.js',
  '/components/layout.js',
  '/components/ui.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', (event) => {
  // Hanya intercept GET request (tidak untuk API call)
  if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
    return;
  }

  // Network First strategy for HTML pages
  if (event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      }).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }

  // Network First strategy for HTML files
  if (event.request.headers.get('accept').includes('text/html')) {
      event.respondWith(
          fetch(event.request).then((response) => {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, clone);
              });
              return response;
          }).catch(() => {
              return caches.match(event.request);
          })
      );
      return;
  }

  // Cache First strategy for static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
