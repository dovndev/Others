const version = 1.008;
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

const clearAllCache = (escape) => {
  return caches.keys().then((keys) => {
    let keysToClear = keys;
    if (escape) {
      keysToClear = keys.filter((key) => !escape.includes(key));
    }
    return Promise.all(
      keysToClear.map(async (key) => await caches.delete(key))
    );
  });
};

const cacheShellAssets = (fresh) => {
  return caches
    .open(staticCacheKey)
    .then((cache) => {
      if (fresh) {
        return Promise.all(
          shellAssets.map(async (url) => {
            return await fetch(new Request(url, { cache: "reload" })).then(
              async (fetchRes) => await cache.put(url, fetchRes.clone())
            );
          })
        );
      } else cache.addAll(shellAssets);
    })
    .catch((error) => {
      console.error(error);
    });
};

const update = () => {
  return clearAllCache().then(() => {
    cacheShellAssets(true).then(() => {
      self.skipWaiting();
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
      update();
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
      if (selfUpdateTimeout) clearTimeout(selfUpdateTimeout);
      selfUpdateTimeout = undefined;
      break;
    }
    case "reinstall": {
      clearAllCache().then(() => {
        allClients.forEach((client) => {
          if (event.source.id === client.id) {
            client.postMessage(event.data);
          }
        });
      });
      break;
    }
  }
});

// install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      if (keys.length === 0) {
        cacheShellAssets();
        return self.skipWaiting();
      } else selfUpdateTimeout = setTimeout(update, 5000);
    })
  );
});

//activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// fetch events
self.addEventListener("fetch", (event) => {
  if (event.request.method != "GET") return;
  if (event.request.cache === "reload") return;

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
