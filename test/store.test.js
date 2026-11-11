import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  chapterStatus,
  dayKey,
  defaultStore,
  loadStore,
  migrate,
  recordAnswer,
  recordDrill,
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
  const P = { id: 'p', type: 'nanikiru' };
  let s = recordAnswer(defaultStore(), P, 'ok', day1);
  s = recordAnswer(s, P, 'ok', day1);
  assert.deepEqual(s.answers.p, { last: 'ok', count: 2, okStreak: 2 });
  assert.deepEqual(s.days, ['2026-11-10']);
  s = recordAnswer(s, P, 'best', day2);
  assert.deepEqual(s.typeStats.nanikiru, { n: 3, points: 2 });
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

test('版1の保存データを引き継ぐ', () => {
  const v1 = {
    version: 1,
    lessonsDone: ['1-1-1'],
    chapters: {},
    answers: {},
    days: ['2026-11-10'],
    settings: {},
  };
  const s = migrate(v1);
  assert.ok(s);
  assert.equal(s.version, 2);
  assert.deepEqual(s.lessonsDone, ['1-1-1']);
  assert.deepEqual(s.box, {});
  assert.deepEqual(s.typeStats, {});
});

test('復習の箱: 悪手で入り、復習で正解するたびに間隔が延び、14日後も正解なら出る', () => {
  const at = (/** @type {string} */ d) => new Date(`${d}T09:00:00`);
  const P = { id: 'q', type: 'rule' };
  let s = recordAnswer(defaultStore(), P, 'bad', at('2026-11-10'));
  assert.deepEqual(s.box.q, { step: 0, due: '2026-11-11' });
  s = recordAnswer(s, P, 'best', at('2026-11-11'), { inReview: true });
  assert.deepEqual(s.box.q, { step: 1, due: '2026-11-14' });
  s = recordAnswer(s, P, 'ok', at('2026-11-14'), { inReview: true });
  assert.deepEqual(s.box.q, { step: 1, due: '2026-11-17' }, '悪くないは同じ間隔');
  s = recordAnswer(s, P, 'best', at('2026-11-17'), { inReview: true });
  assert.deepEqual(s.box.q, { step: 2, due: '2026-11-24' });
  s = recordAnswer(s, P, 'bad', at('2026-11-24'), { inReview: true });
  assert.deepEqual(s.box.q, { step: 0, due: '2026-11-25' }, '間違えたら翌日に戻る');
  for (const d of ['2026-11-25', '2026-11-28', '2026-12-05'])
    s = recordAnswer(s, P, 'best', at(d), { inReview: true });
  assert.deepEqual(s.box.q, { step: 3, due: '2026-12-19' });
  s = recordAnswer(s, P, 'best', at('2026-12-19'), { inReview: true });
  assert.equal(s.box.q, undefined);
});

test('復習の箱: 「悪くない」が3回続いたら入る。レッスンでの正解では動かない', () => {
  const at = new Date('2026-11-10T09:00:00');
  const P = { id: 'r', type: 'nanikiru' };
  let s = defaultStore();
  s = recordAnswer(s, P, 'ok', at);
  s = recordAnswer(s, P, 'ok', at);
  assert.equal(s.box.r, undefined);
  s = recordAnswer(s, P, 'ok', at);
  assert.deepEqual(s.box.r, { step: 0, due: '2026-11-11' });
  s = recordAnswer(s, P, 'best', at);
  assert.deepEqual(s.box.r, { step: 0, due: '2026-11-11' });
});

test('反復練習の記録は箱に入らない', () => {
  const s = recordDrill(defaultStore(), 'agari', 'bad', new Date('2026-11-10T09:00:00'));
  assert.deepEqual(s.box, {});
  assert.deepEqual(s.drillStats.agari, { n: 1, points: 0 });
  assert.deepEqual(s.days, ['2026-11-10']);
});
