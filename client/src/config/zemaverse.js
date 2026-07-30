export const LEGACY_ZEMAVERSE_SOURCE =
  'Saint Louis Ethiopian Orthodox Church Youth Group/Choir';

export function getDisplayedZemaVerseSource(song) {
  if (!song) return '';

  if (Object.prototype.hasOwnProperty.call(song, 'source')) {
    return song.source?.trim() || '';
  }

  return LEGACY_ZEMAVERSE_SOURCE;
}
