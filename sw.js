// Service Worker DigiMairie
const CACHE_NOM = 'digimairie-v1';
const FICHIERS = [
  'portail.html',
  'accueil.html',
  'index.html',
  'mariage.html',
  'naissance.html',
  'deces.html',
  'copie.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// Installation : mise en cache des fichiers
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NOM).then((cache) => cache.addAll(FICHIERS))
  );
  self.skipWaiting();
});

// Activation : nettoyage des anciens caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((noms) =>
      Promise.all(noms.filter(n => n !== CACHE_NOM).map(n => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// Interception des requêtes : réseau d'abord, cache en secours
self.addEventListener('fetch', (e) => {
  // On ne met en cache que les pages, pas les appels API
  if (e.request.url.includes('/api/')) return;

  e.respondWith(
    fetch(e.request)
      .then((reponse) => reponse)
      .catch(() => caches.match(e.request))
  );
});