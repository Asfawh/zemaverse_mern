const MAX_LINES_PER_SLIDE = 6;
const MAX_CHARACTERS_PER_SLIDE = 420;
const STANDALONE_MARKER = /^\s*(?:አዝ(?:ማች)?|chorus|refrain)\s*[:፡.=\-‑–—_·]*\s*$/iu;

export const isLyricsHeading = (line = '') => (
  /^(?:አዝ(?:ማች)?|chorus|refrain|verse|meaning|translation)(?=[\s.:፡።…—–-]|$)/iu.test(line.trim())
);

function normalizeLyrics(value = '') {
  return value.replace(/\r\n?/g, '\n')
    .replace(/አዝ(?:ማች)?[\s=\-‑–—_·.።…]+/gu, '\n\nአዝ\n\n')
    .replace(/\b(?:chorus|refrain)\s*[:=\-‑–—_·.]+/giu, '\n\nChorus\n\n')
    .replace(/[ \t]{3,}/g, '\n\n')
    .replace(/([^\n])\s+(?=አዝ(?:ማች)?(?:[\s.:፡።…—–-]|$))/gu, '$1\n\n').trim();
}

function expandInlineLines(lines) {
  return lines.flatMap((line) => line.split(/(?<=[።.!?])\s+/u).map((part) => part.trim()).filter(Boolean)
    .flatMap((sentence) => {
      if (sentence.length <= 120) return [sentence];
      const chunks = [];
      let chunk = '';
      sentence.split(/\s+/u).forEach((word) => {
        const candidate = chunk ? `${chunk} ${word}` : word;
        if (chunk && candidate.length > 120) { chunks.push(chunk); chunk = word; }
        else chunk = candidate;
      });
      if (chunk) chunks.push(chunk);
      return chunks;
    }));
}

function splitLongSection(lines) {
  const slides = [];
  let currentSlide = [];
  let characterCount = 0;
  const saveSlide = () => {
    if (!currentSlide.length) return;
    slides.push(currentSlide);
    currentSlide = [];
    characterCount = 0;
  };
  lines.forEach((line) => {
    const startsNewSection = isLyricsHeading(line) && currentSlide.length > 0 && !isLyricsHeading(currentSlide[0]);
    const exceedsLineLimit = currentSlide.length >= MAX_LINES_PER_SLIDE && !isLyricsHeading(line);
    const exceedsCharacterLimit = currentSlide.length > 0 && characterCount + line.length > MAX_CHARACTERS_PER_SLIDE;
    if (startsNewSection || exceedsLineLimit || exceedsCharacterLimit) saveSlide();
    currentSlide.push(line);
    characterCount += line.length;
  });
  saveSlide();
  return slides;
}

function foldLeadingTitle(slides, title = '') {
  const normalizedTitle = title.trim().toLocaleLowerCase();
  const firstLine = slides[0]?.[0]?.trim().toLocaleLowerCase();
  if (slides.length > 1 && slides[0].length === 1 && normalizedTitle && firstLine === normalizedTitle) {
    return [[...slides[0], ...slides[1]], ...slides.slice(2)];
  }
  return slides;
}

function mergeOpeningFragments(sections) {
  const opening = sections.slice(0, 3);
  if (opening.length === 3 && opening.every((section) => section.length === 1 && !isLyricsHeading(section[0]))) {
    return [[...opening[0], ...opening[1], ...opening[2]], ...sections.slice(3)];
  }
  return sections;
}

function mergeSingleLineRuns(sections) {
  const result = [];
  let run = [];
  const flush = () => { if (run.length >= 3) result.push(run.flat()); else result.push(...run); run = []; };
  sections.forEach((section) => {
    if (section.length === 1 && !isLyricsHeading(section[0])) run.push(section);
    else { flush(); result.push(section); }
  });
  flush();
  return result;
}

function buildMarkerSlides(normalized) {
  if (!normalized.split('\n').some((line) => STANDALONE_MARKER.test(line))) return null;
  const slides = [];
  let current = [];
  const flush = () => { if (current.length) slides.push(current); current = []; };
  normalized.split('\n').map((line) => line.trim()).filter(Boolean).forEach((line) => {
    if (STANDALONE_MARKER.test(line)) {
      if (current.length) { current.push(line); flush(); }
      else if (slides.length) slides[slides.length - 1].push(line);
      else { current.push(line); flush(); }
      return;
    }
    current.push(line);
    if (current.length >= MAX_LINES_PER_SLIDE) flush();
  });
  flush();
  return slides;
}

function repackSingleLineSlides(slides, rawValue) {
  if ((/[ \t]{3,}/u.test(rawValue) && !/\n/u.test(rawValue)) || !slides.some((slide) => slide.length === 1)) return slides;
  const packed = [];
  let current = [];
  const flush = () => { if (current.length) packed.push(current); current = []; };
  slides.flat().forEach((line) => {
    if (STANDALONE_MARKER.test(line)) {
      if (current.length) { current.push(line); flush(); }
      else if (packed.length) packed[packed.length - 1].push(line);
      return;
    }
    current.push(line);
    if (current.length >= MAX_LINES_PER_SLIDE) flush();
  });
  flush();
  if (packed.length > 1 && packed.at(-1).length === 1 &&
      !STANDALONE_MARKER.test(packed.at(-1)[0]) && !STANDALONE_MARKER.test(packed.at(-2).at(-1))) {
    packed[packed.length - 2].push(packed.pop()[0]);
  }
  return packed;
}

export function buildLyricsSlides(value = '', title = '') {
  const normalized = normalizeLyrics(value);
  if (!normalized) return [];
  const markerSlides = buildMarkerSlides(normalized);
  if (markerSlides) return repackSingleLineSlides(markerSlides, value);
  const sections = mergeSingleLineRuns(mergeOpeningFragments(normalized.split(/\n\s*\n+/)
    .map((section) => section.trim()).filter(Boolean).reduce((merged, section) => {
      const expandedLines = expandInlineLines(section.split('\n').map((line) => line.trim()).filter(Boolean));
      const previous = merged[merged.length - 1];
      const isStandaloneHeading = expandedLines.length === 1 && isLyricsHeading(expandedLines[0]);
      if (isStandaloneHeading && previous) merged[merged.length - 1] = [...previous, ...expandedLines];
      else if (isStandaloneHeading && !previous) merged.push(expandedLines);
      else if (previous?.length === 1 && isLyricsHeading(previous[0])) merged[merged.length - 1] = [...previous, ...expandedLines];
      else merged.push(expandedLines);
      return merged;
    }, [])));
  const lastSection = sections[sections.length - 1];
  if (sections.length > 1 && lastSection?.length === 1 && isLyricsHeading(lastSection[0])) {
    sections.splice(-2, 2, [...sections[sections.length - 2], ...lastSection]);
  }
  const slides = sections.flatMap((section) => splitLongSection(section)).filter((slide) => slide.length > 0);
  return repackSingleLineSlides(foldLeadingTitle(slides, title), value);
}
