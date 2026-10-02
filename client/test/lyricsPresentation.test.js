import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildLyricsSlides,
  isLyricsHeading,
} from '../src/utils/lyricsPresentation.js';

test('uses blank lines as natural stanza boundaries', () => {
  const slides = buildLyricsSlides('Line one\nLine two\n\nLine three\nLine four');

  assert.deepEqual(slides, [
    ['Line one', 'Line two'],
    ['Line three', 'Line four'],
  ]);
});

test('starts a new slide at an Amharic refrain marker', () => {
  const slides = buildLyricsSlides('መስመር አንድ\nመስመር ሁለት  አዝ፡ ይደገም\nቀጣይ መስመር');

  assert.deepEqual(slides, [
    ['መስመር አንድ', 'መስመር ሁለት'],
    ['አዝ፡ ይደገም', 'ቀጣይ መስመር'],
  ]);
  assert.equal(isLyricsHeading('አዝ፡ ይደገም'), true);
});

test('caps unformatted long lyrics at six lines per slide', () => {
  const source = Array.from({ length: 14 }, (_, index) => `Line ${index + 1}`).join('\n');
  const slides = buildLyricsSlides(source);

  assert.deepEqual(slides.map((slide) => slide.length), [6, 6, 2]);
});

test('treats wide whitespace as an intentional stanza break', () => {
  const slides = buildLyricsSlides('First section   Second section');

  assert.deepEqual(slides, [['First section'], ['Second section']]);
});

test('folds a standalone repeated title into the opening lyric stanza', () => {
  assert.deepEqual(
    buildLyricsSlides('ፈራሁ\n\nመስመር አንድ\nመስመር ሁለት', 'ፈራሁ'),
    [['ፈራሁ', 'መስመር አንድ', 'መስመር ሁለት']],
  );
});
