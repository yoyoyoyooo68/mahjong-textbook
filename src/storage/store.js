// 進み具合の保存。localStorage に version 付きで置く。読めない・壊れているときは初期状態に戻す。

/** @typedef {import('../content/types.js').Grade} Grade */

export const STORE_KEY = 'mahjong-textbook';
export const STORE_VERSION = 1;

/**
 * @typedef {object} ChapterRecord
 * @property {number} bestScore 章末テストの最高点
 * @property {number} max 満点
 * @property {boolean} passed 合格したことがあるか
 */

/**
 * @typedef {object} AnswerRecord 問題ごとの記録（段階3の復習と成績で使う）
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
  if (!isObject(raw) || raw.version !== STORE_VERSION) return null;
  if (!isStrings(raw.lessonsDone) || !isStrings(raw.days)) return null;
  if (!isObject(raw.chapters) || !isObject(raw.answers) || !isObject(raw.settings)) return null;
  const base = defaultStore();
  return {
    ...base,
    lessonsDone: raw.lessonsDone,
    days: raw.days,
    chapters: /** @type {Record<string, ChapterRecord>} */ (raw.chapters),
    answers: /** @type {Record<string, AnswerRecord>} */ (raw.answers),
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
 * 1問答えたことを記録する。その日を学習した日に入れる。
 * @param {Store} store
 * @param {string} problemId
 * @param {Grade} grade
 * @param {Date} now
 * @returns {Store}
 */
export function recordAnswer(store, problemId, grade, now) {
  const prev = store.answers[problemId];
  /** @type {AnswerRecord} */
  const next = {
    last: grade,
    count: (prev?.count ?? 0) + 1,
    okStreak: grade === 'ok' ? (prev?.okStreak ?? 0) + 1 : 0,
  };
  const day = dayKey(now);
  const days = store.days[0] === day ? store.days : [day, ...store.days].slice(0, 400);
  return { ...store, answers: { ...store.answers, [problemId]: next }, days };
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
