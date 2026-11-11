import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { GLOSSARY } from '../src/content/glossary.js';
import { LEVELS, PASS_RATIO, visibleLevels } from '../src/content/index.js';
import { advance, answer, startLesson, startTest } from '../src/drill/flow.js';
import { defaultStore, recordLesson } from '../src/storage/store.js';
import { runHtml, testResultHtml } from '../src/ui/run.js';
import { chapterHtml, glossaryHtml, homeHtml, mapHtml, nextUp, termSheetHtml } from '../src/ui/screens.js';
import { rich } from '../src/ui/text.js';
import { SAMPLE_CHAPTER } from './fixtures/sample-chapter.js';

const root = decodeURIComponent(new URL('..', import.meta.url).pathname);
/** @param {string} path */
const read = (path) => readFileSync(join(root, path), 'utf8');
/** @param {string} dir @returns {string[]} */
function walk(dir) {
  return readdirSync(join(root, dir)).flatMap((name) => {
    const path = `${dir}/${name}`;
    return statSync(join(root, path)).isDirectory() ? walk(path) : [path];
  });
}

test('rich: 牌の絵と用語ボタン', () => {
  const html = rich('[[和了]]は {123m}');
  assert.match(html, /data-action="term" data-term="和了"/);
  assert.match(html, /class="inline-tiles"/);
});

test('公開版では監修前の問題を出さない', () => {
  const published = visibleLevels(LEVELS, false);
  assert.ok(
    published.every((l) => l.chapters.every((c) => c.test.every((p) => p.review.status === 'approved'))),
  );
});

test('各画面の HTML が作れる', () => {
  const store = defaultStore();
  const now = new Date(2026, 10, 11);
  assert.match(homeHtml(LEVELS, store, now), /続きから/);
  assert.match(mapHtml(LEVELS, store), /レベル5 上級/);
  assert.match(chapterHtml(SAMPLE_CHAPTER, store, PASS_RATIO), /4点以上で合格/);
  assert.match(glossaryHtml(), /class="glossary"/);
  if (GLOSSARY[0]) assert.ok(termSheetHtml(GLOSSARY[0].term).includes(GLOSSARY[0].term));
  assert.match(termSheetHtml('ない用語'), /まだありません/);

  // レッスンの全画面
  let run = startLesson(SAMPLE_CHAPTER, 1);
  for (let i = 0; i < run.steps.length; i++) {
    const html = runHtml(run, SAMPLE_CHAPTER);
    assert.ok(html.includes('class="bar"'));
    const step = run.steps[run.index];
    if (step.type === 'problem') {
      assert.doesNotMatch(html, /data-action="next"/, '答える前は次へを出さない');
      run =
        step.problem.ask === 'tile'
          ? answer(run, { kind: 'tile', token: '1m' })
          : answer({ ...run, selected: ['3m'] }, { kind: 'tiles' });
      const after = runHtml(run, SAMPLE_CHAPTER);
      assert.match(after, /覚えること/);
      assert.match(after, /data-action="(next|finish)"/);
    }
    run = advance(run);
  }

  const test1 = answer(startTest(SAMPLE_CHAPTER), { kind: 'choice', index: 1 });
  assert.match(testResultHtml(test1, SAMPLE_CHAPTER, { score: 0, max: 5, passed: false }), /もう少し/);
});

test('nextUp: 未完了のレッスン → 章末テスト', () => {
  const levels = [{ id: 1, title: '超初級', theme: '', chapters: [SAMPLE_CHAPTER] }];
  let store = defaultStore();
  assert.equal(nextUp(levels, store)?.lessonIndex, 0);
  store = recordLesson(recordLesson(store, '1-0-1'), '1-0-2');
  assert.equal(nextUp(levels, store)?.lessonIndex, -1);
});

test('HTML: CSP を付け、外部の読み込みやインラインのスクリプト・スタイルがない', () => {
  const html = read('index.html');
  assert.ok(html.includes(`content="default-src 'self'"`));
  assert.ok(!/https?:\/\//.test(html));
  assert.ok(!/<script(?![^>]*\bsrc=)/.test(html));
  assert.ok(!/<style|\sstyle=/.test(html));
  for (const file of walk('src')) assert.ok(!/style="/.test(read(file)), `${file}: style 属性は CSP で無効`);
});

test('教科書の全問題: 答える前と、最善・最悪の答えのあとで表示できる', () => {
  for (const ch of LEVELS.flatMap((l) => l.chapters)) {
    for (const run of [...ch.lessons.map((_, i) => startLesson(ch, i)), startTest(ch)]) {
      let r = run;
      for (let i = 0; i < r.steps.length; i++) {
        assert.doesNotThrow(() => runHtml(r, ch), `${ch.id} ${i}`);
        const step = r.steps[r.index];
        if (step.type === 'problem') {
          const p = step.problem;
          const answered =
            p.ask === 'choice'
              ? answer(r, { kind: 'choice', index: 0 })
              : p.ask === 'tiles'
                ? answer(
                    { ...r, selected: [p.correct ? p.correct.slice(0, 1) + p.correct.slice(-1) : '1m'] },
                    {
                      kind: 'tiles',
                    },
                  )
                : answer(r, { kind: 'tile', token: (p.choices ?? [])[0]?.answer ?? '1m' });
          assert.ok(answered.verdicts[r.index], `${p.id}: 答えられない`);
          const html = runHtml(answered, ch);
          assert.match(html, /覚えること/, p.id);
          r = answered;
        }
        r = advance(r);
      }
    }
  }
});
