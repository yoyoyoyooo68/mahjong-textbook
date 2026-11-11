// 教科書の文を HTML にする: {3p} → 牌の絵、[[和了]] → 用語ボタン。

import { richText } from './tile-text.js';

/** 文中の牌の幅(px) */
export const TEXT_TILE = 22;

/**
 * @param {string} text
 * @param {number} [tileWidth]
 * @returns {string}
 */
export function rich(text, tileWidth = TEXT_TILE) {
  return richText(text, tileWidth).replace(
    /\[\[([^\]]+)\]\]/g,
    (_, term) => `<button type="button" class="term" data-action="term" data-term="${term}">${term}</button>`,
  );
}

/**
 * 文に出てくる用語（[[…]] の中身）。
 * @param {string} text
 * @returns {string[]}
 */
export function termsIn(text) {
  return [...text.matchAll(/\[\[([^\]]+)\]\]/g)].map((m) => m[1]);
}

/**
 * 見出しつきの画面の枠。
 * @param {{ title: string, back?: string, body: string, footer?: string }} parts back は戻るボタンの data-action
 */
export function screenHtml({ title, back, body, footer = '' }) {
  const backButton = back
    ? `<button type="button" class="nav-back" data-action="${back}" aria-label="戻る">‹ 戻る</button>`
    : '';
  return `<header class="bar">${backButton}<h1 class="bar-title">${title}</h1></header>
<main class="page">${body}</main>${footer ? `<footer class="actions">${footer}</footer>` : ''}`;
}
