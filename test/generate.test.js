// 反復練習の自動生成（設計図.md 6.4）。たくさんの種で、条件と正解が計算と合うかを確かめる。

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { shanten, shantenNormal } from '../src/core/shanten.js';
import { agariDrill, machiDrill, makeDrill, nanikiruDrill } from '../src/drill/generate.js';
import { countsOf, kindToken, tokensOf, waitsOf } from '../src/drill/tiles.js';
import { richText } from '../src/ui/tile-text.js';

const SEEDS = Array.from({ length: 120 }, (_, i) => i * 7919 + 1);

/** @param {import('../src/content/types.js').Problem} p */
function checkTexts(p) {
  for (const t of [p.prompt, p.summary, p.explain ?? '', ...(p.choices ?? []).map((c) => c.reason)]) {
    assert.doesNotThrow(() => richText(t), t);
  }
  const counts = countsOf(p.scene?.hand ?? '', p.scene?.draw ?? '');
  assert.ok(
    counts.every((n) => n <= 4),
    `${p.id}: 同じ牌が5枚以上`,
  );
}

test('和了っている？: 14枚で、正解が和了判定と一致する。和了と非和了の両方が出る', () => {
  let yes = 0;
  for (const seed of SEEDS) {
    const p = agariDrill(seed);
    checkTexts(p);
    const counts = countsOf(p.scene?.hand ?? '');
    assert.equal(tokensOf(p.scene?.hand ?? '').length, 14);
    const agari = shanten(counts, 0) === -1;
    if (agari) yes++;
    assert.equal(p.choices?.find((c) => c.answer === '和了の形')?.grade === 'best', agari, p.id);
  }
  assert.ok(yes > 20 && yes < 100, `和了の形の割合が偏っている: ${yes}`);
});

test('待ち当て: 13枚のテンパイで、正解が待ちの計算と一致し、選べる牌に入っている', () => {
  for (const seed of SEEDS) {
    const p = machiDrill(seed);
    checkTexts(p);
    const hand = p.scene?.hand ?? '';
    assert.equal(tokensOf(hand).length, 13);
    const waits = waitsOf(hand, 0).map(kindToken).sort();
    assert.deepEqual(tokensOf(p.correct ?? '').sort(), waits, p.id);
    const palette = new Set(tokensOf(p.palette ?? ''));
    for (const w of waits) assert.ok(palette.has(w), `${p.id}: ${w} が選べない`);
  }
});

test('何切る: 2〜3シャンテン・字牌はオタ風だけ・赤なし。最善は一般形の受け入れ最大で、僅差の選択肢がない', () => {
  for (const seed of SEEDS.slice(0, 60)) {
    const p = nanikiruDrill(seed);
    checkTexts(p);
    const all = `${p.scene?.hand}${p.scene?.draw}`;
    assert.equal(tokensOf(all).length, 14);
    assert.ok(!all.includes('0'), '赤五は出さない');
    for (const t of tokensOf(all)) if (t.endsWith('z')) assert.ok(['2z', '3z', '4z'].includes(t), t);
    const tokens = new Set(tokensOf(all));
    assert.equal(p.choices?.length, tokens.size, '全部の牌に評価がある');
    const counts = countsOf(all);
    const best = (p.choices ?? []).filter((c) => c.grade === 'best');
    assert.ok(best.length > 0);
    for (const c of p.choices ?? []) {
      const after = [...counts];
      after[countsOf(c.answer).findIndex((n) => n > 0)]--;
      assert.equal(shantenNormal(after, 0), c.claims?.shanten, `${p.id}: ${c.answer}`);
    }
    const s = best[0].claims?.shanten ?? -1;
    assert.ok(s >= 2 && s <= 3, `${p.id}: ${s}シャンテン`);
    const keep = (p.choices ?? []).filter((c) => c.claims?.shanten === s);
    const max = Math.max(...keep.map((c) => c.claims?.ukeire ?? 0));
    for (const c of keep) {
      const u = c.claims?.ukeire ?? 0;
      assert.equal(c.grade === 'best', u === max, `${p.id}: ${c.answer}`);
      assert.ok(u === max || u < max - 2, `${p.id}: 僅差の選択肢 ${c.answer}`);
    }
  }
});

test('同じ種からは同じ問題', () => {
  assert.deepEqual(makeDrill('nanikiru', 42), makeDrill('nanikiru', 42));
  assert.deepEqual(makeDrill('machi', 42), makeDrill('machi', 42));
});
