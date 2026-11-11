// 用語集。各章のファイルの TERMS を集めたもの。文中の [[用語]] はここの term と一致させる（検算テストが確認する）。

import * as c11 from './level1/1-1.js';
import * as c12 from './level1/1-2.js';
import * as c13 from './level1/1-3.js';
import * as c14 from './level1/1-4.js';
import * as c15 from './level1/1-5.js';

/** @type {readonly import('./types.js').GlossaryEntry[]} */
export const GLOSSARY = Object.freeze(
  [c11, c12, c13, c14, c15].flatMap((c) => c.TERMS.map((t) => ({ chapter: c.CHAPTER.id, ...t }))),
);

/** @param {string} term @returns {import('./types.js').GlossaryEntry | undefined} */
export function findTerm(term) {
  return GLOSSARY.find((e) => e.term === term);
}
