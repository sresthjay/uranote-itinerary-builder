/*
|--------------------------------------------------------------------------
| Service worker for the Itinerary Builder static export
|--------------------------------------------------------------------------
|
| Strategy:
|   - Precache the application shell (navigation documents) on install.
|   - For navigations, go network-first so fresh HTML is always used
|     when online, and fall back to the cached shell when offline.
|   - For same-origin static assets (JS/CSS/fonts/images), cache-first.
|   - Requests the app explicitly marks `cache: "no-store"` (the PDF
|     export QR image fetch) stay network-first, with a cached copy as
|     an offline fallback.
|   - IndexedDB data is never touched here; itineraries stay fully
|     local so the offline workflow (create/edit/save/reopen/export)
|     keeps working exactly as before.
|   - JSON/PDF exports are blob: URLs, which are not intercepted.
|
| Bump CACHE_NAME when the precache list changes.
|--------------------------------------------------------------------------
*/

const CACHE_NAME = "uranote-itinerary-builder-shell-v1";

const APP_SHELL = [
    "/",
    "/itinerary/new/",
    "/itinerary/edit/",
];

function normalizeCacheUrl(url) {
    const normalized = new URL(url);
    normalized.search = "";
    normalized.hash = "";
    return normalized;
}

function cachePut(url, response) {
    caches
        .open(CACHE_NAME)
        .then((cache) => cache.put(normalizeCacheUrl(url), response));
}

function cacheMatch(url) {
    return caches
        .open(CACHE_NAME)
        .then((cache) => cache.match(normalizeCacheUrl(url)));
}

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((key) => key !== CACHE_NAME)
                        .map((key) => caches.delete(key))
                )
            )
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    const { request } = event;

    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);

    if (url.origin !== self.location.origin) {
        return;
    }

    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    cachePut(request.url, response.clone());
                    return response;
                })
                .catch(async () => {
                    const cached =
                        (await cacheMatch(request.url)) ||
                        (await cacheMatch("/"));

                    return cached || Response.error();
                })
        );
        return;
    }

    if (request.cache === "no-store") {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response.ok) {
                        cachePut(request.url, response.clone());
                    }

                    return response;
                })
                .catch(async () => {
                    const cached = await cacheMatch(request.url);

                    return cached || Response.error();
                })
        );
        return;
    }

    event.respondWith(
        caches.match(normalizeCacheUrl(request.url)).then((cached) => {
            if (cached) {
                return cached;
            }

            return fetch(request).then((response) => {
                if (response.ok) {
                    cachePut(request.url, response.clone());
                }

                return response;
            });
        })
    );
});