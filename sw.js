// ============================================
// 🌸 小食光 — Service Worker
// 缓存核心静态资源，支持离线访问
// ============================================

const CACHE_NAME = 'xsg-v1';
const STATIC_ASSETS = [
  '.',
  'index.html',
  'css/style.css',
  'js/food-db.js',
  'js/storage.js',
  'js/mood.js',
  'js/github-sync.js',
  'js/stats.js',
  'js/app.js',
  'manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
];

// 安装：预缓存静态文件
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.log('SW: cache addAll partial failure (some offline)', err);
      });
    })
  );
  self.skipWaiting();
});

// 激活：清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// 请求：缓存优先策略
self.addEventListener('fetch', event => {
  // 跳过非 GET 请求
  if (event.request.method !== 'GET') return;

  // 跳过 GitHub API 请求
  if (event.request.url.includes('api.github.com')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        // 只缓存成功响应
        if (!response || response.status !== 200) return response;

        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clone);
        });

        return response;
      }).catch(() => {
        // 离线回退
        if (event.request.destination === 'document') {
          return caches.match('index.html');
        }
        return new Response('', { status: 408 });
      });
    })
  );
});
