// 全問題の検算（設計図.md 第11章の2）。問題を足したら、これが通るまで公開しない。

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { GLOSSARY } from '../src/content/glossary.js';
import { allProblems, LEVELS, TEST_SIZE } from '../src/content/index.js';
import { shanten } from '../src/core/shanten.js';
import { YAKU } from '../src/core/yaku.js';
import { afterDiscard, countsOf, kindToken, tokensOf, waitsOf, yakuIdsOf } from '../src/drill/tiles.js';
import { termsIn } from '../src/ui/text.js';
import { richText } from '../src/ui/tile-text.js';

/** @typedef {import('../src/content/types.js').Problem} Problem */

// 作問中の章（レッスンも章末テストも空）は検算しない
const chapters = LEVELS.flatMap((l) => l.chapters).filter((c) => c.lessons.length > 0 || c.test.length > 0);
const problems = allProblems(LEVELS);
const terms = new Set(GLOSSARY.map((e) => e.term));

/**
 * 問題に出てくる文をすべて集める。
 * @param {Problem} p
 * @returns {string[]}
 */
function textsOf(p) {
  return [
    p.prompt,
    p.summary,
    p.explain ?? '',
    ...(p.choices ?? []).flatMap((c) => [c.answer, c.reason]),
    p.otherwise?.reason ?? '',
  ];
}

/** 章とレッスンの文（問題を除く） */
function chapterTexts() {
  return chapters.flatMap((ch) => [ch.goal, ...ch.lessons.flatMap((l) => [l.aim, ...l.pages, ...l.summary])]);
}

/** @param {Problem} p */
const meldCount = (p) => p.scene?.melds?.length ?? 0;

/** @param {Problem} p 相手の河と鳴き（まとめて） */
const othersText = (p) => (p.scene?.others ?? []).flatMap((o) => [o.river, ...(o.melds ?? [])]);

/** @param {Problem} p 手牌 + ツモ */
const fullHand = (p) => `${p.scene?.hand ?? ''}${p.scene?.draw ?? ''}`;

test('id: 重複がなく、章・レッスンの id から始まる', () => {
  const seen = new Set();
  for (const ch of chapters) {
    for (const l of ch.lessons) {
      assert.ok(l.id.startsWith(`${ch.id}-`), l.id);
      for (const p of l.problems) assert.ok(p.id.startsWith(`${l.id}-`), p.id);
    }
    for (const p of ch.test) assert.ok(p.id.startsWith(`${ch.id}-t-`), p.id);
  }
  for (const p of problems) {
    assert.ok(!seen.has(p.id), `id が重複: ${p.id}`);
    seen.add(p.id);
  }
});

test('文: 牌の表記が読め、用語はすべて用語集にある', () => {
  const texts = [...problems.flatMap(textsOf), ...chapterTexts()];
  for (const text of texts) {
    assert.doesNotThrow(() => richText(text), text);
    for (const term of termsIn(text)) assert.ok(terms.has(term), `用語集にない用語: ${term}（${text}）`);
  }
  for (const e of GLOSSARY) {
    assert.doesNotThrow(() => richText(e.body), e.term);
    assert.deepEqual(termsIn(e.body), [], `用語集の説明に [[…]] は使わない: ${e.term}`);
  }
  assert.equal(new Set(GLOSSARY.map((e) => e.term)).size, GLOSSARY.length, '用語集の見出しが重複');
});

test('章: レッスンの確認問題は2〜4問、章末テストの問題数、まとめは3行以内', () => {
  for (const level of LEVELS) {
    for (const ch of level.chapters.filter((c) => chapters.includes(c))) {
      const size = TEST_SIZE[/** @type {1|2|3|4|5} */ (level.id)];
      assert.equal(ch.test.length, size, `${ch.id}: 章末テストは${size}問`);
      assert.ok(ch.goal.trim(), `${ch.id}: goal がない`);
    }
  }
  for (const ch of chapters) {
    for (const l of ch.lessons) {
      assert.ok(l.problems.length >= 2 && l.problems.length <= 4, `${l.id}: 確認問題 ${l.problems.length}問`);
      assert.ok(l.summary.length >= 1 && l.summary.length <= 3, `${l.id}: まとめ ${l.summary.length}行`);
      assert.ok(l.pages.length > 0, `${l.id}: 解説がない`);
    }
  }
});

test('局面: 同じ牌は4枚まで、手牌の枚数が正しい', () => {
  for (const p of problems) {
    const s = p.scene;
    if (!s) continue;
    const counts = countsOf(
      s.hand,
      s.draw ?? '',
      p.win?.tile ?? '',
      s.discards ?? '',
      ...(s.melds ?? []),
      ...(s.doraIndicators ?? []),
      ...othersText(p),
    );
    for (const [k, n] of counts.entries()) assert.ok(n <= 4, `${p.id}: ${kindToken(k)} が${n}枚`);
    const reds = tokensOf(
      [
        fullHand(p),
        p.win?.tile ?? '',
        s.discards ?? '',
        ...(s.melds ?? []),
        ...(s.doraIndicators ?? []),
        ...othersText(p),
      ].join(''),
    ).filter((t) => t.startsWith('0'));
    assert.equal(new Set(reds).size, reds.length, `${p.id}: 赤五が重複`);
    // 赤五ありのルールなので、赤でない5は各色3枚まで
    const allTokens = tokensOf(
      [
        fullHand(p),
        p.win?.tile ?? '',
        s.discards ?? '',
        ...(s.melds ?? []),
        ...(s.doraIndicators ?? []),
        ...othersText(p),
      ].join(''),
    );
    for (const suit of ['m', 'p', 's']) {
      const plain = allTokens.filter((t) => t === `5${suit}`).length;
      assert.ok(
        plain <= 3,
        `${p.id}: 赤でない5${suit}が${plain}枚（赤五ありでは3枚まで。4枚使うなら1枚を0${suit}に）`,
      );
    }

    const n = tokensOf(fullHand(p)).length + meldCount(p) * 3;
    const expected = p.type === 'machi' || p.win ? 13 : 14;
    if (['agari', 'machi', 'nanikiru', 'anzen'].includes(p.type) || p.win) {
      assert.equal(n, expected, `${p.id}: 手牌が${n}枚（副露は3枚と数える）`);
    }
    if (p.type === 'nanikiru' || p.type === 'anzen') assert.ok(s.draw, `${p.id}: 何切るはツモ牌を書く`);
    for (const o of s.others ?? []) {
      if (o.riichiAt !== undefined) {
        const n = tokensOf(o.river).length;
        assert.ok(o.riichiAt >= 0 && o.riichiAt < n, `${p.id}: riichiAt が河の外`);
      }
    }
  }
});

test('答え方: 選択肢・評価の形が正しい', () => {
  for (const p of problems) {
    assert.ok(p.summary.trim(), `${p.id}: 覚えることがない`);
    for (const c of [...(p.choices ?? []), ...(p.otherwise ? [p.otherwise] : [])]) {
      assert.ok(['best', 'ok', 'bad'].includes(c.grade), `${p.id}: 評価 ${c.grade}`);
      assert.ok(c.reason.trim(), `${p.id}: 理由がない`);
    }
    if (p.review.status === 'approved') assert.ok(p.review.reviewer, `${p.id}: 審査者がいないのに approved`);

    if (p.ask === 'tile') {
      const hand = new Set(tokensOf(fullHand(p)));
      const answers = (p.choices ?? []).map((c) => c.answer);
      for (const a of answers) assert.ok(hand.has(a), `${p.id}: ${a} は手牌にない`);
      assert.equal(new Set(answers).size, answers.length, `${p.id}: 同じ牌の評価が2つ`);
      const coversAll = [...hand].every((t) => answers.includes(t));
      assert.ok(coversAll || p.otherwise, `${p.id}: 評価のない牌がある（otherwise を書く）`);
      assert.ok(
        (p.choices ?? []).some((c) => c.grade === 'best'),
        `${p.id}: 最善がない`,
      );
    } else if (p.ask === 'choice') {
      assert.ok((p.choices ?? []).length >= 2, `${p.id}: 選択肢が2つ未満`);
      assert.ok(
        (p.choices ?? []).some((c) => c.grade === 'best'),
        `${p.id}: 最善がない`,
      );
    } else if (p.ask === 'tiles') {
      const palette = new Set(tokensOf(p.palette ?? ''));
      const correct = tokensOf(p.correct ?? '');
      assert.ok(correct.length > 0, `${p.id}: 正解がない`);
      for (const t of correct) assert.ok(palette.has(t), `${p.id}: 正解 ${t} が選べない`);
      assert.ok(p.explain, `${p.id}: 全部選ぶ問題は explain を書く`);
    }
  }
});

test('和了判定: 「和了の形」の評価が計算と一致する', () => {
  for (const p of problems.filter((q) => q.type === 'agari')) {
    const agari = shanten(countsOf(fullHand(p)), meldCount(p)) === -1;
    const yes = p.choices?.find((c) => c.answer === '和了の形');
    const no = p.choices?.find((c) => c.answer === '和了の形ではない');
    assert.ok(yes && no, `${p.id}: 選択肢は「和了の形」「和了の形ではない」にする`);
    assert.equal(yes.grade === 'best', agari, `${p.id}: 和了の形は ${agari}`);
    assert.equal(no.grade === 'best', !agari, `${p.id}`);
  }
});

test('待ち: 正解が計算した待ちと一致する', () => {
  for (const p of problems.filter((q) => q.type === 'machi' && q.ask === 'tiles')) {
    const waits = waitsOf(p.scene?.hand ?? '', meldCount(p))
      .map(kindToken)
      .sort();
    assert.deepEqual([...tokensOf(p.correct ?? '')].sort(), waits, `${p.id}: 待ちは ${waits.join(',')}`);
  }
});

test('何切る: 最善はシャンテン数を下げない（守備の問題を除く）、理由の数字が計算と一致する', () => {
  for (const p of problems.filter((q) => q.type === 'nanikiru' && q.ask === 'tile')) {
    const tiles = fullHand(p);
    const visible = (p.scene?.doraIndicators ?? []).join('');
    const opts = { melds: meldCount(p), visible };
    const all = [...new Set(tokensOf(tiles))].map((t) => ({ t, ...afterDiscard(tiles, t, opts) }));
    const minShanten = Math.min(...all.map((a) => a.shanten));
    for (const c of p.choices ?? []) {
      const r = afterDiscard(tiles, c.answer, opts);
      if (c.grade === 'best' && !p.tags.includes('守備')) {
        assert.equal(r.shanten, minShanten, `${p.id}: 最善 ${c.answer} はシャンテン数が下がる`);
      }
      if (c.claims?.shanten !== undefined) {
        assert.equal(r.shanten, c.claims.shanten, `${p.id}: ${c.answer} を切ると${r.shanten}シャンテン`);
      }
      if (c.claims?.ukeire !== undefined) {
        assert.equal(r.ukeire, c.claims.ukeire, `${p.id}: ${c.answer} を切ると受け入れ${r.ukeire}枚`);
      }
    }
  }
});

test('役: yaku に書いた役が判定と一致する', () => {
  const ids = new Set(YAKU.map((y) => y.id));
  for (const p of problems) {
    if (p.type === 'yaku') assert.ok(p.win && p.yaku, `${p.id}: 役の問題は win と yaku を書く`);
    if (!p.yaku) continue;
    assert.ok(p.win && p.scene, `${p.id}: yaku を書くなら win と scene も書く`);
    for (const id of p.yaku) assert.ok(ids.has(id), `${p.id}: 役の id ${id} はない`);
    const got = yakuIdsOf({ ...p.scene, win: p.win });
    assert.ok(got, `${p.id}: 和了の形になっていない`);
    assert.deepEqual(got, [...p.yaku].sort(), `${p.id}: 判定では ${got.join(',') || '役なし'}`);
  }
});

/**
 * 決まった2択の選択肢の評価を、計算した答えと突き合わせる。
 * @param {Problem} p
 * @param {string} yesText
 * @param {string} noText
 * @param {boolean} truth
 */
function checkPair(p, yesText, noText, truth) {
  const yes = p.choices?.find((c) => c.answer === yesText);
  const no = p.choices?.find((c) => c.answer === noText);
  if (!yes && !no) return false;
  assert.ok(yes && no, `${p.id}: 選択肢は「${yesText}」「${noText}」の2つにする`);
  assert.equal(yes.grade === 'best', truth, `${p.id}: 正しくは「${truth ? yesText : noText}」`);
  assert.equal(no.grade === 'best', !truth, p.id);
  return true;
}

test('2択の決まった問題: テンパイ・ロンできるか（フリテン）・役があって和了れるか', () => {
  for (const p of problems) {
    const s = p.scene;
    if (!s) continue;
    // 「テンパイ」「ノーテン」: 13 - 3×副露 枚の手がテンパイか
    if (checkPair(p, 'テンパイ', 'ノーテン', shanten(countsOf(s.hand), meldCount(p)) === 0)) {
      assert.equal(tokensOf(s.hand).length + meldCount(p) * 3, 13, `${p.id}: テンパイ判定は13枚`);
    }
    // 「ロンできる」「ロンできない」: 待ちのどれかを自分で捨てていればフリテン。役は win があれば判定する
    if (p.choices?.some((c) => c.answer === 'ロンできる')) {
      assert.ok(p.win && !p.win.tsumo, `${p.id}: ロンの問題は win（tsumo: false）を書く`);
      const waits = new Set(waitsOf(s.hand, meldCount(p)));
      const discarded = countsOf(s.discards ?? '');
      const furiten = [...waits].some((k) => discarded[k] > 0);
      const hasYaku = (yakuIdsOf({ ...s, win: p.win }) ?? []).length > 0;
      checkPair(p, 'ロンできる', 'ロンできない', !furiten && hasYaku);
    }
    // 「和了れる」「和了れない」: 役が1つ以上あるか
    if (p.choices?.some((c) => c.answer === '和了れる')) {
      assert.ok(p.win, `${p.id}: 和了れるかの問題は win を書く`);
      checkPair(p, '和了れる', '和了れない', (yakuIdsOf({ ...s, win: p.win }) ?? []).length > 0);
    }
  }
});

test('安全牌: 「現物」と書いた牌がリーチした相手の河にある', () => {
  for (const p of problems) {
    const riichiRivers = (p.scene?.others ?? []).filter((o) => o.riichiAt !== undefined);
    for (const c of p.choices ?? []) {
      if (c.claims?.genbutsu === undefined) continue;
      assert.ok(riichiRivers.length > 0, `${p.id}: 現物を書くならリーチした相手を書く`);
      const kind = countsOf(c.answer).findIndex((n) => n > 0);
      const inRiver = riichiRivers.some((o) => countsOf(o.river)[kind] > 0);
      assert.equal(
        inRiver,
        c.claims.genbutsu,
        `${p.id}: ${c.answer} は現物${inRiver ? 'です' : 'ではありません'}`,
      );
    }
    if (p.type === 'anzen') {
      assert.ok(riichiRivers.length > 0, `${p.id}: 安全牌の問題はリーチした相手を書く`);
      for (const c of (p.choices ?? []).filter((x) => x.grade === 'best')) {
        assert.ok(c.claims?.genbutsu !== undefined, `${p.id}: 安全牌の問題の最善には claims.genbutsu を書く`);
      }
    }
  }
});

test('リーチするか: 門前でテンパイしている13枚の手', () => {
  for (const p of problems) {
    if (!p.choices?.some((c) => c.answer === 'リーチする')) continue;
    const s = p.scene;
    assert.ok(s, `${p.id}: 局面がない`);
    assert.equal(meldCount(p), 0, `${p.id}: 鳴いているとリーチできない`);
    assert.equal(tokensOf(s.hand).length, 13, `${p.id}: リーチするかの手牌は切ったあとの13枚`);
    assert.equal(shanten(countsOf(s.hand), 0), 0, `${p.id}: テンパイしていない`);
    assert.ok(
      p.choices.some((c) => c.answer === 'リーチしない'),
      `${p.id}: 選択肢「リーチしない」がない`,
    );
  }
});
