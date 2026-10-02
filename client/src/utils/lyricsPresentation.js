const MAX_LINES_PER_SLIDE = 6;
const MAX_CHARACTERS_PER_SLIDE = 420;

export const isLyricsHeading = (line = '') => (
  /^(?:አዝ(?:ማች)?|chorus|refrain|verse|meaning|translation)(?=[\s.:፡።…—–-]|$)/iu
    .test(line.trim())
);

function normalizeLyrics(value = '') {
  return value
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]{3,}/g, '\n\n')
    .replace(/([^\n])\s+(?=አዝ(?:ማች)?(?:[\s.:፡።…—–-]|$))/gu, '$1\n\n')
    .trim();
}

function splitLongSection(lines) {
  const slides = [];
  let currentSlide = [];
  let characterCount = 0;

  const saveSlide = () => {
    if (currentSlide.length === 0) return;
    slides.push(currentSlide);
    currentSlide = [];
    characterCount = 0;
  };

  lines.forEach((line) => {
    const startsNewSection = isLyricsHeading(line) && currentSlide.length > 0;
    const exceedsLineLimit = currentSlide.length >= MAX_LINES_PER_SLIDE;
    const exceedsCharacterLimit =
      currentSlide.length > 0 &&
      characterCount + line.length > MAX_CHARACTERS_PER_SLIDE;

    if (startsNewSection || exceedsLineLimit || exceedsCharacterLimit) {
      saveSlide();
    }

    currentSlide.push(line);
    characterCount += line.length;
  });

  saveSlide();
  return slides;
}

function foldLeadingTitle(slides, title = '') {
  const normalizedTitle = title.trim().toLocaleLowerCase();
  const firstLine = slides[0]?.[0]?.trim().toLocaleLowerCase();

  if (
    slides.length > 1 &&
    slides[0].length === 1 &&
    normalizedTitle &&
    firstLine === normalizedTitle
  ) {
    return [[...slides[0], ...slides[1]], ...slides.slice(2)];
  }

  return slides;
}

export function buildLyricsSlides(value = '', title = '') {
  const normalized = normalizeLyrics(value);
  if (!normalized) return [];

  const slides = normalized
    .split(/\n\s*\n+/)
    .flatMap((section) => {
      const lines = section
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      return splitLongSection(lines);
    })
    .filter((slide) => slide.length > 0);

  return foldLeadingTitle(slides, title);
}
