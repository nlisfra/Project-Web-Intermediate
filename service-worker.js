importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

const CACHE_NAME = 'dicoding-cerita-cache-v1';
const BASE_PATH = '/Project-Web-Intermediate';

const URLS_TO_CACHE = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/src/css/style.css`,
  `${BASE_PATH}/src/js/app.js`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/icons/icon-512.png`,
  `${BASE_PATH}/icons/icon-192.png`,
];

// Cache saat install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      console.log('[SW] Installing and caching...');
      for (const url of URLS_TO_CACHE) {
        try {
          await cache.add(url);
          console.log(`Cached: ${url}`);
        } catch (error) {
          console.error(`Gagal cache URL: ${url}`, error);
        }
      }
    })
  );
});

self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      )
    )
  );
});

// Workbox routing
workbox.routing.registerRoute(
  ({ url }) => url.origin === 'https://story-api.dicoding.dev',
  new workbox.strategies.NetworkFirst({ cacheName: 'api-cache' })
);

workbox.routing.registerRoute(
  ({ url }) =>
    url.origin === 'https://unpkg.com' &&
    (url.pathname.endsWith('.css') || url.pathname.endsWith('.js')),
  new workbox.strategies.StaleWhileRevalidate({ cacheName: 'leaflet-cdn-cache' })
);

workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  })
);

// Push notification handler
self.addEventListener('push', event => {
  const showNotification = async () => {
    let data = {};
    if (event.data) {
      try {
        data = event.data.json();
      } catch (e) {
        data = { title: 'Notifikasi Baru', message: event.data.text() };
      }
    }

    console.log('[SW] Push received:', data);

    const title = data.title || 'Notifikasi Baru';
    const options = {
      body: data.message || 'Ada pesan baru.',
      icon: '/Project-Web-Intermediate/icons/icon-192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
      },
    };

    const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const isAppInFocus = allClients.some(client => client.visibilityState === 'visible' && client.focused);

    if (isAppInFocus) {
      allClients.forEach(client => {
        client.postMessage({ type: 'PUSH_RECEIVED', data });
      });
    } else {
      return self.registration.showNotification(title, options);
    }
  };

  event.waitUntil(showNotification());
});

self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification click');
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes(BASE_PATH) && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(BASE_PATH);
    })
  );
});