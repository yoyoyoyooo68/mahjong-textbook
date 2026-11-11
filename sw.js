// Service Worker: cache-first。配信するファイルをすべて先読みして、オフラインでも使えるようにする。
// ファイルを足す・変えて公開するときは ASSETS と CACHE_NAME の版数を更新する（test/pwa.test.js が一覧の漏れを検査する）。

const CACHE_NAME = 'mahjong-textbook-v1';

const ASSETS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'icons/apple-touch-icon.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'src/content/glossary.js',
  'src/content/index.js',
  'src/content/level1/1-1.js',
  'src/content/level1/1-2.js',
  'src/content/level1/1-3.js',
  'src/content/level1/1-4.js',
  'src/content/level1/1-5.js',
  'src/content/level2/2-1.js',
  'src/content/level2/2-2.js',
  'src/content/level2/2-3.js',
  'src/content/level2/2-4.js',
  'src/content/level2/2-5.js',
  'src/content/level2/2-6.js',
  'src/content/types.js',
  'src/core/agari.js',
  'src/core/efficiency.js',
  'src/core/rules.js',
  'src/core/shanten.js',
  'src/core/tiles.js',
  'src/core/yaku.js',
  'src/drill/flow.js',
  'src/drill/generate.js',
  'src/drill/grade.js',
  'src/drill/review.js',
  'src/drill/tiles.js',
  'src/main.js',
  'src/storage/store.js',
  'src/ui/problem.js',
  'src/ui/run.js',
  'src/ui/screens.js',
  'src/ui/text.js',
  'src/ui/tile-svg.js',
  'src/ui/tile-text.js',
  'styles/app.css',
  'styles/tiles.css',
  'styles/tokens.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (event) => {
  // 古い版のキャッシュを消す
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => cached ?? fetch(event.request)),
  );
});

// 更新は自動では切り替えない。ホームの「新しい版があります」から指示が来たときだけ切り替える
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
