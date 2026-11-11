// レベル2 初級 / 章 2-2 何を切る？ 切る順番とシャンテン数

/** @typedef {import('../types.js').Review} Review */

/** @type {Review} */
const REVIEW = {
  author: 'pro-author',
  reviewer: 'pro-reviewer',
  status: 'approved',
  note: '2026-11-11 ブラインド審査・3人目の判定・最終確認済み（reviews/2-2.md 参照）',
};

/** @type {import('../types.js').Chapter} */
export const CHAPTER = {
  id: '2-2',
  title: '何を切る？ 切る順番とシャンテン数',
  goal: '[[シャンテン数]]を数え、[[孤立牌]]を正しい順番で切って、[[テンパイ]]に近づける',
  lessons: [
    {
      id: '2-2-1',
      title: '搭子と孤立牌',
      aim: '[[搭子]]と[[孤立牌]]を見分けられるようになる',
      pages: [
        'あと1枚で[[順子]]になる2枚の組を<strong>[[搭子]]</strong>（ターツ）といいます。<br>{45m}（[[両面]]）{46m}（[[嵌張]]）{12m}（[[辺張]]）<br>同じ牌2枚 {33p} も、[[刻子]]や[[雀頭]]のもとになる組です。',
        'どの牌ともくっつかない1枚を<strong>[[孤立牌]]</strong>（こりつはい）といいます。<br>[[数牌]]は、同じ種類で数字が<strong>2つ以内</strong>に離れた牌があればくっつきます。{3m} は {1m}〜{5m} とくっつき、{6m} とはくっつきません。<br>[[字牌]]は同じ牌が来たときだけくっつきます。',
        '牌を引いたら1枚切ります。面子や搭子を崩さず、<strong>孤立牌から切る</strong>のが基本です。',
      ],
      problems: [
        {
          id: '2-2-1-01',
          type: 'rule',
          ask: 'choice',
          prompt: '{3m} と組み合わせても搭子にならない牌はどれですか？',
          choices: [
            {
              answer: '{6m}',
              grade: 'best',
              reason:
                '{3m} と {6m} は数字が3つ離れています。間に2枚入らないと順子にならないので、搭子ではありません。',
            },
            {
              answer: '{4m}',
              grade: 'bad',
              reason: '{34m} は {2m} か {5m} で順子になる両面の搭子です。',
            },
            {
              answer: '{5m}',
              grade: 'bad',
              reason: '{35m} は間の {4m} で順子になる嵌張の搭子です。数字が2つ離れていてもくっつきます。',
            },
            {
              answer: '{1m}',
              grade: 'bad',
              reason: '{13m} は間の {2m} で順子になる嵌張の搭子です。',
            },
          ],
          summary: '数牌は、同じ種類で数字が2つ以内ならくっつく',
          tags: ['搭子'],
          review: REVIEW,
        },
        {
          id: '2-2-1-02',
          type: 'rule',
          ask: 'choice',
          prompt: '字牌の {1z} がくっついて組になるのは、どの牌が来たときですか？',
          choices: [
            {
              answer: 'もう1枚の {1z}',
              grade: 'best',
              reason:
                '字牌には数字がないので、順子は作れません。同じ牌が来たときだけ、{11z} の組になります。',
            },
            {
              answer: '{2z}',
              grade: 'bad',
              reason: '{1z}{2z}{3z} と並べても順子にはなりません。字牌は同じ牌どうしでしか組になりません。',
            },
          ],
          summary: '字牌は同じ牌が来ないとくっつかない',
          tags: ['孤立牌'],
          review: REVIEW,
        },
        {
          id: '2-2-1-03',
          type: 'nanikiru',
          ask: 'tile',
          scene: { hand: '23456m79p345s88s4z', draw: '6s', round: '東1局', seat: 'south', turn: 5 },
          prompt: '{6s} を引きました。孤立牌を見つけて切ってください。',
          choices: [
            {
              answer: '4z',
              grade: 'best',
              reason:
                '{4z} はどの牌ともくっつかない孤立牌です。ほかの牌はみな面子か搭子の一部なので、{4z} を切れば手が崩れません。',
              claims: { shanten: 1 },
            },
          ],
          otherwise: {
            grade: 'bad',
            reason: 'その牌は面子や搭子の一部です。どこにもくっつかない {4z} から切るのが基本です。',
          },
          summary: '孤立牌から切る',
          tags: ['孤立牌'],
          review: REVIEW,
        },
      ],
      summary: [
        'あと1枚で順子になる2枚 = 搭子',
        'どれともくっつかない1枚 = 孤立牌',
        '孤立牌から切るのが基本',
      ],
    },
    {
      id: '2-2-2',
      title: 'シャンテン数を数える',
      aim: '[[シャンテン数]]（テンパイまであと何枚か）を数えられるようになる',
      pages: [
        '[[テンパイ]]まであと何枚必要かを<strong>[[シャンテン数]]</strong>といいます。<br>あと1枚でテンパイなら1シャンテン、あと2枚なら2シャンテン。テンパイは0です。',
        '数え方の基本です。<br><strong>8 − 面子の数×2 − 搭子の数</strong><br>同じ牌2枚も搭子として数えます。面子と搭子は<strong>合わせて5組まで</strong>です（雀頭になる組が1つもないと、1つ多くなることがあります。くわしくはレベル3で）。<br>{123m}{456p}{35p}{78s}{99m}{1z}<br>面子2つ、搭子3つで 8−4−3 = 1シャンテン。',
        '何を切るか迷ったら、<strong>切ったあとシャンテン数が増えない牌</strong>を選びます。孤立牌を切ってもシャンテン数は変わりませんが、搭子を崩すと増えることが多いです。',
      ],
      problems: [
        {
          id: '2-2-2-01',
          type: 'rule',
          ask: 'choice',
          scene: { hand: '12399m456p35p78s1z' },
          prompt: '{123m}{456p}{35p}{78s}{99m}{1z}<br>この13枚は何シャンテンですか？',
          choices: [
            {
              answer: '1シャンテン',
              grade: 'best',
              reason:
                '面子は {123m}{456p} の2つ、搭子は {35p}{78s}{99m} の3つ。8−4−3 = 1 で1シャンテンです。',
            },
            {
              answer: 'テンパイしている',
              grade: 'bad',
              reason:
                '{1z} がどこにもくっつかず、あと1枚で和了る形になっていません。搭子が1つ面子になればテンパイです。',
            },
            {
              answer: '2シャンテン',
              grade: 'bad',
              reason: '同じ牌2枚の {99m} も搭子として数えます。搭子は3つなので、8−4−3 = 1 です。',
            },
          ],
          summary: '8 − 面子×2 − 搭子 = シャンテン数',
          tags: ['シャンテン数'],
          review: REVIEW,
        },
        {
          id: '2-2-2-02',
          type: 'rule',
          ask: 'choice',
          scene: { hand: '12346m456p199s17z' },
          prompt: '{123m}{46m}{456p}{99s}{1s}{1z}{7z}<br>この13枚は何シャンテンですか？',
          choices: [
            {
              answer: '2シャンテン',
              grade: 'best',
              reason:
                '面子は {123m}{456p} の2つ、搭子は {46m}{99s} の2つ。8−4−2 = 2 で2シャンテンです。{1s}{1z}{7z} は孤立牌なので数えません。',
            },
            {
              answer: '1シャンテン',
              grade: 'bad',
              reason: '孤立牌は組に数えません。搭子は {46m}{99s} の2つだけなので、8−4−2 = 2 です。',
            },
            {
              answer: '3シャンテン',
              grade: 'bad',
              reason: '{46m} も嵌張の搭子です。搭子は2つなので、8−4−2 = 2 です。',
            },
          ],
          summary: '孤立牌は組に数えない',
          tags: ['シャンテン数'],
          review: REVIEW,
        },
        {
          id: '2-2-2-03',
          type: 'nanikiru',
          ask: 'tile',
          scene: { hand: '12346m456p199s47z', draw: '2s', round: '東1局', seat: 'south', turn: 6 },
          prompt:
            '{2s} を引いて、{12s} の搭子ができました。シャンテン数が一番少なくなる切り方はどれですか？（{4z} は役にならない風牌です）',
          choices: [
            {
              answer: '4z',
              grade: 'best',
              reason:
                '孤立牌の {4z} を切ると、面子2つ・搭子3つで1シャンテンになります。役にならない字牌なので、残す理由もありません。',
              claims: { shanten: 1 },
            },
            {
              answer: '7z',
              grade: 'ok',
              reason:
                '{7z} も孤立牌なので1シャンテンにはなります。ただ {7z} は重なれば役になる役牌。役にならない {4z} を先に切るほうがよいです。',
              claims: { shanten: 1 },
            },
            {
              answer: '2s',
              grade: 'bad',
              reason:
                'せっかくできた搭子を崩すと、2シャンテンのままです。孤立牌を切れば1シャンテンに進みます。',
              claims: { shanten: 2 },
            },
            {
              answer: '6m',
              grade: 'bad',
              reason: '{46m} の搭子を崩すと搭子が減り、2シャンテンのままです。',
              claims: { shanten: 2 },
            },
          ],
          otherwise: {
            grade: 'bad',
            reason: '面子や搭子を崩すと、シャンテン数が進みません。孤立牌の {4z} を切りましょう。',
          },
          summary: '孤立牌を切ればシャンテン数が進む',
          tags: ['シャンテン数', '孤立牌'],
          review: REVIEW,
        },
      ],
      summary: [
        'テンパイまであと何枚か = シャンテン数',
        '8 − 面子×2 − 搭子（5組まで）',
        '切ったあとシャンテン数が増えない牌を選ぶ',
      ],
    },
    {
      id: '2-2-3',
      title: '孤立牌を切る順番',
      aim: '孤立牌が何枚もあるとき、どれから切るかがわかる',
      pages: [
        'くっつかない孤立牌は、次の順に切るのが基本です。<br><strong>[[オタ風]] → [[役牌]] → 1・9 → 2・8 → 3〜7</strong><br>[[オタ風]]（おたかぜ）は、[[自風]]でも[[場風]]でもない[[風牌]]。3枚そろえても役になりません。<br>例: 南家で東場なら、{3z}{4z} がオタ風です。',
        '1・9 → 2・8 → 3〜7 の順番は、くっつく牌の多さの順です。<br>字牌は同じ牌でしかくっつきません。{1m} は {2m}{3m} とだけ、{5m} は {3m}〜{7m} とくっつきます。<strong>真ん中の数字ほど残す価値が高い</strong>のです。',
        'ただし役牌は、重なれば[[役]]になります（2枚になれば、3枚目を[[ポン]]して役牌にできます）。序盤なら<strong>1〜2巡持つこともあります</strong>。<br>中盤になっても重ならない役牌は、早めに切ります。',
      ],
      problems: [
        {
          id: '2-2-3-01',
          type: 'nanikiru',
          ask: 'tile',
          scene: { hand: '2349m267p34588s4z', draw: '5s', round: '東1局', seat: 'south', turn: 3 },
          prompt:
            'あなたは南家、東1局です。{5s} を引きました。孤立牌は {9m}{2p}{4z} です。どれを切りますか？',
          choices: [
            {
              answer: '4z',
              grade: 'best',
              reason:
                '{4z} は南家にとってオタ風。3枚そろえても役にならず、同じ牌でしかくっつきません。一番いらない牌です。',
              claims: { shanten: 2 },
            },
            {
              answer: '9m',
              grade: 'ok',
              reason:
                '{9m} もくっつく牌が少ない牌ですが、{7m} か {8m} が来れば搭子になります。まだ使い道のない {4z} を先に切ります。',
              claims: { shanten: 2 },
            },
            {
              answer: '2p',
              grade: 'bad',
              reason:
                '{2p} は {1p}〜{4p} とくっつき、{4z} より使い道があります。オタ風を残して数牌を切るのは順番が逆です。',
              claims: { shanten: 2 },
            },
          ],
          otherwise: {
            grade: 'bad',
            reason: 'その牌は面子や搭子の一部です。孤立牌から、オタ風の {4z} を切りましょう。',
          },
          summary: '孤立牌はオタ風から切る',
          tags: ['切り順', 'オタ風'],
          review: REVIEW,
        },
        {
          id: '2-2-3-02',
          type: 'nanikiru',
          ask: 'tile',
          scene: { hand: '599m2348p145678s', draw: '3p', round: '東1局', seat: 'south', turn: 5 },
          prompt: '{3p} を引きました。孤立牌は {5m}{8p}{1s} です。どれを切りますか？',
          choices: [
            {
              answer: '1s',
              grade: 'best',
              reason:
                '{1s} は {2s}{3s} としかくっつきません。3枚の中で一番くっつく牌が少ないので、先に切ります。',
              claims: { shanten: 2 },
            },
            {
              answer: '8p',
              grade: 'ok',
              reason: '{8p} は2・8なので、1・9の次に切る牌です。{1s} を先に切るほうがよいです。',
              claims: { shanten: 2 },
            },
            {
              answer: '5m',
              grade: 'bad',
              reason: '{5m} は {3m}〜{7m} とくっつく、一番使い道の広い牌です。真ん中の牌は最後まで残します。',
              claims: { shanten: 2 },
            },
          ],
          otherwise: {
            grade: 'bad',
            reason: 'その牌は面子や搭子の一部です。孤立牌の中から、端の {1s} を切りましょう。',
          },
          summary: '1・9 → 2・8 → 3〜7 の順に切る',
          tags: ['切り順'],
          review: REVIEW,
        },
        {
          id: '2-2-3-03',
          type: 'nanikiru',
          ask: 'tile',
          scene: { hand: '34567m299p2349s7z', draw: '5m', round: '東1局', seat: 'south', turn: 7 },
          prompt:
            '7巡目、{5m} を引きました。{7z} はまだ1枚で、重なっていません。孤立牌は {2p}{9s}{7z} です。どれを切りますか？',
          choices: [
            {
              answer: '7z',
              grade: 'best',
              reason:
                '役牌は重なれば役になりますが、7巡目まで重ならなければ、もう待つ時期ではありません。同じ牌でしかくっつかない字牌から切ります。',
              claims: { shanten: 1 },
            },
            {
              answer: '9s',
              grade: 'ok',
              reason: '1・9も切る候補ですが、順番は役牌が先です。中盤まで重ならない {7z} を先に切ります。',
              claims: { shanten: 1 },
            },
            {
              answer: '2p',
              grade: 'bad',
              reason:
                '{2p} は {9s}{7z} よりくっつく牌が多い牌です。役牌を抱えたまま数牌を切るのは順番が逆です。',
              claims: { shanten: 1 },
            },
          ],
          otherwise: {
            grade: 'bad',
            reason: 'その牌は面子や搭子の一部です。孤立牌の {7z} を切りましょう。',
          },
          summary: '中盤まで重ならない役牌は切る',
          tags: ['切り順', '役牌'],
          review: REVIEW,
        },
        {
          id: '2-2-3-04',
          type: 'nanikiru',
          ask: 'tile',
          scene: { hand: '1239m489p34567s5z', draw: '2s', round: '東1局', seat: 'south', turn: 1 },
          prompt: '1巡目、{2s} を引きました。孤立牌は {9m}{4p}{5z} です。どれを切りますか？',
          choices: [
            {
              answer: '9m',
              grade: 'best',
              reason:
                '{5z} はもう1枚引いて2枚になれば、3枚目をポンして役牌の役が作れます。この手は {123m}{89p} があって[[断么九]]にならないので、役の候補は大事です。1巡目なら1〜2巡持って重なるのを待てます。次にいらない {9m} を先に切ります。',
              claims: { shanten: 1 },
            },
            {
              answer: '5z',
              grade: 'ok',
              reason:
                '基本の順番どおりで、悪くありません。ただ1巡目の役牌は、1〜2巡持って重なるのを待つこともできます。',
              claims: { shanten: 1 },
            },
            {
              answer: '4p',
              grade: 'bad',
              reason: '{4p} は {2p}〜{6p} とくっつく真ん中の牌です。{9m}{5z} より先に切る牌ではありません。',
              claims: { shanten: 1 },
            },
          ],
          otherwise: {
            grade: 'bad',
            reason: 'その牌は面子や搭子の一部です。孤立牌の {9m} を切りましょう。',
          },
          summary: '序盤の役牌は1〜2巡持ってもよい',
          tags: ['切り順', '役牌', '例外'],
          review: REVIEW,
        },
      ],
      summary: [
        '孤立牌はオタ風 → 役牌 → 1・9 → 2・8 → 3〜7',
        '序盤の役牌は1〜2巡持つこともある',
        '中盤まで重ならない役牌は切る',
      ],
    },
    {
      id: '2-2-4',
      title: 'ドラとドラの近く',
      aim: '[[ドラ表示牌]]から[[ドラ]]がわかり、ドラの近くの牌を残せる',
      pages: [
        '<strong>[[ドラ]]</strong>は、持っていると[[和了]]ったときの点が増える牌です。ドラは役ではないので、ドラだけでは和了れません。<br>局の初めに[[山]]の牌を1枚めくります。これを<strong>[[ドラ表示牌]]</strong>といい、<strong>その次の牌</strong>がドラです。<br>表示牌 {3m} → ドラ {4m}、表示牌 {9m} → ドラ {1m}',
        '字牌は次の順で回ります。<br>{1z}→{2z}→{3z}→{4z}→{1z}（東→南→西→北→東）<br>{5z}→{6z}→{7z}→{5z}（白→發→中→白）<br>例: 表示牌 {4z} → ドラ {1z}、表示牌 {7z} → ドラ {5z}',
        'ドラとドラの近くの牌は、ドラを使った面子になりやすいので<strong>残します</strong>。<br>孤立牌の順番が同じなら、<strong>ドラから遠いほうを切る</strong>のが基本です。<br>例: ドラ {4p} なら、{5p} と {5s} では {5s} を切ります。<br>ドラの活かし方は、2-4 でくわしく学びます。',
      ],
      problems: [
        {
          id: '2-2-4-01',
          type: 'rule',
          ask: 'choice',
          prompt: 'ドラ表示牌は {9s} です。ドラはどれですか？',
          choices: [
            {
              answer: '{1s}',
              grade: 'best',
              reason: 'ドラは表示牌の次の牌です。9の次は1に戻るので、{9s} の次は {1s} です。',
            },
            {
              answer: '{9s}',
              grade: 'bad',
              reason: '表示牌そのものはドラではありません。ドラは表示牌の次の牌です。',
            },
            {
              answer: '{8s}',
              grade: 'bad',
              reason: 'ドラは表示牌の1つ前ではなく、次の牌です。9の次は1に戻ります。',
            },
          ],
          summary: '表示牌の次がドラ。9の次は1',
          tags: ['ドラ'],
          review: REVIEW,
        },
        {
          id: '2-2-4-02',
          type: 'rule',
          ask: 'choice',
          prompt: 'ドラ表示牌は {4z}（北）です。ドラはどれですか？',
          choices: [
            {
              answer: '{1z}',
              grade: 'best',
              reason: '風牌は 東→南→西→北→東 と回ります。北の次は東に戻るので、ドラは {1z} です。',
            },
            {
              answer: '{5z}',
              grade: 'bad',
              reason: '風牌と三元牌は別々に回ります。北の次は白ではなく、東に戻ります。',
            },
            {
              answer: '{3z}',
              grade: 'bad',
              reason: 'ドラは表示牌の1つ前ではなく、次の牌です。北の次は東です。',
            },
          ],
          summary: '風牌は東→南→西→北→東',
          tags: ['ドラ'],
          review: REVIEW,
        },
        {
          id: '2-2-4-03',
          type: 'rule',
          ask: 'choice',
          prompt: 'ドラ表示牌は {7z}（中）です。ドラはどれですか？',
          choices: [
            {
              answer: '{5z}',
              grade: 'best',
              reason: '三元牌は 白→發→中→白 と回ります。中の次は白に戻るので、ドラは {5z} です。',
            },
            {
              answer: '{1z}',
              grade: 'bad',
              reason: '三元牌は三元牌の中で回ります。中の次は東ではなく、白です。',
            },
            {
              answer: '{6z}',
              grade: 'bad',
              reason: 'ドラは表示牌の1つ前ではなく、次の牌です。中の次は白です。',
            },
          ],
          summary: '三元牌は白→發→中→白',
          tags: ['ドラ'],
          review: REVIEW,
        },
        {
          id: '2-2-4-04',
          type: 'nanikiru',
          ask: 'tile',
          scene: {
            hand: '234678m599p1299s',
            draw: '5s',
            doraIndicators: ['3p'],
            round: '東1局',
            seat: 'south',
            turn: 5,
          },
          prompt:
            'ドラ表示牌は {3p}、ドラは {4p} です。{5s} を引きました。孤立牌は {5p}{5s} です。どれを切りますか？',
          choices: [
            {
              answer: '5s',
              grade: 'best',
              reason:
                '{5p}{5s} はどちらも真ん中の牌で、切る順番は同じです。{5p} はドラ {4p} とくっつき、ドラを使った面子になりやすいので残します。',
              claims: { shanten: 1, ukeire: 8 },
            },
            {
              answer: '5p',
              grade: 'ok',
              reason:
                'シャンテン数も、くっつく牌の多さも {5s} 切りと同じなので、損は小さいです。ただ {5p} はドラ {4p} の隣で、{4p} を引けばドラ入りの搭子になります。ドラの近くを残すほうが少し得です。',
              claims: { shanten: 1, ukeire: 8 },
            },
          ],
          otherwise: {
            grade: 'bad',
            reason: 'その牌は面子や搭子の一部です。孤立牌のうち、ドラから遠い {5s} を切りましょう。',
          },
          summary: '順番が同じなら、ドラから遠いほうを切る',
          tags: ['ドラ', '切り順', '例外'],
          review: REVIEW,
        },
      ],
      summary: [
        '表示牌の次がドラ（9の次は1、字牌は東南西北・白發中で回る）',
        'ドラは役ではない',
        'ドラの近くは残す',
      ],
    },
  ],
  test: [
    {
      id: '2-2-t-01',
      type: 'rule',
      ask: 'choice',
      prompt: '{8s} と組み合わせると搭子になる牌はどれですか？',
      choices: [
        {
          answer: '{6s}',
          grade: 'best',
          reason: '{68s} は間の {7s} で順子になる嵌張の搭子です。数字が2つ以内ならくっつきます。',
        },
        {
          answer: '{5s}',
          grade: 'bad',
          reason: '{5s} と {8s} は3つ離れていて、1枚足しても順子になりません。',
        },
        {
          answer: '{8p}',
          grade: 'bad',
          reason: '数字が同じでも、索子と筒子は種類が違うのでくっつきません。',
        },
      ],
      summary: '同じ種類で数字が2つ以内ならくっつく',
      tags: ['搭子'],
      review: REVIEW,
    },
    {
      id: '2-2-t-02',
      type: 'rule',
      ask: 'choice',
      scene: { hand: '234m57m33p678p19s5z' },
      prompt: '{234m}{57m}{33p}{678p}{1s}{9s}{5z}<br>この13枚は何シャンテンですか？',
      choices: [
        {
          answer: '2シャンテン',
          grade: 'best',
          reason: '面子は {234m}{678p} の2つ、搭子は {57m}{33p} の2つ。8−4−2 = 2 で2シャンテンです。',
        },
        {
          answer: '1シャンテン',
          grade: 'bad',
          reason: '{1s}{9s}{5z} は孤立牌で、組に数えません。搭子は2つなので 8−4−2 = 2 です。',
        },
        {
          answer: '3シャンテン',
          grade: 'bad',
          reason: '{33p} のような同じ牌2枚も搭子として数えます。搭子は2つで、8−4−2 = 2 です。',
        },
      ],
      summary: '8 − 面子×2 − 搭子 = シャンテン数',
      tags: ['シャンテン数'],
      review: REVIEW,
    },
    {
      id: '2-2-t-03',
      type: 'rule',
      ask: 'choice',
      prompt: 'ドラ表示牌は {6z}（發）です。ドラはどれですか？',
      choices: [
        {
          answer: '{7z}',
          grade: 'best',
          reason: '三元牌は 白→發→中→白 と回ります。發の次は中です。',
        },
        {
          answer: '{6z}',
          grade: 'bad',
          reason: '表示牌そのものはドラではありません。ドラは表示牌の次の牌です。',
        },
        {
          answer: '{5z}',
          grade: 'bad',
          reason: 'ドラは表示牌の1つ前ではなく、次の牌です。發の次は中です。',
        },
      ],
      summary: '表示牌の次がドラ',
      tags: ['ドラ'],
      review: REVIEW,
    },
    {
      id: '2-2-t-04',
      type: 'rule',
      ask: 'choice',
      prompt: '役が1つもない手で、ドラを3枚持って和了の形がそろいました。和了れますか？',
      choices: [
        {
          answer: '和了れない',
          grade: 'best',
          reason:
            'ドラは点を増やす牌で、役ではありません。役が1つもなければ、ドラが何枚あっても和了れません。',
        },
        {
          answer: 'ドラがあるので和了れる',
          grade: 'bad',
          reason: 'ドラは役ではありません。和了には役が最低1つ必要です。',
        },
      ],
      summary: 'ドラは役ではない',
      tags: ['ドラ', '役'],
      review: REVIEW,
    },
    {
      id: '2-2-t-05',
      type: 'nanikiru',
      ask: 'tile',
      scene: { hand: '345m67m24p567s88s3z', draw: '6z', round: '東1局', seat: 'south', turn: 2 },
      prompt: 'あなたは南家、東1局です。{6z} を引きました。孤立牌は {3z}{6z} です。どれを切りますか？',
      choices: [
        {
          answer: '3z',
          grade: 'best',
          reason:
            '{3z} は南家にとってオタ風で、3枚そろえても役になりません。重なれば役になる {6z} より先に切ります。',
          claims: { shanten: 1 },
        },
        {
          answer: '6z',
          grade: 'ok',
          reason: '{6z} は重なれば役牌です。2巡目なら残す価値があります。役にならない {3z} を先に切ります。',
          claims: { shanten: 1 },
        },
      ],
      otherwise: {
        grade: 'bad',
        reason: 'その牌は面子や搭子の一部です。孤立牌のオタ風 {3z} を切りましょう。',
      },
      summary: '役牌よりオタ風を先に切る',
      tags: ['切り順', 'オタ風'],
      review: REVIEW,
    },
    {
      id: '2-2-t-06',
      type: 'nanikiru',
      ask: 'tile',
      scene: { hand: '116m34578p678s33z', draw: '2s', round: '東1局', seat: 'south', turn: 6 },
      prompt: '{2s} を引きました。孤立牌は {6m}{2s} です。どれを切りますか？',
      choices: [
        {
          answer: '2s',
          grade: 'best',
          reason:
            '{2s} は {1s}〜{4s} とくっつく牌、{6m} は {4m}〜{8m} とくっつく牌です。端に近い {2s} のほうが使い道が少ないので先に切ります。',
          claims: { shanten: 1, ukeire: 12 },
        },
        {
          answer: '6m',
          grade: 'ok',
          reason:
            'どちらを切っても1シャンテンで、損は小さいです。ただ {6m} は真ん中の牌で両側にくっつき、あとで搭子になって手が良くなりやすい牌です。2・8 の {2s} を先に切るのが基本です。',
          claims: { shanten: 1, ukeire: 12 },
        },
      ],
      otherwise: {
        grade: 'bad',
        reason: 'その牌は面子や搭子の一部です。孤立牌の {2s} を切りましょう。',
      },
      summary: '2・8 は 3〜7 より先に切る',
      tags: ['切り順'],
      review: REVIEW,
    },
    {
      id: '2-2-t-07',
      type: 'nanikiru',
      ask: 'tile',
      scene: { hand: '1299m469p234678s', draw: '4z', round: '東1局', seat: 'south', turn: 8 },
      prompt: '{4z} を引きました。{12m} は辺張の搭子です。何を切りますか？',
      choices: [
        {
          answer: '4z',
          grade: 'best',
          reason:
            '孤立牌の {4z} を切れば1シャンテンのままです。オタ風なので、孤立牌の中でも一番先に切る牌です。',
          claims: { shanten: 1 },
        },
        {
          answer: '9p',
          grade: 'ok',
          reason: '{9p} も孤立牌なので1シャンテンのままです。ただ、オタ風の {4z} のほうが先に切る牌です。',
          claims: { shanten: 1 },
        },
        {
          answer: '1m',
          grade: 'bad',
          reason:
            '辺張でも搭子は搭子です。崩すと搭子が減って2シャンテンに戻ります。孤立牌があるうちは、搭子を崩しません。',
          claims: { shanten: 2 },
        },
      ],
      otherwise: {
        grade: 'bad',
        reason: 'その牌は面子や搭子の一部で、崩すとシャンテン数が増えます。孤立牌の {4z} を切りましょう。',
      },
      summary: '孤立牌があるうちは搭子を崩さない',
      tags: ['シャンテン数', '孤立牌'],
      review: REVIEW,
    },
    {
      id: '2-2-t-08',
      type: 'nanikiru',
      ask: 'tile',
      scene: {
        hand: '228m55678p23479s',
        draw: '2p',
        doraIndicators: ['6m'],
        round: '東1局',
        seat: 'south',
        turn: 4,
      },
      prompt: 'ドラ表示牌は {6m} です。{2p} を引きました。孤立牌は {8m}{2p} です。どれを切りますか？',
      choices: [
        {
          answer: '2p',
          grade: 'best',
          reason:
            'ドラは {6m} の次の {7m} です。{8m}{2p} はどちらも2・8で順番は同じなので、ドラ {7m} とくっつく {8m} を残し、{2p} を切ります。',
          claims: { shanten: 1, ukeire: 8 },
        },
        {
          answer: '8m',
          grade: 'ok',
          reason:
            'シャンテン数も、くっつく牌の多さも {2p} 切りと同じなので、損は小さいです。ただ {8m} はドラ {7m} の隣で、{7m} を引けばドラ入りの搭子になります。ドラの近くを残すほうが少し得です。',
          claims: { shanten: 1, ukeire: 8 },
        },
      ],
      otherwise: {
        grade: 'bad',
        reason: 'その牌は面子や搭子の一部です。孤立牌のうち、ドラから遠い {2p} を切りましょう。',
      },
      summary: 'ドラの近くは残す',
      tags: ['ドラ', '切り順'],
      review: REVIEW,
    },
    {
      id: '2-2-t-09',
      type: 'nanikiru',
      ask: 'tile',
      scene: { hand: '23467m1789p599s6z', draw: '5m', round: '東1局', seat: 'south', turn: 8 },
      prompt: '8巡目、{5m} を引きました。{6z} はまだ1枚です。孤立牌は {1p}{5s}{6z} です。どれを切りますか？',
      choices: [
        {
          answer: '6z',
          grade: 'best',
          reason:
            '8巡目まで重ならない役牌は、もう待つ時期ではありません。同じ牌でしかくっつかない {6z} から切ります。',
          claims: { shanten: 1 },
        },
        {
          answer: '1p',
          grade: 'ok',
          reason: '{1p} も使い道の少ない牌ですが、順番は役牌が先です。中盤の役牌は抱えません。',
          claims: { shanten: 1 },
        },
        {
          answer: '5s',
          grade: 'bad',
          reason: '{5s} は {3s}〜{7s} とくっつく真ん中の牌です。孤立牌の中で一番最後に切る牌です。',
          claims: { shanten: 1 },
        },
      ],
      otherwise: {
        grade: 'bad',
        reason: 'その牌は面子や搭子の一部です。孤立牌の {6z} を切りましょう。',
      },
      summary: '中盤まで重ならない役牌は切る',
      tags: ['切り順', '役牌'],
      review: REVIEW,
    },
    {
      id: '2-2-t-10',
      type: 'rule',
      ask: 'choice',
      prompt: '「1シャンテン」とはどんな状態ですか？',
      choices: [
        {
          answer: 'あと1枚でテンパイ',
          grade: 'best',
          reason:
            'シャンテン数はテンパイまであと何枚必要かです。1シャンテンは、うまく1枚引けばテンパイになる状態です。',
        },
        {
          answer: 'あと1枚で和了',
          grade: 'bad',
          reason: 'あと1枚で和了る状態はテンパイ（0シャンテン）です。1シャンテンはその1つ手前です。',
        },
        {
          answer: 'あと1枚で面子が1つできる',
          grade: 'bad',
          reason: 'シャンテン数は面子の数ではなく、テンパイまであと何枚かを表します。',
        },
      ],
      summary: '1シャンテン = あと1枚でテンパイ',
      tags: ['シャンテン数'],
      review: REVIEW,
    },
  ],
};

/** @type {import('../types.js').GlossaryEntry[]} */
export const TERMS = [
  {
    term: '孤立牌',
    reading: 'こりつはい',
    body: 'どの牌ともくっつかない1枚。数牌は同じ種類で数字が2つ以内に離れた牌があればくっつく。字牌は同じ牌があるときだけくっつく。',
  },
  {
    term: 'シャンテン数',
    reading: 'しゃんてんすう',
    body: 'テンパイまであと何枚必要か。あと1枚でテンパイなら1シャンテン。テンパイは0。基本は「8 − 面子の数×2 − 搭子の数（面子と搭子は合わせて5組まで）」で数える。',
  },
  {
    term: '搭子',
    reading: 'たーつ',
    body: 'あと1枚で順子になる2枚の組。{45m}（両面）、{46m}（嵌張）、{12m}（辺張）。シャンテン数を数えるときは、同じ牌2枚も搭子として数える。',
  },
  {
    term: 'オタ風',
    reading: 'おたかぜ',
    body: '自風でも場風でもない風牌。3枚そろえても役にならない。例: 南家で東場なら {3z}{4z}。',
  },
  {
    term: 'ドラ',
    reading: 'どら',
    body: '持っていると和了ったときの点が増える牌。役ではないので、ドラだけでは和了れない。ドラ表示牌の次の牌がドラ。',
  },
  {
    term: 'ドラ表示牌',
    reading: 'どらひょうじはい',
    body: '局の初めに山からめくって見せる牌。この次の牌がドラ。9の次は1。字牌は 東→南→西→北→東、白→發→中→白 の順。',
  },
];
