import mongoose from 'mongoose';
import Song from '../models/song.model.js';
import User from '../models/user-model.js';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI is required');

const sourceUrl = 'https://genius.com/albums/Teddy-afro/Etorika';
const tracks = [
  ['Das Tal (Ansaw)', 'ዳስ ጣል (አንሳው)', '07:18'],
  ['Samnew', 'ሳምነው', '05:03'],
  ['Etorika', 'ኢቶሪካ', '04:38'],
  ['Tewedaj', 'ተወዳጅ', '03:46'],
  ['Sememene (GuReggae)', 'ሰመመነ (ጉሬጌ)', '05:25'],
  ['Tsion Mushraye', 'ጽዮን ሙሽራዬ', '06:32'],
  ['Tintago (Pintago)', 'ጥንታጎ (ፒንታጎ)', '05:00'],
  ['Yemaereg Tig (Abra Nuariye)', 'የማዕረግ ጥግ (አብራ ኑአርዬ)', '04:48'],
  ['Shih Bibal (Back to 90s)', 'ሺህ ቢባል (Back to 90s)', '05:02'],
  ['Tayegn', 'ታየኝ', '03:56'],
  ['Bemeskotu', 'በመስኮቱ', '06:10'],
  ['Bilchita', 'ብልጭታ', '05:04'],
  ['Yeazo Emba', 'የአዞ እንባ', '04:46'],
  ['Ze Tsedal', 'ዘ ጸዳል', '04:59'],
  ['Merema', 'መረማ', '07:44'],
  ['Merkeb', 'መርከብ', '05:28'],
  ['Sema Erase', 'ሰማ እረሳ', '03:40'],
  ['Jember', 'ጀምበር', '06:33'],
];

await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });

const owner = await User.findOne({ username: 'cho' }).select('_id').lean();
if (!owner) throw new Error('User cho was not found');

const lastNumberedSong = await Song.findOne({ pageNumber: { $type: 'number' } })
  .sort({ pageNumber: -1 })
  .select({ pageNumber: 1 })
  .lean();
let nextPageNumber = (lastNumberedSong?.pageNumber || 0) + 1;

let imported = 0;
for (const [index, [latinTitle, amharicTitle, duration]] of tracks.entries()) {
  const existing = await Song.findOne({
    artistName: 'Teddy Afro',
    albumName: 'Etorika',
    trackNumber: index + 1,
  }).select('pageNumber').lean();

  await Song.findOneAndUpdate(
    { artistName: 'Teddy Afro', albumName: 'Etorika', trackNumber: index + 1 },
    {
      $set: {
        songName: `${amharicTitle} — ${latinTitle}`,
        artistName: 'Teddy Afro',
        albumName: 'Etorika',
        releaseYear: 2026,
        trackNumber: index + 1,
        duration,
        source: 'Genius album metadata',
        genre: 'Ethiopian Reggae',
        primaryLanguage: 'Amharic',
        primaryLanguageCode: 'am',
        externalOnly: true,
        externalSourceUrl: sourceUrl,
        rightsStatus: 'metadata-only',
        verses: '',
        lyrics: [],
        createdBy: owner._id,
        pageNumber: existing?.pageNumber || nextPageNumber,
      },
    },
    { upsert: true, runValidators: true }
  );
  if (!existing?.pageNumber) nextPageNumber += 1;
  imported += 1;
}

console.log(`Imported ${imported} Etorika metadata records for user cho`);
await mongoose.disconnect();
