
const CACHE_NAME = 'pendor-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Ne pas cacher les requêtes API Supabase pour permettre les mises à jour en temps réel
  if (event.request.url.includes('supabase.co') || 
      event.request.method !== 'GET') {
    event.respondWith(fetch(event.request));
    return;
  }

  // Pour les autres ressources, utiliser la stratégie Network First
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la requête réseau réussit, mettre en cache
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        // En cas d'échec réseau, utiliser le cache
        return caches.match(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Gestionnaire pour les notifications push
self.addEventListener('push', (event) => {
  console.log('Push message received:', event);
  
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Nouvelle notification',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [200, 100, 200],
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'Voir'
        },
        {
          action: 'dismiss',
          title: 'Ignorer'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Nouveau pronostic', options)
    );
  }
});

// Gestionnaire pour les clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});
