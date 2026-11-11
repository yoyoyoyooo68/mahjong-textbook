# 練習アプリから写したファイル

次のファイルは `../麻雀練習アプリ/` から写したもの。**ここでは書き換えない**（直すときは練習アプリ側で直してから写し直す）。
練習アプリの修正は自動では入らないので、必要なときに手で取り込む。

写した元: 麻雀練習アプリ の main ブランチ、コミット `70e0dc9`（2026-11-11）

| ファイル | 中身 |
|---|---|
| `src/core/tiles.js` | 牌の番号・表記の読み書き |
| `src/core/shanten.js` | シャンテン数 |
| `src/core/agari.js` | 和了形の分解 |
| `src/core/efficiency.js` | 受け入れ枚数・牌効率 |
| `src/core/rules.js` | ルール設定（yaku.js が使う） |
| `src/core/yaku.js` | 役の判定（役当てドリル用） |
| `src/ui/tile-svg.js` | 牌の絵（SVG） |
| `src/ui/tile-text.js` | 文中の `{3p}` を牌の絵にする |
| `styles/tiles.css` | 牌の色付け |

写し直す手順:
```bash
S=../麻雀練習アプリ
for f in tiles shanten agari efficiency rules yaku; do cp $S/src/core/$f.js src/core/; done
cp $S/src/ui/tile-svg.js $S/src/ui/tile-text.js src/ui/
cp $S/styles/tiles.css styles/
```
そのあと `npm run check` を通し、上の「写した元」のコミットを書き換える。
