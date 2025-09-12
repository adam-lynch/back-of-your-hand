/* global clients skipWaiting */
/*
  HTML: network, then offline page
  CSS: cache, then network
  JS: cache, then network
  Tile images: network
*/

const generalCacheName = "files-v4";
const offlinePageUrl = "/offline";
const tileCacheName = "tiles-v2";
const tileMaxEntries = 5000; // first in, first out

addEventListener("install", (installEvent) => {
  skipWaiting();
  installEvent.waitUntil(
    caches.open(generalCacheName).then((cache) => {
      return cache.addAll([
        "/favicon.png",
        "/gc.js",
        "/images/android-chrome-512x512.png",
        "/images/apple-touch-icon.png",
        "/images/leaflet/marker-icon-2x.png",
        "/images/leaflet/marker-icon.png",
        "/images/leaflet/marker-shadow.png",
        "/manifest.webmanifest",
        offlinePageUrl, // The only HTML page cached
      ]);
    }),
  );
});

addEventListener("activate", (activateEvent) => {
  clients.claim();

  // Prune old caches
  activateEvent.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => ![generalCacheName, tileCacheName].includes(key))
            .map((key) => caches.delete(key)),
        ),
      ),
  );
});

addEventListener("fetch", (fetchEvent) => {
  // https://stackoverflow.com/a/49719964/727074
  if (
    fetchEvent.request.cache === "only-if-cached" &&
    fetchEvent.request.mode !== "same-origin"
  ) {
    return;
  }

  const request = fetchEvent.request;
  const url = new URL(request.url);
  if (
    request.method !== "GET" ||
    ["extension", "masked-url"].some((substring) =>
      url.protocol.includes(substring),
    ) ||
    /(^count|backend)\.(local-backofyourhand--backend.com|backofyourhand.com|backofyourhand.pages.dev)$/.test(
      url.hostname,
    )
  ) {
    return;
  }

  fetchEvent.respondWith(
    (async function () {
      const targetCacheName = request.url.includes("cartocdn.com")
        ? tileCacheName
        : generalCacheName;

      const responseFromFetch = fetch(request);
      if (request.headers.get("Accept").includes("text/html")) {
        try {
          const response = await responseFromFetch;
          return response;
        } catch (error) {
          return (await caches.open(targetCacheName)).match(offlinePageUrl);
        }
      } else {
        fetchEvent.waitUntil(
          (async function () {
            const responseCopy = (await responseFromFetch).clone();
            const myCache = await caches.open(targetCacheName);
            await myCache.put(request, responseCopy);

            if (targetCacheName === tileCacheName) {
              const keys = await myCache.keys();
              if (keys.length > tileMaxEntries) {
                await myCache.delete(keys[0]); // FIFO delete oldest
              }
            }
          })(),
        );

        return (
          (await (await caches.open(targetCacheName)).match(request)) ||
          responseFromFetch
        );
      }
    })(),
  );
});
