// ブラインド審査の第2段階で使う、作問者の答え（最善・悪くない）の一覧を出す。
// 使い方: node scripts/answer-key.js 1 > reviews/key-level1.md

import { LEVELS } from '../src/content/index.js';

const target = process.argv[2] ?? '1';
const out = ['# 作問者の答え', ''];
for (const level of LEVELS) {
  for (const ch of level.chapters) {
    if (String(level.id) !== target && ch.id !== target) continue;
    for (const p of [...ch.lessons.flatMap((l) => l.problems), ...ch.test]) {
      let answer = '';
      if (p.ask === 'tiles') answer = `正解 ${p.correct}`;
      else {
        const best = (p.choices ?? []).filter((c) => c.grade === 'best').map((c) => c.answer);
        const ok = (p.choices ?? []).filter((c) => c.grade === 'ok').map((c) => c.answer);
        answer = `最善 ${best.join(' / ')}${ok.length ? `、悪くない ${ok.join(' / ')}` : ''}`;
        if (p.ask === 'tile' && p.otherwise)
          answer += `、それ以外は${p.otherwise.grade === 'bad' ? '悪手' : p.otherwise.grade}`;
      }
      out.push(`- ${p.id}: ${answer}`);
    }
  }
}
console.log(out.join('\n'));
