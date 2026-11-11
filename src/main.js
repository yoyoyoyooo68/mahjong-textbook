// 配線だけを行う: 保存データ・教科書の中身・各画面の HTML を、クリックと描画でつなぐ。

import { findChapter, LEVELS, PASS_RATIO, visibleLevels } from './content/index.js';
import { advance, answer, answered, back, startLesson, startTest, toggleTile } from './drill/flow.js';
import { testScore } from './drill/grade.js';
import { loadStore, recordAnswer, recordLesson, recordTest, saveStore } from './storage/store.js';
import { runHtml, testResultHtml } from './ui/run.js';
import { chapterHtml, glossaryHtml, homeHtml, mapHtml, termSheetHtml } from './ui/screens.js';

/** @typedef {import('./drill/flow.js').Run} Run */

const root = /** @type {HTMLElement} */ (document.getElementById('app'));

/** localStorage が使えない環境（プライベートモードなど）では、保存せずに動かす */
/** @type {import('./storage/store.js').StorageLike} */
let storage;
try {
  storage = window.localStorage;
} catch {
  storage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
}

// 手元（localhost）か ?draft=1 のときだけ、監修前の問題も出す
const drafts =
  ['localhost', '127.0.0.1'].includes(location.hostname) || new URLSearchParams(location.search).has('draft');
const levels = visibleLevels(LEVELS, drafts);

let { store } = loadStore(storage);

/**
 * @typedef {{ name: 'home' } | { name: 'map' } | { name: 'glossary' }
 *   | { name: 'chapter', chapterId: string }
 *   | { name: 'run', run: Run }
 *   | { name: 'result', run: Run, result: { score: number, max: number, passed: boolean } }} Screen
 */

/** @type {Screen} */
let screen = { name: 'home' };
/** @type {string | null} 開いている用語 */
let term = null;

/** @param {string} id */
function chapterOf(id) {
  const ch = findChapter(levels, id);
  if (!ch) throw new Error(`章 ${id} がありません`);
  return ch;
}

function render() {
  let html = '';
  if (screen.name === 'home') html = homeHtml(levels, store, new Date());
  else if (screen.name === 'map') html = mapHtml(levels, store);
  else if (screen.name === 'glossary') html = glossaryHtml();
  else if (screen.name === 'chapter') html = chapterHtml(chapterOf(screen.chapterId), store, PASS_RATIO);
  else if (screen.name === 'run') html = runHtml(screen.run, chapterOf(screen.run.chapterId));
  else if (screen.name === 'result')
    html = testResultHtml(screen.run, chapterOf(screen.run.chapterId), screen.result);
  if (term) html += termSheetHtml(term);
  root.innerHTML = html;
}

/** @param {Screen} next */
function go(next) {
  screen = next;
  term = null;
  render();
  window.scrollTo(0, 0);
}

/** @param {Run} run */
function updateRun(run) {
  if (screen.name !== 'run') return;
  const before = screen.run;
  screen = { name: 'run', run };
  // 答えた瞬間に記録する
  const v = run.verdicts[run.index];
  if (v && !before.verdicts[run.index]) {
    const step = run.steps[run.index];
    if (step.type === 'problem') {
      store = recordAnswer(store, step.problem.id, v.grade, new Date());
      saveStore(storage, store);
    }
  }
  render();
}

function finishRun() {
  if (screen.name !== 'run') return;
  const { run } = screen;
  if (run.mode === 'lesson') {
    const lesson = chapterOf(run.chapterId).lessons[run.lessonIndex];
    store = recordLesson(store, lesson.id);
    saveStore(storage, store);
    go({ name: 'chapter', chapterId: run.chapterId });
    return;
  }
  const result = testScore(
    answered(run).map((a) => a.verdict.grade),
    PASS_RATIO,
  );
  store = recordTest(store, run.chapterId, result);
  saveStore(storage, store);
  go({ name: 'result', run, result });
}

root.addEventListener('click', (event) => {
  const target = /** @type {HTMLElement} */ (event.target);
  const el = /** @type {HTMLElement | null} */ (target.closest('[data-action]'));
  if (!el || (el instanceof HTMLButtonElement && el.disabled)) return;
  const { action, chapter, index, token } = el.dataset;
  const run = screen.name === 'run' ? screen.run : null;

  switch (action) {
    case 'home':
      return go({ name: 'home' });
    case 'map':
      return go({ name: 'map' });
    case 'glossary':
      return go({ name: 'glossary' });
    case 'chapter':
      return go({ name: 'chapter', chapterId: String(chapter) });
    case 'lesson':
      return go({ name: 'run', run: startLesson(chapterOf(String(chapter)), Number(index)) });
    case 'test':
      return go({ name: 'run', run: startTest(chapterOf(String(chapter))) });
    case 'quit-run':
      if (run?.verdicts.some(Boolean) && !window.confirm('途中でやめますか？（答えた問題の記録は残ります）'))
        return;
      return go(run ? { name: 'chapter', chapterId: run.chapterId } : { name: 'map' });
    case 'next':
      if (run) {
        screen = { name: 'run', run: advance(run) };
        render();
        window.scrollTo(0, 0);
      }
      return;
    case 'prev':
      if (run) updateRun(back(run));
      return;
    case 'finish':
      return finishRun();
    case 'pick-tile':
      if (run && token) updateRun(answer(run, { kind: 'tile', token }));
      return;
    case 'pick-choice':
      if (run) updateRun(answer(run, { kind: 'choice', index: Number(index) }));
      return;
    case 'toggle-tile':
      if (run && token) updateRun(toggleTile(run, token));
      return;
    case 'submit-tiles':
      if (run) updateRun(answer(run, { kind: 'tiles' }));
      return;
    case 'term':
      term = el.dataset.term ?? null;
      return render();
    case 'close-sheet':
      term = null;
      return render();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && term) {
    term = null;
    render();
  }
});

render();
