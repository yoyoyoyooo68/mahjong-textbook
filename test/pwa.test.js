// オフライン対応（PWA）の検査。ファイルを足したら sw.js の一覧と版数を更新する。

import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const root = decodeURIComponent(new URL('..', import.meta.url).pathname);
/** @param {string} path */
const read = (path) => readFileSync(join(root, path), 'utf8');

/** @param {string} dir @returns {string[]} */
function walk(dir) {
  return readdirSync(join(root, dir)).flatMap((name) => {
    if (name === '.DS_Store') return [];
    const path = `${dir}/${name}`;
    return statSync(join(root, path)).isDirectory() ? walk(path) : [path];
  });
}

test('Service Worker: 配信するファイルがすべて先読み一覧に入っている', () => {
  const sw = read('sw.js');
  const listed = [...sw.matchAll(/^ {2}'([^']+)',$/gm)].map((m) => m[1]);
  const expected = [
    './',
    'index.html',
    'manifest.webmanifest',
    ...walk('icons'),
    ...walk('src'),
    ...walk('styles'),
  ];
  assert.deepEqual(
    [...listed].sort(),
    [...expected].sort(),
    'ファイルを足したら sw.js の ASSETS と CACHE_NAME を更新する',
  );
  assert.match(sw, /const CACHE_NAME = 'mahjong-textbook-v\d+';/);
  assert.equal(sw.match(/skipWaiting\(\)/g)?.length, 1, '更新は利用者の指示でだけ切り替える');
});

test('manifest: 相対パスで、アイコンが実在する', () => {
  const manifest = JSON.parse(read('manifest.webmanifest'));
  assert.equal(manifest.start_url, './');
  assert.equal(manifest.scope, './');
  assert.ok(manifest.icons.some((/** @type {{ purpose?: string }} */ i) => i.purpose === 'maskable'));
  for (const icon of manifest.icons) {
    assert.ok(!icon.src.startsWith('/'), 'GitHub Pages のサブパスで動くよう相対パスにする');
    assert.ok(existsSync(join(root, icon.src)), icon.src);
  }
});

test('公開: CI が sw.js・manifest・icons も配信する', () => {
  const ci = read('.github/workflows/ci.yml');
  for (const f of ['sw.js', 'manifest.webmanifest', 'icons']) assert.ok(ci.includes(` ${f}`), f);
});
