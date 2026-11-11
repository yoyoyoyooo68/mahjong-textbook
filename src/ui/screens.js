// ホーム・章の地図・章の中身・用語集の画面。

import { findTerm, GLOSSARY } from '../content/glossary.js';
import { hasDraft } from '../content/index.js';
import { chapterStatus, streak } from '../storage/store.js';
import { rich, screenHtml } from './text.js';

/** @typedef {import('../content/types.js').Level} Level */
/** @typedef {import('../content/types.js').Chapter} Chapter */
/** @typedef {import('../storage/store.js').Store} Store */

const STATUS_LABEL = { new: '未着手', progress: '学習中', passed: '合格' };
const STATUS_MARK = { new: '○', progress: '◐', passed: '★' };

/**
 * 次にやること（最初の未合格の章の、最初の未完了レッスン。全部終えていれば章末テスト）。
 * @param {readonly Level[]} levels
 * @param {Store} store
 * @returns {{ chapter: Chapter, lessonIndex: number } | null} lessonIndex = -1 は章末テスト
 */
export function nextUp(levels, store) {
  for (const level of levels) {
    for (const chapter of level.chapters) {
      if (store.chapters[chapter.id]?.passed) continue;
      const i = chapter.lessons.findIndex((l) => !store.lessonsDone.includes(l.id));
      return { chapter, lessonIndex: i };
    }
  }
  return null;
}

/**
 * @param {readonly Level[]} levels
 * @param {Store} store
 * @param {Date} now
 */
export function homeHtml(levels, store, now) {
  const days = streak(store, now);
  const next = nextUp(levels, store);
  let resume = '<p class="muted">公開中の章はすべて合格しました。</p>';
  if (next) {
    const { chapter, lessonIndex } = next;
    const what = lessonIndex === -1 ? '章末テスト' : chapter.lessons[lessonIndex].title;
    const action =
      lessonIndex === -1
        ? `data-action="test" data-chapter="${chapter.id}"`
        : `data-action="lesson" data-chapter="${chapter.id}" data-index="${lessonIndex}"`;
    resume = `<button type="button" class="card card-primary" ${action}>
<span class="card-kicker">続きから</span>
<span class="card-title">${chapter.id} ${chapter.title}</span>
<span class="card-sub">${what}</span></button>`;
  }
  const passed = Object.values(store.chapters).filter((c) => c.passed).length;
  const total = levels.reduce((n, l) => n + l.chapters.length, 0);
  const body = `
<p class="lead">短い解説とドリルで、麻雀の戦い方を身につけよう。</p>
${resume}
<div class="stats">
  <div class="stat"><span class="stat-num">${days}</span><span class="stat-label">日連続</span></div>
  <div class="stat"><span class="stat-num">${passed}/${total}</span><span class="stat-label">章合格</span></div>
</div>
<nav class="menu">
  <button type="button" class="card" data-action="map"><span class="card-title">章の地図</span><span class="card-sub">全レベルの章を見る</span></button>
  <button type="button" class="card" data-action="glossary"><span class="card-title">用語集</span><span class="card-sub">わからない言葉を調べる</span></button>
</nav>`;
  return screenHtml({ title: '麻雀教科書', body });
}

/**
 * @param {readonly Level[]} levels
 * @param {Store} store
 */
export function mapHtml(levels, store) {
  const sections = levels.map((level) => {
    const items = level.chapters.map((ch) => {
      const status = chapterStatus(store, ch);
      const draft = hasDraft(ch) ? '<span class="badge badge-draft">未審査</span>' : '';
      return `<li><button type="button" class="map-item status-${status}" data-action="chapter" data-chapter="${ch.id}">
<span class="map-mark" aria-hidden="true">${STATUS_MARK[status]}</span>
<span class="map-text"><span class="map-title">${ch.id} ${ch.title}${draft}</span><span class="map-sub">${STATUS_LABEL[status]}</span></span>
</button></li>`;
    });
    const list = items.length ? `<ul class="map-list">${items.join('')}</ul>` : '<p class="muted">準備中</p>';
    const allPassed = level.chapters.length > 0 && level.chapters.every((c) => store.chapters[c.id]?.passed);
    return `<section class="level">
<h2 class="level-title">レベル${level.id} ${level.title}${allPassed ? ' <span class="badge badge-pass">★ クリア</span>' : ''}</h2>
<p class="level-theme">${level.theme}</p>${list}</section>`;
  });
  return screenHtml({ title: '章の地図', back: 'home', body: sections.join('') });
}

/**
 * @param {Chapter} chapter
 * @param {Store} store
 * @param {number} passRatio
 */
export function chapterHtml(chapter, store, passRatio) {
  const lessons = chapter.lessons.map((l, i) => {
    const done = store.lessonsDone.includes(l.id);
    return `<li><button type="button" class="map-item ${done ? 'status-passed' : 'status-new'}" data-action="lesson" data-chapter="${chapter.id}" data-index="${i}">
<span class="map-mark" aria-hidden="true">${done ? '✓' : i + 1}</span>
<span class="map-text"><span class="map-title">${l.title}</span><span class="map-sub">${done ? '済み' : `確認問題 ${l.problems.length}問`}</span></span>
</button></li>`;
  });
  const record = store.chapters[chapter.id];
  const need = Math.ceil(chapter.test.length * passRatio * 2) / 2;
  const best = record
    ? `最高 ${record.bestScore}点 / ${record.max}点${record.passed ? '（合格）' : ''}`
    : `${chapter.test.length}問・${need}点以上で合格`;
  const body = `<p class="lead">${rich(chapter.goal)}</p>
<h2 class="section-title">レッスン</h2>
<ul class="map-list">${lessons.join('')}</ul>
<h2 class="section-title">章末テスト</h2>
<button type="button" class="card${record?.passed ? '' : ' card-primary'}" data-action="test" data-chapter="${chapter.id}">
<span class="card-title">テストを受ける</span><span class="card-sub">${best}</span></button>
<p class="muted small">レッスンを終えていなくても受けられます。</p>`;
  return screenHtml({ title: `${chapter.id} ${chapter.title}`, back: 'map', body });
}

export function glossaryHtml() {
  const items = GLOSSARY.map(
    (e) =>
      `<div class="term-entry"><dt>${e.term}${e.reading ? `<span class="reading">${e.reading}</span>` : ''}</dt><dd>${rich(e.body)}</dd></div>`,
  );
  return screenHtml({ title: '用語集', back: 'home', body: `<dl class="glossary">${items.join('')}</dl>` });
}

/**
 * 用語をタップしたときの下からのシート。
 * @param {string} term
 */
export function termSheetHtml(term) {
  const entry = findTerm(term);
  const body = entry ? rich(entry.body) : 'この用語の説明はまだありません。';
  const reading = entry?.reading ? `<span class="reading">${entry.reading}</span>` : '';
  return `<div class="sheet-backdrop" data-action="close-sheet"></div>
<div class="sheet" role="dialog" aria-modal="true" aria-label="${term}">
<h2 class="sheet-title">${term}${reading}</h2><p>${body}</p>
<button type="button" class="btn" data-action="close-sheet">閉じる</button></div>`;
}
