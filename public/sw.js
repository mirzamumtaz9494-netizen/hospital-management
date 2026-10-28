// VitalSync HMS - Offline Service Worker & Asset Cache
const CACHE_NAME = "vitalsync-hms-cache-v1";
const STATIC_ASSETS = [
  "/",
  "/opd",
  "/ipd",
  "/accounts",
  "/pharmacy",
  "/laboratory",
  "/doctors",
  "/manifest.json",
  "/favicon.ico"
];

// Install: Cache essential shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("Service worker precache warning:", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: Purge old version caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network First, Fallback to Local Cache if Offline
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip chrome-extension or external api requests
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache successful responses for offline use
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // Network failed (offline): fetch from local cache
        const cached = await caches.match(event.request);
        if (cached) return cached;

        // If navigating to a page while offline, return cached root or opd
        if (event.request.mode === "navigate") {
          const fallbackPage = await caches.match("/opd") || await caches.match("/");
          if (fallbackPage) return fallbackPage;
        }

        return new Response("Offline - Local Cache Not Available", {
          status: 503,
          headers: { "Content-Type": "text/plain" },
        });
      })
  );
});
