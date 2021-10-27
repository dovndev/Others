const staticCacheName = "site-static-v1";
const dynamicCacheName = "site-dynamic-v1";
const assets = [
  "/Others/Notes/",
  "/Others/Notes/index.html",
  "/Others/Notes/react-ui.js",
  "/Others/Notes/index.css",
  "https://unpkg.com/@babel/standalone/babel.min.js",
  "https://unpkg.com/react@17/umd/react.production.min.js",
  "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js",
];

const avoidFiles = ["/Others/Notes/manifest.json", "/Others/Notes/sw.js"];

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
self.addEventListener("install", (evt) => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log("caching shell assets");
      cache.addAll(assets);
    })
  );
  self.skipWaiting();
});

// activate event
self.addEventListener("activate", (evt) => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then((keys) => {
      clients.claim();
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// fetch events
self.addEventListener("fetch", (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((cacheRes) => {
      return (
        cacheRes ||
        fetch(evt.request).then((fetchRes) => {
          return caches.open(dynamicCacheName).then((cache) => {
            if (!avoidFiles.includes(evt.request.url)) {
              cache.put(evt.request.url, fetchRes.clone());
            }

            // check cached items size
            limitCacheSize(dynamicCacheName, 15);
            return fetchRes;
          });
        })
      );
    })
  );
});
