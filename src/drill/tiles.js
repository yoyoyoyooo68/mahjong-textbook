// 問題データの牌の表記（"123m406p"）を扱う小道具。採点・検算・画面で共通に使う。

import { enumerateShapes } from '../core/agari.js';
import { calcUkeire } from '../core/efficiency.js';
import { DEFAULT_RULES } from '../core/rules.js';
import { shanten } from '../core/shanten.js';
import { kindOf, NUM_KINDS, parseTiles, toCounts } from '../core/tiles.js';
import { judgeYaku } from '../core/yaku.js';
import { parseKinds } from '../ui/tile-text.js';

const SUITS = 'mpsz';

/**
 * 牌1枚の表記。赤五は "0p"。
 * @param {{ kind: number, red: boolean }} tile
 * @returns {string}
 */
export function tokenOf(tile) {
  const n = tile.red ? 0 : (tile.kind % 9) + 1;
  return `${n}${SUITS[Math.floor(tile.kind / 9)]}`;
}

/** 牌種 → 表記（赤ではない方） @param {number} kind */
export const kindToken = (kind) => tokenOf({ kind, red: false });

/**
 * "123m0p" → ["1m","2m","3m","0p"]
 * @param {string} text
 * @returns {string[]}
 */
export function tokensOf(text) {
  return parseKinds(text).map(tokenOf);
}

/**
 * 牌種ごとの枚数（長さ34）。複数の表記を足し合わせる。
 * @param {...string} texts
 * @returns {number[]}
 */
export function countsOf(...texts) {
  const counts = new Array(NUM_KINDS).fill(0);
  for (const text of texts) for (const t of parseKinds(text)) counts[t.kind]++;
  return counts;
}

/**
 * テンパイの手（13 - 3×副露 枚）の待ちの牌種。自分で4枚持っている牌は待ちに数えない。
 * @param {string} hand
 * @param {number} [melds]
 * @returns {number[]}
 */
export function waitsOf(hand, melds = 0) {
  const counts = countsOf(hand);
  /** @type {number[]} */
  const waits = [];
  for (let k = 0; k < NUM_KINDS; k++) {
    if (counts[k] >= 4) continue;
    counts[k]++;
    if (shanten(counts, melds) === -1) waits.push(k);
    counts[k]--;
  }
  return waits;
}

/**
 * 手牌から1枚切ったあとのシャンテン数と受け入れ枚数。
 * 見えている牌は、自分の手牌とドラ表示牌だけとして数える。
 * @param {string} tiles 切る前の手牌（ツモを含む）
 * @param {string} discard 切る牌1枚
 * @param {{ melds?: number, visible?: string }} [options] visible はドラ表示牌など
 * @returns {{ shanten: number, ukeire: number }}
 */
export function afterDiscard(tiles, discard, options = {}) {
  const counts = countsOf(tiles);
  const [kind] = parseKinds(discard).map((t) => t.kind);
  if (counts[kind] === 0) throw new RangeError(`手牌に ${discard} がありません`);
  // 切った牌は河に見えるので、見えていない枚数は切る前の手牌で数える
  const visible = countsOf(options.visible ?? '');
  counts[kind]--;
  visible[kind]++;
  const result = calcUkeire(counts, { melds: options.melds ?? 0, visible });
  return { shanten: result.shanten, ukeire: result.total };
}

/**
 * 副露の表記（"555z"・"345m"・"5555p"）を Meld にする。
 * @param {string} text
 * @param {Set<number>} used
 * @returns {import('../core/agari.js').Meld}
 */
function meldOf(text, used) {
  const tiles = parseTiles(text, used);
  const kinds = tiles.map(kindOf);
  if (tiles.length === 4) return { type: 'minkan', tiles };
  if (tiles.length === 3 && kinds.every((k) => k === kinds[0])) return { type: 'pon', tiles };
  if (tiles.length === 3) return { type: 'chi', tiles };
  throw new SyntaxError(`副露の表記が不正です: ${text}`);
}

const WIND_KIND = { east: 27, south: 28, west: 29, north: 30 };

/**
 * 和了の場面で成立する役の id（ドラを除く）。面子の取り方が複数あれば、翻数の合計が一番多い取り方を返す。
 * 和了の形でなければ null。
 * @param {{ hand: string, melds?: string[], win: { tile: string, tsumo: boolean, riichi?: boolean },
 *   seat?: 'east' | 'south' | 'west' | 'north', roundWind?: 'east' | 'south' }} scene
 * @returns {string[] | null}
 */
export function yakuIdsOf(scene) {
  const used = new Set();
  const melds = (scene.melds ?? []).map((m) => meldOf(m, used));
  const concealed = [...parseTiles(scene.hand, used), ...parseTiles(scene.win.tile, used)];
  const counts = toCounts(concealed);
  const winKind = kindOf(parseTiles(scene.win.tile)[0]);
  const shapes = enumerateShapes(counts, melds, winKind, scene.win.tsumo);
  if (shapes.length === 0) return null;
  const kinds = [...new Set([...concealed, ...melds.flatMap((m) => m.tiles)].map(kindOf))];
  const menzen = melds.length === 0;
  let best = /** @type {import('../core/yaku.js').YakuResult[]} */ ([]);
  let bestValue = -1;
  for (const shape of shapes) {
    const result = judgeYaku({
      shape,
      kinds,
      counts,
      meldCount: melds.length,
      menzen,
      tsumo: scene.win.tsumo,
      winKind,
      seatWind: WIND_KIND[scene.seat ?? 'east'],
      roundWind: WIND_KIND[scene.roundWind ?? 'east'],
      riichi: scene.win.riichi ?? false,
      doubleRiichi: false,
      ippatsu: false,
      rinshan: false,
      chankan: false,
      haitei: false,
      houtei: false,
      tenhou: false,
      chiihou: false,
      rules: DEFAULT_RULES,
    });
    const value = result.reduce((n, y) => n + y.han + y.yakuman * 13, 0);
    if (value > bestValue) {
      best = result;
      bestValue = value;
    }
  }
  return best.map((y) => y.id).sort();
}

/**
 * 理牌（萬子 → 筒子 → 索子 → 字牌、数字の順。赤五は同じ5の先頭）。元の配列は変えない。
 * @param {readonly string[]} tokens
 * @returns {string[]}
 */
export function sortTokens(tokens) {
  /** @param {string} t */
  const key = (t) => {
    const n = Number(t[0]);
    return 'mpsz'.indexOf(t[1]) * 100 + (n === 0 ? 5 : n) * 10 + (n === 0 ? 0 : 1);
  };
  return [...tokens].sort((a, b) => key(a) - key(b));
}
