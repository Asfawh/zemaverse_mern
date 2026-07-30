import mongoose from 'mongoose';
import dotenv from 'dotenv';

import dbConnect from '../config/mongoose.config.js';
import {
  GENRE_BY_SONG_NAME,
  LEGACY_GENRE_MAP,
  ZEMAVERSE_GENRES,
} from '../config/genres.js';
import Song from '../models/song.model.js';

dotenv.config();

async function migrateGenres() {
  await dbConnect();

  const dryRun = process.argv.includes('--dry-run');
  const songs = await Song.find({}, { songName: 1, genre: 1 }).lean();

  const resolvedSongs = songs.map((song) => {
    const currentGenre = song.genre?.trim();
    const songName = song.songName?.trim();
    const genre = ZEMAVERSE_GENRES.includes(currentGenre)
      ? currentGenre
      : GENRE_BY_SONG_NAME.get(songName) || LEGACY_GENRE_MAP.get(currentGenre);

    return { ...song, currentGenre, genre };
  });
  const unresolved = resolvedSongs.filter((song) => !song.genre);

  if (unresolved.length > 0) {
    throw new Error(
      `Could not resolve a genre for: ${unresolved.map((song) => song.songName).join(', ')}.`
    );
  }

  const targets = resolvedSongs.filter((song) => song.currentGenre !== song.genre);
  let matched = targets.length;
  let modified = 0;

  if (!dryRun) {
    const result = await Song.bulkWrite(
      targets.map((song) => ({
        updateOne: {
          filter: { _id: song._id },
          update: {
            $set: {
              genre: song.genre,
            },
          },
        },
      }))
    );

    matched = result.matchedCount;
    modified = result.modifiedCount;
  }

  const counts = resolvedSongs.reduce((summary, song) => {
    summary[song.genre] = (summary[song.genre] || 0) + 1;
    return summary;
  }, {});

  console.log(JSON.stringify({
    mode: dryRun ? 'dry-run' : 'write',
    scanned: songs.length,
    matched,
    modified,
    categories: counts,
  }, null, 2));
}

try {
  await migrateGenres();
} finally {
  await mongoose.disconnect();
}
