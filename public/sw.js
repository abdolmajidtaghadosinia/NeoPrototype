const CACHE_NAME = 'neo-cache-v2';
const ASSETS = [
  '/',
  '/index.html',
];
const API_BYPASS_HOSTNAMES = ['api.coingecko.com', 'pro-api.coingecko.com'];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  const requestUrl = new URL(event.request.url);
  if (API_BYPASS_HOSTNAMES.includes(requestUrl.hostname)) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((resp) => {
      if (resp) return resp;
      return fetch(event.request).then((networkResp) => {
        if (
          event.request.method === 'GET' &&
          networkResp &&
          networkResp.status === 200
        ) {
          const clone = networkResp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResp;
      });
    })
  );
});
