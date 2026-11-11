// レッスンと章末テストの進み方。状態は不変で、操作ごとに新しい状態を返す。DOM には触らない。

import { gradeChoice, gradeTile, gradeTiles } from './grade.js';

/** @typedef {import('../content/types.js').Chapter} Chapter */
/** @typedef {import('../content/types.js').Lesson} Lesson */
/** @typedef {import('../content/types.js').Problem} Problem */
/** @typedef {import('./grade.js').Verdict} Verdict */

/**
 * @typedef {{ type: 'aim' }
 *   | { type: 'page', index: number }
 *   | { type: 'problem', problem: Problem }
 *   | { type: 'summary' }} Step
 */

/**
 * @typedef {object} Run レッスン・テスト・復習・反復練習の途中の状態
 * @property {'lesson' | 'test' | 'review' | 'drill'} mode
 * @property {string} chapterId 復習・反復練習のときは ''
 * @property {number} lessonIndex レッスン以外は -1
 * @property {string} [drill] 反復練習の種類
 * @property {Step[]} steps
 * @property {number} index 今の画面
 * @property {(Verdict | null)[]} verdicts 画面ごとの答えの結果（問題でない画面は null）
 * @property {string[]} selected ask=tiles で選んでいる途中の牌
 */

/**
 * @param {Chapter} chapter
 * @param {number} lessonIndex
 * @returns {Run}
 */
export function startLesson(chapter, lessonIndex) {
  const lesson = chapter.lessons[lessonIndex];
  if (!lesson) throw new RangeError(`${chapter.id}: レッスン ${lessonIndex} はありません`);
  /** @type {Step[]} */
  const steps = [
    { type: 'aim' },
    ...lesson.pages.map((_, index) => /** @type {Step} */ ({ type: 'page', index })),
    ...lesson.problems.map((problem) => /** @type {Step} */ ({ type: 'problem', problem })),
    { type: 'summary' },
  ];
  return fresh('lesson', chapter.id, lessonIndex, steps);
}

/**
 * @param {Chapter} chapter
 * @returns {Run}
 */
export function startTest(chapter) {
  const steps = chapter.test.map((problem) => /** @type {Step} */ ({ type: 'problem', problem }));
  return fresh('test', chapter.id, -1, steps);
}

/**
 * 復習（今日の分の問題を順に）。
 * @param {readonly Problem[]} problems
 * @returns {Run}
 */
export function startReview(problems) {
  if (problems.length === 0) throw new RangeError('復習する問題がありません');
  const steps = problems.map((problem) => /** @type {Step} */ ({ type: 'problem', problem }));
  return fresh('review', '', -1, steps);
}

/**
 * 反復練習。1問ずつ appendProblem で足していく。
 * @param {string} kind
 * @param {Problem} first
 * @returns {Run}
 */
export function startDrill(kind, first) {
  return { ...fresh('drill', '', -1, [{ type: 'problem', problem: first }]), drill: kind };
}

/**
 * 反復練習で、次の問題を足して進む。今の問題に答えていなければ何もしない。
 * @param {Run} run
 * @param {Problem} problem
 * @returns {Run}
 */
export function appendProblem(run, problem) {
  if (!canAdvance(run)) return run;
  return {
    ...run,
    steps: [...run.steps, { type: 'problem', problem }],
    verdicts: [...run.verdicts, null],
    index: run.steps.length,
    selected: [],
  };
}

/**
 * @param {Run['mode']} mode
 * @param {string} chapterId
 * @param {number} lessonIndex
 * @param {Step[]} steps
 * @returns {Run}
 */
function fresh(mode, chapterId, lessonIndex, steps) {
  return { mode, chapterId, lessonIndex, steps, index: 0, verdicts: steps.map(() => null), selected: [] };
}

/** @param {Run} run @returns {Step} */
export const currentStep = (run) => run.steps[run.index];

/** @param {Run} run @returns {Verdict | null} */
export const currentVerdict = (run) => run.verdicts[run.index];

/**
 * 次へ進めるか（問題は答えるまで進めない）。
 * @param {Run} run
 */
export function canAdvance(run) {
  return currentStep(run).type !== 'problem' || currentVerdict(run) !== null;
}

/** @param {Run} run */
export const isLast = (run) => run.index === run.steps.length - 1;

/**
 * @param {Run} run
 * @returns {Run}
 */
export function advance(run) {
  if (!canAdvance(run) || isLast(run)) return run;
  return { ...run, index: run.index + 1, selected: [] };
}

/**
 * @param {Run} run
 * @returns {Run}
 */
export function back(run) {
  if (run.index === 0 || run.mode !== 'lesson') return run;
  return { ...run, index: run.index - 1, selected: [] };
}

/**
 * @typedef {{ kind: 'tile', token: string } | { kind: 'choice', index: number } | { kind: 'tiles' }} Input
 */

/**
 * 答える。すでに答えた問題は変えられない。
 * @param {Run} run
 * @param {Input} input
 * @returns {Run}
 */
export function answer(run, input) {
  const step = currentStep(run);
  if (step.type !== 'problem' || currentVerdict(run) !== null) return run;
  const { problem } = step;
  /** @type {Verdict} */
  let verdict;
  if (input.kind === 'tile' && problem.ask === 'tile') verdict = gradeTile(problem, input.token);
  else if (input.kind === 'choice' && problem.ask === 'choice') verdict = gradeChoice(problem, input.index);
  else if (input.kind === 'tiles' && problem.ask === 'tiles') {
    if (run.selected.length === 0) return run;
    verdict = gradeTiles(problem, run.selected);
  } else return run;
  const verdicts = [...run.verdicts];
  verdicts[run.index] = verdict;
  return { ...run, verdicts };
}

/**
 * ask=tiles の問題で、牌を選ぶ・選び直す。
 * @param {Run} run
 * @param {string} token
 * @returns {Run}
 */
export function toggleTile(run, token) {
  const step = currentStep(run);
  if (step.type !== 'problem' || step.problem.ask !== 'tiles' || currentVerdict(run) !== null) return run;
  const selected = run.selected.includes(token)
    ? run.selected.filter((t) => t !== token)
    : [...run.selected, token];
  return { ...run, selected };
}

/**
 * 答えた問題の結果（テストの採点用）。
 * @param {Run} run
 * @returns {{ problem: Problem, verdict: Verdict }[]}
 */
export function answered(run) {
  /** @type {{ problem: Problem, verdict: Verdict }[]} */
  const out = [];
  run.steps.forEach((step, i) => {
    const verdict = run.verdicts[i];
    if (step.type === 'problem' && verdict) out.push({ problem: step.problem, verdict });
  });
  return out;
}
