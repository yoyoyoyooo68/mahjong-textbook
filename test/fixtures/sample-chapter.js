// テスト用の見本の章（段階1で作った動作確認用。教科書の中身ではない）。
// 画面・採点・進み方のテストが使う。

/** @typedef {import('../../src/content/types.js').Chapter} Chapter */
/** @typedef {import('../../src/content/types.js').Review} Review */

/** @type {Review} */
const DRAFT = { author: 'claude-sample', status: 'draft', note: '段階1の見本。監修前' };

/** @type {Chapter} */
export const SAMPLE_CHAPTER = {
  id: '1-0',
  title: '見本の章（仮）',
  goal: '和了の形と待ちがわかり、いらない牌を1枚選べる',
  lessons: [
    {
      id: '1-0-1',
      title: '和了の形',
      aim: '手牌が[[和了]]の形になっているか、見分けられるようになる',
      pages: [
        '麻雀は、14枚の牌で決まった形を作ったら勝ち、というゲームです。この形を[[和了]]（ホーラ）といいます。',
        '和了の形は<strong>3枚の組を4つ</strong>と<strong>同じ牌2枚を1つ</strong>です。<br>3枚の組を[[面子]]、同じ牌2枚を[[雀頭]]と呼びます。<br>{123m}{456p}{789s}{111z}{22z}',
        '面子は2種類あります。<br>・同じ種類で数字が続く3枚 {345p}（[[順子]]）<br>・まったく同じ牌3枚 {777s}（[[刻子]]）<br>字牌は数字がないので、刻子しか作れません。',
      ],
      problems: [
        {
          id: '1-0-1-01',
          type: 'agari',
          ask: 'choice',
          scene: { hand: '123m456p789s11122z' },
          prompt: 'この14枚は和了の形になっていますか？',
          choices: [
            {
              answer: '和了の形',
              grade: 'best',
              reason: '{123m}{456p}{789s}{111z} の面子4つと、{22z} の雀頭1つに分けられます。',
            },
            {
              answer: '和了の形ではない',
              grade: 'bad',
              reason: '{123m}{456p}{789s}{111z} で面子が4つ、{22z} が雀頭なので、和了の形です。',
            },
          ],
          summary: '面子4つ + 雀頭1つ = 和了',
          tags: ['和了の形'],
          review: DRAFT,
        },
        {
          id: '1-0-1-02',
          type: 'agari',
          ask: 'choice',
          scene: { hand: '124m456p789s11122z' },
          prompt: 'この14枚は和了の形になっていますか？',
          choices: [
            {
              answer: '和了の形',
              grade: 'bad',
              reason: '{124m} は数字が続いていないので順子ではありません。面子が3つしかありません。',
            },
            {
              answer: '和了の形ではない',
              grade: 'best',
              reason: '{124m} は 1・2・4 で数字が続いていません。{3m} があれば和了でした。',
            },
          ],
          summary: '順子は数字が3つ続く',
          tags: ['和了の形'],
          review: DRAFT,
        },
      ],
      summary: ['和了 = 面子4つ + 雀頭1つ（14枚）', '面子は順子（{123m}）か刻子（{777s}）', '字牌は刻子だけ'],
    },
    {
      id: '1-0-2',
      title: '待ちといらない牌',
      aim: 'あと1枚で和了る牌（[[待ち]]）を見つけ、いらない牌を選べるようになる',
      pages: [
        'あと1枚で和了の形になる状態を[[テンパイ]]、その1枚を[[待ち]]といいます。<br>{123m}{456p}{789s}{11z}{45m}<br>この手は {3m} か {6m} が来れば {345m} か {456m} ができて和了です。',
        '牌を1枚引いたら、1枚捨てます。どの組にもつながらない牌（[[孤立牌]]）から捨てるのが基本です。',
      ],
      problems: [
        {
          id: '1-0-2-01',
          type: 'machi',
          ask: 'tiles',
          scene: { hand: '123m456p789s11z45m' },
          prompt: 'この手の待ちを全部選んでください。',
          palette: '123456789m',
          correct: '36m',
          explain: '{45m} は、{3m} が来れば {345m}、{6m} が来れば {456m} になります。',
          summary: '{45m} の待ちは {3m} と {6m}',
          tags: ['待ち', '両面'],
          review: DRAFT,
        },
        {
          id: '1-0-2-02',
          type: 'nanikiru',
          ask: 'tile',
          scene: { hand: '12356m456p78999s', draw: '4z', round: '東1局', seat: 'south', turn: 8 },
          prompt: '{4z} を引きました。何を切りますか？',
          choices: [
            {
              answer: '4z',
              grade: 'best',
              reason:
                '{4z} はどこにもつながらない孤立牌です。切ると {47m} 待ちのテンパイになります。ほかの牌を切ると、組が崩れてテンパイから遠ざかります。',
              claims: { shanten: 0, ukeire: 8 },
            },
          ],
          otherwise: {
            grade: 'bad',
            reason:
              'その牌は面子や雀頭の一部です。切ると組が崩れます。つながらない {4z} を切ればテンパイです。',
          },
          summary: 'つながらない牌から切る',
          tags: ['孤立牌'],
          review: DRAFT,
        },
      ],
      summary: ['あと1枚で和了 = テンパイ', 'その1枚 = 待ち', 'つながらない牌（孤立牌）から切る'],
    },
  ],
  test: [
    {
      id: '1-0-t-01',
      type: 'agari',
      ask: 'choice',
      scene: { hand: '234m234p234s55z777z' },
      prompt: 'この14枚は和了の形になっていますか？',
      choices: [
        {
          answer: '和了の形',
          grade: 'best',
          reason: '{234m}{234p}{234s}{777z} の面子4つと、{55z} の雀頭です。',
        },
        {
          answer: '和了の形ではない',
          grade: 'bad',
          reason: '{234m}{234p}{234s}{777z} で面子4つ、{55z} が雀頭です。',
        },
      ],
      summary: '種類が違えば同じ数字の順子が並んでもよい',
      tags: ['和了の形'],
      review: DRAFT,
    },
    {
      id: '1-0-t-02',
      type: 'machi',
      ask: 'tiles',
      scene: { hand: '123m456p789s11z68m' },
      prompt: 'この手の待ちを全部選んでください。',
      palette: '123456789m',
      correct: '7m',
      explain: '{68m} は間の {7m} が来たときだけ {678m} になります。',
      summary: '{68m} の待ちは {7m} だけ',
      tags: ['待ち', '嵌張'],
      review: DRAFT,
    },
    {
      id: '1-0-t-03',
      type: 'machi',
      ask: 'tiles',
      scene: { hand: '123m456p789s1144z' },
      prompt: 'この手の待ちを全部選んでください。',
      palette: '1234567z',
      correct: '14z',
      explain: '{11z} と {44z} のどちらかが3枚になれば刻子ができ、残りが雀頭になります。',
      summary: '雀頭候補が2つなら、どちらも待ち',
      tags: ['待ち', '双碰'],
      review: DRAFT,
    },
    {
      id: '1-0-t-04',
      type: 'nanikiru',
      ask: 'tile',
      scene: { hand: '1345m679p234789s', draw: '4z', round: '東1局', seat: 'south', turn: 5 },
      prompt: '{4z} を引きました。何を切りますか？',
      choices: [
        {
          answer: '4z',
          grade: 'best',
          reason:
            '{4z} は南家のあなたには役にならない字牌で、重なっても刻子にしか使えません。数牌の {1m} や {9p} は隣の牌とつながる可能性があるので、先に字牌を切ります。',
          claims: { shanten: 1 },
        },
        {
          answer: '1m',
          grade: 'ok',
          reason:
            '{1m} も孤立牌なので悪くありません。ただ {2m} や {3m} とつながる可能性がある分、{4z} より残す価値があります。',
          claims: { shanten: 1 },
        },
        {
          answer: '9p',
          grade: 'ok',
          reason:
            '{9p} も孤立牌なので悪くありません。ただ {8p} とつながる可能性がある分、{4z} より残す価値があります。',
          claims: { shanten: 1 },
        },
      ],
      otherwise: {
        grade: 'bad',
        reason: 'その牌は面子や、面子になりかけの組の一部です。孤立牌（{1m}・{9p}・{4z}）から切りましょう。',
      },
      summary: '孤立牌が複数あれば、字牌から',
      tags: ['孤立牌', '切り順'],
      review: DRAFT,
    },
    {
      id: '1-0-t-05',
      type: 'agari',
      ask: 'choice',
      scene: { hand: '1199m2288p3377s44z' },
      prompt: 'この14枚は和了の形になっていますか？',
      choices: [
        {
          answer: '和了の形',
          grade: 'best',
          reason:
            '面子4つ + 雀頭1つの形ではありませんが、同じ牌2枚を7組そろえた形は特別に和了と認められます（[[七対子]]）。',
        },
        {
          answer: '和了の形ではない',
          grade: 'bad',
          reason: '同じ牌2枚を7組そろえた形は、[[七対子]]という特別な和了の形です。',
        },
      ],
      explain: '七対子は、レベル2の「よく出る役」でくわしく扱います。',
      summary: '2枚 × 7組（七対子）も和了',
      tags: ['和了の形', '七対子'],
      review: DRAFT,
    },
  ],
};
