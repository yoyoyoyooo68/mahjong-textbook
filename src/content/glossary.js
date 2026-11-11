// 用語集。各章のファイルの TERMS を集めたもの。文中の [[用語]] はここの term と一致させる（検算テストが確認する）。

import * as c11 from './level1/1-1.js';
import * as c12 from './level1/1-2.js';
import * as c13 from './level1/1-3.js';
import * as c14 from './level1/1-4.js';
import * as c15 from './level1/1-5.js';
import * as c21 from './level2/2-1.js';
import * as c22 from './level2/2-2.js';
import * as c23 from './level2/2-3.js';
import * as c24 from './level2/2-4.js';
import * as c25 from './level2/2-5.js';
import * as c26 from './level2/2-6.js';

/** @type {readonly import('./types.js').GlossaryEntry[]} */
export const GLOSSARY = Object.freeze(
  [c11, c12, c13, c14, c15, c21, c22, c23, c24, c25, c26].flatMap((c) =>
    c.TERMS.map((t) => ({ chapter: c.CHAPTER.id, ...t })),
  ),
);

/** @param {string} term @returns {import('./types.js').GlossaryEntry | undefined} */
export function findTerm(term) {
  return GLOSSARY.find((e) => e.term === term);
}
