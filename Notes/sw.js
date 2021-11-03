const version = 4;
const staticCacheName = `site-shell-assets-v${version}`;
const dynamicCacheName = `site-dynamic-assets-v${version}`;
const dynamicCacheLimit = 15;
const skipWaiting = true;
const clientsClaim = true;
const shellAssets = [
  "/Others/Notes/",
  "/Others/Notes/index.html",
  "/Others/Notes/react-ui.js",
  "/Others/Notes/app.js",
  "/Others/Notes/index.css",
  "https://unpkg.com/@babel/standalone/babel.min.js",
  "https://unpkg.com/react@17/umd/react.production.min.js",
  "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js",
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log("Caching Shell Assets");
      cache.addAll(shellAssets);
    })
  );
  if (skipWaiting) self.skipWaiting();
  console.log("Service-Worker Installed");
});

// activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      if (clientsClaim) clients.claim();
      console.log("Started Using New Service-Worker");
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// fetch events
self.addEventListener("fetch", (event) => {
  if (event.request.method != "GET") return;

  event.respondWith(
    caches.match(event.request).then((cacheRes) => {
      return (
        cacheRes ||
        fetch(event.request).then((fetchRes) => {
          return caches.open(dynamicCacheName).then((cache) => {
            cache.put(event.request.url, fetchRes.clone());

            // check cached items size
            limitCacheSize(dynamicCacheName, dynamicCacheLimit);
            return fetchRes;
          });
        })
      );
    })
  );
});
