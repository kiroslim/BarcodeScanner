/* eslint-disable no-restricted-globals */

import { precacheAndRoute } from 'workbox-precaching';

// Precache all assets generated during the build process
precacheAndRoute(self.__WB_MANIFEST);

// Install Event
self.addEventListener("install", (_event) => {
  console.log("[Service Worker] Installing...");
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (_event) => {
  console.log("[Service Worker] Activating...");
  _event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((_cache) => {
          return null; // Placeholder for old cache removal
        })
      )
    )
  );

  self.clients.claim();
});


// Fetch Event
self.addEventListener("fetch", (event) => {
  console.log(`[Service Worker] Fetching resource: ${event.request.url}`);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log("[Service Worker] Found in cache:", event.request.url);
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Optional: Return a fallback page for offline use
        if (event.request.mode === "navigate") {
          return caches.match("/index.html");
        }
      });
    })
  );
});
