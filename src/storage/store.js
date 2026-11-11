// 進み具合の保存。localStorage に version 付きで置く。読めない・壊れているときは初期状態に戻す。

import { POINTS } from '../drill/grade.js';
import { updateBox } from '../drill/review.js';

/** @typedef {import('../content/types.js').Grade} Grade */
/** @typedef {import('../drill/review.js').Box} Box */

export const STORE_KEY = 'mahjong-textbook';
export const STORE_VERSION = 2;

/**
 * @typedef {object} ChapterRecord
 * @property {number} bestScore 章末テストの最高点
 * @property {number} max 満点
 * @property {boolean} passed 合格したことがあるか
 */

/**
 * @typedef {object} TypeStat 種類ごとの成績
 * @property {number} n 答えた数
 * @property {number} points 得点の合計（最善1・悪くない0.5・悪手0）
 */

/**
 * @typedef {object} AnswerRecord 問題ごとの記録
 * @property {Grade} last 最後の評価
 * @property {number} count 答えた回数
 * @property {number} okStreak 「悪くない」が続いた回数
 */

/**
 * @typedef {object} Store
 * @property {number} version
 * @property {string[]} lessonsDone 終えたレッスンの id
 * @property {Record<string, ChapterRecord>} chapters
 * @property {Record<string, AnswerRecord>} answers
 * @property {string[]} days 学習した日（"2026-11-11"。新しい順に最大400日）
 * @property {Box} box 復習の箱
 * @property {Record<string, TypeStat>} typeStats 教科書の問題の、種類（DrillType）ごとの成績
 * @property {Record<string, TypeStat>} drillStats 反復練習（自動生成）の、種類ごとの成績
 * @property {{ largeText: boolean }} settings
 */

/** @typedef {Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>} StorageLike */

/** @returns {Store} */
export function defaultStore() {
  return {
    version: STORE_VERSION,
    lessonsDone: [],
    chapters: {},
    answers: {},
    days: [],
    box: {},
    typeStats: {},
    drillStats: {},
    settings: { largeText: false },
  };
}

/** @param {unknown} v @returns {v is Record<string, unknown>} */
const isObject = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);

/** @param {unknown} v @returns {v is string[]} */
const isStrings = (v) => Array.isArray(v) && v.every((s) => typeof s === 'string');

/**
 * 保存されていた値を検査して Store にする。形が違えば null。
 * @param {unknown} raw
 * @returns {Store | null}
 */
export function migrate(raw) {
  // 版1（段階2）には復習の箱と成績がない。中身はそのまま引き継ぐ
  if (!isObject(raw) || (raw.version !== STORE_VERSION && raw.version !== 1)) return null;
  if (!isStrings(raw.lessonsDone) || !isStrings(raw.days)) return null;
  if (!isObject(raw.chapters) || !isObject(raw.answers) || !isObject(raw.settings)) return null;
  const base = defaultStore();
  /** @param {unknown} v */
  const record = (v) => (isObject(v) ? v : {});
  return {
    ...base,
    lessonsDone: raw.lessonsDone,
    days: raw.days,
    chapters: /** @type {Record<string, ChapterRecord>} */ (raw.chapters),
    answers: /** @type {Record<string, AnswerRecord>} */ (raw.answers),
    box: /** @type {Box} */ (record(raw.box)),
    typeStats: /** @type {Record<string, TypeStat>} */ (record(raw.typeStats)),
    drillStats: /** @type {Record<string, TypeStat>} */ (record(raw.drillStats)),
    settings: { ...base.settings, largeText: raw.settings.largeText === true },
  };
}

/**
 * @param {StorageLike} storage
 * @returns {{ store: Store, corrupted: boolean }}
 */
export function loadStore(storage) {
  let text = null;
  try {
    text = storage.getItem(STORE_KEY);
  } catch {
    return { store: defaultStore(), corrupted: false };
  }
  if (text === null) return { store: defaultStore(), corrupted: false };
  try {
    const store = migrate(JSON.parse(text));
    if (store) return { store, corrupted: false };
  } catch {
    // 下で初期化する
  }
  return { store: defaultStore(), corrupted: true };
}

/**
 * @param {StorageLike} storage
 * @param {Store} store
 * @returns {boolean} 保存できたか
 */
export function saveStore(storage, store) {
  try {
    storage.setItem(STORE_KEY, JSON.stringify(store));
    return true;
  } catch {
    return false;
  }
}

/**
 * 端末の暦での日付（"2026-11-11"）。
 * @param {Date} date
 */
export function dayKey(date) {
  const p = (/** @type {number} */ n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

/**
 * その日を学習した日に入れる。
 * @param {string[]} days
 * @param {string} day
 */
const withDay = (days, day) => (days[0] === day ? days : [day, ...days].slice(0, 400));

/**
 * @param {Record<string, TypeStat>} stats
 * @param {string} type
 * @param {Grade} grade
 * @returns {Record<string, TypeStat>}
 */
function addStat(stats, type, grade) {
  const prev = stats[type] ?? { n: 0, points: 0 };
  return { ...stats, [type]: { n: prev.n + 1, points: prev.points + POINTS[grade] } };
}

/**
 * 教科書の問題に1問答えたことを記録する。復習の箱・種類別の成績・学習した日も更新する。
 * @param {Store} store
 * @param {{ id: string, type: string }} problem
 * @param {Grade} grade
 * @param {Date} now
 * @param {{ inReview?: boolean }} [options] 復習として答えたか
 * @returns {Store}
 */
export function recordAnswer(store, problem, grade, now, options = {}) {
  const prev = store.answers[problem.id];
  /** @type {AnswerRecord} */
  const next = {
    last: grade,
    count: (prev?.count ?? 0) + 1,
    okStreak: grade === 'ok' ? (prev?.okStreak ?? 0) + 1 : 0,
  };
  const day = dayKey(now);
  return {
    ...store,
    answers: { ...store.answers, [problem.id]: next },
    days: withDay(store.days, day),
    box: updateBox(store.box, problem.id, grade, {
      inReview: options.inReview === true,
      okStreak: next.okStreak,
      today: day,
    }),
    typeStats: addStat(store.typeStats, problem.type, grade),
  };
}

/**
 * 反復練習（自動生成の問題）に1問答えたことを記録する。復習の箱には入れない。
 * @param {Store} store
 * @param {string} type
 * @param {Grade} grade
 * @param {Date} now
 * @returns {Store}
 */
export function recordDrill(store, type, grade, now) {
  return {
    ...store,
    days: withDay(store.days, dayKey(now)),
    drillStats: addStat(store.drillStats, type, grade),
  };
}

/**
 * @param {Store} store
 * @param {string} lessonId
 * @returns {Store}
 */
export function recordLesson(store, lessonId) {
  if (store.lessonsDone.includes(lessonId)) return store;
  return { ...store, lessonsDone: [...store.lessonsDone, lessonId] };
}

/**
 * @param {Store} store
 * @param {string} chapterId
 * @param {{ score: number, max: number, passed: boolean }} result
 * @returns {Store}
 */
export function recordTest(store, chapterId, result) {
  const prev = store.chapters[chapterId];
  /** @type {ChapterRecord} */
  const next = {
    bestScore: Math.max(prev?.bestScore ?? 0, result.score),
    max: result.max,
    passed: (prev?.passed ?? false) || result.passed,
  };
  return { ...store, chapters: { ...store.chapters, [chapterId]: next } };
}

/**
 * 連続学習日数。今日か昨日まで続いていれば数える。
 * @param {Store} store
 * @param {Date} now
 */
export function streak(store, now) {
  const set = new Set(store.days);
  const d = new Date(now);
  if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(dayKey(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

/**
 * 章の進み具合。
 * @param {Store} store
 * @param {import('../content/types.js').Chapter} chapter
 * @returns {'new' | 'progress' | 'passed'}
 */
export function chapterStatus(store, chapter) {
  if (store.chapters[chapter.id]?.passed) return 'passed';
  const started =
    chapter.lessons.some((l) => store.lessonsDone.includes(l.id)) || chapter.id in store.chapters;
  return started ? 'progress' : 'new';
}
