const CACHE = "financeos-v4-8-pdf-statements";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./src/app.js",
  "./src/constants.js",
  "./src/icons.js",
  "./src/import.js",
  "./vendor/pdfjs/pdf.worker.mjs",
  "./vendor/pdfjs/pdf.mjs",
  "./src/share-target.js",
  "./src/pdf-import.js",
  "./src/logic.js",
  "./src/motion.js",
  "./src/storage.js",
  "./src/pwa.js",
  "./src/design/tokens.css",
  "./src/design/base.css",
  "./src/components/components.css",
  "./src/screens/screens.css",
  "./src/components/components.js",
  "./src/ui.js",
  "./src/views.js",
  "./assets/icons/favicon.svg",
  "./assets/icons/icon-32.png",
  "./assets/icons/icon-96.png",
  "./assets/icons/icon-180.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-maskable-192.png",
  "./assets/icons/icon-maskable-512.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys =>
        Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))
      ),
      self.clients.claim()
    ])
  );
});


const SHARE_CACHE = "financeos-shared-files";
const SHARE_KEY = "./__shared_pdf__";

async function handleShareTarget(request) {
  const formData = await request.formData();
  const file = formData.get("statement");
  if (!(file instanceof File) || file.type !== "application/pdf") {
    return Response.redirect("./?shared-pdf-error=1", 303);
  }

  const cache = await caches.open(SHARE_CACHE);
  await cache.put(
    SHARE_KEY,
    new Response(file, {
      headers: {
        "content-type": file.type,
        "x-financeos-filename": file.name
      }
    })
  );

  return Response.redirect("./?shared-pdf=1", 303);
}

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method === "POST" && new URL(request.url).pathname.endsWith("/share-target")) {
    event.respondWith(handleShareTarget(request));
    return;
  }

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      const network = fetch(request)
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});
