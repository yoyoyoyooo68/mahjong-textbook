// レッスンと章末テストの画面、テストの結果画面。

import { currentStep, currentVerdict, isLast } from '../drill/flow.js';
import { gradeLabel, problemHtml } from './problem.js';
import { rich, screenHtml } from './text.js';

/** @typedef {import('../content/types.js').Chapter} Chapter */
/** @typedef {import('../drill/flow.js').Run} Run */

/**
 * @param {Run} run
 * @param {Chapter} chapter
 */
export function runHtml(run, chapter) {
  const step = currentStep(run);
  const lesson = run.mode === 'lesson' ? chapter.lessons[run.lessonIndex] : null;
  const verdict = currentVerdict(run);
  let body = '';
  if (step.type === 'aim' && lesson) {
    body = `<p class="kicker">このレッスンのねらい</p><p class="aim">${rich(lesson.aim)}</p>`;
  } else if (step.type === 'page' && lesson) {
    body = `<div class="prose">${rich(lesson.pages[step.index])}</div>`;
  } else if (step.type === 'problem') {
    body = problemHtml(step.problem, verdict, run.selected);
  } else if (step.type === 'summary' && lesson) {
    body = `<p class="kicker">まとめ</p><ul class="summary">${lesson.summary.map((s) => `<li>${rich(s)}</li>`).join('')}</ul>`;
  }

  const total = run.steps.length;
  const progress = `<div class="progress" role="progressbar" aria-valuemin="1" aria-valuemax="${total}" aria-valuenow="${run.index + 1}" aria-label="${run.index + 1} / ${total}">
${run.steps.map((_, i) => `<span class="progress-dot${i <= run.index ? ' is-done' : ''}"></span>`).join('')}</div>`;

  const waiting = step.type === 'problem' && !verdict;
  const nextLabel = isLast(run) ? (run.mode === 'test' ? '結果を見る' : 'レッスンを終える') : '次へ';
  const nextAction = isLast(run) ? 'finish' : 'next';
  const prev =
    run.mode === 'lesson' && run.index > 0 && step.type !== 'problem'
      ? '<button type="button" class="btn" data-action="prev">前へ</button>'
      : '';
  const footer = waiting
    ? ''
    : `${prev}<button type="button" class="btn btn-primary" data-action="${nextAction}">${nextLabel}</button>`;
  const title = lesson ? lesson.title : `${chapter.id} 章末テスト`;
  return screenHtml({ title, back: 'quit-run', body: progress + body, footer });
}

/**
 * @param {Run} run
 * @param {Chapter} chapter
 * @param {{ score: number, max: number, passed: boolean }} result
 */
export function testResultHtml(run, chapter, result) {
  const rows = run.steps.map((step, i) => {
    const v = run.verdicts[i];
    if (step.type !== 'problem' || !v) return '';
    return `<li><span class="grade-tag grade-${v.grade}">${gradeLabel(v.grade, v.binary)}</span> ${rich(step.problem.summary)}</li>`;
  });
  const head = result.passed
    ? `<p class="result-head is-pass">★ 合格</p><p>この章の内容は身につきました。</p>`
    : `<p class="result-head">もう少し</p><p>レッスンを見直してから、もう一度挑戦しましょう。</p>`;
  const body = `${head}
<p class="score"><span class="score-num">${result.score}</span> / ${result.max}点</p>
<h2 class="section-title">1問ずつの結果</h2><ul class="result-list">${rows.join('')}</ul>`;
  const footer = `<button type="button" class="btn" data-action="test" data-chapter="${chapter.id}">もう一度</button>
<button type="button" class="btn btn-primary" data-action="chapter" data-chapter="${chapter.id}">章にもどる</button>`;
  return screenHtml({ title: `${chapter.id} 章末テストの結果`, back: 'map', body, footer });
}
