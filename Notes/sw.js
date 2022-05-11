const version = 1.12345;
const staticCacheName = `site-shell-assets-v-${version}`;
const dynamicCacheName = `site-dynamic-assets-v-${version}`;
const dynamicCacheLimit = 15;
const shellAssets = [
  "/Others/Notes/",
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

self.addEventListener("message", (event) => {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});

// install event
// self.addEventListener("install", (event) => {
//   event.waitUntil();
// });

// activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await caches.open(staticCacheName).then((cache) => {
        cache.addAll(shellAssets);
      });
      await caches.keys().then((keys) => {
        return Promise.all(
          keys
            .filter(
              (key) => key !== staticCacheName && key !== dynamicCacheName
            )
            .map((key) => caches.delete(key))
        );
      });
      clients.claim();
    })()
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
