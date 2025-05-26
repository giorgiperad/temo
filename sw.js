const CACHE_NAME = 'weather-app-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    'https://ta3bviqjtxy1kv7x.public.blob.vercel-storage.com/bb-CZSrKO0GN7VGFnjZTR88zyTqV5pNs7.png'
];

// Install event: Cache essential files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch event: Serve from cache or network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
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
