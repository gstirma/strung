// Service worker — cache offline simples (network-first para páginas,
// cache-first para assets estáticos). Funciona tanto na raiz quanto no
// subcaminho do GitHub Pages: o escopo vem do próprio local do arquivo.
const CACHE = "apt-encordoamento-v3";
const BASE = new URL(self.registration.scope).pathname.replace(/\/$/, "");

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      c.addAll([`${BASE}/`, `${BASE}/manifest.json`, `${BASE}/icon.svg`]).catch(() => {})
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  const isStatic =
    url.pathname.includes("/_next/static") || /\.(svg|png|ico|woff2?|css|js)$/.test(url.pathname);

  if (isStatic) {
    e.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
            return res;
          })
      )
    );
  } else {
    e.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() =>
          caches.match(request).then((hit) => hit || caches.match(`${BASE}/`))
        )
    );
  }
});
