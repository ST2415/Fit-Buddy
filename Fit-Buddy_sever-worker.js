const CACHE_NAME = 'fitbuddy-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// ติดตั้ง Service Worker และ Cache ไฟล์
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// ดึงข้อมูลจาก Cache เมื่อออฟไลน์
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // คืนค่าจาก Cache
        }
        return fetch(event.request); // ดึงจาก Network
      })
  );
});

// อัปเดต Cache เมื่อมีการเปลี่ยนเวอร์ชัน
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});