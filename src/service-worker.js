/* eslint-disable no-restricted-globals */

// Increment this version whenever the app changes
const CACHE_VERSION = "v2"; // Update this version when files change
const CACHE_NAME = `barcode-scanner-cache-${CACHE_VERSION}`;
const FILES_TO_CACHE = [
  "/", // Root file
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/logo192.png",
  "/logo512.png",
  "/main.js", // Add hashed files in production (e.g., /main.abcdef123.js)
  "/styles.css", // Add hashed files in production
];

// Install Event
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching files...");
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting(); // Force activation after installation
});

// Activate Event
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log(`[Service Worker] Deleting old cache: ${cache}`);
            return caches.delete(cache);
          }
        })
      )
    )
  );

  self.clients.claim(); // Take control of all pages under the scope immediately
});

// Fetch Event
self.addEventListener("fetch", (event) => {
  console.log(`[Service Worker] Fetching resource: ${event.request.url}`);

  // Use network-first strategy for dynamic content
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log("[Service Worker] Found in cache:", event.request.url);
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          // Cache dynamic content if it is a GET request
          if (event.request.method === "GET") {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          }

          return networkResponse;
        })
        .catch(() => {
          // Optional: Return a fallback page for offline use
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        });
    })
  );
});
