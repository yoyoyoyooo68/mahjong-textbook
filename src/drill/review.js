// 復習の箱（設計図.md 6.3）。間違えた問題を、間隔をあけて出し直す。日付は "2026-11-11" の形で扱う。

/** @typedef {import('../content/types.js').Grade} Grade */

/** 再出題までの日数。正解で次へ進み、最後（14日後）も正解なら箱から出る */
export const INTERVALS = Object.freeze([1, 3, 7, 14]);

/** 「悪くない」がこの回数続いたら箱に入れる */
export const OK_STREAK_LIMIT = 3;

/**
 * @typedef {object} BoxEntry
 * @property {string} due 次に出す日
 * @property {number} step INTERVALS の何番目の間隔を待っているか
 */

/** @typedef {Record<string, BoxEntry>} Box */

/**
 * 日付に日数を足す。
 * @param {string} day "2026-11-11"
 * @param {number} n
 * @returns {string}
 */
export function addDays(day, n) {
  const [y, m, d] = day.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + n));
  return date.toISOString().slice(0, 10);
}

/**
 * 1問答えたあとの箱。
 * - 復習で答えたとき: 最善なら次の間隔へ（最後なら箱から出る）。悪くないなら同じ間隔をもう一度。悪手なら翌日に戻る。
 * - レッスン・テストで答えたとき: 悪手なら入れる（入っていれば翌日に戻す）。悪くないが続いたら入れる。
 * @param {Box} box
 * @param {string} id
 * @param {Grade} grade
 * @param {{ inReview: boolean, okStreak: number, today: string }} context okStreak はこの答えを含めた回数
 * @returns {Box}
 */
export function updateBox(box, id, grade, { inReview, okStreak, today }) {
  const entry = box[id];
  if (grade === 'bad') return { ...box, [id]: { step: 0, due: addDays(today, INTERVALS[0]) } };
  if (inReview && entry) {
    if (grade === 'ok')
      return { ...box, [id]: { step: entry.step, due: addDays(today, INTERVALS[entry.step]) } };
    const step = entry.step + 1;
    if (step >= INTERVALS.length) {
      const { [id]: _, ...rest } = box;
      return rest;
    }
    return { ...box, [id]: { step, due: addDays(today, INTERVALS[step]) } };
  }
  if (grade === 'ok' && okStreak >= OK_STREAK_LIMIT && !entry) {
    return { ...box, [id]: { step: 0, due: addDays(today, INTERVALS[0]) } };
  }
  return box;
}

/**
 * 今日（までに）出す問題の id。期限の古い順。
 * @param {Box} box
 * @param {string} today
 * @returns {string[]}
 */
export function dueIds(box, today) {
  return Object.entries(box)
    .filter(([, e]) => e.due <= today)
    .sort((a, b) => (a[1].due === b[1].due ? a[0].localeCompare(b[0]) : a[1].due.localeCompare(b[1].due)))
    .map(([id]) => id);
}
