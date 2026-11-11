// 教科書のデータの形（設計図.md 第10章）。型だけを置くファイル。
//
// 文の書き方（解説・問題文・理由のすべてで使える）
//   {3p}      牌の絵になる（表記は 123m406p789s1234567z。0 は赤五）
//   [[和了]]  用語になる。タップで用語集の説明が出る。用語集（glossary.js）にない用語は検算テストで落ちる
//   <strong>  強調。ほかの HTML は使わない

/** @typedef {'best' | 'ok' | 'bad'} Grade 最善・悪くない・悪手 */

/**
 * ドリルの種類。成績の種類別集計に使う。
 * rule は牌の名前・ルール・用語など、答えが1つに決まる基礎知識（正解・不正解の2段階で表示）。
 * @typedef {'agari' | 'machi' | 'yaku' | 'nanikiru' | 'oshihiki' | 'naki' | 'anzen' | 'rule'} DrillType
 */

/**
 * @typedef {object} Claims 理由に書いた数字。検算テストが計算と突き合わせる
 * @property {number} [shanten] その牌を切ったあとのシャンテン数（0 = テンパイ）
 * @property {number} [ukeire] その牌を切ったあとの受け入れ枚数（自分の手牌とドラ表示牌だけを見えている牌として数える）
 */

/**
 * @typedef {object} Choice 選択肢1つ
 * @property {string} answer ask=tile なら牌の表記1枚（"4z"、赤五は "0p"）。ask=choice ならボタンの文
 * @property {Grade} grade
 * @property {string} reason なぜこの評価か。最善以外は「なぜダメか」、最善は「なぜ他よりよいか」も書く
 * @property {Claims} [claims]
 */

/**
 * @typedef {object} Scene 局面
 * @property {string} hand 手牌（副露を除く）。何切るは14枚目を含めない
 * @property {string} [draw] ツモった牌（何切るのとき）
 * @property {string[]} [melds] 副露。1つずつ "555z" のように
 * @property {string[]} [doraIndicators] ドラ表示牌
 * @property {string} [discards] 自分の捨て牌（フリテンの問題など）。捨てた順に
 * @property {number} [turn] 巡目
 * @property {'east' | 'south' | 'west' | 'north'} [seat] 自風
 * @property {string} [round] 局（"東1局" など）
 * @property {number[]} [scores] 点数（自分・下家・対面・上家）
 * @property {'east' | 'south'} [roundWind] 場風（役の検算に使う。省略時は東）
 */

/**
 * @typedef {object} Win 和了の場面（役の問題）。scene.hand は和了牌を除いた 13 - 3×副露 枚
 * @property {string} tile 和了牌
 * @property {boolean} tsumo ツモ和了か（false ならロン）
 * @property {boolean} [riichi] リーチしているか
 */

/**
 * @typedef {object} Problem 問題1問
 * @property {string} id "章-連番"（例 "2-2-03"）。公開後は変えない（復習の記録が id で紐づく）
 * @property {DrillType} type
 * @property {'tile' | 'choice' | 'tiles'} ask 答え方。tile=手牌から1枚、choice=ボタン、tiles=当てはまる牌を全部選ぶ
 * @property {Scene} [scene]
 * @property {string} prompt 問題文
 * @property {Choice[]} [choices] ask=tile/choice のとき
 * @property {{ grade: Grade, reason: string }} [otherwise] ask=tile で、choices に無い牌を選んだときの評価
 * @property {string} [palette] ask=tiles のとき、選べる牌（"123456789m"）
 * @property {string} [correct] ask=tiles のとき、正解の牌の組（"36m"）。正解・不正解の2つで採点
 * @property {Win} [win] 役の問題の和了の場面
 * @property {string[]} [yaku] 成立する役の id（src/core/yaku.js の YAKU の id。ドラは含めない）。空配列は「役なし」。
 *   書いたら検算テストが判定と突き合わせる（面子の取り方が複数あれば、役が一番多い取り方で比べる）
 * @property {string} [explain] 答えたあとに必ず出す説明
 * @property {string} summary 覚えること（1行）
 * @property {string[]} tags
 * @property {string[]} [sources] 根拠の出典
 * @property {Review} review
 */

/**
 * @typedef {object} Review 監修の記録
 * @property {string} author 作問者（"pro" など）
 * @property {string} [reviewer] 審査者
 * @property {'draft' | 'approved'} status approved だけが公開版に出る
 * @property {string} [note]
 */

/**
 * @typedef {object} Lesson レッスン（ねらい → 解説 → 確認問題 → まとめ）
 * @property {string} id "1-2-1" など
 * @property {string} title
 * @property {string} aim ねらい（1行）
 * @property {string[]} pages 解説。1要素が画面1枚
 * @property {Problem[]} problems 確認問題（2〜4問）
 * @property {string[]} summary まとめ（3行以内）
 */

/**
 * @typedef {object} Chapter
 * @property {string} id "1-2" など
 * @property {string} title
 * @property {string} goal この章でできるようになること
 * @property {Lesson[]} lessons
 * @property {Problem[]} test 章末テスト
 */

/**
 * @typedef {object} Level
 * @property {number} id 1〜5
 * @property {string} title "超初級" など
 * @property {string} theme "麻雀ってどんなゲーム？" など
 * @property {Chapter[]} chapters
 */

/**
 * @typedef {object} GlossaryEntry
 * @property {string} term 見出し（[[…]] の中身と一致させる）
 * @property {string} [reading] 読み
 * @property {string} body 説明（{3p} は使える。[[…]] は使わない）
 * @property {string} [chapter] 詳しく出てくる章
 */

export {};
