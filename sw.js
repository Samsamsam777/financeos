const CACHE = "financeos-v3-apple-polish";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./src/app.js",
  "./src/constants.js",
  "./src/icons.js",
  "./src/logic.js",
  "./src/motion.js",
  "./src/storage.js",
  "./src/styles.css",
  "./src/ui.js",
  "./src/views.js",
  "./TOKENS.md",
  "./DESIGN.md"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});
