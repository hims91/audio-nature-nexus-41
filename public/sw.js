
const CACHE_NAME = 'will-hall-sound-v3';
const urlsToCache = [
  '/',
  '/portfolio',
  '/contact'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Installing service worker and caching resources');
        // Cache each URL individually to prevent one failure from breaking all caching
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(err => {
              console.warn(`Failed to cache ${url}:`, err);
              return Promise.resolve();
            })
          )
        );
      })
      .catch((error) => {
        console.error('Failed to open cache:', error);
        return Promise.resolve();
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Fetch event
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // If both cache and network fail, return a basic response for navigation requests
          if (event.request.mode === 'navigate') {
            return new Response('Offline - Please check your connection', { 
              status: 503, 
              statusText: 'Service Unavailable',
              headers: new Headers({ 'Content-Type': 'text/plain' })
            });
          }
          // For other requests, just let them fail
          return new Response('Resource not available offline', {
            status: 404,
            statusText: 'Not Found'
          });
        });
      })
      .catch(() => {
        // If cache matching fails, try network
        return fetch(event.request).catch(() => {
          return new Response('Service temporarily unavailable', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    }).catch((error) => {
      console.error('Cache cleanup failed:', error);
      return Promise.resolve();
    })
  );
});

// Handle skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
