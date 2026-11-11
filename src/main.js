// 配線だけを行う: 保存データ・教科書の中身・各画面の HTML を、クリックと描画でつなぐ。

import { allProblems, findChapter, LEVELS, PASS_RATIO, visibleLevels } from './content/index.js';
import {
  advance,
  answer,
  answered,
  appendProblem,
  back,
  startDrill,
  startLesson,
  startReview,
  startTest,
  toggleTile,
} from './drill/flow.js';
import { DRILLS, makeDrill } from './drill/generate.js';
import { testScore } from './drill/grade.js';
import { dueIds } from './drill/review.js';
import {
  dayKey,
  defaultStore,
  loadStore,
  recordAnswer,
  recordDrill,
  recordLesson,
  recordTest,
  saveStore,
} from './storage/store.js';
import { runHtml, testResultHtml } from './ui/run.js';
import {
  chapterHtml,
  drillsHtml,
  glossaryHtml,
  homeHtml,
  mapHtml,
  settingsHtml,
  statsHtml,
  termSheetHtml,
} from './ui/screens.js';

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
const problemById = new Map(allProblems(levels).map((p) => [p.id, p]));

/** 1回の復習で出す問題数の上限 */
const REVIEW_LIMIT = 20;

let { store } = loadStore(storage);

/**
 * @typedef {{ name: 'home' } | { name: 'map' } | { name: 'glossary' }
 *   | { name: 'drills' } | { name: 'stats' } | { name: 'settings' }
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

/** 今日の復習の問題（公開中の問題だけ） */
function dueProblems() {
  return dueIds(store.box, dayKey(new Date()))
    .map((id) => problemById.get(id))
    .filter((p) => p !== undefined);
}

/** @param {string} id 復習・反復練習では '' */
const maybeChapter = (id) => (id ? chapterOf(id) : undefined);

/** 反復練習の次の問題 */
const freshSeed = () => Math.floor(Math.random() * 2 ** 31);

function save() {
  saveStore(storage, store);
}

/** @type {ServiceWorker | null} 待機中の新しい版 */
let waitingWorker = null;

function render() {
  document.documentElement.classList.toggle('large-text', store.settings.largeText);
  let html = '';
  if (screen.name === 'home') html = homeHtml(levels, store, new Date(), dueProblems().length);
  else if (screen.name === 'map') html = mapHtml(levels, store);
  else if (screen.name === 'glossary') html = glossaryHtml();
  else if (screen.name === 'drills') html = drillsHtml(store, drafts);
  else if (screen.name === 'stats') html = statsHtml(store);
  else if (screen.name === 'settings') html = settingsHtml(store);
  else if (screen.name === 'chapter') html = chapterHtml(chapterOf(screen.chapterId), store, PASS_RATIO);
  else if (screen.name === 'run') html = runHtml(screen.run, maybeChapter(screen.run.chapterId));
  else if (screen.name === 'result')
    html = testResultHtml(screen.run, maybeChapter(screen.run.chapterId), screen.result);
  if (term) html += termSheetHtml(term);
  if (waitingWorker && screen.name === 'home') {
    html = `<button type="button" class="update-band" data-action="update">新しい版があります。タップして更新</button>${html}`;
  }
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
      const now = new Date();
      store =
        run.mode === 'drill'
          ? recordDrill(store, step.problem.type, v.grade, now)
          : recordAnswer(store, step.problem, v.grade, now, { inReview: run.mode === 'review' });
      save();
    }
  }
  render();
}

function finishRun() {
  if (screen.name !== 'run') return;
  const { run } = screen;
  if (run.mode === 'drill') return go({ name: 'drills' });
  if (run.mode === 'lesson') {
    const lesson = chapterOf(run.chapterId).lessons[run.lessonIndex];
    store = recordLesson(store, lesson.id);
    save();
    go({ name: 'chapter', chapterId: run.chapterId });
    return;
  }
  const result = testScore(
    answered(run).map((a) => a.verdict.grade),
    PASS_RATIO,
  );
  if (run.mode === 'test') {
    store = recordTest(store, run.chapterId, result);
    save();
  }
  go({ name: 'result', run, result });
}

root.addEventListener('click', (event) => {
  const target = /** @type {HTMLElement} */ (event.target);
  const el = /** @type {HTMLElement | null} */ (target.closest('[data-action]'));
  if (!el || (el instanceof HTMLButtonElement && el.disabled)) return;
  const { action, chapter, index, token, kind } = el.dataset;
  const run = screen.name === 'run' ? screen.run : null;

  switch (action) {
    case 'home':
      return go({ name: 'home' });
    case 'map':
      return go({ name: 'map' });
    case 'glossary':
      return go({ name: 'glossary' });
    case 'drills':
      return go({ name: 'drills' });
    case 'stats':
      return go({ name: 'stats' });
    case 'settings':
      return go({ name: 'settings' });
    case 'review': {
      const due = dueProblems().slice(0, REVIEW_LIMIT);
      if (due.length) go({ name: 'run', run: startReview(due) });
      return;
    }
    case 'drill': {
      const def = DRILLS.find((d) => d.kind === kind);
      if (def) go({ name: 'run', run: startDrill(def.kind, makeDrill(def.kind, freshSeed())) });
      return;
    }
    case 'toggle-large':
      store = { ...store, settings: { ...store.settings, largeText: !store.settings.largeText } };
      save();
      return render();
    case 'reset':
      if (
        !window.confirm(
          '章の合格・復習の箱・成績など、進み具合をすべて消します。元に戻せません。消しますか？',
        )
      )
        return;
      store = defaultStore();
      save();
      return go({ name: 'home' });
    case 'chapter':
      return go({ name: 'chapter', chapterId: String(chapter) });
    case 'lesson':
      return go({ name: 'run', run: startLesson(chapterOf(String(chapter)), Number(index)) });
    case 'test':
      return go({ name: 'run', run: startTest(chapterOf(String(chapter))) });
    case 'quit-run':
      if (
        run?.mode !== 'drill' &&
        run?.verdicts.some(Boolean) &&
        !window.confirm('途中でやめますか？（答えた問題の記録は残ります）')
      )
        return;
      if (run?.mode === 'drill') return go({ name: 'drills' });
      return go(run?.chapterId ? { name: 'chapter', chapterId: run.chapterId } : { name: 'home' });
    case 'next':
      if (run) {
        const next =
          run.mode === 'drill' && run.drill
            ? appendProblem(
                run,
                makeDrill(/** @type {import('./drill/generate.js').DrillKind} */ (run.drill), freshSeed()),
              )
            : advance(run);
        screen = { name: 'run', run: next };
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
    case 'update':
      if (waitingWorker) {
        navigator.serviceWorker.addEventListener('controllerchange', () => location.reload(), { once: true });
        waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      }
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

// Service Worker（オフライン対応）。手元では古いキャッシュで混乱しないよう、?sw=1 を付けたときだけ登録する
const local = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
if ('serviceWorker' in navigator && (!local || new URLSearchParams(location.search).has('sw'))) {
  navigator.serviceWorker
    .register('sw.js')
    .then((registration) => {
      const check = () => {
        if (!registration.waiting || !navigator.serviceWorker.controller) return;
        waitingWorker = registration.waiting;
        if (screen.name === 'home') render();
      };
      check();
      registration.addEventListener('updatefound', () => {
        registration.installing?.addEventListener('statechange', check);
      });
    })
    .catch(() => {
      // 登録できなくてもオンラインでは普通に使える
    });
}

render();
