// 教科書の全体（レベル → 章 → レッスン）。章を足したら、ここの chapters に並べる。

import { CHAPTER as c11 } from './level1/1-1.js';
import { CHAPTER as c12 } from './level1/1-2.js';
import { CHAPTER as c13 } from './level1/1-3.js';
import { CHAPTER as c14 } from './level1/1-4.js';
import { CHAPTER as c15 } from './level1/1-5.js';

/** @typedef {import('./types.js').Level} Level */
/** @typedef {import('./types.js').Chapter} Chapter */
/** @typedef {import('./types.js').Problem} Problem */

/** @type {readonly Level[]} */
export const LEVELS = Object.freeze([
  { id: 1, title: '超初級', theme: '麻雀ってどんなゲーム？', chapters: [c11, c12, c13, c14, c15] },
  { id: 2, title: '初級', theme: '和了れる人になる', chapters: [] },
  { id: 3, title: '中級', theme: '守る・鳴く・手を組む', chapters: [] },
  { id: 4, title: '中上級', theme: '押すか、降りるか', chapters: [] },
  { id: 5, title: '上級', theme: '相手を見て戦う', chapters: [] },
]);

/** 章末テストの問題数（レベルごと）。超初級は負担を軽くするため5問 */
export const TEST_SIZE = Object.freeze({ 1: 5, 2: 10, 3: 10, 4: 10, 5: 10 });

/** 章末テストの合格ライン（得点の割合） */
export const PASS_RATIO = 0.8;

/**
 * 画面に出す範囲に絞る。公開版（drafts=false）では監修済み（approved）の問題だけを残し、
 * 章末テストが空になった章は出さない。
 * @param {readonly Level[]} levels
 * @param {boolean} drafts 監修前の問題も出すか（手元の確認用）
 * @returns {Level[]}
 */
export function visibleLevels(levels, drafts) {
  /** @param {Problem} p */
  const show = (p) => drafts || p.review.status === 'approved';
  return levels.map((level) => ({
    ...level,
    chapters: level.chapters
      .map((ch) => ({
        ...ch,
        lessons: ch.lessons.map((l) => ({ ...l, problems: l.problems.filter(show) })),
        test: ch.test.filter(show),
      }))
      .filter((ch) => ch.test.length > 0),
  }));
}

/**
 * @param {readonly Level[]} levels
 * @param {string} id
 * @returns {Chapter | undefined}
 */
export function findChapter(levels, id) {
  for (const level of levels) {
    const ch = level.chapters.find((c) => c.id === id);
    if (ch) return ch;
  }
  return undefined;
}

/**
 * 全問題（レッスンの確認問題 + 章末テスト）。
 * @param {readonly Level[]} levels
 * @returns {Problem[]}
 */
export function allProblems(levels) {
  return levels.flatMap((level) =>
    level.chapters.flatMap((ch) => [...ch.lessons.flatMap((l) => l.problems), ...ch.test]),
  );
}

/** 章に下書きの問題が含まれるか（画面に「未審査」と出す） @param {Chapter} ch */
export function hasDraft(ch) {
  return [...ch.lessons.flatMap((l) => l.problems), ...ch.test].some((p) => p.review.status !== 'approved');
}
