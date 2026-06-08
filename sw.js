// ============================================
// 🌸 小食光 — Service Worker
// 缓存核心静态资源，支持离线访问
// ============================================

const CACHE_NAME = 'xsg-v2';
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

const NEVER_CACHE_PATHS = [
  'api.github.com',
];

function isHttpRequest(request) {
  return request.url.startsWith('http://') || request.url.startsWith('https://');
}

function shouldSkipRequest(request) {
  if (request.method !== 'GET') return true;
  if (!isHttpRequest(request)) return true;
  return NEVER_CACHE_PATHS.some(path => request.url.includes(path));
}

function isAppShellRequest(request) {
  const url = new URL(request.url);
  return request.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request, { cache: 'no-store' });
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    if (isAppShellRequest(request)) {
      return caches.match('index.html');
    }

    return new Response('', { status: 408 });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await caches.match(request);

  const networkPromise = fetch(request).then(response => {
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  });

  return cached || networkPromise;
}


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

// 请求：HTML 走网络优先，静态资源走 stale-while-revalidate
self.addEventListener('fetch', event => {
  if (shouldSkipRequest(event.request)) return;

  if (isAppShellRequest(event.request)) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  event.respondWith(staleWhileRevalidate(event.request));
});
