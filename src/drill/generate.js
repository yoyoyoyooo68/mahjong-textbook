// 反復練習の問題を自動で作る（設計図.md 6.4）。機械で正解が決まる種類だけ。同じ種（seed）からは同じ問題ができる。

import { decompose } from '../core/agari.js';
import { shanten, shantenChiitoi, shantenNormal } from '../core/shanten.js';
import { countsOf, kindToken, sortTokens, waitsOf } from './tiles.js';

/** @typedef {import('../content/types.js').Problem} Problem */
/** @typedef {import('../content/types.js').Choice} Choice */

/** @typedef {'agari' | 'machi' | 'nanikiru'} DrillKind */

/**
 * @typedef {object} DrillDef
 * @property {DrillKind} kind
 * @property {string} title
 * @property {string} desc
 * @property {string} unlock この章に合格すると開く
 */

/** @type {readonly DrillDef[]} */
export const DRILLS = Object.freeze([
  { kind: 'agari', title: '和了っている？', desc: '14枚が和了の形かを見分ける', unlock: '1-2' },
  { kind: 'machi', title: '待ち当て', desc: 'テンパイの手の待ちを全部選ぶ', unlock: '1-4' },
  { kind: 'nanikiru', title: '何切る（牌効率）', desc: '受け入れが一番多くなる牌を切る', unlock: '2-3' },
]);

const AUTO_REVIEW = Object.freeze({ author: 'auto', status: /** @type {const} */ ('approved') });

/**
 * 種から決まる乱数（mulberry32）。
 * @param {number} seed
 * @returns {() => number} 0以上1未満
 */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** @param {() => number} r @param {number} n 0〜n-1 */
const pick = (r, n) => Math.floor(r() * n);

/** @param {readonly number[]} counts */
const handText = (counts) =>
  sortTokens(counts.flatMap((n, k) => Array.from({ length: n }, () => kindToken(k)))).join('');

/**
 * 和了の形の14枚をランダムに作る（4面子 + 雀頭）。
 * @param {() => number} r
 * @param {readonly number[]} honors 使ってよい字牌の牌種
 * @returns {number[]}
 */
function completeHand(r, honors) {
  for (;;) {
    const c = new Array(34).fill(0);
    let ok = true;
    for (let g = 0; g < 4 && ok; g++) {
      if (r() < 0.25) {
        const kinds = [...Array.from({ length: 27 }, (_, i) => i), ...honors];
        const k = kinds[pick(r, kinds.length)];
        c[k] += 3;
        ok = c[k] <= 4;
      } else {
        const k = pick(r, 3) * 9 + pick(r, 7);
        for (let i = 0; i < 3; i++) c[k + i]++;
        ok = c[k] <= 4 && c[k + 1] <= 4 && c[k + 2] <= 4;
      }
    }
    const kinds = [...Array.from({ length: 27 }, (_, i) => i), ...honors];
    const head = kinds[pick(r, kinds.length)];
    c[head] += 2;
    if (ok && c[head] <= 4) return c;
  }
}

/**
 * 和了の形の分け方を文にする（"{123m}{456p}…{55s}"）。
 * @param {readonly number[]} counts
 */
function shapeText(counts) {
  const all = decompose(counts, 0);
  const d = all.find((x) => x.form === 'normal');
  if (d?.form !== 'normal') {
    for (const c of all) {
      if (c.form === 'chiitoi') return c.pairs.map((k) => `{${kindToken(k)}${kindToken(k)}}`).join('');
    }
    return '';
  }
  const groups = d.sets.map((g) =>
    g.type === 'shuntsu'
      ? `{${kindToken(g.kind)}${kindToken(g.kind + 1)}${kindToken(g.kind + 2)}}`
      : `{${kindToken(g.kind).repeat(3)}}`,
  );
  return `${groups.join('')}{${kindToken(d.head).repeat(2)}}`;
}

/**
 * 和了っている？（14枚）
 * @param {number} seed
 * @returns {Problem}
 */
export function agariDrill(seed) {
  const r = rng(seed);
  const c = completeHand(r, [27, 28, 29, 30, 31, 32, 33]);
  if (r() < 0.55) {
    // 1枚だけ別の牌に入れかえる
    for (;;) {
      const from = pick(r, 34);
      const to = pick(r, 34);
      if (c[from] === 0 || from === to || c[to] >= 4) continue;
      c[from]--;
      c[to]++;
      break;
    }
  }
  const agari = shanten(c, 0) === -1;
  const shape = agari ? shapeText(c) : '';
  /** @type {Choice[]} */
  const choices = [
    {
      answer: '和了の形',
      grade: agari ? 'best' : 'bad',
      reason: agari
        ? `${shape} に分けられるので和了の形です。`
        : '4つの面子と雀頭1つには分けられません。余る牌があります。',
    },
    {
      answer: '和了の形ではない',
      grade: agari ? 'bad' : 'best',
      reason: agari
        ? `${shape} に分けられます。並べ方を変えて探してみましょう。`
        : '4つの面子と雀頭1つには分けられないので、和了の形ではありません。',
    },
  ];
  return {
    id: `auto-agari-${seed}`,
    type: 'agari',
    ask: 'choice',
    scene: { hand: handText(c) },
    prompt: 'この14枚は和了の形ですか？',
    choices,
    summary: '面子4つ + 雀頭1つに分けられるかを探す',
    tags: ['自動'],
    review: AUTO_REVIEW,
  };
}

/**
 * 待ち当て（13枚のテンパイ）。
 * @param {number} seed
 * @returns {Problem}
 */
export function machiDrill(seed) {
  const r = rng(seed);
  for (;;) {
    // 字牌を少なめにするため、字牌は3種まで
    const c = completeHand(r, [27 + pick(r, 7), 27 + pick(r, 7)]);
    const held = c.flatMap((n, k) => Array.from({ length: n }, () => k));
    c[held[pick(r, held.length)]]--;
    const hand = handText(c);
    const waits = waitsOf(hand, 0);
    if (waits.length === 0) continue;
    // 選べる牌: 手にある色の数牌すべてと、手にある字牌
    const palette = [];
    for (let s = 0; s < 3; s++) {
      if (c.slice(s * 9, s * 9 + 9).some((n) => n > 0) || waits.some((k) => Math.floor(k / 9) === s)) {
        for (let i = 0; i < 9; i++) palette.push(kindToken(s * 9 + i));
      }
    }
    for (let k = 27; k < 34; k++) if (c[k] > 0 || waits.includes(k)) palette.push(kindToken(k));
    const correct = waits.map(kindToken).join('');
    return {
      id: `auto-machi-${seed}`,
      type: 'machi',
      ask: 'tiles',
      scene: { hand },
      prompt: 'この手の待ちを全部選んでください。',
      palette: palette.join(''),
      correct,
      explain: `待ちは {${correct}} の${waits.length}種類です。`,
      summary: '1枚ずつ足してみて、和了の形になる牌を全部探す',
      tags: ['自動'],
      review: AUTO_REVIEW,
    };
  }
}

/**
 * 一般形だけで数えた、切ったあとのシャンテン数と受け入れ。
 * @param {readonly number[]} counts14
 * @param {number} discard
 */
function normalAfter(counts14, discard) {
  const c = [...counts14];
  c[discard]--;
  const s = shantenNormal(c, 0);
  /** @type {number[]} */
  const tiles = [];
  let total = 0;
  for (let k = 0; k < 34; k++) {
    // 切った牌は河に見えるので、見えていない枚数は切る前の14枚で数える
    const unseen = 4 - counts14[k];
    if (c[k] >= 4 || unseen <= 0) continue;
    c[k]++;
    if (shantenNormal(c, 0) < s) {
      tiles.push(k);
      total += unseen;
    }
    c[k]--;
  }
  return { shanten: s, ukeire: total, tiles };
}

/** 字牌はオタ風だけ（東場の東家から見た 南・西・北） */
const OTAKAZE = Object.freeze([28, 29, 30]);

/**
 * 何切る（牌効率）。条件（設計図.md 6.4）を満たす局面が出るまで作り直す。
 * @param {number} seed
 * @returns {Problem}
 */
export function nanikiruDrill(seed) {
  const r = rng(seed);
  /** @type {number[]} */
  const wall = [];
  for (let k = 0; k < 27; k++) for (let i = 0; i < 4; i++) wall.push(k);
  for (const k of OTAKAZE) for (let i = 0; i < 4; i++) wall.push(k);
  for (;;) {
    for (let i = wall.length - 1; i > 0; i--) {
      const j = pick(r, i + 1);
      [wall[i], wall[j]] = [wall[j], wall[i]];
    }
    const tiles = wall.slice(0, 14);
    const draw = tiles[13];
    const c = countsOf('');
    for (const k of tiles) c[k]++;
    const hand = [...c];
    hand[draw]--;
    if (shantenChiitoi(hand) <= shantenNormal(hand, 0)) continue; // 七対子が近い手は除く
    const options = [...new Set(tiles)].map((k) => ({ kind: k, ...normalAfter(c, k) }));
    const minS = Math.min(...options.map((o) => o.shanten));
    if (minS < 2 || minS > 3) continue; // 2〜3シャンテンの局面に限る
    const keep = options.filter((o) => o.shanten === minS);
    const maxU = Math.max(...keep.map((o) => o.ukeire));
    // 1位と僅差（1〜2枚差）の選択肢がある局面は、良形の割合で正解が変わりうるので使わない
    if (keep.some((o) => o.ukeire < maxU && o.ukeire >= maxU - 2)) continue;
    /** @type {Choice[]} */
    const choices = options.map((o) => {
      const t = `{${kindToken(o.kind)}}`;
      if (o.shanten > minS) {
        return {
          answer: kindToken(o.kind),
          grade: 'bad',
          reason: `${t} を切ると${o.shanten}シャンテンに戻ります。`,
          claims: { shanten: o.shanten },
        };
      }
      const best = o.ukeire === maxU;
      return {
        answer: kindToken(o.kind),
        grade: best ? 'best' : 'bad',
        reason: best
          ? `${t} を切ると受け入れ${o.ukeire}枚（{${o.tiles.map(kindToken).join('')}}）。一番多い枚数です。`
          : `${t} を切ると受け入れ${o.ukeire}枚。一番多い${maxU}枚より${maxU - o.ukeire}枚少なくなります。`,
        claims: { shanten: o.shanten, ukeire: o.ukeire },
      };
    });
    return {
      id: `auto-nanikiru-${seed}`,
      type: 'nanikiru',
      ask: 'tile',
      scene: { hand: handText(hand), draw: kindToken(draw) },
      prompt: '受け入れが一番多くなるのは、どれを切ったとき？',
      choices,
      explain: `自動で作った問題です。今は${minS}シャンテン。ドラ・役・安全度は考えず、受け入れ枚数だけで決めています（七対子は数えません）。`,
      summary: 'シャンテン数を下げず、受け入れが一番多くなる牌を切る',
      tags: ['自動'],
      review: AUTO_REVIEW,
    };
  }
}

/**
 * @param {DrillKind} kind
 * @param {number} seed
 * @returns {Problem}
 */
export function makeDrill(kind, seed) {
  if (kind === 'agari') return agariDrill(seed);
  if (kind === 'machi') return machiDrill(seed);
  return nanikiruDrill(seed);
}
