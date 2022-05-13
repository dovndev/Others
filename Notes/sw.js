const version = 911.007;
const staticCacheKey = `site-shell-assets-v-${version}`;
const dynamicCacheKey = `site-dynamic-assets-v-${version}`;
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
              return shellAssets.map(async (url) => {
                return await fetch(new Request(url, { cache: "reload" })).then(
                  async (fetchRes) => await cache.put(url, fetchRes.clone())
                );
              });
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
  }
});

//install event
// self.addEventListener("install", (event) => {
//    console.log("install event");
// });

//activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// fetch events
self.addEventListener("fetch", (event) => {
  if (event.request.method != "GET") return;
  let request = event.request;
  if (request.url === "/Others/Notes/index.html") {
    request = new Request("/Others/Notes/");
  }

  event.respondWith(
    caches.match(request).then((cacheRes) => {
      return (
        cacheRes ||
        fetch(request).then((fetchRes) => {
          return caches.open(dynamicCacheKey).then((cache) => {
            cache.put(request.url, fetchRes.clone());

            // check cached items size
            limitCacheSize(dynamicCacheKey, dynamicCacheLimit);
            return fetchRes;
          });
        })
      );
    })
  );
});
