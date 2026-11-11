// レベル2 初級 / 章 2-6 リーチされたら現物を切る（最低限のベタオリ）

/** @typedef {import('../types.js').Review} Review */

/** @type {Review} */
const REVIEW = {
  author: 'pro-author',
  reviewer: 'pro-reviewer',
  status: 'approved',
  note: '2026-11-11 ブラインド審査・3人目の判定・最終確認済み（reviews/2-6.md 参照）',
};

/** @type {import('../types.js').Chapter} */
export const CHAPTER = {
  id: '2-6',
  title: 'リーチされたら現物を切る',
  goal: 'リーチされて自分の手が遠いときに降りると決め、リーチした人の河にある牌（現物）を選んで切れる',
  lessons: [
    {
      id: '2-6-1',
      title: '手が遠ければ降りる',
      aim: 'リーチされて自分の手が遠いときは、[[和了]]をあきらめて[[放銃]]しないことを目指すとわかる',
      pages: [
        '[[リーチ]]した人は[[テンパイ]]しています。その人の[[待ち]]の牌を捨てると[[ロン]]されます。<br>自分の捨てた牌でロンされることを[[放銃]]（ホウジュウ）といいます。放銃すると、和了った人に点を払います。',
        '自分の手が<strong>遠いとき</strong>（まだテンパイしていない）や、テンパイしていても<strong>待ちが悪くて安いとき</strong>は、和了をあきらめて<strong>放銃しない牌だけを切ります</strong>。これを[[ベタオリ]]といいます。<br>先にテンパイしている人と勝負しても、そういう手ではまず勝てません。',
        '[[良形]]のテンパイや[[満貫]]以上の高い手なら、押して勝負することも多くあります。どちらにするかはレベル4でくわしく学びます。<br>この章では<strong>「手が遠いので降りる」</strong>場面だけを練習します。',
      ],
      problems: [
        {
          id: '2-6-1-01',
          type: 'oshihiki',
          ask: 'choice',
          scene: {
            hand: '234m678p4p1s57s99s3z',
            draw: '6z',
            turn: 8,
            round: '東1局',
            others: [{ who: 'toimen', river: '1z9m2s8p4z5z7m', riichiAt: 6 }],
          },
          prompt:
            '[[対面]]がリーチしました。あなたの手はテンパイまであと2枚足りません（[[シャンテン数]]は2）。押しますか？降りますか？',
          choices: [
            {
              answer: '降りる',
              grade: 'best',
              reason:
                '相手はもうテンパイ、こちらはまだ2枚足りません。追いつく前に相手が和了るか、こちらが放銃する見込みが高いので、降りるのが基本です。',
            },
            {
              answer: '押す',
              grade: 'bad',
              reason:
                'テンパイまで2枚足りない手で勝負しても、和了れる見込みはとても低く、放銃する危険だけが残ります。降りるのが基本です。',
            },
          ],
          summary: 'リーチされて手が遠ければ降りる',
          tags: ['ベタオリ', '押し引き'],
          review: REVIEW,
        },
        {
          id: '2-6-1-02',
          type: 'oshihiki',
          ask: 'choice',
          scene: {
            hand: '234m567p13s79s88p4z',
            draw: '1z',
            turn: 9,
            round: '東1局',
            others: [{ who: 'shimocha', river: '9p2z6m1s4m7z3p', riichiAt: 6 }],
          },
          prompt:
            '[[下家]]がリーチしました。あなたの手はテンパイまであと1枚（[[シャンテン数]]は1）。でも {13s} と {79s} はどちらも[[嵌張]]で、役はリーチだけの安い手です。押しますか？降りますか？',
          choices: [
            {
              answer: '降りる',
              grade: 'best',
              reason:
                'まだテンパイしておらず、テンパイしても嵌張待ちの[[愚形]]で安い手です。和了れても得が小さく、放銃すると損が大きいので、基本は降ります。',
            },
            {
              answer: '押す',
              grade: 'bad',
              reason:
                'あと1枚でテンパイでも、嵌張2つで[[受け入れ]]がせまく、テンパイしても[[愚形]]の安い手です。危ない牌を切ってまで勝負する手ではありません。',
            },
          ],
          summary: 'テンパイ前で、待ちが悪い安い手なら、基本は降りる',
          tags: ['ベタオリ', '押し引き'],
          review: REVIEW,
        },
        {
          id: '2-6-1-03',
          type: 'rule',
          ask: 'choice',
          prompt: '[[ベタオリ]]をするとき、いちばん大事にすることは？',
          choices: [
            {
              answer: '放銃しないこと',
              grade: 'best',
              reason: 'ベタオリは和了をあきらめて、放銃しない牌だけを切ることです。手の形は気にしません。',
            },
            {
              answer: '早くテンパイすること',
              grade: 'bad',
              reason:
                'テンパイを目指すのは押すときです。降りると決めたら、テンパイより放銃しないことを優先します。',
            },
            {
              answer: '手の形をくずさないこと',
              grade: 'bad',
              reason:
                '降りるときは、[[面子]]や[[雀頭]]をくずしてでも放銃しない牌を切ります。形を残そうとして危ない牌を切るのがいちばんの失敗です。',
            },
          ],
          summary: 'ベタオリ = 和了をあきらめて、放銃しない牌だけを切る',
          tags: ['ベタオリ'],
          review: REVIEW,
        },
      ],
      summary: [
        '自分の捨てた牌でロンされる = 放銃',
        'リーチされて手が遠ければ、和了をあきらめて降りる（ベタオリ）',
      ],
    },
    {
      id: '2-6-2',
      title: '現物はロンされない',
      aim: 'リーチした人の河にある牌（[[現物]]）を見つけて切れるようになる',
      pages: [
        'リーチした人の[[河]]にある牌を[[現物]]（ゲンブツ）といいます。<br>自分で捨てた牌が待ちなら[[フリテン]]なので、リーチした人は<strong>現物ではロンできません</strong>。<br>現物は、その人に絶対に放銃しない[[安全牌]]（アンパイ）です。',
        '<strong>河にない牌は、どれもロンされることがあります</strong>。<br>{1z} や {7z} のような[[字牌]]でも、{1m}・{9s} のような端の牌でも、河になければ現物ではありません。<br>「なんとなく安全そう」で選ばず、河にあるかを確かめます。',
        'リーチの前に捨てた牌も、リーチを宣言した牌（横向きの牌）も、河にあれば全部現物です。<br>河の最初から最後まで見て、自分の手にある牌を探しましょう。',
      ],
      problems: [
        {
          id: '2-6-2-01',
          type: 'anzen',
          ask: 'tile',
          scene: {
            hand: '34m678p9p57s99s1z3z6z',
            draw: '2m',
            turn: 7,
            others: [{ who: 'toimen', river: '4z1m9p2z8s7z6m', riichiAt: 6 }],
          },
          prompt: '[[対面]]がリーチ。手が遠いので降ります。何を切りますか？',
          choices: [
            {
              answer: '9p',
              grade: 'best',
              reason: '{9p} は対面の河にある現物です。対面はフリテンなので、{9p} ではロンできません。',
              claims: { genbutsu: true },
            },
            {
              answer: '1z',
              grade: 'bad',
              reason: '{1z} は対面の河にありません。字牌でも、河にない牌はロンされることがあります。',
              claims: { genbutsu: false },
            },
            {
              answer: '3z',
              grade: 'bad',
              reason: '{3z} は対面の河にありません。字牌だから安全、ではありません。',
              claims: { genbutsu: false },
            },
            {
              answer: '6z',
              grade: 'bad',
              reason:
                '{6z} は対面の河にありません。現物の {9p} があるのに、わざわざ危ない牌を切る理由はありません。',
              claims: { genbutsu: false },
            },
          ],
          otherwise: {
            grade: 'bad',
            reason: 'その牌は対面の河にない、現物でない牌です。現物の {9p} を切ります。',
          },
          summary: '字牌でも河になければ現物ではない',
          tags: ['現物', '守備'],
          review: REVIEW,
        },
        {
          id: '2-6-2-02',
          type: 'anzen',
          ask: 'tile',
          scene: {
            hand: '67m345p678s22s9m1s2z',
            draw: '4z',
            turn: 6,
            others: [{ who: 'kamicha', river: '1z9s2m8p5z3p', riichiAt: 5 }],
          },
          prompt: '[[上家]]が {3p} を横にしてリーチ。手が遠いので降ります。何を切りますか？',
          choices: [
            {
              answer: '3p',
              grade: 'best',
              reason:
                'リーチを宣言した {3p} も河にある現物です。{345p} の面子をくずしても、安全な {3p} を切ります。',
              claims: { genbutsu: true },
            },
            {
              answer: '4z',
              grade: 'bad',
              reason:
                'いま引いた {4z} は上家の河にありません。いらない牌に見えても、現物ではないのでロンされることがあります。',
              claims: { genbutsu: false },
            },
            {
              answer: '9m',
              grade: 'bad',
              reason: '{9m} は上家の河にありません。端の牌でも現物でなければ安全ではありません。',
              claims: { genbutsu: false },
            },
            {
              answer: '1s',
              grade: 'bad',
              reason:
                '{1s} は上家の河にありません（河にあるのは {9s}）。似た牌と見まちがえないように確かめましょう。',
              claims: { genbutsu: false },
            },
          ],
          otherwise: {
            grade: 'bad',
            reason: 'その牌は上家の河にない、現物でない牌です。リーチ宣言の {3p} が現物です。',
          },
          summary: 'リーチを宣言した牌も現物',
          tags: ['現物', '守備'],
          review: REVIEW,
        },
        {
          id: '2-6-2-03',
          type: 'anzen',
          ask: 'tile',
          scene: {
            hand: '7s23m456p88p34s1p5z6z',
            draw: '9s',
            turn: 9,
            others: [{ who: 'shimocha', river: '7s1m4z9m9p2z6s8m', riichiAt: 7 }],
          },
          prompt: '[[下家]]がリーチ。手が遠いので降ります。何を切りますか？',
          choices: [
            {
              answer: '7s',
              grade: 'best',
              reason:
                '{7s} は下家がいちばん最初に捨てた牌で、現物です。リーチの前に捨てた牌でも、河にあればロンされません。',
              claims: { genbutsu: true },
            },
            {
              answer: '9s',
              grade: 'bad',
              reason:
                'いま引いた {9s} は下家の河にありません。そのまま切りたくなりますが、ロンされることがあります。',
              claims: { genbutsu: false },
            },
            {
              answer: '1p',
              grade: 'bad',
              reason: '{1p} は下家の河にありません（河にあるのは {9p}）。端の牌でも現物ではありません。',
              claims: { genbutsu: false },
            },
            {
              answer: '5z',
              grade: 'bad',
              reason: '{5z} は下家の河にありません。字牌でも現物でなければロンされることがあります。',
              claims: { genbutsu: false },
            },
          ],
          otherwise: {
            grade: 'bad',
            reason: 'その牌は下家の河にない、現物でない牌です。最初に捨てられた {7s} が現物です。',
          },
          summary: 'リーチの前に捨てた牌も現物。河を最初から見る',
          tags: ['現物', '守備'],
          review: REVIEW,
        },
      ],
      summary: [
        'リーチした人の河にある牌 = 現物。フリテンなのでロンされない',
        '字牌や端の牌でも、河になければ現物ではない',
      ],
    },
    {
      id: '2-6-3',
      title: '手をくずして現物を切り続ける',
      aim: '降りると決めたら、面子をくずしても現物を切り、何巡しのげるか数えられるようになる',
      pages: [
        '降りると決めたら、<strong>手の形は気にしません</strong>。<br>現物が[[面子]]や[[雀頭]]の中にあっても、くずして切ります。<br>テンパイが取れる牌を引いても、待ちが悪くて安い手なら降りるのは変わりません。',
        'リーチした人は、和了るまで毎巡ツモを続けます。こちらも<strong>毎巡、現物を1枚ずつ</strong>切ります。<br>手の中の現物が何枚あるか数えておくと、何巡しのげるかがわかります。現物が何枚もあれば、どれから切っても今の巡は安全です。',
      ],
      problems: [
        {
          id: '2-6-3-01',
          type: 'anzen',
          ask: 'tile',
          scene: {
            hand: '234m7m456s5p13p88m6z',
            draw: '9s',
            turn: 8,
            others: [{ who: 'toimen', river: '1z9p2m6s4z8p5s', riichiAt: 6 }],
          },
          prompt: '[[対面]]がリーチ。手が遠いので降ります。何を切りますか？',
          choices: [
            {
              answer: '2m',
              grade: 'best',
              reason: '{2m} は対面の河にある現物です。{234m} の面子をくずしても、安全な牌を切ります。',
              claims: { genbutsu: true },
            },
            {
              answer: '6s',
              grade: 'best',
              reason: '{6s} は対面の河にある現物です。{456s} の面子をくずしても、安全な牌を切ります。',
              claims: { genbutsu: true },
            },
            {
              answer: '5s',
              grade: 'best',
              reason: '{5s} はリーチを宣言した牌で、現物です。真ん中の牌でも、河にあればロンされません。',
              claims: { genbutsu: true },
            },
            {
              answer: '6z',
              grade: 'bad',
              reason:
                '{6z} はいらない牌に見えますが、対面の河にありません。形を残そうとして現物でない牌を切るのは、降りるときにいちばん多い失敗です。',
              claims: { genbutsu: false },
            },
            {
              answer: '9s',
              grade: 'bad',
              reason:
                'いま引いた {9s} は対面の河にありません。現物が3枚もあるのに、危ない牌を切る理由はありません。',
              claims: { genbutsu: false },
            },
          ],
          otherwise: {
            grade: 'bad',
            reason: 'その牌は対面の河にない、現物でない牌です。{2m}・{5s}・{6s} が現物です。',
          },
          summary: '降りるときは、面子をくずしても現物を切る',
          tags: ['現物', 'ベタオリ', '守備'],
          review: REVIEW,
        },
        {
          id: '2-6-3-02',
          type: 'rule',
          ask: 'choice',
          scene: {
            hand: '25m38p99p47s58s1z4z5z',
            turn: 7,
            others: [{ who: 'kamicha', river: '9p4z1s7m3z2s6p', riichiAt: 6 }],
          },
          prompt: '[[上家]]がリーチ。降りると決めました。この手牌の中に、現物は何枚ありますか？',
          choices: [
            {
              answer: '3枚',
              grade: 'best',
              reason:
                '{9p} が2枚と {4z} が1枚で、3枚です。ツモが現物でなくても、少なくとも3巡は安全に切れます。',
            },
            {
              answer: '2枚',
              grade: 'bad',
              reason:
                '{9p} と {4z} の2種類ですが、{9p} は手に2枚あります。2枚とも現物なので、数えると3枚です。',
            },
            {
              answer: '4枚',
              grade: 'bad',
              reason:
                '{1z} や {5z} は上家の河にないので、現物ではありません。現物は {9p} 2枚と {4z} 1枚の3枚です。',
            },
          ],
          summary: '同じ現物が2枚あれば、2巡ぶん切れる',
          tags: ['現物', 'ベタオリ'],
          review: REVIEW,
        },
        {
          id: '2-6-3-03',
          type: 'anzen',
          ask: 'tile',
          scene: {
            hand: '234m456p13p79s44s8m',
            draw: '2p',
            turn: 10,
            others: [{ who: 'toimen', river: '1z9m4s8s6z2s7z3m8s', riichiAt: 7 }],
          },
          prompt:
            '[[対面]]がリーチ。{2p} を引き、{8m} を切ればテンパイですが、{79s} の嵌張待ちで、待ちの {8s} はもう2枚見えています（残り2枚）。役はリーチだけの安い手です。降ります。何を切りますか？',
          choices: [
            {
              answer: '4s',
              grade: 'best',
              reason:
                '{4s} は対面の河にある現物です。雀頭をくずしても安全に切れ、もう1枚の {4s} で次の巡もしのげます。',
              claims: { genbutsu: true },
            },
            {
              answer: '3m',
              grade: 'best',
              reason: '{3m} はリーチを宣言した牌で、現物です。{234m} の面子をくずしても安全に切れます。',
              claims: { genbutsu: true },
            },
            {
              answer: '8m',
              grade: 'bad',
              reason:
                '{8m} は対面の河にありません。テンパイは取れますが、残り2枚しかない待ちの安い手のために、危ない牌を切るのは損です。',
              claims: { genbutsu: false },
            },
            {
              answer: '2p',
              grade: 'bad',
              reason:
                'いま引いた {2p} は対面の河にありません。ツモ切りでも、現物でなければロンされることがあります。',
              claims: { genbutsu: false },
            },
          ],
          otherwise: {
            grade: 'bad',
            reason: 'その牌は対面の河にない、現物でない牌です。{4s} か {3m} を切ります。',
          },
          summary: 'テンパイが取れても、待ちが悪くて安い手なら現物を切る',
          tags: ['現物', 'ベタオリ', '守備'],
          review: REVIEW,
        },
      ],
      summary: ['降りると決めたら、面子をくずしても現物を切る', '手の中の現物を数えて、何巡しのげるかを知る'],
    },
  ],
  test: [
    {
      id: '2-6-t-01',
      type: 'oshihiki',
      ask: 'choice',
      scene: {
        hand: '13m7m57p9p1s46s88s1z3z',
        draw: '6z',
        turn: 6,
        round: '東1局',
        others: [{ who: 'kamicha', river: '9s1z5z2p8m4z', riichiAt: 5 }],
      },
      prompt:
        '[[上家]]がリーチしました。あなたの手はテンパイまでまだ遠く、[[面子]]が1つもありません。押しますか？降りますか？',
      choices: [
        {
          answer: '降りる',
          grade: 'best',
          reason:
            '面子が1つもなく、テンパイまで何巡もかかります。先にテンパイしている相手に追いつけないので、降ります。降りるなら、上家の河にある {1z} が現物です。',
        },
        {
          answer: '押す',
          grade: 'bad',
          reason:
            'この手がテンパイするころには、相手が和了っていることが多いです。和了れない手で危ない牌を切るのは損だけです。',
        },
      ],
      summary: 'リーチされて手が遠ければ降りる',
      tags: ['ベタオリ', '押し引き'],
      review: REVIEW,
    },
    {
      id: '2-6-t-02',
      type: 'anzen',
      ask: 'tile',
      scene: {
        hand: '1345m67p2p5s79s2z3z6z',
        draw: '7z',
        turn: 7,
        others: [{ who: 'toimen', river: '2s8p1z7m4z9s', riichiAt: 5 }],
      },
      prompt: '[[対面]]がリーチ。手が遠いので降ります。何を切りますか？',
      choices: [
        {
          answer: '9s',
          grade: 'best',
          reason: '{9s} はリーチを宣言した牌で、現物です。手の中で現物はこれだけです。',
          claims: { genbutsu: true },
        },
        {
          answer: '7z',
          grade: 'bad',
          reason:
            'いま引いた {7z} は対面の河にありません。字牌のツモ切りでも、現物でなければロンされることがあります。',
          claims: { genbutsu: false },
        },
        {
          answer: '2z',
          grade: 'bad',
          reason: '{2z} は対面の河にありません。字牌でも現物ではありません。',
          claims: { genbutsu: false },
        },
        {
          answer: '1m',
          grade: 'bad',
          reason: '{1m} は対面の河にありません。端の牌でも現物ではありません。',
          claims: { genbutsu: false },
        },
      ],
      otherwise: { grade: 'bad', reason: 'その牌は対面の河にない、現物でない牌です。{9s} が現物です。' },
      summary: '字牌・端の牌より、河にある現物',
      tags: ['現物', '守備'],
      review: REVIEW,
    },
    {
      id: '2-6-t-03',
      type: 'anzen',
      ask: 'tile',
      scene: {
        hand: '23m6m456p9p78s11s4z7z',
        draw: '3s',
        turn: 8,
        others: [{ who: 'shimocha', river: '9m3z1p6z8m2p5p', riichiAt: 6 }],
      },
      prompt: '[[下家]]が {5p} を横にしてリーチ。手が遠いので降ります。何を切りますか？',
      choices: [
        {
          answer: '5p',
          grade: 'best',
          reason: 'リーチを宣言した {5p} は現物です。{456p} の面子をくずしても、安全な牌を切ります。',
          claims: { genbutsu: true },
        },
        {
          answer: '9p',
          grade: 'bad',
          reason: '{9p} は下家の河にありません（河にあるのは {1p}）。端の牌でも現物ではありません。',
          claims: { genbutsu: false },
        },
        {
          answer: '4z',
          grade: 'bad',
          reason: '{4z} は下家の河にありません。字牌でも現物ではありません。',
          claims: { genbutsu: false },
        },
        {
          answer: '3s',
          grade: 'bad',
          reason: 'いま引いた {3s} は下家の河にありません。現物ではないのでロンされることがあります。',
          claims: { genbutsu: false },
        },
      ],
      otherwise: {
        grade: 'bad',
        reason: 'その牌は下家の河にない、現物でない牌です。リーチ宣言の {5p} が現物です。',
      },
      summary: 'リーチを宣言した牌も現物',
      tags: ['現物', '守備'],
      review: REVIEW,
    },
    {
      id: '2-6-t-04',
      type: 'anzen',
      ask: 'tile',
      scene: {
        hand: '23m5m9m6p13p45s2s77z3z',
        draw: '8s',
        turn: 9,
        others: [{ who: 'toimen', river: '1m7z4p9s2z6m8p', riichiAt: 6 }],
      },
      prompt: '[[対面]]がリーチ。手が遠いので降ります。何を切りますか？',
      choices: [
        {
          answer: '7z',
          grade: 'best',
          reason:
            '{7z} は対面の河にある現物です。[[役牌]]の対子をくずすのは惜しく見えますが、降りるなら役は関係ありません。2枚あるので次の巡も切れます。',
          claims: { genbutsu: true },
        },
        {
          answer: '8s',
          grade: 'bad',
          reason: 'いま引いた {8s} は対面の河にありません。現物ではないのでロンされることがあります。',
          claims: { genbutsu: false },
        },
        {
          answer: '3z',
          grade: 'bad',
          reason: '{3z} は対面の河にありません。字牌でも現物ではありません。',
          claims: { genbutsu: false },
        },
        {
          answer: '9m',
          grade: 'bad',
          reason: '{9m} は対面の河にありません（河にあるのは {9s}）。端の牌でも現物ではありません。',
          claims: { genbutsu: false },
        },
      ],
      otherwise: { grade: 'bad', reason: 'その牌は対面の河にない、現物でない牌です。{7z} が現物です。' },
      summary: '役牌の対子でも、現物ならくずして切る',
      tags: ['現物', 'ベタオリ', '守備'],
      review: REVIEW,
    },
    {
      id: '2-6-t-05',
      type: 'anzen',
      ask: 'tile',
      scene: {
        hand: '24m678m45p99p2s4s1z7z',
        draw: '9m',
        turn: 10,
        others: [{ who: 'kamicha', river: '4z1p9m7s2z3p6z5m', riichiAt: 7 }],
      },
      prompt: '[[上家]]がリーチ。手が遠いので降ります。何を切りますか？',
      choices: [
        {
          answer: '9m',
          grade: 'best',
          reason:
            'いま引いた {9m} は上家の河にある現物です。手の中には現物がないので、そのままツモ切りします。',
          claims: { genbutsu: true },
        },
        {
          answer: '1z',
          grade: 'bad',
          reason: '{1z} は上家の河にありません。現物を引いたのに、字牌だからと現物でない牌を切るのは損です。',
          claims: { genbutsu: false },
        },
        {
          answer: '7z',
          grade: 'bad',
          reason: '{7z} は上家の河にありません。字牌でも現物ではありません。',
          claims: { genbutsu: false },
        },
        {
          answer: '2s',
          grade: 'bad',
          reason: '{2s} は上家の河にありません。現物ではないのでロンされることがあります。',
          claims: { genbutsu: false },
        },
      ],
      otherwise: {
        grade: 'bad',
        reason: 'その牌は上家の河にない、現物でない牌です。引いた {9m} が現物です。',
      },
      summary: '引いた牌が現物なら、そのままツモ切り',
      tags: ['現物', '守備'],
      review: REVIEW,
    },
    {
      id: '2-6-t-06',
      type: 'anzen',
      ask: 'tile',
      scene: {
        hand: '246m134p7p5s89s2z3z6z',
        draw: '9m',
        turn: 6,
        others: [{ who: 'toimen', river: '1z9p3s4z1m5s', riichiAt: 5 }],
      },
      prompt: '[[対面]]がリーチ。手が遠いので降ります。何を切りますか？',
      choices: [
        {
          answer: '5s',
          grade: 'best',
          reason:
            '{5s} はリーチを宣言した牌で、現物です。真ん中の牌は危なく見えますが、河にあればロンされません。',
          claims: { genbutsu: true },
        },
        {
          answer: '9m',
          grade: 'bad',
          reason: '{9m} は対面の河にありません（河にあるのは {1m}）。端の牌でも現物ではありません。',
          claims: { genbutsu: false },
        },
        {
          answer: '1p',
          grade: 'bad',
          reason: '{1p} は対面の河にありません（河にあるのは {9p}）。端の牌でも現物ではありません。',
          claims: { genbutsu: false },
        },
        {
          answer: '9s',
          grade: 'bad',
          reason: '{9s} は対面の河にありません。端の牌だから安全、ではありません。',
          claims: { genbutsu: false },
        },
      ],
      otherwise: { grade: 'bad', reason: 'その牌は対面の河にない、現物でない牌です。{5s} が現物です。' },
      summary: '真ん中の牌でも、現物なら安全',
      tags: ['現物', '守備'],
      review: REVIEW,
    },
    {
      id: '2-6-t-07',
      type: 'rule',
      ask: 'choice',
      prompt: 'リーチした人は、自分の河にある牌（[[現物]]）ではロンできません。なぜですか？',
      choices: [
        {
          answer: 'フリテンだから',
          grade: 'best',
          reason:
            '待ちの牌を自分で捨てているとフリテンで、ロンできません。だから河にある牌で待っていても、その牌ではロンできません。',
        },
        {
          answer: 'リーチしたら手を変えられないから',
          grade: 'bad',
          reason:
            'リーチ後に手を変えられないのは本当ですが、現物でロンされない理由ではありません。理由はフリテンです。',
        },
        {
          answer: '同じ牌は2回出ないから',
          grade: 'bad',
          reason: '同じ牌は4枚ずつあるので、何回も出てきます。ロンされない理由はフリテンです。',
        },
      ],
      summary: '現物でロンされないのは、リーチした人がフリテンだから',
      tags: ['現物', 'フリテン'],
      review: REVIEW,
    },
    {
      id: '2-6-t-08',
      type: 'anzen',
      ask: 'tile',
      scene: {
        hand: '2m68m333p8p9p4s57s1z5z',
        draw: '1m',
        turn: 9,
        others: [{ who: 'shimocha', river: '7z1s9m3p6z2s', riichiAt: 5 }],
      },
      prompt: '[[下家]]がリーチ。手が遠いので降ります。何を切りますか？',
      choices: [
        {
          answer: '3p',
          grade: 'best',
          reason:
            '{3p} は下家の河にある現物です。[[刻子]]をくずしても安全に切れ、手に3枚あるので3巡しのげます。',
          claims: { genbutsu: true },
        },
        {
          answer: '1z',
          grade: 'bad',
          reason: '{1z} は下家の河にありません。字牌でも現物ではありません。',
          claims: { genbutsu: false },
        },
        {
          answer: '5z',
          grade: 'bad',
          reason: '{5z} は下家の河にありません。字牌でも現物ではありません。',
          claims: { genbutsu: false },
        },
        {
          answer: '1m',
          grade: 'bad',
          reason: 'いま引いた {1m} は下家の河にありません（河にあるのは {9m}）。現物ではありません。',
          claims: { genbutsu: false },
        },
      ],
      otherwise: { grade: 'bad', reason: 'その牌は下家の河にない、現物でない牌です。{3p} が現物です。' },
      summary: '刻子でも、現物ならくずして切る',
      tags: ['現物', 'ベタオリ', '守備'],
      review: REVIEW,
    },
    {
      id: '2-6-t-09',
      type: 'oshihiki',
      ask: 'choice',
      scene: {
        hand: '234m567p13s57s99m2z',
        draw: '6z',
        turn: 10,
        round: '東1局',
        others: [{ who: 'toimen', river: '1z9p4z2m8s7z5s', riichiAt: 6 }],
      },
      prompt:
        '[[対面]]がリーチしました。あなたの手はテンパイまであと1枚（[[シャンテン数]]は1）。でも {13s} と {57s} はどちらも[[嵌張]]で、役はリーチだけの安い手です。押しますか？降りますか？',
      choices: [
        {
          answer: '降りる',
          grade: 'best',
          reason:
            'まだテンパイしておらず、テンパイしても嵌張待ちの[[愚形]]で安い手です。和了れても得が小さく、放銃の損のほうが大きいので、基本は降ります。降りるなら、手の中の {2m}・{5s} が現物です。',
        },
        {
          answer: '押す',
          grade: 'bad',
          reason:
            'あと1枚でも、[[受け入れ]]がせまい嵌張2つで安い手です。押すなら現物でない {6z} などを切ることになり、そこまでして勝負するほどの手ではありません。',
        },
      ],
      summary: 'テンパイ前で、待ちが悪い安い手なら、基本は降りる',
      tags: ['ベタオリ', '押し引き'],
      review: REVIEW,
    },
    {
      id: '2-6-t-10',
      type: 'anzen',
      ask: 'tile',
      scene: {
        hand: '123p567m46s9p77s3m5z',
        draw: '6s',
        turn: 8,
        others: [{ who: 'kamicha', river: '8m1z6s4z9p2s3z', riichiAt: 6 }],
      },
      prompt: '[[上家]]がリーチ。手が遠いので降ります。何を切りますか？',
      choices: [
        {
          answer: '9p',
          grade: 'best',
          reason: '{9p} は上家の河にある現物です。引いた {6s} も現物なので、次の巡もまだ現物が残ります。',
          claims: { genbutsu: true },
        },
        {
          answer: '6s',
          grade: 'best',
          reason: 'いま引いた {6s} は上家の河にある現物です。ツモ切りすれば {9p} が次の巡に残ります。',
          claims: { genbutsu: true },
        },
        {
          answer: '5z',
          grade: 'bad',
          reason: '{5z} は上家の河にありません。字牌でも現物ではありません。',
          claims: { genbutsu: false },
        },
        {
          answer: '3m',
          grade: 'bad',
          reason: '{3m} は上家の河にありません。孤立した牌でも、現物でなければロンされることがあります。',
          claims: { genbutsu: false },
        },
      ],
      otherwise: {
        grade: 'bad',
        reason: 'その牌は上家の河にない、現物でない牌です。{9p} か {6s} を切ります。',
      },
      summary: '現物が2枚あれば、どちらを切っても今の巡は安全',
      tags: ['現物', 'ベタオリ', '守備'],
      review: REVIEW,
    },
  ],
};

/** @type {import('../types.js').GlossaryEntry[]} */
export const TERMS = [
  {
    term: '放銃',
    reading: 'ホウジュウ',
    body: '自分の捨てた牌でほかの人にロンされること。和了った人に点を払う。「振り込み」ともいう。',
  },
  {
    term: 'ベタオリ',
    reading: 'べたおり',
    body: '相手のリーチなどに対して和了をあきらめ、放銃しない牌（現物など）だけを切り続けること。',
  },
  {
    term: '現物',
    reading: 'ゲンブツ',
    body: 'リーチした人の河にある牌。その人はフリテンなので、この牌ではロンできない。いちばん確実な安全牌。',
  },
  {
    term: '安全牌',
    reading: 'アンパイ',
    body: 'その相手にロンされない（されにくい）牌。いちばん確実なのは現物。',
  },
];
