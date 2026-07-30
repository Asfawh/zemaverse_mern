export const ZEMAVERSE_GENRES = [
  'Tizita',
  'Bati',
  'Ambassel',
  'Anchihoye',
  'Ethio-Jazz',
  'Ethio-Pop',
  'Ethiopian Reggae',
  'Oromo Music',
  'Gurage Music',
  'Traditional Ethiopian',
];

const genreBySongName = {
  Merkebe: 'ምስጋና ውዳሴ Wudase',
  'Le-Getaye': 'ምስጋና ውዳሴ Wudase',
  'Tekle Haimanot': 'ምስጋና ውዳሴ Wudase',
  'Selam Eleki': 'ምስጋና ውዳሴ Wudase',
  'Misgananew Siraye': 'ምስጋና ውዳሴ Wudase',
  'Yalante Lene': 'ምስጋና ውዳሴ Wudase',
  'Kibre Kidusan': 'ምስጋና ውዳሴ Wudase',
  'Inte Be Mider': "Werbe-ገዕዝ (Ge'ez)",
  'Hore Eyesus': "Werbe-ገዕዝ (Ge'ez)",
  'Metsa Kale Endemena': "Werbe-ገዕዝ (Ge'ez)",
  'Sibhat Le Egziabher': "Werbe-ገዕዝ (Ge'ez)",
  'Oh Erite Helina': "Werbe-ገዕዝ (Ge'ez)",
  Bemenu: "Werbe-ገዕዝ (Ge'ez)",
  'Gabriel New Alu': 'ምስጋና ውዳሴ Wudase',
  'Moged Simetayn': 'ምስጋና ውዳሴ Wudase',
  ፈራሁ: 'ንስሐ-Nisiha',
  'ሰባቱ መንጦላይት': 'ምስጋና ውዳሴ Wudase',
};

const legacyGenreFallback = {
  Yensiha: 'ንስሐ-Nisiha',
  Woreb: "Werbe-ገዕዝ (Ge'ez)",
  Chebchebo: 'ምስጋና ውዳሴ Wudase',
  'ምስጋና Misgana': 'ምስጋና ውዳሴ Wudase',
  'ውዳሴ Wudase': 'ምስጋና ውዳሴ Wudase',
};

export function getZemaVerseGenre(song) {
  if (!song) return '';

  const currentGenre = song.genre?.trim();
  if (ZEMAVERSE_GENRES.includes(currentGenre)) {
    return currentGenre;
  }

  const songName = song.songName?.trim();
  return genreBySongName[songName]
    || legacyGenreFallback[currentGenre]
    || currentGenre
    || ZEMAVERSE_GENRES[0];
}

export function withZemaVerseGenre(song) {
  if (!song) return song;

  return {
    ...song,
    genre: getZemaVerseGenre(song),
  };
}

export function withZemaVerseGenres(songs) {
  return Array.isArray(songs) ? songs.map(withZemaVerseGenre) : songs;
}
