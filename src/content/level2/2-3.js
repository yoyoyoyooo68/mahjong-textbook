// レベル2 初級 / 章 2-3 受け入れ枚数と良い形

/** @typedef {import('../types.js').Review} Review */

/** @type {Review} */
const REVIEW = {
  author: 'pro-author',
  reviewer: 'pro-reviewer',
  status: 'approved',
  note: '2026-11-11 ブラインド審査・最終確認済み（reviews/2-3.md 参照）',
};

/** シャンテン数が戻る牌（面子・雀頭を崩す）を選んだとき */
const BREAKS = {
  grade: /** @type {const} */ ('bad'),
  reason:
    'できている面子や雀頭を崩すと、[[シャンテン数]]が1つ戻ります（テンパイから遠くなる）。まず手が戻らない牌から選びます。',
};

/** @type {import('../types.js').Chapter} */
export const CHAPTER = {
  id: '2-3',
  title: '受け入れ枚数と良い形',
  goal: '受け入れ枚数を数えて比べ、受け入れが多い方・良形が残る方を自分で選べる',
  lessons: [
    {
      id: '2-3-1',
      title: '受け入れ枚数を数える',
      aim: '手が進む牌（[[受け入れ]]）が何枚残っているか、数えられるようになる',
      pages: [
        '来ると手が1歩進む牌を[[受け入れ]]といいます。[[テンパイ]]なら[[待ち]]の牌です。<br>枚数は<strong>「1種類4枚 − 自分の手にある枚数」</strong>で数えます。<br>{345m}{567p}{234s}{99s}{78p}<br>待ちは {6p}{9p}。{6p} は手に1枚あるので3枚、{9p} は4枚。合計7枚です。',
        '[[ドラ表示牌]]も見えている牌なので、その分を引きます。実戦では、ほかの人の捨て牌や鳴いた牌も見えていれば引きます（この章の問題では、手牌とドラ表示牌だけで数えます）。<br>何を切るか迷ったら、<strong>切ったあとの受け入れ枚数を比べ、多い方を残す</strong>のが基本です。',
      ],
      problems: [
        {
          id: '2-3-1-01',
          type: 'rule',
          ask: 'choice',
          scene: { hand: '345m567p234s99s78p' },
          prompt:
            'この手はテンパイです。待ちの牌は、あと何枚残っていますか？（見えているのは自分の手牌だけ）',
          choices: [
            {
              answer: '7枚',
              grade: 'best',
              reason:
                '待ちは {78p} の両面で {6p} と {9p}。{6p} は {567p} に1枚使っているので残り3枚、{9p} は4枚。合計7枚です。',
            },
            {
              answer: '8枚',
              grade: 'bad',
              reason: '{567p} の中に {6p} が1枚あります。自分の手にある牌は引くので、{6p} は残り3枚です。',
            },
            {
              answer: '4枚',
              grade: 'bad',
              reason: '{78p} は両面なので、待ちは {6p} と {9p} の2種類です。両方を足します。',
            },
          ],
          summary: '受け入れ枚数 = 4枚 − 自分の手にある枚数',
          tags: ['受け入れ'],
          review: REVIEW,
        },
        {
          id: '2-3-1-02',
          type: 'rule',
          ask: 'choice',
          scene: { hand: '234m345s789s99m46p', doraIndicators: ['5p'] },
          prompt: 'この手はテンパイです。[[ドラ表示牌]]は {5p}。待ちの牌は、あと何枚残っていますか？',
          choices: [
            {
              answer: '3枚',
              grade: 'best',
              reason:
                '{46p} の嵌張で、待ちは {5p} だけ。4枚のうち1枚がドラ表示牌で見えているので、残り3枚です。',
            },
            {
              answer: '4枚',
              grade: 'bad',
              reason: 'ドラ表示牌の {5p} も見えている牌です。その1枚を引いて、残り3枚です。',
            },
            {
              answer: '8枚',
              grade: 'bad',
              reason: '{46p} は嵌張なので、待ちは間の {5p} の1種類だけです。',
            },
          ],
          summary: 'ドラ表示牌も見えている牌。受け入れから引く',
          tags: ['受け入れ'],
          review: REVIEW,
        },
        {
          id: '2-3-1-03',
          type: 'nanikiru',
          ask: 'tile',
          scene: { hand: '345m234s789s99m13p', draw: '4p' },
          prompt: '{4p} をツモりました。テンパイのまま、受け入れが一番多くなるのはどれを切ったとき？',
          choices: [
            {
              answer: '1p',
              grade: 'best',
              reason:
                '{34p} が残り、待ちは {2p}{5p}。どちらも手になく8枚です。{4p} を切ると {13p} の待ち {2p} だけで4枚。倍の差があります。',
              claims: { shanten: 0, ukeire: 8 },
            },
            {
              answer: '4p',
              grade: 'bad',
              reason: '{13p} が残り、待ちは {2p} だけの4枚です。{1p} を切れば {2p}{5p} の8枚になります。',
              claims: { shanten: 0, ukeire: 4 },
            },
          ],
          otherwise: {
            grade: 'bad',
            reason: 'テンパイが崩れます。{1p} か {4p} を切ればテンパイのままです。',
          },
          summary: '切ったあとの受け入れ枚数を数えて、多い方を選ぶ',
          tags: ['受け入れ', '何切る'],
          review: REVIEW,
        },
      ],
      summary: [
        '手が1歩進む牌 = 受け入れ',
        '枚数は4枚から、自分の手牌とドラ表示牌を引いて数える',
        '切ったあとの受け入れが多い方を選ぶ',
      ],
    },
    {
      id: '2-3-2',
      title: '良形と愚形',
      aim: '[[良形]]を残し、[[愚形]]から外す判断ができるようになる',
      pages: [
        '[[両面]]のように、待ちが2種類で最大8枚ある形を[[良形]]（りょうけい）といいます。<br>[[嵌張]]・[[辺張]]・[[双碰]]・[[単騎]]は、受け入れが多くても4枚。これを[[愚形]]（ぐけい）といいます。<br>良形は受け入れが多く、和了りやすい形です。',
        '[[搭子]]が多すぎて1つ外すときは、<strong>愚形から外す</strong>のが基本です。<br>{45m}{79p}{12s} なら、外すのは {12s} か {79p}。両面の {45m} は残します。',
        '受け入れが1枚ほど少なくても、<strong>良形が残る方</strong>がよいことが多いです。<br>愚形が残ると、テンパイしても待ちが4枚以下になりやすいからです。',
      ],
      problems: [
        {
          id: '2-3-2-01',
          type: 'rule',
          ask: 'choice',
          prompt: '次のうち、良形はどれ？',
          choices: [
            {
              answer: '{67p}',
              grade: 'best',
              reason: '{67p} は両面で、{5p}{8p} の2種類（最大8枚）を受けます。これが良形です。',
            },
            {
              answer: '{79p}',
              grade: 'bad',
              reason: '{79p} は嵌張で、受けは間の {8p} だけ（最大4枚）。愚形です。',
            },
            {
              answer: '{89p}',
              grade: 'bad',
              reason: '{89p} は辺張で、受けは {7p} だけ（最大4枚）。愚形です。',
            },
            {
              answer: '{77p}',
              grade: 'bad',
              reason: '対子のまま待つと双碰か単騎になり、残りは多くても2枚ずつ。愚形です。',
            },
          ],
          summary: '良形 = 両面。嵌張・辺張・双碰・単騎は愚形',
          tags: ['良形', '愚形'],
          review: REVIEW,
        },
        {
          id: '2-3-2-02',
          type: 'nanikiru',
          ask: 'tile',
          scene: { hand: '234m8m34p99p23s678s', draw: '9m' },
          prompt: '{9m} をツモりました。何を切りますか？',
          choices: [
            {
              answer: '9m',
              grade: 'best',
              reason:
                '辺張の {89m} を外すと、両面2つ {34p}{23s} が残り、受け入れは {2p}{5p}{1s}{4s} の16枚。両面を外すと12枚に減ります。',
              claims: { shanten: 1, ukeire: 16 },
            },
            {
              answer: '8m',
              grade: 'best',
              reason: '{9m} を切るのと同じです。辺張を外して両面2つを残し、受け入れ16枚です。',
              claims: { shanten: 1, ukeire: 16 },
            },
            {
              answer: '3p',
              grade: 'bad',
              reason: '両面の {34p} を壊すと、辺張 {89m} が残ります。受け入れは12枚に減ります。',
              claims: { shanten: 1, ukeire: 12 },
            },
            {
              answer: '2s',
              grade: 'bad',
              reason: '両面の {23s} を壊すと、辺張 {89m} が残ります。受け入れは12枚に減ります。',
              claims: { shanten: 1, ukeire: 12 },
            },
          ],
          otherwise: BREAKS,
          summary: '搭子を1つ外すなら、愚形から',
          tags: ['良形', '愚形', '何切る'],
          review: REVIEW,
        },
        {
          id: '2-3-2-03',
          type: 'nanikiru',
          ask: 'tile',
          scene: { hand: '23445m78m456p99p3s', draw: '1s' },
          prompt: '{1s} をツモりました。{45m}{78m} の両面2つを残すか、嵌張 {13s} を残すか。何を切りますか？',
          choices: [
            {
              answer: '1s',
              grade: 'best',
              reason:
                '{45m}{78m} の両面2つが残り、受け入れは {3m}{6m}{9m} の11枚。萬子を切る（12枚）より1枚少ないですが、どれが来ても両面待ちのテンパイになります。',
              claims: { shanten: 1, ukeire: 11 },
            },
            {
              answer: '3s',
              grade: 'best',
              reason:
                '{1s} を切るのと同じです。両面2つが残り、受け入れ11枚。テンパイすれば必ず両面待ちです。',
              claims: { shanten: 1, ukeire: 11 },
            },
            {
              answer: '5m',
              grade: 'ok',
              reason:
                '受け入れは12枚で一番多いですが、{6m}{9m} でテンパイすると嵌張 {13s} の待ち（4枚）が残ります。1枚の差なら両面2つを残す方が和了りやすいです。',
              claims: { shanten: 1, ukeire: 12 },
            },
            {
              answer: '2m',
              grade: 'ok',
              reason:
                '受け入れは12枚ですが、嵌張 {13s} が残り、テンパイの多くが愚形の待ちになります。1枚少なくても両面2つを残す方が上です。',
              claims: { shanten: 1, ukeire: 12 },
            },
            {
              answer: '4m',
              grade: 'ok',
              reason:
                '{2m}・{5m} を切るのと同じで、受け入れは12枚で一番多いですが、嵌張 {13s} が残ります。1枚少なくても両面2つを残す方が和了りやすいです。',
              claims: { shanten: 1, ukeire: 12 },
            },
            {
              answer: '7m',
              grade: 'bad',
              reason:
                '両面を壊して嵌張を残す形です。受け入れは11枚で、両面2つ（11枚）と同じなのに形が悪くなります。',
              claims: { shanten: 1, ukeire: 11 },
            },
          ],
          otherwise: {
            grade: 'bad',
            reason:
              '{8m} は {7m} と同じで、両面を壊して嵌張を残す形です。それ以外の牌は面子や雀頭を崩し、手が戻ります。',
          },
          summary: '受け入れが1枚ほど少なくても、良形が残る方を選ぶ',
          tags: ['良形', '愚形', '何切る'],
          review: REVIEW,
        },
      ],
      summary: [
        '良形 = 両面（最大8枚）。愚形 = 嵌張・辺張・双碰・単騎',
        '搭子を外すなら愚形から',
        '受け入れが少しだけ少なくても、良形が残る方を選ぶ',
      ],
    },
    {
      id: '2-3-3',
      title: '両面と同じだけ受ける3枚の形（リャンカン・亜両面）',
      aim: '3枚で両面と同じだけ受ける形（[[リャンカン]]・[[亜両面]]）を見つけ、崩さずに残せるようになる',
      pages: [
        '{135p} のように1つ飛ばしで3枚並んだ形を[[リャンカン]]といいます。<br>{2p} が来れば {123p}、{4p} が来れば {345p}。受け入れは2種類8枚で、<strong>両面と同じ</strong>です。<br>{5p} を切って {13p} にすると、{2p} だけの4枚に減ります。',
        '{245s} のように、両面 {45s} と嵌張 {24s} が重なった形を[[亜両面]]（アリャンメン）といいます。<br>受け入れは {3s}{6s} の8枚。{5s} を切ると嵌張 {24s} になり4枚に減ります。<br>端の {2s} は、{3s} が来たとき {2345s} につながる、役に立つ1枚です。',
      ],
      problems: [
        {
          id: '2-3-3-01',
          type: 'nanikiru',
          ask: 'tile',
          scene: { hand: '234m78m135p456s99s', draw: '9p' },
          prompt: '{9p} をツモりました。何を切りますか？',
          choices: [
            {
              answer: '9p',
              grade: 'best',
              reason:
                'リャンカン {135p} を残すと、受け入れは {6m}{9m}{2p}{4p} の16枚。{1p} や {5p} を切って嵌張にすると12枚に減ります。',
              claims: { shanten: 1, ukeire: 16 },
            },
            {
              answer: '1p',
              grade: 'bad',
              reason: '{35p} の嵌張になり、筒子の受けが {4p} だけになります。受け入れは12枚に減ります。',
              claims: { shanten: 1, ukeire: 12 },
            },
            {
              answer: '5p',
              grade: 'bad',
              reason: '{13p} の嵌張になり、筒子の受けが {2p} だけになります。受け入れは12枚に減ります。',
              claims: { shanten: 1, ukeire: 12 },
            },
          ],
          otherwise: BREAKS,
          summary: 'リャンカンは両面と同じ8枚を受ける。崩さない',
          tags: ['リャンカン', '何切る'],
          review: REVIEW,
        },
        {
          id: '2-3-3-02',
          type: 'rule',
          ask: 'tiles',
          prompt: '亜両面 {245s} の受け入れ（来ると面子ができる牌）を全部選んでください。',
          palette: '123456789s',
          correct: '36s',
          explain:
            '{3s} が来れば {234s}（または {345s}）、{6s} が来れば {456s} ができます。両面 {45s} と同じ {3s}{6s} の2種類です。',
          summary: '亜両面 {245s} の受け入れは {3s}{6s}',
          tags: ['亜両面'],
          review: REVIEW,
        },
        {
          id: '2-3-3-03',
          type: 'nanikiru',
          ask: 'tile',
          scene: { hand: '234m78m245s678p11p', draw: '9s' },
          prompt: '{9s} をツモりました。何を切りますか？',
          choices: [
            {
              answer: '9s',
              grade: 'best',
              reason:
                '亜両面 {245s} をそのまま残し、受け入れは {6m}{9m}{3s}{6s} の16枚。{2s} は {3s} が来たとき {2345s} になる分、孤立した {9s} より役に立ちます。',
              claims: { shanten: 1, ukeire: 16 },
            },
            {
              answer: '2s',
              grade: 'ok',
              reason:
                '両面 {45s} が残り、受け入れは同じ16枚。ただ、くっつく先のない {9s} を残すより、{2s} を残す方が少し得です。',
              claims: { shanten: 1, ukeire: 16 },
            },
            {
              answer: '5s',
              grade: 'bad',
              reason: '嵌張 {24s} が残り、索子の受けが {3s} だけになります。受け入れは12枚に減ります。',
              claims: { shanten: 1, ukeire: 12 },
            },
          ],
          otherwise: BREAKS,
          summary: '亜両面は崩さず、[[孤立牌]]から切る',
          tags: ['亜両面', '何切る'],
          review: REVIEW,
        },
      ],
      summary: [
        'リャンカン {135p} は {2p}{4p} の8枚を受ける',
        '亜両面 {245s} は {3s}{6s} の8枚を受ける',
        'どちらも両面と同じ。真ん中や片側を切って嵌張にしない',
      ],
    },
    {
      id: '2-3-4',
      title: '4枚の強い形（連続形・中ぶくれ）',
      aim: '面子1つに見える4枚の形（[[連続形]]・[[中ぶくれ]]）が、[[搭子]]2つ分の働きをすることがわかる',
      pages: [
        '{3456m} のように4枚以上続いた形を[[連続形]]といいます。<br>{34m}+{56m} の両面2つと見ると、{2m}{4m}{5m}{7m} で面子ができます。<br>「{345m} の面子 + 余りの {6m}」と見て {6m} を切ると、この受けがまるごと消えます。',
        '{3445m} のように、真ん中の牌が2枚ある形を[[中ぶくれ]]といいます。<br>{34m}+{45m} の両面2つで、{2m}{3m}{5m}{6m} で面子ができます。<br>どちらの形も、面子が足りないうちは<strong>崩さずに残す</strong>のが基本です。',
      ],
      problems: [
        {
          id: '2-3-4-01',
          type: 'nanikiru',
          ask: 'tile',
          scene: { hand: '456p345s99m3456m1p', draw: '9s' },
          prompt: '{9s} をツモりました。何を切りますか？',
          choices: [
            {
              answer: '1p',
              grade: 'best',
              reason:
                '連続形 {3456m} を残すと、萬子の {1m}〜{9m} のどれでもテンパイでき、受け入れは41枚。{6m} を切って面子にすると24枚まで減ります。',
              claims: { shanten: 1, ukeire: 41 },
            },
            {
              answer: '9s',
              grade: 'best',
              reason: '{1p} を切るのと同じで、受け入れ41枚。連続形 {3456m} を残すのが大事です。',
              claims: { shanten: 1, ukeire: 41 },
            },
            {
              answer: '6m',
              grade: 'bad',
              reason:
                '{345m} の面子はできますが、萬子の受けがなくなり、受け入れは {9m}{1p}〜{3p}{7s}〜{9s} の24枚。連続形の受けを捨てています。',
              claims: { shanten: 1, ukeire: 24 },
            },
            {
              answer: '3m',
              grade: 'bad',
              reason:
                '{456m} の面子にしても、{6m} を切るのと同じく受け入れは24枚。連続形を崩すと萬子の受けが消えます。',
              claims: { shanten: 1, ukeire: 24 },
            },
          ],
          otherwise: BREAKS,
          summary: '連続形 {3456m} は両面2つ分。余り牌と思って切らない',
          tags: ['連続形', '何切る'],
          review: REVIEW,
        },
        {
          id: '2-3-4-02',
          type: 'nanikiru',
          ask: 'tile',
          scene: { hand: '456p345s99m3445m1p', draw: '9s' },
          prompt: '{9s} をツモりました。何を切りますか？',
          choices: [
            {
              answer: '1p',
              grade: 'best',
              reason:
                '中ぶくれ {3445m} を残すと、{2m}〜{6m} の萬子で手が進み、受け入れは29枚。{4m} を切って {345m} にすると24枚に減ります。',
              claims: { shanten: 1, ukeire: 29 },
            },
            {
              answer: '9s',
              grade: 'best',
              reason: '{1p} を切るのと同じで、受け入れ29枚。中ぶくれ {3445m} を残します。',
              claims: { shanten: 1, ukeire: 29 },
            },
            {
              answer: '4m',
              grade: 'bad',
              reason:
                '{345m} の面子はできますが、萬子の受けが消えて受け入れは24枚。中ぶくれの {4m} は余り牌ではありません。',
              claims: { shanten: 1, ukeire: 24 },
            },
          ],
          otherwise: BREAKS,
          summary: '中ぶくれ {3445m} は両面2つ分。真ん中の重なりを切らない',
          tags: ['中ぶくれ', '何切る'],
          review: REVIEW,
        },
        {
          id: '2-3-4-03',
          type: 'rule',
          ask: 'choice',
          prompt: '{5667s} のような形の名前は？',
          choices: [
            {
              answer: '中ぶくれ',
              grade: 'best',
              reason: '真ん中の {6s} が2枚ある形が中ぶくれです。{56s}+{67s} の両面2つとして働きます。',
            },
            {
              answer: '連続形',
              grade: 'bad',
              reason:
                '連続形は {4567s} のように、違う数字が4枚以上続いた形です。{5667s} は {6s} が重なっています。',
            },
            {
              answer: 'リャンカン',
              grade: 'bad',
              reason: 'リャンカンは {357s} のように、1つ飛ばしで3枚並んだ形です。',
            },
          ],
          summary: '真ん中が重なった4枚 = 中ぶくれ',
          tags: ['中ぶくれ'],
          review: REVIEW,
        },
      ],
      summary: [
        '連続形 {3456m}・中ぶくれ {3445m} は両面2つ分',
        '面子が足りないうちは、面子を作るために崩さない',
      ],
    },
  ],
  test: [
    {
      id: '2-3-t-01',
      type: 'rule',
      ask: 'choice',
      scene: { hand: '234m567p99s45m78p9m' },
      prompt:
        'この手の受け入れ（来るとテンパイになる牌）は、あと何枚ありますか？（見えているのは自分の手牌だけ）',
      choices: [
        {
          answer: '14枚',
          grade: 'best',
          reason:
            '{45m} の {3m}{6m}、{78p} の {6p}{9p} が受け入れ。{3m} は {234m} に、{6p} は {567p} に1枚ずつ使っているので、3+4+3+4 = 14枚です。',
        },
        {
          answer: '16枚',
          grade: 'bad',
          reason:
            '自分の手にある {3m}（{234m} の中）と {6p}（{567p} の中）を引き忘れています。正しくは14枚です。',
        },
        {
          answer: '8枚',
          grade: 'bad',
          reason: '両面は2つあります。{45m} と {78p} の受けを両方足します。',
        },
      ],
      summary: '両面2つの受け入れを足し、手にある牌を引く',
      tags: ['受け入れ'],
      review: REVIEW,
    },
    {
      id: '2-3-t-02',
      type: 'nanikiru',
      ask: 'tile',
      scene: { hand: '234m123p678p99m35s', draw: '6s' },
      prompt: '{6s} をツモってテンパイできます。何を切りますか？',
      choices: [
        {
          answer: '3s',
          grade: 'best',
          reason: '両面 {56s} が残り、待ちは {4s}{7s} の8枚。{6s} を切ると嵌張 {35s} の {4s} だけで4枚です。',
          claims: { shanten: 0, ukeire: 8 },
        },
        {
          answer: '6s',
          grade: 'bad',
          reason: '嵌張 {35s} の待ちで、{4s} の4枚だけ。{3s} を切れば両面で8枚になります。',
          claims: { shanten: 0, ukeire: 4 },
        },
      ],
      otherwise: { grade: 'bad', reason: 'テンパイしません。{3s} を切れば両面待ちのテンパイです。' },
      summary: 'テンパイの形を選べるなら両面を選ぶ',
      tags: ['良形', '何切る'],
      review: REVIEW,
    },
    {
      id: '2-3-t-03',
      type: 'nanikiru',
      ask: 'tile',
      scene: { hand: '567m1m34p88p234s78s', draw: '2m' },
      prompt: '{2m} をツモりました。何を切りますか？',
      choices: [
        {
          answer: '1m',
          grade: 'best',
          reason: '辺張 {12m} を外し、両面 {34p}{78s} を残します。受け入れは {2p}{5p}{6s}{9s} の16枚です。',
          claims: { shanten: 1, ukeire: 16 },
        },
        {
          answer: '2m',
          grade: 'best',
          reason: '{1m} を切るのと同じで、辺張を外して両面2つを残します。受け入れ16枚です。',
          claims: { shanten: 1, ukeire: 16 },
        },
        {
          answer: '4p',
          grade: 'bad',
          reason: '両面 {34p} を壊すと辺張 {12m} が残り、受け入れは12枚に減ります。',
          claims: { shanten: 1, ukeire: 12 },
        },
        {
          answer: '8s',
          grade: 'bad',
          reason: '両面 {78s} を壊すと辺張 {12m} が残り、受け入れは12枚に減ります。',
          claims: { shanten: 1, ukeire: 12 },
        },
      ],
      otherwise: BREAKS,
      summary: '搭子を外すなら愚形（辺張）から',
      tags: ['良形', '愚形', '何切る'],
      review: REVIEW,
    },
    {
      id: '2-3-t-04',
      type: 'rule',
      ask: 'choice',
      prompt: '{55m}{88p} のような双碰（シャンポン）待ちは、良形と愚形のどちら？',
      choices: [
        {
          answer: '愚形',
          grade: 'best',
          reason: '待ちは2種類でも、それぞれ残りは2枚ずつ。合計4枚以下なので愚形です。',
        },
        {
          answer: '良形',
          grade: 'bad',
          reason:
            '待ちが2種類でも、{5m}{8p} は手に2枚ずつあり、残りは2枚ずつ（合計4枚）。両面の8枚に比べて少ない愚形です。',
        },
      ],
      summary: '双碰は待ち2種類でも最大4枚の愚形',
      tags: ['愚形'],
      review: REVIEW,
    },
    {
      id: '2-3-t-05',
      type: 'nanikiru',
      ask: 'tile',
      scene: { hand: '345m8m23p678p11s57s', draw: '9s' },
      prompt: '{9s} をツモりました。何を切りますか？',
      choices: [
        {
          answer: '8m',
          grade: 'best',
          reason:
            'リャンカン {579s} を残すと、受け入れは {1p}{4p}{6s}{8s} の16枚。{9s} や {5s} を切って嵌張にすると12枚です。',
          claims: { shanten: 1, ukeire: 16 },
        },
        {
          answer: '9s',
          grade: 'bad',
          reason:
            '端の牌から切りたくなりますが、{57s} の嵌張になり受けは {6s} だけ。受け入れ12枚に減ります。',
          claims: { shanten: 1, ukeire: 12 },
        },
        {
          answer: '5s',
          grade: 'bad',
          reason: '{79s} の嵌張になり、受けは {8s} だけ。受け入れは12枚に減ります。',
          claims: { shanten: 1, ukeire: 12 },
        },
      ],
      otherwise: BREAKS,
      summary: 'リャンカンは崩さず、くっつかない牌から切る',
      tags: ['リャンカン', '何切る'],
      review: REVIEW,
    },
    {
      id: '2-3-t-06',
      type: 'nanikiru',
      ask: 'tile',
      scene: { hand: '234m78m11p56p678s1s', draw: '8p' },
      prompt: '{8p} をツモりました。何を切りますか？',
      choices: [
        {
          answer: '1s',
          grade: 'best',
          reason:
            '亜両面 {568p} を残し、受け入れは {6m}{9m}{4p}{7p} の16枚。{8p} は {7p} が来たとき {5678p} になり、孤立した {1s} より役に立ちます。',
          claims: { shanten: 1, ukeire: 16 },
        },
        {
          answer: '8p',
          grade: 'ok',
          reason:
            '両面 {56p} が残り、受け入れは同じ16枚。ただ、くっつく先のない {1s} を残すより、{8p} を残す方が少し得です。',
          claims: { shanten: 1, ukeire: 16 },
        },
        {
          answer: '5p',
          grade: 'bad',
          reason: '嵌張 {68p} が残り、筒子の受けは {7p} だけ。受け入れは12枚に減ります。',
          claims: { shanten: 1, ukeire: 12 },
        },
      ],
      otherwise: BREAKS,
      summary: '亜両面は崩さず、[[孤立牌]]から切る',
      tags: ['亜両面', '何切る'],
      review: REVIEW,
    },
    {
      id: '2-3-t-07',
      type: 'nanikiru',
      ask: 'tile',
      scene: { hand: '11m789m4567p345s1p', draw: '9s' },
      prompt: '{9s} をツモりました。何を切りますか？',
      choices: [
        {
          answer: '1p',
          grade: 'best',
          reason:
            '連続形 {4567p} を残し、受け入れは41枚。{1p} は {4567p} と同じ筒子で受けが重なるので、違う色の {9s} を残す方が受け入れが多くなります。',
          claims: { shanten: 1, ukeire: 41 },
        },
        {
          answer: '9s',
          grade: 'ok',
          reason:
            '連続形は残せていて受け入れ33枚。ただ {1p} の受けは {4567p} と重なっているので、{1p} を切る方が8枚多くなります。',
          claims: { shanten: 1, ukeire: 33 },
        },
        {
          answer: '7p',
          grade: 'bad',
          reason:
            '{456p} の面子はできますが、筒子の受けがほぼ消えて受け入れは24枚。{7p} は余り牌ではありません。',
          claims: { shanten: 1, ukeire: 24 },
        },
        {
          answer: '4p',
          grade: 'bad',
          reason: '{567p} の面子にしても受け入れは24枚。連続形を崩すと受けが大きく減ります。',
          claims: { shanten: 1, ukeire: 24 },
        },
      ],
      otherwise: BREAKS,
      summary: '連続形は崩さない',
      tags: ['連続形', '何切る'],
      review: REVIEW,
    },
    {
      id: '2-3-t-08',
      type: 'nanikiru',
      ask: 'tile',
      scene: { hand: '234m99m678p5667s1p', draw: '1s' },
      prompt: '{1s} をツモりました。何を切りますか？',
      choices: [
        {
          answer: '1p',
          grade: 'best',
          reason: '中ぶくれ {5667s} を残し、受け入れは29枚。{6s} を切って {567s} にすると24枚に減ります。',
          claims: { shanten: 1, ukeire: 29 },
        },
        {
          answer: '1s',
          grade: 'best',
          reason: '{1p} を切るのと同じ29枚。中ぶくれを残します。',
          claims: { shanten: 1, ukeire: 29 },
        },
        {
          answer: '6s',
          grade: 'bad',
          reason:
            '{567s} の面子はできますが、索子の受けが減り受け入れは24枚。中ぶくれの重なりは余り牌ではありません。',
          claims: { shanten: 1, ukeire: 24 },
        },
      ],
      otherwise: BREAKS,
      summary: '中ぶくれは崩さない',
      tags: ['中ぶくれ', '何切る'],
      review: REVIEW,
    },
    {
      id: '2-3-t-09',
      type: 'nanikiru',
      ask: 'tile',
      scene: { hand: '22m456m3467p3s789s', draw: '1s' },
      prompt: '{1s} をツモりました。何を切りますか？',
      choices: [
        {
          answer: '1s',
          grade: 'best',
          reason:
            '両面 {34p}{67p} が残り、受け入れは {2p}{5p}{8p} の12枚。筒子を切っても12枚で同じなら、テンパイが必ず両面になるこちらが上です。',
          claims: { shanten: 1, ukeire: 12 },
        },
        {
          answer: '3s',
          grade: 'best',
          reason: '{1s} を切るのと同じで、両面2つが残り受け入れ12枚です。',
          claims: { shanten: 1, ukeire: 12 },
        },
        {
          answer: '7p',
          grade: 'bad',
          reason: '受け入れは同じ12枚ですが、嵌張 {13s} が残ります。同じ枚数なら良形が残る方を選びます。',
          claims: { shanten: 1, ukeire: 12 },
        },
        {
          answer: '3p',
          grade: 'bad',
          reason: '受け入れは同じ12枚ですが、嵌張 {13s} が残り、テンパイが愚形になりやすくなります。',
          claims: { shanten: 1, ukeire: 12 },
        },
      ],
      otherwise: {
        grade: 'bad',
        reason:
          '{4p}{6p} を切っても受け入れ12枚で嵌張 {13s} が残ります。それ以外は面子や雀頭を崩して手が戻ります。',
      },
      summary: '受け入れが同じなら、良形が残る方',
      tags: ['良形', '愚形', '何切る'],
      review: REVIEW,
    },
    {
      id: '2-3-t-10',
      type: 'rule',
      ask: 'choice',
      prompt: 'リャンカン {357s} の受け入れ（来ると面子ができる牌）は？',
      choices: [
        {
          answer: '{4s} と {6s}',
          grade: 'best',
          reason: '{4s} なら {345s}、{6s} なら {567s}。2種類8枚で、両面と同じです。',
        },
        {
          answer: '{4s} だけ',
          grade: 'bad',
          reason: '{6s} が来ても {567s} ができます。受けは {4s}{6s} の2種類です。',
        },
        {
          answer: '{2s} と {8s}',
          grade: 'bad',
          reason:
            '{2s} や {8s} では面子ができません（{235s} や {578s} は順子ではない）。間の {4s}{6s} です。',
        },
      ],
      summary: 'リャンカンは2つの間を受ける',
      tags: ['リャンカン'],
      review: REVIEW,
    },
  ],
};

/** @type {import('../types.js').GlossaryEntry[]} */
export const TERMS = [
  {
    term: '受け入れ',
    reading: 'うけいれ',
    body: '来ると手が1歩進む（シャンテン数が1つ減る）牌。テンパイなら待ちの牌。受け入れ枚数は、1種類4枚から自分の手牌やドラ表示牌など見えている枚数を引いて数える。',
    chapter: '2-3',
  },
  {
    term: '良形',
    reading: 'りょうけい',
    body: '両面のように待ちが2種類で、最大8枚ある和了りやすい形。',
    chapter: '2-3',
  },
  {
    term: '愚形',
    reading: 'ぐけい',
    body: '嵌張・辺張・双碰・単騎のように、待ちが多くても4枚の形。良形より和了りにくい。',
    chapter: '2-3',
  },
  {
    term: 'リャンカン',
    reading: 'りゃんかん',
    body: '{135p} のように1つ飛ばしで3枚並んだ形。{2p}{4p} の8枚を受け、両面と同じ枚数になる。',
    chapter: '2-3',
  },
  {
    term: '亜両面',
    reading: 'アリャンメン',
    body: '{245s} のように、両面 {45s} と嵌張 {24s} が重なった形。{3s}{6s} の8枚を受ける。',
    chapter: '2-3',
  },
  {
    term: '連続形',
    reading: 'れんぞくけい',
    body: '{3456m} のように、違う数字が4枚以上続いた形。{34m}+{56m} の両面2つとして働く。',
    chapter: '2-3',
  },
  {
    term: '中ぶくれ',
    reading: 'なかぶくれ',
    body: '{3445m} のように、続いた3枚の真ん中が2枚ある形。{34m}+{45m} の両面2つとして働く。',
    chapter: '2-3',
  },
];
