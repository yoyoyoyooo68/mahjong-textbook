import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  advance,
  answer,
  answered,
  back,
  canAdvance,
  startLesson,
  startTest,
  toggleTile,
} from '../src/drill/flow.js';
import { choiceOrder, gradeChoice, gradeTile, gradeTiles, testScore } from '../src/drill/grade.js';
import { afterDiscard, sortTokens, tokensOf, waitsOf, yakuIdsOf } from '../src/drill/tiles.js';
import { SAMPLE_CHAPTER } from './fixtures/sample-chapter.js';

const lesson2 = SAMPLE_CHAPTER.lessons[1];
const nanikiru = lesson2.problems[1];
const machi = lesson2.problems[0];

test('tokensOf: 赤五は 0 のまま', () => {
  assert.deepEqual(tokensOf('105p'), ['1p', '0p', '5p']);
});

test('waitsOf: 両面・双碰・七対子の単騎', () => {
  assert.deepEqual(waitsOf('123m456p789s11z45m'), [2, 5]);
  assert.deepEqual(waitsOf('123m456p789s1144z'), [27, 30]);
  assert.deepEqual(waitsOf('1199m2288p3377s4z'), [30]);
});

test('afterDiscard: シャンテン数と受け入れ（ドラ表示牌は見えている牌に数える）', () => {
  assert.deepEqual(afterDiscard('12356m456p78999s4z', '4z'), { shanten: 0, ukeire: 8 });
  assert.deepEqual(afterDiscard('12356m456p78999s4z', '4z', { visible: '4m' }), { shanten: 0, ukeire: 7 });
  assert.throws(() => afterDiscard('123m', '9m'));
});

test('gradeTile: 選択肢に無い牌は otherwise', () => {
  assert.equal(gradeTile(nanikiru, '4z').grade, 'best');
  assert.equal(gradeTile(nanikiru, '1m').grade, 'bad');
});

test('gradeChoice / gradeTiles', () => {
  const agari = SAMPLE_CHAPTER.lessons[0].problems[0];
  assert.equal(gradeChoice(agari, 0).grade, 'best');
  assert.equal(gradeChoice(agari, 0).binary, true);
  assert.throws(() => gradeChoice(agari, 5));
  assert.equal(gradeTiles(machi, ['6m', '3m']).grade, 'best');
  assert.equal(gradeTiles(machi, ['3m']).grade, 'bad');
  assert.equal(gradeTiles(machi, ['3m', '6m', '9m']).grade, 'bad');
});

test('testScore: 最善1点・悪くない0.5点、8割で合格', () => {
  assert.deepEqual(testScore(['best', 'best', 'best', 'ok', 'ok'], 0.8), { score: 4, max: 5, passed: true });
  assert.deepEqual(testScore(['best', 'best', 'best', 'ok', 'bad'], 0.8), {
    score: 3.5,
    max: 5,
    passed: false,
  });
  assert.equal(testScore([], 0.8).passed, false);
});

test('レッスン: ねらい → 解説 → 問題 → まとめ。問題は答えるまで進めない', () => {
  let run = startLesson(SAMPLE_CHAPTER, 1);
  assert.deepEqual(
    run.steps.map((s) => s.type),
    ['aim', 'page', 'page', 'problem', 'problem', 'summary'],
  );
  run = advance(advance(advance(run)));
  assert.equal(run.steps[run.index].type, 'problem');
  assert.equal(canAdvance(run), false);
  assert.equal(advance(run), run);
  // 待ち問題: 選んでから答える
  assert.equal(answer(run, { kind: 'tiles' }), run, '何も選ばずには答えられない');
  run = toggleTile(toggleTile(toggleTile(run, '3m'), '9m'), '9m');
  assert.deepEqual(run.selected, ['3m']);
  run = toggleTile(run, '6m');
  run = answer(run, { kind: 'tiles' });
  assert.equal(run.verdicts[run.index]?.grade, 'best');
  assert.equal(toggleTile(run, '1m'), run, '答えたあとは変えられない');
  run = advance(run);
  run = answer(run, { kind: 'choice', index: 0 });
  assert.equal(run.verdicts[run.index], null, '答え方が違う入力は無視');
  run = answer(run, { kind: 'tile', token: '9s' });
  assert.equal(run.verdicts[run.index]?.grade, 'bad');
  assert.equal(answered(run).length, 2);
  assert.equal(back(run).index, run.index - 1);
});

test('テスト: 戻れない', () => {
  const run = startTest(SAMPLE_CHAPTER);
  assert.equal(run.steps.length, SAMPLE_CHAPTER.test.length);
  const answeredRun = advance(answer(run, { kind: 'choice', index: 0 }));
  assert.equal(back(answeredRun), answeredRun);
});

test('yakuIdsOf: 役なし・副露・和了でない形', () => {
  assert.deepEqual(yakuIdsOf({ hand: '234m456p678s55s22z', win: { tile: '2z', tsumo: false } }), []);
  assert.deepEqual(
    yakuIdsOf({ hand: '234m456p678s55s22z', seat: 'south', win: { tile: '2z', tsumo: false } }),
    ['jikaze'],
  );
  assert.deepEqual(
    yakuIdsOf({ hand: '234m456p678s5s', melds: ['777z'], win: { tile: '5s', tsumo: false } }),
    ['chun'],
  );
  assert.equal(yakuIdsOf({ hand: '234m456p345s2256s', win: { tile: '2z', tsumo: false } }), null);
});

test('choiceOrder: 全部の選択肢を1回ずつ、問題ごとに決まった順で', () => {
  const p = SAMPLE_CHAPTER.test[3];
  const order = choiceOrder(p);
  assert.deepEqual([...order].sort(), [0, 1, 2]);
  assert.deepEqual(choiceOrder(p), order);
});

test('sortTokens: 萬筒索字の順、赤五は5の先頭', () => {
  assert.deepEqual(sortTokens(['1z', '5p', '4m', '0p', '9s']), ['4m', '0p', '5p', '9s', '1z']);
});
