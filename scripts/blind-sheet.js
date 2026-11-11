// ブラインド審査用の問題用紙を作る（設計図.md 第11章の3）。評価・理由・解説を伏せて、局面と問題文と選択肢だけを出す。
// 使い方: node scripts/blind-sheet.js 1 > reviews/blind-level1.md   （引数はレベル。章 id でもよい: 1-3）

import { LEVELS } from '../src/content/index.js';
import { choiceOrder } from '../src/drill/grade.js';

const SEATS = { east: '東', south: '南', west: '西', north: '北' };
const target = process.argv[2] ?? '1';

/** @param {import('../src/content/types.js').Problem} p */
function sheet(p) {
  const s = p.scene;
  const lines = [`### ${p.id}（${p.type}）`];
  if (s) {
    const info = [
      s.round,
      s.roundWind && `${SEATS[s.roundWind]}場`,
      s.seat && `自風${SEATS[s.seat]}`,
      s.turn && `${s.turn}巡目`,
      s.doraIndicators?.length && `ドラ表示牌 ${s.doraIndicators.join(' ')}`,
    ].filter(Boolean);
    if (info.length) lines.push(`- 状況: ${info.join(' / ')}`);
    lines.push(
      `- 手牌: ${s.hand}${s.draw ? ` ＋ツモ ${s.draw}` : ''}${s.melds?.length ? ` ／副露 ${s.melds.join(' ')}` : ''}`,
    );
    if (s.discards) lines.push(`- 自分の捨て牌: ${s.discards}`);
  }
  if (p.win)
    lines.push(`- 和了: ${p.win.tsumo ? 'ツモ' : 'ロン'} ${p.win.tile}${p.win.riichi ? '（リーチ中）' : ''}`);
  lines.push(`- 問題: ${p.prompt}`);
  if (p.ask === 'choice') {
    const choices = p.choices ?? [];
    lines.push(...choiceOrder(p).map((i, n) => `  ${n + 1}. ${choices[i].answer}`));
  }
  if (p.ask === 'tile') lines.push('  （手牌＋ツモから1枚選ぶ。最善・悪くない・悪手を牌ごとに付ける）');
  if (p.ask === 'tiles') lines.push(`  （当てはまる牌を全部選ぶ。選べる牌: ${p.palette}）`);
  lines.push('- あなたの答え: ');
  return lines.join('\n');
}

const out = [
  '# ブラインド審査 問題用紙',
  '',
  '牌の表記: m=萬子 p=筒子 s=索子 z=字牌（1東2南3西4北5白6發7中）、0は赤五。',
  '',
];
for (const level of LEVELS) {
  for (const ch of level.chapters) {
    if (String(level.id) !== target && ch.id !== target) continue;
    out.push(`## ${ch.id} ${ch.title}`, '');
    for (const l of ch.lessons) for (const p of l.problems) out.push(sheet(p), '');
    out.push(`## ${ch.id} 章末テスト`, '');
    for (const p of ch.test) out.push(sheet(p), '');
  }
}
console.log(out.join('\n'));
