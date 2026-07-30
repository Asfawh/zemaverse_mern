import mongoose from 'mongoose';
import Song from '../models/song.model.js';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI is required');

const decodeHtml = (value = '') => value
  .replace(/&#8211;|&#8212;|&ndash;|&mdash;/g, '–')
  .replace(/&#038;|&amp;/g, '&')
  .replace(/&#8217;|&rsquo;/g, '’')
  .replace(/&quot;|&#8220;|&#8221;/g, '"')
  .replace(/&nbsp;|&#160;/g, ' ')
  .replace(/<[^>]+>/g, '')
  .trim();

const parseTitle = (rawTitle) => {
  const title = decodeHtml(rawTitle).replace(/\s+/g, ' ');
  const withoutLyrics = title.replace(/\s+lyrics\b/i, '').trim();
  const parts = withoutLyrics.split(/\s+[–—-]\s+/);
  if (parts.length < 2) return { songName: withoutLyrics, artistName: 'Unknown artist' };
  return {
    songName: parts.slice(0, -1).join(' – ').trim(),
    artistName: parts.at(-1).trim(),
  };
};

const postsByUrl = new Map();
for (let page = 1; page <= 8 && postsByUrl.size < 100; page += 1) {
  const archiveUrl = `https://ethiozeima.com/category/ethiopian-music/ethio-lyrics/page/${page}/`;
  const response = await fetch(archiveUrl);
  if (!response.ok) throw new Error(`Ethio Zeima archive returned ${response.status}`);
  const html = await response.text();
  const linkPattern = /<a\s+href="(https:\/\/ethiozeima\.com\/\d{4}\/\d{2}\/\d{2}\/[^"]+\/)"\s+rel="bookmark">([\s\S]*?)<\/a>/gi;
  for (const match of html.matchAll(linkPattern)) {
    postsByUrl.set(match[1], { link: match[1], title: { rendered: match[2] } });
  }
}
const posts = [...postsByUrl.values()].slice(0, 100);
if (posts.length < 100) throw new Error(`Expected 100 metadata records, found ${posts.length}`);

await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });

let imported = 0;
for (const [index, post] of posts.entries()) {
  const { songName, artistName } = parseTitle(post.title?.rendered);
  if (!songName) continue;

  await Song.findOneAndUpdate(
    { externalSourceUrl: post.link },
    {
      $set: {
        songName,
        artistName,
        source: 'EZ-metadata',
        genre: 'Ethio-Pop',
        primaryLanguage: 'Amharic',
        primaryLanguageCode: 'am',
        externalOnly: true,
        externalSourceUrl: post.link,
        rightsStatus: 'metadata-only',
        verses: '',
        lyrics: [],
        pageNumber: 3 + index,
      },
    },
    { upsert: true, runValidators: true }
  );
  imported += 1;
}

console.log(`Imported ${imported} Ethio Zeima metadata records`);
await mongoose.disconnect();
