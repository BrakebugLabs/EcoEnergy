const CACHE_NAME = "ecoenergy-cache-v1";

const ASSETS = [
    "/",
    "/index.html",
    "/manifest.webmanifest",
    "/icon-192.png",
    "/icon-512.png",
];

// Instalação: pré-cache
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)),
    );
    self.skipWaiting();
});

// Ativação: limpa caches antigos
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys.map((key) => key !== CACHE_NAME && caches.delete(key)),
                ),
            ),
    );
    self.clients.claim();
});

// Intercepta requisições
self.addEventListener("fetch", (event) => {
    const req = event.request;

    // Navegação → fallback para index.html (SPA)
    if (req.mode === "navigate") {
        event.respondWith(
            fetch(req).catch(() => caches.match("/index.html")),
        );
        return;
    }

    // Cache-first para assets
    event.respondWith(
        caches.match(req).then((cached) => cached || fetch(req)),
    );
});
