import mongoose from 'mongoose';
import Song from '../models/song.model.js';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI is required');

await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });

const samples = [
  {
    songName: 'ብርሃን ሆይ',
    artistName: 'ZemaVerse Sample',
    source: 'Original sample lyrics',
    pageNumber: 1,
    genre: 'Traditional Ethiopian',
    primaryLanguage: 'Amharic',
    primaryLanguageCode: 'am',
    verses: 'ብርሃን ሆይ መንገዴን ምራ\nበተስፋ ልቤን ሙላ',
    lyrics: [
      {
        language: 'Amharic',
        languageCode: 'am',
        title: 'ብርሃን ሆይ',
        text: 'ብርሃን ሆይ መንገዴን ምራ\nበተስፋ ልቤን ሙላ\n\nየሰላም ዜማ በልቤ ይሰማ\nፍቅርህ ለዘላለም ይኑር',
      },
      {
        language: 'English',
        languageCode: 'en',
        title: 'O Light',
        text: 'O light, come guide my way\nFill my heart with hope today\n\nLet a song of peace live in my heart\nMay your love remain forever',
      },
    ],
  },
  {
    songName: 'Homeward Sky',
    artistName: 'ZemaVerse Sample',
    source: 'Original sample lyrics',
    pageNumber: 2,
    genre: 'Tizita',
    primaryLanguage: 'English',
    primaryLanguageCode: 'en',
    verses: 'Under the homeward sky\nEvery road remembers our name',
    lyrics: [
      {
        language: 'English',
        languageCode: 'en',
        title: 'Homeward Sky',
        text: 'Under the homeward sky\nEvery road remembers our name\n\nCarry the old song softly\nAnd bring its bright echo home',
      },
      {
        language: 'Amharic',
        languageCode: 'am',
        title: 'የናፍቆት ሰማይ',
        text: 'በናፍቆት ሰማይ ስር\nመንገዱ ስማችንን ያስታውሳል\n\nየድሮውን ዜማ በቀስታ ያዝ\nብሩህ ድምፁን ወደ ቤት መልስ',
      },
    ],
  },
];

for (const sample of samples) {
  await Song.findOneAndUpdate(
    { songName: sample.songName, artistName: sample.artistName },
    { $set: sample },
    { upsert: true, new: true, runValidators: true }
  );
}

console.log(`Seeded ${samples.length} ZemaVerse sample songs`);
await mongoose.disconnect();
