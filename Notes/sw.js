const version = 1.001;
const staticCacheKey = `site-shell-assets-v-${version}`;
const dynamicCacheKey = `site-dynamic-assets-v-${version}`;
const dynamicCacheLimit = 15;
let selfUpdateTimeout;
const shellAssets = [
  "/Others/Notes/",
  "/Others/Notes/react-ui.js",
  "/Others/Notes/app.js",
  "/Others/Notes/index.css",
  "/Others/Notes/icons/pen.svg",
  "https://unpkg.com/@babel/standalone/babel.min.js",
  "https://unpkg.com/react@17/umd/react.production.min.js",
  "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js",
];

// cache size limit function
const limitCacheSize = (key, size) => {
  caches.open(key).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        keys
          .filter((key, index) => index >= size)
          .map((key) => cache.delete(key));
      }
    });
  });
};

// listening for messages
self.addEventListener("message", async (event) => {
  const allClients = await self.clients.matchAll();
  switch (event.data.action) {
    case "update-available": {
      await caches.keys().then((keys) => {
        return Promise.all(
          keys
            .filter((key) => key !== staticCacheKey && key !== dynamicCacheKey)
            .map((key) => caches.delete(key))
        );
      });
      allClients.forEach((client) => {
        client.postMessage(event.data);
      });
      break;
    }
    case "update": {
      caches
        .keys()
        .then((keys) => {
          return Promise.all(keys.map(async (key) => await caches.delete(key)));
        })
        .then(() => {
          caches
            .open(staticCacheKey)
            .then((cache) => {
              return Promise.all(
                shellAssets.map(async (url) => {
                  return await fetch(
                    new Request(url, { cache: "reload" })
                  ).then(
                    async (fetchRes) => await cache.put(url, fetchRes.clone())
                  );
                })
              );
            })
            .catch((error) => {
              console.error(error);
            })
            .finally(() => {
              self.skipWaiting();
            });
        });
      break;
    }
    case "reload-data": {
      allClients.forEach((client) => {
        if (event.source.id === client.id) return;
        client.postMessage(event.data);
      });
      break;
    }
    case "update-found": {
      clearTimeout(selfUpdateTimeout);
      break;
    }
  }
});

// install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(staticCacheKey).then((cache) => cache.addAll(shellAssets))
  );
  selfUpdateTimeout = setTimeout(() => self.skipWaiting(), 5000);
});

//activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// fetch events
self.addEventListener("fetch", (event) => {
  if (event.request.method != "GET") return;

  event.respondWith(
    caches.match(event.request).then((cacheRes) => {
      return (
        cacheRes ||
        fetch(event.request).then((fetchRes) => {
          return caches.open(dynamicCacheKey).then((cache) => {
            cache.put(event.request.url, fetchRes.clone());

            // check cached items size
            limitCacheSize(dynamicCacheKey, dynamicCacheLimit);
            return fetchRes;
          });
        })
      );
    })
  );
});
