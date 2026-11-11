// 問題1問の表示: 局面・問題文・答えるところ・答え合わせ。

import { bestChoices, choiceOrder } from '../drill/grade.js';
import { sortTokens, tokenOf, tokensOf } from '../drill/tiles.js';
import { rich } from './text.js';
import { kindSvg } from './tile-svg.js';
import { parseKinds } from './tile-text.js';

/** @typedef {import('../content/types.js').Problem} Problem */
/** @typedef {import('../content/types.js').Grade} Grade */
/** @typedef {import('../drill/grade.js').Verdict} Verdict */

/** 手牌の牌の幅(px)。縦持ち 390px で14枚が1列に収まる大きさ */
export const HAND_TILE = 24;
/** 選ぶ牌の幅(px) */
const PALETTE_TILE = 34;

const SEAT_NAMES = { east: '東', south: '南', west: '西', north: '北' };
const WHO_NAMES = { shimocha: '下家', toimen: '対面', kamicha: '上家' };
/** 河の牌の幅(px) */
const RIVER_TILE = 20;

/**
 * @param {Grade} grade
 * @param {boolean} binary
 */
export function gradeLabel(grade, binary) {
  if (binary) return grade === 'best' ? '○ 正解' : '× 不正解';
  return { best: '◎ 最善', ok: '○ 悪くない', bad: '× 悪手' }[grade];
}

/**
 * 牌1枚の絵（読み上げ名つき）。
 * @param {string} token
 * @param {number} width
 */
function tileImg(token, width) {
  const [t] = parseKinds(token);
  return kindSvg(t.kind, t.red, { width });
}

/** @param {Problem} problem */
function sceneInfo(problem) {
  const s = problem.scene;
  if (!s) return '';
  const chips = [];
  if (s.round) chips.push(s.round);
  else if (s.roundWind) chips.push(`${SEAT_NAMES[s.roundWind]}場`);
  if (s.seat) chips.push(`自風 ${SEAT_NAMES[s.seat]}`);
  if (s.turn) chips.push(`${s.turn}巡目`);
  if (s.doraIndicators?.length) chips.push(`ドラ表示牌 ${rich(`{${s.doraIndicators.join('')}}`, 18)}`);
  const w = problem.win;
  if (w) {
    if (w.riichi) chips.push('リーチ中');
    chips.push(`${w.tsumo ? 'ツモ' : 'ロン'} ${rich(`{${w.tile}}`, 18)}`);
  }
  return chips.length
    ? `<p class="scene-info">${chips.map((c) => `<span class="chip">${c}</span>`).join('')}</p>`
    : '';
}

/**
 * 相手の河。リーチ宣言牌は横向きにする。
 * @param {Problem} problem
 */
function othersHtml(problem) {
  const others = problem.scene?.others ?? [];
  return others
    .map((o) => {
      const tiles = tokensOf(o.river).map((t, i) => {
        const cls = i === o.riichiAt ? 'river-tile river-tile--riichi' : 'river-tile';
        return `<span class="${cls}">${tileImg(t, RIVER_TILE)}</span>`;
      });
      const riichi = o.riichiAt !== undefined ? '<span class="chip chip--riichi">リーチ</span>' : '';
      const melds = (o.melds ?? [])
        .map((m) => `<span class="meld">${rich(`{${m}}`, RIVER_TILE)}</span>`)
        .join('');
      return `<section class="river" aria-label="${WHO_NAMES[o.who]}の河">
<p class="river-head"><span class="river-who">${WHO_NAMES[o.who]}</span>${riichi}${melds}</p>
<div class="river-tiles">${tiles.join('')}</div>
</section>`;
    })
    .join('');
}

/**
 * 手牌の列。ask=tile で未回答なら牌がボタンになる。
 * @param {Problem} problem
 * @param {Verdict | null} verdict
 */
function handHtml(problem, verdict) {
  const s = problem.scene;
  if (!s || (!s.hand && !s.draw && !s.melds?.length && !s.discards)) return '';
  const pickable = problem.ask === 'tile';
  const best = new Set(bestChoices(problem).map((c) => c.answer));
  const picked = pickable ? verdict?.picked[0] : undefined;
  // 同じ牌が複数あるときは、印を1枚だけに付ける（ツモ牌を優先）
  /** @type {Set<string>} */
  const marked = new Set();
  /** @param {string} token @param {boolean} draw */
  const tile = (token, draw) => {
    const cls = ['hand-tile'];
    if (draw) cls.push('hand-tile--draw');
    if (verdict && !marked.has(token)) {
      if (token === picked) cls.push(`is-picked grade-${verdict.grade}`);
      if (pickable && best.has(token)) cls.push('is-best');
      if (token === picked || (pickable && best.has(token))) marked.add(token);
    }
    const img = tileImg(token, HAND_TILE);
    if (!pickable) return `<span class="${cls.join(' ')}">${img}</span>`;
    const disabled = verdict ? ' disabled' : '';
    return `<button type="button" class="${cls.join(' ')}" data-action="pick-tile" data-token="${token}"${disabled}>${img}</button>`;
  };
  const draw = s.draw ? tokensOf(s.draw).map((t) => tile(t, true)) : [];
  const tiles = sortTokens(tokensOf(s.hand))
    .reverse()
    .map((t) => tile(t, false))
    .reverse();
  const melds = (s.melds ?? []).map((m) => `<span class="meld">${rich(`{${m}}`, HAND_TILE)}</span>`).join('');
  const discards = s.discards
    ? `<p class="discards"><span class="discards-label">自分の捨て牌</span>${rich(`{${s.discards}}`, 20)}</p>`
    : '';
  const label = pickable && !verdict ? '<p class="hint-line">切る牌をタップ</p>' : '';
  return `${discards}<div class="hand" role="group" aria-label="手牌">${tiles.join('')}${draw.join('')}${melds}</div>${label}`;
}

/**
 * @param {Problem} problem
 * @param {Verdict | null} verdict
 */
function choicesHtml(problem, verdict) {
  const choices = problem.choices ?? [];
  const buttons = choiceOrder(problem).map((i) => {
    const c = choices[i];
    const cls = ['choice'];
    if (verdict) {
      cls.push(`grade-${c.grade}`);
      if (verdict.picked[0] === String(i)) cls.push('is-picked');
    }
    const disabled = verdict ? ' disabled' : '';
    return `<button type="button" class="${cls.join(' ')}" data-action="pick-choice" data-index="${i}"${disabled}>${rich(c.answer)}</button>`;
  });
  return `<div class="choices">${buttons.join('')}</div>`;
}

/**
 * @param {Problem} problem
 * @param {Verdict | null} verdict
 * @param {readonly string[]} selected
 */
function paletteHtml(problem, verdict, selected) {
  const correct = new Set(tokensOf(problem.correct ?? ''));
  const tiles = parseKinds(problem.palette ?? '').map((t) => {
    const token = tokenOf(t);
    const on = verdict ? verdict.picked.includes(token) : selected.includes(token);
    const cls = ['palette-tile'];
    if (on) cls.push('is-on');
    if (verdict && correct.has(token)) cls.push('is-correct');
    if (verdict && on && !correct.has(token)) cls.push('is-wrong');
    const disabled = verdict ? ' disabled' : '';
    return `<button type="button" class="${cls.join(' ')}" data-action="toggle-tile" data-token="${token}" aria-pressed="${on}"${disabled}>${tileImg(token, PALETTE_TILE)}</button>`;
  });
  const submit = verdict
    ? ''
    : `<button type="button" class="btn btn-primary" data-action="submit-tiles"${selected.length ? '' : ' disabled'}>これで答える</button>`;
  return `<div class="palette">${tiles.join('')}</div>${submit}`;
}

/**
 * 答え合わせ。選んだ答えの評価と理由、最善の答え、ほかの選択肢。
 * @param {Problem} problem
 * @param {Verdict} verdict
 */
function feedbackHtml(problem, verdict) {
  const head = `<p class="verdict grade-${verdict.grade}">${gradeLabel(verdict.grade, verdict.binary)}</p>`;
  const parts = [head, `<p>${rich(verdict.reason)}</p>`];
  if (problem.ask !== 'tiles') {
    const others = (problem.choices ?? [])
      .filter((c, i) =>
        problem.ask === 'tile' ? c.answer !== verdict.picked[0] : String(i) !== verdict.picked[0],
      )
      .map((c) => {
        const name = problem.ask === 'tile' ? rich(`{${c.answer}}`) : rich(c.answer);
        return `<li><span class="grade-tag grade-${c.grade}">${gradeLabel(c.grade, verdict.binary)}</span> ${name}<br>${rich(c.reason)}</li>`;
      });
    if (
      problem.ask === 'tile' &&
      problem.otherwise &&
      problem.choices?.some((c) => c.answer === verdict.picked[0])
    ) {
      const o = problem.otherwise;
      others.push(
        `<li><span class="grade-tag grade-${o.grade}">${gradeLabel(o.grade, false)}</span> それ以外の牌<br>${rich(o.reason)}</li>`,
      );
    }
    if (others.length) {
      parts.push(
        `<details class="others"><summary>ほかの答え</summary><ul>${others.join('')}</ul></details>`,
      );
    }
  }
  if (problem.explain) parts.push(`<p class="explain">${rich(problem.explain)}</p>`);
  parts.push(`<p class="point">覚えること: ${rich(problem.summary)}</p>`);
  return `<section class="feedback" aria-live="polite">${parts.join('')}</section>`;
}

/**
 * @param {Problem} problem
 * @param {Verdict | null} verdict
 * @param {readonly string[]} selected
 * @returns {string}
 */
export function problemHtml(problem, verdict, selected) {
  const answerPart =
    problem.ask === 'choice'
      ? choicesHtml(problem, verdict)
      : problem.ask === 'tiles'
        ? paletteHtml(problem, verdict, selected)
        : '';
  return `<article class="problem">
${sceneInfo(problem)}
${othersHtml(problem)}
<p class="prompt">${rich(problem.prompt)}</p>
${handHtml(problem, verdict)}
${answerPart}
${verdict ? feedbackHtml(problem, verdict) : ''}
</article>`;
}
