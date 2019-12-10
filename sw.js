
const CACHE = "Precache";
const precacheFiles = [
  './index.html',
  './src/app.css',
  './src/app.js',
  './img/hero.jpg'
];

self.addEventListener("install", function (event) {
  console.log(" Install Event processing");

  console.log(" Skip waiting on install");
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log("Caching pages during install");
      return cache.addAll(precacheFiles);
    })
  );
});

self.addEventListener("activate", function (event) {
  console.log("Claiming clients for current page");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (event) { 
  if (event.request.method !== "GET") return;

  event.respondWith(
    fromCache(event.request).then(
      function (response) {
        event.waitUntil(
          fetch(event.request).then(function (response) {
            return updateCache(event.request, response);
          })
        );

        return response;
      },
      function () {
        return fetch(event.request)
          .then(function (response) {
            event.waitUntil(updateCache(event.request, response.clone()));

            return response;
          })
          .catch(function (error) {
            console.log("Network request failed and no cache." + error);
          });
      }
    )
  );
});

function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (!matching || matching.status === 404) {
        return Promise.reject("no-match");
      }
      return matching;
    });
  });
}
function updateCache(request, response) {
  return caches.open(CACHE).then(function (cache) {
    return cache.put(request, response);
  });
}
