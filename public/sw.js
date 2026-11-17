/**
 * Service Worker for Facebook Pixel Resource Caching
 * Caches Facebook resources locally to improve performance on repeat visits
 * Estimated savings: 111 KiB on repeat visits
 * 
 * IMPORTANT: Update CACHE_VERSION on each deployment to bust old caches
 */

const CACHE_VERSION = 'v2';
const CACHE_NAME = `rino-facebook-cache-${CACHE_VERSION}`;
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Facebook resources to cache with longer lifetimes
const FACEBOOK_RESOURCES = [
  'https://connect.facebook.net/en_US/fbevents.js',
  'https://www.facebook.com/tr'
];

// Install event - no need to pre-cache
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event - clean up old caches
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

// Fetch event - implement stale-while-revalidate strategy for Facebook resources
self.addEventListener('fetch', (event) => {
  // Add try-catch to prevent service worker errors from breaking the site
  try {
    const url = new URL(event.request.url);
    
    // Only handle Facebook resources
    if (url.hostname === 'connect.facebook.net' || 
        (url.hostname === 'www.facebook.com' && url.pathname === '/tr')) {
      
      event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          
          // Check if cached response is still fresh (within 7 days)
          if (cachedResponse) {
            const cachedTime = new Date(cachedResponse.headers.get('sw-cached-time')).getTime();
            const now = Date.now();
            
            if (now - cachedTime < CACHE_DURATION) {
              // Return cached response and update in background
              const fetchPromise = fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                  const responseToCache = networkResponse.clone();
                  const headers = new Headers(responseToCache.headers);
                  headers.set('sw-cached-time', new Date().toISOString());
                  
                  const modifiedResponse = new Response(responseToCache.body, {
                    status: responseToCache.status,
                    statusText: responseToCache.statusText,
                    headers: headers
                  });
                  
                  cache.put(event.request, modifiedResponse);
                }
                return networkResponse;
              }).catch(() => cachedResponse); // Fallback to cache on network error
              
              return cachedResponse;
            }
          }
          
          // No valid cache, fetch from network
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              const headers = new Headers(responseToCache.headers);
              headers.set('sw-cached-time', new Date().toISOString());
              
              const modifiedResponse = new Response(responseToCache.body, {
                status: responseToCache.status,
                statusText: responseToCache.statusText,
                headers: headers
              });
              
              cache.put(event.request, modifiedResponse);
            }
            return networkResponse;
          }).catch(() => {
            // If network fails and we have an expired cache, return it anyway
            if (cachedResponse) {
              return cachedResponse;
            }
            throw new Error('Network request failed and no cache available');
          });
        });
      })
      );
    }
  } catch (error) {
    // If there's any error (like in Brave with Shields up), just pass through the request
    console.log('Service Worker fetch error (may be expected in privacy browsers):', error);
  }
});
