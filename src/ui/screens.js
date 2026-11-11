// ホーム・章の地図・章の中身・用語集の画面。

import { findTerm, GLOSSARY } from '../content/glossary.js';
import { hasDraft } from '../content/index.js';
import { DRILLS } from '../drill/generate.js';
import { chapterStatus, streak } from '../storage/store.js';
import { rich, screenHtml } from './text.js';

/** @typedef {import('../content/types.js').Level} Level */
/** @typedef {import('../content/types.js').Chapter} Chapter */
/** @typedef {import('../storage/store.js').Store} Store */

/** 種類の名前（成績の画面） */
export const TYPE_NAMES = Object.freeze({
  rule: '基礎',
  agari: '和了の形',
  machi: '待ち',
  yaku: '役',
  nanikiru: '何切る',
  riichi: 'リーチ判断',
  oshihiki: '押し引き',
  naki: '鳴き',
  anzen: '安全牌',
});

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
 * @param {number} dueCount 今日の復習の問題数
 */
export function homeHtml(levels, store, now, dueCount) {
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
  ${
    dueCount > 0
      ? `<button type="button" class="card card-review" data-action="review"><span class="card-title">今日の復習 ${dueCount}問</span><span class="card-sub">間違えた問題をもう一度</span></button>`
      : '<div class="card card-static"><span class="card-title">今日の復習 0問</span><span class="card-sub">間違えた問題は、翌日・3日後・7日後・14日後に出ます</span></div>'
  }
  <button type="button" class="card" data-action="drills"><span class="card-title">反復練習</span><span class="card-sub">自動で作る問題を何問でも</span></button>
  <button type="button" class="card" data-action="map"><span class="card-title">章の地図</span><span class="card-sub">全レベルの章を見る</span></button>
  <button type="button" class="card" data-action="glossary"><span class="card-title">用語集</span><span class="card-sub">わからない言葉を調べる</span></button>
  <button type="button" class="card" data-action="stats"><span class="card-title">成績</span><span class="card-sub">種類ごとの得点率と苦手</span></button>
  <button type="button" class="card" data-action="settings"><span class="card-title">設定</span><span class="card-sub">文字の大きさ・記録のリセット</span></button>
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

/**
 * 反復練習の一覧。開く条件の章に合格するまでは押せない。
 * @param {Store} store
 * @param {boolean} unlockAll 手元の確認用に全部開く
 */
export function drillsHtml(store, unlockAll) {
  const items = DRILLS.map((d) => {
    const open = unlockAll || store.chapters[d.unlock]?.passed === true;
    const stat = store.drillStats[d.kind];
    const sub = open
      ? `${d.desc}${stat ? `（${stat.n}問・正解率 ${Math.round((stat.points / stat.n) * 100)}%）` : ''}`
      : `${d.unlock} の章末テストに合格すると開きます`;
    return `<li><button type="button" class="map-item ${open ? 'status-progress' : 'status-locked'}" data-action="drill" data-kind="${d.kind}"${open ? '' : ' disabled'}>
<span class="map-mark" aria-hidden="true">${open ? '▶' : '－'}</span>
<span class="map-text"><span class="map-title">${d.title}</span><span class="map-sub">${sub}</span></span>
</button></li>`;
  });
  const body = `<p class="lead">機械が自動で作る問題を、好きなだけ解けます。ここで間違えた問題は復習には入りません。</p>
<ul class="map-list">${items.join('')}</ul>`;
  return screenHtml({ title: '反復練習', back: 'home', body });
}

/**
 * 得点率の1行。
 * @param {string} name
 * @param {{ n: number, points: number } | undefined} stat
 * @param {boolean} weak
 */
function statRow(name, stat, weak) {
  if (!stat || stat.n === 0) return `<tr><th scope="row">${name}</th><td class="muted">—</td><td></td></tr>`;
  const rate = Math.round((stat.points / stat.n) * 100);
  return `<tr${weak ? ' class="is-weak"' : ''}><th scope="row">${name}${weak ? ' <span class="badge badge-weak">苦手</span>' : ''}</th>
<td>${rate}%<meter min="0" max="100" low="60" high="80" optimum="100" value="${rate}">${rate}%</meter></td><td class="muted small">${stat.n}問</td></tr>`;
}

/**
 * 成績: 種類ごとの得点率。5問以上答えた種類のうち、一番低いものを「苦手」にする。
 * @param {Store} store
 */
export function statsHtml(store) {
  const rated = Object.entries(store.typeStats).filter(([, st]) => st.n >= 5);
  const weakest =
    rated.length >= 2 ? rated.sort((a, b) => a[1].points / a[1].n - b[1].points / b[1].n)[0] : null;
  const weak = weakest && weakest[1].points / weakest[1].n < 0.8 ? weakest[0] : '';
  const rows = Object.entries(TYPE_NAMES)
    .filter(([type]) => store.typeStats[type])
    .map(([type, name]) => statRow(name, store.typeStats[type], type === weak));
  const drillRows = DRILLS.filter((d) => store.drillStats[d.kind]).map((d) =>
    statRow(d.title, store.drillStats[d.kind], false),
  );
  const answered = Object.keys(store.answers).length;
  const box = Object.keys(store.box).length;
  const table = (/** @type {string[]} */ r) =>
    r.length
      ? `<table class="stats-table"><tbody>${r.join('')}</tbody></table>`
      : '<p class="muted">まだ記録がありません。</p>';
  const body = `<div class="stats">
  <div class="stat"><span class="stat-num">${answered}</span><span class="stat-label">解いた問題</span></div>
  <div class="stat"><span class="stat-num">${box}</span><span class="stat-label">復習の箱</span></div>
</div>
<h2 class="section-title">教科書の問題（種類ごとの得点率）</h2>
<p class="muted small">最善 1点・悪くない 0.5点・悪手 0点で数えます。</p>
${table(rows)}
${weak ? `<p>「${TYPE_NAMES[/** @type {keyof typeof TYPE_NAMES} */ (weak)]}」が苦手のようです。その種類が出てくる章を見直しましょう。</p>` : ''}
<h2 class="section-title">反復練習（正解率）</h2>
${table(drillRows)}`;
  return screenHtml({ title: '成績', back: 'home', body });
}

/**
 * 設定。
 * @param {Store} store
 */
export function settingsHtml(store) {
  const large = store.settings.largeText;
  const body = `<h2 class="section-title">文字の大きさ</h2>
<button type="button" class="toggle" data-action="toggle-large" aria-pressed="${large}">
<span class="toggle-text">解説と問題の文字を大きくする</span><span class="toggle-state">${large ? 'オン' : 'オフ'}</span></button>
<h2 class="section-title">記録</h2>
<p class="muted small">記録はこの端末のブラウザの中だけに保存され、どこにも送られません。</p>
<button type="button" class="btn btn-danger" data-action="reset">進み具合をすべて消す</button>`;
  return screenHtml({ title: '設定', back: 'home', body });
}
