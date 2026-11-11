// レベル2 初級 / 章 2-1 よく出る役

/** @typedef {import('../types.js').Review} Review */

/** @type {Review} */
const REVIEW = {
  author: 'pro-author',
  reviewer: 'pro-reviewer',
  status: 'approved',
  note: '2026-11-11 ブラインド審査・最終確認済み（reviews/2-1.md 参照）',
};

/** @type {import('../types.js').Chapter} */
export const CHAPTER = {
  id: '2-1',
  title: 'よく出る役',
  goal: '手の形を見て「この形ならこの[[役]]」と見抜き、手を作るときに役を意識できる',
  lessons: [
    {
      id: '2-1-1',
      title: '平和',
      aim: '[[平和]]がつく4つの条件がわかる',
      pages: [
        '<strong>[[平和]]</strong>（ピンフ）は、次の4つを全部満たした手の[[役]]です。<br>・[[門前]]（鳴いていない）<br>・面子4つがすべて[[順子]]<br>・[[雀頭]]が[[役牌]]でない<br>・待ちが[[両面]]',
        '例: {234m}{567m}{345p}{67s}{99p} は {5s}{8s} の両面待ち。どちらで和了っても平和です。<br>[[刻子]]が1つある、雀頭が {5z}{5z} のような役牌（自風・場風の風牌も含む）、待ちが[[嵌張]]・[[辺張]]・[[単騎]]・[[双碰]]。どれか1つでもあれば平和はつきません。',
        '役には大きさがあり、<strong>[[翻]]</strong>（ハン）で数えます。翻が多いほど点数が高くなります。<br>リーチ・門前清自摸和・断么九・役牌・平和は、どれも1翻です。役は重なってつき、翻は足し算です。',
      ],
      problems: [
        {
          id: '2-1-1-01',
          type: 'yaku',
          ask: 'choice',
          scene: { hand: '234567m34599p67s', seat: 'south', round: '東1局' },
          win: { tile: '8s', tsumo: false },
          yaku: ['pinfu'],
          prompt:
            '鳴いていない手で、リーチはしていません。相手が {8s} を捨て、{234m}{567m}{345p}{678s}{99p} の形がそろいます。つく役はどれですか？',
          choices: [
            {
              answer: '平和',
              grade: 'best',
              reason:
                '門前で、面子4つがすべて順子、雀頭は {9p} で役牌ではなく、{67s} の両面待ちです。4つの条件がそろうので平和がつきます。',
            },
            {
              answer: '断么九',
              grade: 'bad',
              reason: '{9p} があるので断么九はつきません。',
            },
            {
              answer: '役なし',
              grade: 'bad',
              reason: '平和の4つの条件をすべて満たしています。リーチをしていなくても平和で和了れます。',
            },
          ],
          summary: '門前・全部順子・雀頭が役牌でない・両面待ち = 平和',
          tags: ['平和'],
          review: REVIEW,
        },
        {
          id: '2-1-1-02',
          type: 'yaku',
          ask: 'choice',
          scene: { hand: '234m56799p22267s', seat: 'south', round: '東1局' },
          win: { tile: '5s', tsumo: false },
          yaku: [],
          prompt:
            '鳴いていない手で、リーチはしていません。相手が {5s} を捨て、{234m}{567p}{222s}{567s}{99p} の形がそろいます。和了れますか？',
          choices: [
            {
              answer: '和了れない',
              grade: 'best',
              reason:
                '{222s} の刻子があるので、平和になりません。{9p} があって断么九でもなく、役牌もリーチもありません。役がないので和了れません。',
            },
            {
              answer: '和了れる',
              grade: 'bad',
              reason:
                '待ちは両面ですが、平和は面子4つがすべて順子のときだけです。刻子が1つあるとつきません。',
            },
          ],
          summary: '刻子が1つでもあると平和にならない',
          tags: ['平和', '役なし'],
          review: REVIEW,
        },
        {
          id: '2-1-1-03',
          type: 'yaku',
          ask: 'choice',
          scene: { hand: '234567m34599p79s', seat: 'south', round: '東1局' },
          win: { tile: '8s', riichi: true, tsumo: false },
          yaku: ['riichi'],
          prompt:
            '鳴いていない手でリーチをかけました。相手が {8s} を捨て、{234m}{567m}{345p}{789s}{99p} の形がそろいます。つく役はどれですか？',
          choices: [
            {
              answer: 'リーチだけ',
              grade: 'best',
              reason:
                '面子はすべて順子ですが、待ちが {79s} の嵌張です。平和は両面待ちのときだけなので、つくのはリーチだけです。',
            },
            {
              answer: 'リーチと平和',
              grade: 'bad',
              reason: '全部順子でも、嵌張待ちでは平和はつきません。平和は両面待ちが条件です。',
            },
          ],
          summary: '嵌張・辺張・単騎の待ちでは平和にならない',
          tags: ['平和', 'リーチ', '嵌張'],
          review: REVIEW,
        },
        {
          id: '2-1-1-04',
          type: 'yaku',
          ask: 'choice',
          scene: { hand: '234m567p34567s55z', seat: 'south', round: '東1局' },
          win: { tile: '8s', tsumo: true },
          yaku: ['tsumo'],
          prompt:
            '鳴いていない手で、リーチはしていません。自分で {8s} を引いて（ツモで）、{234m}{567p}{345s}{678s}{55z} の形がそろいます。つく役はどれですか？',
          choices: [
            {
              answer: '門前清自摸和だけ',
              grade: 'best',
              reason:
                '雀頭の {5z}（白）は役牌です。雀頭が役牌だと平和はつきません。門前でツモったので、門前清自摸和だけがつきます。',
            },
            {
              answer: '門前清自摸和と平和',
              grade: 'bad',
              reason: '全部順子で両面待ちですが、雀頭が役牌（白）です。雀頭が役牌の手は平和になりません。',
            },
          ],
          summary: '雀頭が役牌だと平和にならない',
          tags: ['平和', '門前清自摸和', '役牌'],
          review: REVIEW,
        },
      ],
      summary: [
        '平和 = 門前・全部順子・雀頭が役牌でない・両面待ち',
        '1つでも欠けたらつかない',
        '役の大きさは翻で数え、重なれば足し算',
      ],
    },
    {
      id: '2-1-2',
      title: '順子の並びで作る役',
      aim: '[[一盃口]]・[[三色同順]]・[[一気通貫]]の形を見抜ける',
      pages: [
        '<strong>[[一盃口]]</strong>（イーペーコー）は、<strong>まったく同じ順子を2つ</strong>そろえた手です。<br>{234m}{234m}（{223344m}）<br>[[門前]]のときだけ使える1翻の役です。',
        '<strong>[[三色同順]]</strong>（サンショクドウジュン）は、<strong>同じ数の順子を萬子・筒子・索子でそろえた</strong>手です。<br>{345m}{345p}{345s}<br>門前なら2翻、鳴いても1翻でつきます。',
        '<strong>[[一気通貫]]</strong>（イッキツウカン）は、<strong>同じ色で1〜9をつなげた</strong>手です。<br>{123p}{456p}{789p}<br>門前なら2翻、鳴いても1翻。鳴くと翻が下がることを<strong>[[食い下がり]]</strong>といいます。',
      ],
      problems: [
        {
          id: '2-1-2-01',
          type: 'yaku',
          ask: 'choice',
          scene: { hand: '223344m56799p79s', seat: 'south', round: '東1局' },
          win: { tile: '8s', tsumo: false },
          yaku: ['iipeikou'],
          prompt:
            '鳴いていない手で、リーチはしていません。相手が {8s} を捨て、{234m}{234m}{567p}{789s}{99p} の形がそろいます。つく役はどれですか？',
          choices: [
            {
              answer: '一盃口',
              grade: 'best',
              reason: '{234m} が2つあります。同じ順子が2つで一盃口です。門前なので使えます。',
            },
            {
              answer: '平和',
              grade: 'bad',
              reason: '全部順子ですが、待ちが {79s} の嵌張です。両面待ちではないので平和はつきません。',
            },
            {
              answer: '役なし',
              grade: 'bad',
              reason: '{223344m} は {234m} が2つ。同じ順子2つの一盃口があります。',
            },
          ],
          summary: '同じ順子が2つ = 一盃口（門前だけ）',
          tags: ['一盃口'],
          review: REVIEW,
        },
        {
          id: '2-1-2-02',
          type: 'yaku',
          ask: 'choice',
          scene: { hand: '345678m345p3499s', seat: 'south', round: '東1局' },
          win: { tile: '5s', tsumo: false },
          yaku: ['pinfu', 'sanshokuDoujun'],
          prompt:
            '鳴いていない手で、リーチはしていません。相手が {5s} を捨て、{345m}{678m}{345p}{345s}{99s} の形がそろいます。つく役はどれですか？',
          choices: [
            {
              answer: '平和と三色同順',
              grade: 'best',
              reason:
                '{345m}{345p}{345s} で三色同順。さらに全部順子・雀頭 {9s}・{34s} の両面待ちなので平和もつきます。{2s} で和了ると三色はつかず、平和だけです。',
            },
            {
              answer: '平和だけ',
              grade: 'bad',
              reason:
                '{345m}{345p}{345s} と、345が3色そろっています。三色同順も見落とさないようにしましょう。',
            },
            {
              answer: '三色同順だけ',
              grade: 'bad',
              reason: '門前・全部順子・雀頭が役牌でない・両面待ちなので、平和もつきます。',
            },
          ],
          summary: '同じ数の順子が3色 = 三色同順',
          tags: ['三色同順', '平和'],
          review: REVIEW,
        },
        {
          id: '2-1-2-03',
          type: 'yaku',
          ask: 'choice',
          scene: { hand: '234m12345679p55s', seat: 'south', round: '東1局' },
          win: { tile: '8p', tsumo: false },
          yaku: ['ittsu'],
          prompt:
            '鳴いていない手で、リーチはしていません。相手が {8p} を捨て、{234m}{123p}{456p}{789p}{55s} の形がそろいます。つく役はどれですか？',
          choices: [
            {
              answer: '一気通貫',
              grade: 'best',
              reason: '{123p}{456p}{789p} と、筒子だけで1〜9がつながっています。一気通貫です。',
            },
            {
              answer: '三色同順',
              grade: 'bad',
              reason:
                '三色同順は、同じ数の順子を3色でそろえる役です。この手は1色で1〜9をつなげた一気通貫です。',
            },
            {
              answer: '役なし',
              grade: 'bad',
              reason: '筒子で {123p}{456p}{789p} がそろっています。一気通貫という役があります。',
            },
          ],
          summary: '同じ色で123・456・789 = 一気通貫',
          tags: ['一気通貫'],
          review: REVIEW,
        },
        {
          id: '2-1-2-04',
          type: 'yaku',
          ask: 'choice',
          scene: { hand: '23m55p123456s', melds: ['789s'], seat: 'south', round: '東1局' },
          win: { tile: '4m', tsumo: false },
          yaku: ['ittsu'],
          prompt: '{789s} をチーしています。相手が {4m} を捨てました。ロンできますか？',
          choices: [
            {
              answer: 'ロンできる',
              grade: 'best',
              reason:
                '{123s}{456s} と、チーした {789s} で一気通貫です。一気通貫は鳴いても使えます（食い下がりで1翻になります）。',
            },
            {
              answer: 'ロンできない',
              grade: 'bad',
              reason: '一気通貫は鳴いても役になります。翻が1つ下がるだけで、役がなくなるわけではありません。',
            },
          ],
          summary: '一気通貫・三色同順は鳴いてもつく（1翻に下がる）',
          tags: ['一気通貫', '食い下がり', '鳴き'],
          review: REVIEW,
        },
      ],
      summary: [
        '一盃口 = 同じ順子2つ（門前だけ）',
        '三色同順 = 同じ数の順子を3色、一気通貫 = 1色で1〜9',
        '三色・一通は鳴いてもつくが1翻下がる（食い下がり）',
      ],
    },
    {
      id: '2-1-3',
      title: '対子と刻子で作る役',
      aim: '[[七対子]]と[[対々和]]の形がわかる',
      pages: [
        '<strong>[[七対子]]</strong>（チートイツ）は、同じ牌2枚の組（対子）を<strong>7組</strong>そろえた手です。<br>{11m}{55m}{22p}{88p}{33s}{66s}{77z}<br>[[門前]]だけの2翻の役。待ちは必ず[[単騎]]です。<br>同じ牌4枚は、2組とは数えません。',
        '<strong>[[対々和]]</strong>（トイトイ）は、<strong>面子4つがすべて[[刻子]]</strong>の手です。<br>{222p}{777s}{555m}{333z}{99s}<br>[[ポン]]して作ってもよく、鳴いても2翻のまま下がりません。',
      ],
      problems: [
        {
          id: '2-1-3-01',
          type: 'yaku',
          ask: 'choice',
          scene: { hand: '1155m2288p3366s7z', seat: 'south', round: '東1局' },
          win: { tile: '7z', tsumo: false },
          yaku: ['chiitoi'],
          prompt: '鳴いていない手で、リーチはしていません。相手が {7z} を捨てました。つく役はどれですか？',
          choices: [
            {
              answer: '七対子',
              grade: 'best',
              reason:
                '{11m}{55m}{22p}{88p}{33s}{66s}{77z} と対子が7組そろいます。面子4つと雀頭の形でなくても、七対子は和了の形で役です。',
            },
            {
              answer: '役牌',
              grade: 'bad',
              reason: '{7z}（中）は2枚だけです。役牌は3枚そろえた刻子のときだけです。',
            },
            {
              answer: '対々和',
              grade: 'bad',
              reason: '対々和は面子4つがすべて刻子（3枚）の手です。この手は2枚の組が7つの七対子です。',
            },
          ],
          summary: '対子7組 = 七対子',
          tags: ['七対子'],
          review: REVIEW,
        },
        {
          id: '2-1-3-02',
          type: 'yaku',
          ask: 'choice',
          scene: { hand: '2255m3366p4488s6s', seat: 'south', round: '東1局' },
          win: { tile: '6s', tsumo: false },
          yaku: ['chiitoi', 'tanyao'],
          prompt: '鳴いていない手で、リーチはしていません。相手が {6s} を捨てました。つく役はどれですか？',
          choices: [
            {
              answer: '七対子と断么九',
              grade: 'best',
              reason: '対子7組で七対子。しかも全部2〜8の数牌なので断么九も重なってつきます。',
            },
            {
              answer: '七対子だけ',
              grade: 'bad',
              reason: '1・9・字牌が1枚もありません。七対子でも断么九は重なってつきます。',
            },
          ],
          summary: '七対子にも、ほかの役が重なる',
          tags: ['七対子', '断么九'],
          review: REVIEW,
        },
        {
          id: '2-1-3-03',
          type: 'rule',
          ask: 'choice',
          prompt: '七対子を作っています。手に {1m} が4枚あるとき、対子は何組と数えますか？',
          choices: [
            {
              answer: '1組（4枚で1組の対子にしかならない）',
              grade: 'best',
              reason: '七対子は、ちがう種類の対子を7組そろえる役です。同じ牌4枚は2組と数えません。',
            },
            {
              answer: '2組',
              grade: 'bad',
              reason: '七対子では、同じ牌4枚を2組の対子としては使えません。7組はすべてちがう牌にします。',
            },
          ],
          summary: '七対子の対子は7組ともちがう牌',
          tags: ['七対子'],
          review: REVIEW,
        },
        {
          id: '2-1-3-04',
          type: 'yaku',
          ask: 'choice',
          scene: { hand: '555m99s33z', melds: ['222p', '777s'], seat: 'south', round: '東1局' },
          win: { tile: '9s', tsumo: false },
          yaku: ['toitoi'],
          prompt: '{222p} と {777s} をポンしています。相手が {9s} を捨てました。つく役はどれですか？',
          choices: [
            {
              answer: '対々和',
              grade: 'best',
              reason:
                '{222p}{777s}{555m}{999s} と、面子4つがすべて刻子です。ポンしていても対々和はつきます。',
            },
            {
              answer: '役牌',
              grade: 'bad',
              reason: '{3z}（西）は雀頭です。それに、南家・東場では西は役牌になりません。',
            },
            {
              answer: '役なし',
              grade: 'bad',
              reason: '鳴いていても、面子4つが全部刻子なら対々和という役があります。',
            },
          ],
          summary: '面子4つが全部刻子 = 対々和（ポンしてもよい）',
          tags: ['対々和', '鳴き'],
          review: REVIEW,
        },
      ],
      summary: [
        '七対子 = 対子7組（門前だけ・単騎待ち）',
        '対々和 = 面子4つが全部刻子',
        '対々和はポンしてもよく、翻も下がらない',
      ],
    },
    {
      id: '2-1-4',
      title: '混一色',
      aim: '[[混一色]]の形と、鳴くと[[翻]]が下がることがわかる',
      pages: [
        '<strong>[[混一色]]</strong>（ホンイツ）は、<strong>1種類の[[数牌]]と[[字牌]]だけ</strong>で作った手です。<br>{234m}{567m}{789m}{333z}{44z}<br>萬子・筒子・索子のうち2種類が混ざるとつきません。',
        '混一色は門前なら3翻、鳴いても2翻です（[[食い下がり]]）。鳴いても使えるので、[[ポン]]・[[チー]]をして作ることも多い役です。<br>[[役牌]]の刻子と組み合わせると、さらに高くなります。',
      ],
      problems: [
        {
          id: '2-1-4-01',
          type: 'yaku',
          ask: 'choice',
          scene: { hand: '23456789m33344z', seat: 'south', round: '東1局' },
          win: { tile: '7m', tsumo: false },
          yaku: ['honitsu'],
          prompt:
            '鳴いていない手で、リーチはしていません。相手が {7m} を捨て、{234m}{567m}{789m}{333z}{44z} の形がそろいます。つく役はどれですか？',
          choices: [
            {
              answer: '混一色',
              grade: 'best',
              reason: '萬子と字牌だけで手ができています。混一色です。',
            },
            {
              answer: '役牌',
              grade: 'bad',
              reason: '{3z}（西）も {4z}（北）も、南家・東場では役牌ではありません。',
            },
            {
              answer: '役なし',
              grade: 'bad',
              reason: '数牌が萬子だけで、ほかは字牌です。1色 + 字牌の混一色があります。',
            },
          ],
          summary: '1種類の数牌 + 字牌 = 混一色',
          tags: ['混一色'],
          review: REVIEW,
        },
        {
          id: '2-1-4-02',
          type: 'yaku',
          ask: 'choice',
          scene: { hand: '12367899m11z', melds: ['555z'], seat: 'south', round: '東1局' },
          win: { tile: '9m', tsumo: false },
          yaku: ['haku', 'honitsu'],
          prompt: '{5z}（白）をポンしています。相手が {9m} を捨てました。つく役はどれですか？',
          choices: [
            {
              answer: '役牌と混一色',
              grade: 'best',
              reason:
                '白の刻子で役牌。さらに萬子と字牌だけなので混一色。混一色は鳴いても2翻でつき、役牌と合わせて3翻です。',
            },
            {
              answer: '役牌だけ',
              grade: 'bad',
              reason: '萬子と字牌だけでできています。混一色は鳴いても使える役です。',
            },
            {
              answer: '混一色だけ',
              grade: 'bad',
              reason: '{5z}（白）の刻子は、ポンしていても役牌です。',
            },
          ],
          summary: '役牌 + 混一色は鳴いても作れる組み合わせ',
          tags: ['混一色', '役牌', '鳴き'],
          review: REVIEW,
        },
        {
          id: '2-1-4-03',
          type: 'rule',
          ask: 'choice',
          prompt: '門前なら3翻の混一色。ポンやチーをして作ると何翻になりますか？',
          choices: [
            {
              answer: '2翻',
              grade: 'best',
              reason: '混一色は鳴くと1翻下がって2翻になります（食い下がり）。それでも十分大きい役です。',
            },
            {
              answer: '3翻のまま',
              grade: 'bad',
              reason: '混一色は食い下がりのある役です。鳴くと1翻下がります。',
            },
            {
              answer: '鳴くと使えない',
              grade: 'bad',
              reason:
                '鳴くと使えないのは、リーチ・門前清自摸和・平和・一盃口・七対子などです。混一色は鳴いても使えます。',
            },
          ],
          summary: '混一色は鳴くと3翻 → 2翻（食い下がり）',
          tags: ['混一色', '食い下がり', '翻'],
          review: REVIEW,
        },
        {
          id: '2-1-4-04',
          type: 'yaku',
          ask: 'choice',
          scene: { hand: '123789m45p33344z', seat: 'south', round: '東1局' },
          win: { tile: '6p', tsumo: false },
          yaku: [],
          prompt:
            '鳴いていない手で、リーチはしていません。相手が {6p} を捨て、{123m}{789m}{456p}{333z}{44z} の形がそろいます。和了れますか？',
          choices: [
            {
              answer: '和了れない',
              grade: 'best',
              reason:
                '萬子と筒子の2種類が混ざっているので、混一色になりません。{3z}{4z} は役牌でもなく、ほかに役もありません。',
            },
            {
              answer: '和了れる',
              grade: 'bad',
              reason: '字牌が多くても、数牌が2種類あると混一色はつきません。数牌は1種類だけが条件です。',
            },
          ],
          summary: '数牌が2種類あると混一色にならない',
          tags: ['混一色', '役なし'],
          review: REVIEW,
        },
      ],
      summary: [
        '混一色 = 1種類の数牌 + 字牌だけ',
        '門前3翻、鳴くと2翻（食い下がり）',
        '役牌と組み合わせやすい',
      ],
    },
  ],
  test: [
    {
      id: '2-1-t-01',
      type: 'yaku',
      ask: 'choice',
      scene: { hand: '234m45688p34567s', seat: 'south', round: '東1局' },
      win: { tile: '2s', riichi: true, tsumo: false },
      yaku: ['riichi', 'pinfu', 'tanyao'],
      prompt:
        '鳴いていない手でリーチをかけました。相手が {2s} を捨て、{234m}{456p}{234s}{567s}{88p} の形がそろいます。つく役はどれですか？',
      choices: [
        {
          answer: 'リーチ・平和・断么九',
          grade: 'best',
          reason:
            '全部順子・雀頭 {8p}・{34s} の両面待ちで平和、全部2〜8の数牌で断么九、そしてリーチ。3つ重なります。',
        },
        {
          answer: 'リーチと断么九',
          grade: 'bad',
          reason: '門前・全部順子・雀頭が役牌でない・両面待ちなので、平和もつきます。',
        },
        {
          answer: 'リーチと平和',
          grade: 'bad',
          reason: '1・9・字牌が1枚もないので、断么九もつきます。',
        },
      ],
      summary: 'リーチ・平和・断么九は重なりやすい',
      tags: ['平和', '断么九', 'リーチ'],
      review: REVIEW,
    },
    {
      id: '2-1-t-02',
      type: 'yaku',
      ask: 'choice',
      scene: { hand: '12m345678p23455s', seat: 'south', round: '東1局' },
      win: { tile: '3m', riichi: true, tsumo: false },
      yaku: ['riichi'],
      prompt:
        '鳴いていない手でリーチをかけました。相手が {3m} を捨て、{123m}{345p}{678p}{234s}{55s} の形がそろいます。つく役はどれですか？',
      choices: [
        {
          answer: 'リーチだけ',
          grade: 'best',
          reason: '全部順子ですが、待ちは {12m} の辺張です。両面待ちではないので平和はつきません。',
        },
        {
          answer: 'リーチと平和',
          grade: 'bad',
          reason: '辺張待ちでは平和になりません。平和は両面待ちのときだけです。',
        },
      ],
      summary: '辺張待ちは平和にならない',
      tags: ['平和', '辺張'],
      review: REVIEW,
    },
    {
      id: '2-1-t-03',
      type: 'yaku',
      ask: 'choice',
      scene: { hand: '334455m67899p23s', seat: 'south', round: '東1局' },
      win: { tile: '4s', tsumo: false },
      yaku: ['pinfu', 'iipeikou'],
      prompt:
        '鳴いていない手で、リーチはしていません。相手が {4s} を捨て、{345m}{345m}{678p}{234s}{99p} の形がそろいます。つく役はどれですか？',
      choices: [
        {
          answer: '平和と一盃口',
          grade: 'best',
          reason: '{345m} が2つで一盃口。全部順子・雀頭 {9p}・{23s} の両面待ちで平和もつきます。',
        },
        {
          answer: '一盃口だけ',
          grade: 'bad',
          reason: '平和の4つの条件もそろっています。一盃口と平和は重なってつきます。',
        },
        {
          answer: '平和だけ',
          grade: 'bad',
          reason: '{334455m} は {345m} が2つ。同じ順子2つの一盃口も見落とさないようにしましょう。',
        },
      ],
      summary: '一盃口と平和は重なりやすい',
      tags: ['一盃口', '平和'],
      review: REVIEW,
    },
    {
      id: '2-1-t-04',
      type: 'yaku',
      ask: 'choice',
      scene: { hand: '234678m2399s', melds: ['234p'], seat: 'south', round: '東1局' },
      win: { tile: '4s', tsumo: false },
      yaku: ['sanshokuDoujun'],
      prompt: '{234p} をチーしています。相手が {4s} を捨てました。ロンできますか？',
      choices: [
        {
          answer: 'ロンできる',
          grade: 'best',
          reason:
            '{234m}、チーした {234p}、{234s} で三色同順です。三色同順は鳴いても1翻でつくので、ロンできます。',
        },
        {
          answer: 'ロンできない',
          grade: 'bad',
          reason:
            '三色同順は鳴いても使える役です（食い下がりで1翻）。{9s} があって断么九はつきませんが、三色があります。',
        },
      ],
      summary: '三色同順は鳴いても1翻でつく',
      tags: ['三色同順', '食い下がり', '鳴き'],
      review: REVIEW,
    },
    {
      id: '2-1-t-05',
      type: 'yaku',
      ask: 'choice',
      scene: { hand: '12345678m234p55s', seat: 'south', round: '東1局' },
      win: { tile: '9m', tsumo: false },
      yaku: ['pinfu', 'ittsu'],
      prompt: '鳴いていない手で、リーチはしていません。相手が {9m} を捨てました。つく役はどれですか？',
      choices: [
        {
          answer: '平和と一気通貫',
          grade: 'best',
          reason:
            '{123m}{456m}{789m} で一気通貫。全部順子・雀頭 {5s}・{78m} の両面待ちなので平和もつきます。',
        },
        {
          answer: '平和だけ',
          grade: 'bad',
          reason: '{9m} で萬子の1〜9がつながります。一気通貫も重なってつきます。',
        },
        {
          answer: '一気通貫だけ',
          grade: 'bad',
          reason: '{78m} に {9m} がつく両面待ちです。全部順子で雀頭も役牌でないので、平和もつきます。',
        },
      ],
      summary: '一気通貫と平和も重なる',
      tags: ['一気通貫', '平和'],
      review: REVIEW,
    },
    {
      id: '2-1-t-06',
      type: 'yaku',
      ask: 'choice',
      scene: { hand: '1199m3377p55s226z', seat: 'south', round: '東1局' },
      win: { tile: '6z', tsumo: true },
      yaku: ['chiitoi', 'tsumo'],
      prompt:
        '鳴いていない手で、リーチはしていません。自分で {6z} を引いて（ツモで）和了りました。つく役はどれですか？',
      choices: [
        {
          answer: '七対子と門前清自摸和',
          grade: 'best',
          reason: '対子7組で七対子。門前でツモったので、門前清自摸和も重なってつきます。',
        },
        {
          answer: '七対子だけ',
          grade: 'bad',
          reason: '七対子は門前の手です。門前でツモ和了すれば、門前清自摸和もつきます。',
        },
        {
          answer: '役牌',
          grade: 'bad',
          reason: '{6z}（發）は2枚だけです。対子では役になりません。',
        },
      ],
      summary: '七対子でもツモなら門前清自摸和がつく',
      tags: ['七対子', '門前清自摸和'],
      review: REVIEW,
    },
    {
      id: '2-1-t-07',
      type: 'yaku',
      ask: 'choice',
      scene: { hand: '99m888p33s', melds: ['666z', '222m'], seat: 'south', round: '東1局' },
      win: { tile: '3s', tsumo: false },
      yaku: ['hatsu', 'toitoi'],
      prompt: '{6z}（發）と {222m} をポンしています。相手が {3s} を捨てました。つく役はどれですか？',
      choices: [
        {
          answer: '役牌と対々和',
          grade: 'best',
          reason: '發の刻子で役牌。{666z}{222m}{888p}{333s} と面子4つが全部刻子なので、対々和も重なります。',
        },
        {
          answer: '役牌だけ',
          grade: 'bad',
          reason: '面子4つがすべて刻子です。ポンしていても対々和がつきます。',
        },
        {
          answer: '対々和だけ',
          grade: 'bad',
          reason: '{6z}（發）は三元牌なので、刻子にすれば役牌です。',
        },
      ],
      summary: '役牌のポンから対々和を狙える',
      tags: ['対々和', '役牌', '鳴き'],
      review: REVIEW,
    },
    {
      id: '2-1-t-08',
      type: 'yaku',
      ask: 'choice',
      scene: { hand: '12345789p11555z', seat: 'south', round: '東1局' },
      win: { tile: '6p', tsumo: false },
      yaku: ['haku', 'honitsu', 'ittsu'],
      prompt: '鳴いていない手で、リーチはしていません。相手が {6p} を捨てました。つく役はどれですか？',
      choices: [
        {
          answer: '役牌・混一色・一気通貫',
          grade: 'best',
          reason:
            '{555z}（白）で役牌、筒子と字牌だけで混一色、{123p}{456p}{789p} で一気通貫。3つ重なる大きな手です。',
        },
        {
          answer: '役牌と混一色',
          grade: 'bad',
          reason: '{6p} が入って筒子の1〜9がつながります。一気通貫も見落とさないようにしましょう。',
        },
        {
          answer: '混一色と一気通貫',
          grade: 'bad',
          reason: '{5z}（白）の刻子は役牌です。（{1z}（東）は雀頭なので、こちらは役になりません）',
        },
      ],
      summary: '混一色は一気通貫や役牌と重なりやすい',
      tags: ['混一色', '一気通貫', '役牌'],
      review: REVIEW,
    },
    {
      id: '2-1-t-09',
      type: 'yaku',
      ask: 'choice',
      scene: { hand: '222m88s44z', melds: ['555p', '678s'], seat: 'south', round: '東1局' },
      win: { tile: '8s', tsumo: false },
      yaku: [],
      prompt: '{555p} をポンし、{678s} をチーしています。相手が {8s} を捨てました。ロンできますか？',
      choices: [
        {
          answer: 'ロンできない',
          grade: 'best',
          reason:
            '{678s} の順子があるので対々和になりません。{4z}（北）があるので断么九でもなく、役牌もありません。役がないのでロンできません。',
        },
        {
          answer: 'ロンできる',
          grade: 'bad',
          reason: '対々和は面子4つが全部刻子のときだけです。チーした順子が1つあるとつきません。',
        },
      ],
      summary: 'チーした順子があると対々和にならない',
      tags: ['対々和', '役なし', '鳴き'],
      review: REVIEW,
    },
    {
      id: '2-1-t-10',
      type: 'rule',
      ask: 'choice',
      prompt: '鳴いても翻が下がらない役はどれですか？',
      choices: [
        {
          answer: '対々和',
          grade: 'best',
          reason: '対々和はポンして作っても2翻のままです。食い下がりがありません。',
        },
        {
          answer: '混一色',
          grade: 'bad',
          reason: '混一色は鳴くと3翻から2翻に下がります（食い下がり）。',
        },
        {
          answer: '一気通貫',
          grade: 'bad',
          reason: '一気通貫は鳴くと2翻から1翻に下がります（食い下がり）。',
        },
        {
          answer: '平和',
          grade: 'bad',
          reason: '平和は門前だけの役です。鳴くと下がるどころか、使えなくなります。',
        },
      ],
      summary: '食い下がり: 三色・一通・混一色。対々和は下がらない',
      tags: ['食い下がり', '対々和', '翻'],
      review: REVIEW,
    },
  ],
};

/** この章で初めて出てくる用語（用語集に入る） @type {import('../types.js').GlossaryEntry[]} */
export const TERMS = [
  {
    term: '平和',
    reading: 'ピンフ',
    body: '鳴いていない手で、面子4つがすべて順子、雀頭が役牌でなく、待ちが両面のときの役。1翻。',
  },
  {
    term: '一盃口',
    reading: 'イーペーコー',
    body: 'まったく同じ順子を2つそろえた手の役（例: {234m}{234m}）。鳴いていない手だけ。1翻。',
  },
  {
    term: '三色同順',
    reading: 'サンショクドウジュン',
    body: '同じ数の順子を萬子・筒子・索子の3色でそろえた手の役（例: {345m}{345p}{345s}）。門前2翻、鳴くと1翻。',
  },
  {
    term: '一気通貫',
    reading: 'イッキツウカン',
    body: '同じ色で123・456・789の順子をそろえた手の役。門前2翻、鳴くと1翻。略して一通（イッツー）。',
  },
  {
    term: '混一色',
    reading: 'ホンイツ',
    body: '1種類の数牌と字牌だけで作った手の役。門前3翻、鳴くと2翻。',
  },
  {
    term: '対々和',
    reading: 'トイトイ',
    body: '面子4つがすべて刻子の手の役。ポンして作ってもよい。2翻で、鳴いても下がらない。',
  },
  {
    term: '翻',
    reading: 'ハン',
    body: '役の大きさの単位。役が重なると翻は足し算になり、翻が多いほど点数が高い。',
  },
  {
    term: '食い下がり',
    reading: 'くいさがり',
    body: '鳴くと役の翻が1つ下がること。三色同順・一気通貫・混一色などにある。',
  },
];
