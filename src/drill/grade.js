// 採点（設計図.md 6.2）。最善・悪くない・悪手の3段階。ask=tiles は正解・不正解の2つで、正解=最善・不正解=悪手として扱う。

import { tokensOf } from './tiles.js';

/** @typedef {import('../content/types.js').Problem} Problem */
/** @typedef {import('../content/types.js').Grade} Grade */
/** @typedef {import('../content/types.js').Choice} Choice */

/**
 * @typedef {object} Verdict 1問の答えの結果
 * @property {Grade} grade
 * @property {boolean} binary 正解・不正解の2段階の問題か
 * @property {string} reason 選んだ答えの理由
 * @property {string[]} picked 選んだもの（牌の表記、または choice の番号を文字にしたもの）
 */

/** 章末テストの点数（設計図.md 6.2） */
export const POINTS = Object.freeze({ best: 1, ok: 0.5, bad: 0 });

/**
 * 手牌から1枚選ぶ問題。赤五と通常の五は別の答えとして扱う。
 * @param {Problem} problem
 * @param {string} token "4z" など
 * @returns {Verdict}
 */
export function gradeTile(problem, token) {
  const choice = problem.choices?.find((c) => c.answer === token) ?? problem.otherwise;
  if (!choice) throw new Error(`${problem.id}: ${token} の評価がありません`);
  return { grade: choice.grade, binary: false, reason: choice.reason, picked: [token] };
}

/**
 * ボタンで選ぶ問題。
 * @param {Problem} problem
 * @param {number} index
 * @returns {Verdict}
 */
export function gradeChoice(problem, index) {
  const choice = problem.choices?.[index];
  if (!choice) throw new RangeError(`${problem.id}: 選択肢 ${index} はありません`);
  const binary = isBinaryChoice(problem);
  return { grade: choice.grade, binary, reason: choice.reason, picked: [String(index)] };
}

/**
 * 当てはまる牌を全部選ぶ問題。過不足なく選べたら正解。
 * @param {Problem} problem
 * @param {readonly string[]} selected
 * @returns {Verdict}
 */
export function gradeTiles(problem, selected) {
  const correct = new Set(tokensOf(problem.correct ?? ''));
  const picked = [...new Set(selected)];
  const ok = picked.length === correct.size && picked.every((t) => correct.has(t));
  return {
    grade: ok ? 'best' : 'bad',
    binary: true,
    reason: ok ? '正解です。' : `正解は {${problem.correct}} です。`,
    picked,
  };
}

/**
 * 選択肢が「最善1つ + 悪手」だけの問題は、正解・不正解の表示にする（和了判定など）。
 * @param {Problem} problem
 */
export function isBinaryChoice(problem) {
  return problem.type === 'agari' || problem.type === 'rule';
}

/**
 * 最善の選択肢（複数ありうる）。
 * @param {Problem} problem
 * @returns {Choice[]}
 */
export function bestChoices(problem) {
  return (problem.choices ?? []).filter((c) => c.grade === 'best');
}

/**
 * 章末テストの得点と合否。
 * @param {readonly Grade[]} grades
 * @param {number} passRatio
 * @returns {{ score: number, max: number, passed: boolean }}
 */
export function testScore(grades, passRatio) {
  const score = grades.reduce((sum, g) => sum + POINTS[g], 0);
  const max = grades.length;
  return { score, max, passed: max > 0 && score >= max * passRatio };
}

/**
 * 選択肢を画面に出す順番（元の番号の並び）。作問では最善を先頭に書きがちなので、問題の id から決まる順に混ぜる。
 * 同じ問題はいつも同じ順になる。
 * @param {Problem} problem
 * @returns {number[]}
 */
export function choiceOrder(problem) {
  const n = problem.choices?.length ?? 0;
  let seed = 2166136261;
  for (const ch of problem.id) seed = Math.imul(seed ^ ch.charCodeAt(0), 16777619) >>> 0;
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    seed = Math.imul(seed ^ (seed >>> 15), 2246822507) >>> 0;
    const j = seed % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}
