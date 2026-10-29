// VitalSync Enterprise HMS - Offline PWA Service Worker (v3)
const CACHE_NAME = "vitalsync-hms-v3";

const PRECACHE_ROUTES = [
  "/",
  "/opd",
  "/ipd",
  "/accounts",
  "/referrals",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/favicon.ico"
];

// Helper: Safely timeout a fetch request if network is hanging
const fetchWithTimeout = (request, timeoutMs = 2500) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Network timeout"));
    }, timeoutMs);

    fetch(request)
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

// 1. Install: Deep pre-cache core routes AND automatically extract & pre-cache static JS/CSS chunks
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      const discoveredAssets = new Set(PRECACHE_ROUTES);

      // Pre-fetch all core HTML routes and parse static chunk references
      for (const route of PRECACHE_ROUTES) {
        try {
          const res = await fetch(route, { cache: "no-cache" });
          if (res.ok) {
            await cache.put(route, res.clone());

            // If HTML or JSON, extract static bundle URLs
            const contentType = res.headers.get("content-type") || "";
            if (contentType.includes("text/html")) {
              const html = await res.text();
              const regex = /(?:src|href)=["'](\/_next\/static\/[^"']+)["']/g;
              let match;
              while ((match = regex.exec(html)) !== null) {
                discoveredAssets.add(match[1]);
              }
            }
          }
        } catch (err) {
          console.warn("Precache skipped route:", route, err);
        }
      }

      // Pre-cache all discovered Next.js static scripts, CSS and assets
      const staticAssets = Array.from(discoveredAssets).filter(
        (url) => url.startsWith("/_next/static/")
      );

      await Promise.allSettled(
        staticAssets.map(async (assetUrl) => {
          try {
            const assetRes = await fetch(assetUrl, { cache: "no-cache" });
            if (assetRes.ok) {
              await cache.put(assetUrl, assetRes);
            }
          } catch (e) {
            // Non-critical asset failure
          }
        })
      );
    })
  );
  self.skipWaiting();
});

// 2. Activate: Purge obsolete cache versions immediately and claim all open clients
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Removing obsolete HMS cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Strategy
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip third-party CDNs, external APIs, and Supabase cloud endpoints
  if (url.origin !== self.location.origin) return;

  // Strategy A: Next.js Static Bundles, JS, CSS, Media (Cache First)
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".woff2")
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;

        return fetch(event.request)
          .then((networkRes) => {
            if (networkRes && networkRes.status === 200) {
              const resClone = networkRes.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, resClone);
              });
            }
            return networkRes;
          })
          .catch(() => {
            return new Response("", { status: 408 });
          });
      })
    );
    return;
  }

  // Strategy B: Page Navigation & HTML (Network First with Fast Timeout, Fallback to Local Cache)
  if (
    event.request.mode === "navigate" ||
    (event.request.headers.get("accept") &&
      event.request.headers.get("accept").includes("text/html"))
  ) {
    event.respondWith(
      fetchWithTimeout(event.request, 2000)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const resClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, resClone);
              cache.put(url.pathname, resClone.clone());
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // Network failed or device is completely offline:
          // 1. Try exact URL match
          const matchExact = await caches.match(event.request, { ignoreSearch: true });
          if (matchExact) return matchExact;

          // 2. Try clean pathname (e.g. /opd or /)
          const matchPath = await caches.match(url.pathname, { ignoreSearch: true });
          if (matchPath) return matchPath;

          // 3. Fallback to /opd or / shell
          const fallbackOpd = await caches.match("/opd", { ignoreSearch: true });
          if (fallbackOpd) return fallbackOpd;

          const fallbackRoot = await caches.match("/", { ignoreSearch: true });
          if (fallbackRoot) return fallbackRoot;

          // 4. Emergency graceful HTML offline card
          return new Response(
            `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>VitalSync HMS - Offline Mode</title>
              <style>
                body { background: #0c1322; color: #f8fafc; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; text-align: center; }
                .card { background: #111a2e; border: 1px solid #1e293b; border-radius: 24px; padding: 32px 24px; max-width: 420px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
                .badge { display: inline-block; background: rgba(20, 184, 166, 0.2); color: #14b8a6; border: 1px solid rgba(20, 184, 166, 0.4); padding: 4px 14px; border-radius: 999px; font-size: 11px; font-weight: 700; margin-bottom: 16px; letter-spacing: 0.5px; }
                h1 { font-size: 22px; margin: 0 0 10px; color: #fff; font-weight: 700; }
                p { font-size: 13.5px; color: #94a3b8; line-height: 1.6; margin: 0 0 24px; }
                .btn { background: #0d9488; color: #fff; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; font-size: 14px; cursor: pointer; text-decoration: none; display: inline-block; width: 100%; box-sizing: border-box; transition: background 0.2s; }
                .btn:hover { background: #14b8a6; }
              </style>
            </head>
            <body>
              <div class="card">
                <span class="badge">● OFFLINE LOCAL ENGINE</span>
                <h1>VitalSync HMS</h1>
                <p>Offline mode is active. You can register OPD patients and create tokens without internet. All records are safely saved on this device and will automatically sync once connected.</p>
                <a href="/opd" class="btn" onclick="window.location.reload()">Open OPD Register</a>
              </div>
            </body>
            </html>`,
            {
              status: 200,
              headers: { "Content-Type": "text/html; charset=utf-8" },
            }
          );
        })
    );
    return;
  }

  // Strategy C: Client-side routing / Next.js RSC requests (?_rsc=...)
  event.respondWith(
    fetch(event.request)
      .then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, resClone);
          });
        }
        return networkRes;
      })
      .catch(async () => {
        const cached = await caches.match(event.request, { ignoreSearch: true });
        if (cached) return cached;
        const matchPath = await caches.match(url.pathname, { ignoreSearch: true });
        if (matchPath) return matchPath;
        return new Response("", { status: 408 });
      })
  );
});
