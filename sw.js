const CACHE_NAME = 'weather-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  'https://ta3bviqjtxy1kv7x.public.blob.vercel-storage.com/bb1-gMiAHJ5ILdALhLF9EKnw9QCMXwooYf.png'
];
const apiCacheName = 'weather-api-cache-v1';

// Install event: Cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event: Cache API responses
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // Cache OpenWeatherMap API requests
  if (requestUrl.origin === 'https://api.openweathermap.org') {
    event.respondWith(
      caches.open(apiCacheName).then(cache => {
        return fetch(event.request).then(networkResponse => {
          // Cache the API response
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        }).catch(() => {
          // Return cached API response if offline
          return caches.match(event.request);
        });
      })
    );
  } else {
    // Serve static assets from cache or network
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME, apiCacheName];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
