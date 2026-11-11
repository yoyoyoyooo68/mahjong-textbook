import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  chapterStatus,
  dayKey,
  defaultStore,
  loadStore,
  migrate,
  recordAnswer,
  recordLesson,
  recordTest,
  STORE_KEY,
  saveStore,
  streak,
} from '../src/storage/store.js';
import { SAMPLE_CHAPTER } from './fixtures/sample-chapter.js';

/** @returns {import('../src/storage/store.js').StorageLike & { data: Map<string, string> }} */
function memory() {
  const data = new Map();
  return {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
    removeItem: (k) => void data.delete(k),
  };
}

test('保存して読み直せる。壊れていたら初期化', () => {
  const s = memory();
  const store = recordLesson(defaultStore(), '1-0-1');
  assert.equal(saveStore(s, store), true);
  assert.deepEqual(loadStore(s), { store, corrupted: false });
  s.setItem(STORE_KEY, '{oops');
  assert.deepEqual(loadStore(s), { store: defaultStore(), corrupted: true });
  assert.equal(migrate({ version: 99 }), null);
  const broken = {
    getItem: () => {
      throw new Error('denied');
    },
    setItem: () => {
      throw new Error('full');
    },
    removeItem: () => {},
  };
  assert.deepEqual(loadStore(broken).store, defaultStore());
  assert.equal(saveStore(broken, defaultStore()), false);
});

test('recordAnswer: 回数・悪くないの連続・学習日', () => {
  const day1 = new Date(2026, 10, 10, 9);
  const day2 = new Date(2026, 10, 11, 9);
  let s = recordAnswer(defaultStore(), 'p', 'ok', day1);
  s = recordAnswer(s, 'p', 'ok', day1);
  assert.deepEqual(s.answers.p, { last: 'ok', count: 2, okStreak: 2 });
  assert.deepEqual(s.days, ['2026-11-10']);
  s = recordAnswer(s, 'p', 'best', day2);
  assert.equal(s.answers.p.okStreak, 0);
  assert.deepEqual(s.days, ['2026-11-11', '2026-11-10']);
  assert.equal(streak(s, day2), 2);
  assert.equal(streak(s, new Date(2026, 10, 12, 9)), 2, '今日まだでも昨日まで続いていれば数える');
  assert.equal(streak(s, new Date(2026, 10, 13, 9)), 0);
  assert.equal(dayKey(day1), '2026-11-10');
});

test('recordTest: 最高点と、一度でも合格したか', () => {
  let s = recordTest(defaultStore(), '1-0', { score: 4.5, max: 5, passed: true });
  s = recordTest(s, '1-0', { score: 2, max: 5, passed: false });
  assert.deepEqual(s.chapters['1-0'], { bestScore: 4.5, max: 5, passed: true });
});

test('chapterStatus', () => {
  let s = defaultStore();
  assert.equal(chapterStatus(s, SAMPLE_CHAPTER), 'new');
  s = recordLesson(s, '1-0-1');
  assert.equal(chapterStatus(s, SAMPLE_CHAPTER), 'progress');
  s = recordTest(s, '1-0', { score: 5, max: 5, passed: true });
  assert.equal(chapterStatus(s, SAMPLE_CHAPTER), 'passed');
});
