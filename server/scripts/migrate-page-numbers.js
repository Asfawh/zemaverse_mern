import mongoose from 'mongoose';
import dotenv from 'dotenv';

import dbConnect from '../config/mongoose.config.js';
import Song from '../models/song.model.js';

dotenv.config();

async function migratePageNumbers() {
  await dbConnect();

  const dryRun = process.argv.includes('--dry-run');
  const songs = await Song.find({}, { songName: 1, pageNumber: 1, createdAt: 1 })
    .sort({ createdAt: 1, _id: 1 })
    .lean();
  const assignments = songs.map((song, index) => ({
    ...song,
    nextPageNumber: index + 1,
  }));
  const targets = assignments.filter((song) => (
    song.pageNumber !== song.nextPageNumber
  ));

  let matched = targets.length;
  let modified = 0;

  if (!dryRun && targets.length > 0) {
    const result = await Song.bulkWrite(
      targets.map((song) => ({
        updateOne: {
          filter: { _id: song._id },
          update: { $set: { pageNumber: song.nextPageNumber } },
        },
      }))
    );

    matched = result.matchedCount;
    modified = result.modifiedCount;
  }

  console.log(JSON.stringify({
    mode: dryRun ? 'dry-run' : 'write',
    scanned: songs.length,
    matched,
    modified,
    sequence: songs.length > 0 ? `1-${songs.length}` : 'empty',
  }, null, 2));
}

try {
  await migratePageNumbers();
} finally {
  await mongoose.disconnect();
}
