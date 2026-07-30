import Reaction from '../models/reaction.model.js';

function emptyCounts() {
  return { like: 0, love: 0 };
}

async function attachReactionData(songDocuments, userId = null) {
  const songs = songDocuments.map((song) => (
    typeof song.toObject === 'function' ? song.toObject() : song
  ));
  const songIds = songs.map((song) => song._id);

  if (songIds.length === 0) {
    return songs;
  }

  const [countRows, userRows] = await Promise.all([
    Reaction.aggregate([
      { $match: { song: { $in: songIds } } },
      {
        $group: {
          _id: { song: '$song', kind: '$kind' },
          count: { $sum: 1 },
        },
      },
    ]),
    userId
      ? Reaction.find({ user: userId, song: { $in: songIds } }).lean()
      : Promise.resolve([]),
  ]);

  const countsBySong = new Map();
  countRows.forEach((row) => {
    const songId = row._id.song.toString();
    const counts = countsBySong.get(songId) || emptyCounts();
    counts[row._id.kind] = row.count;
    countsBySong.set(songId, counts);
  });

  const userReactionBySong = new Map(
    userRows.map((reaction) => [reaction.song.toString(), reaction.kind])
  );

  return songs.map((song) => {
    const songId = song._id.toString();

    return {
      ...song,
      reactionCounts: countsBySong.get(songId) || emptyCounts(),
      userReaction: userReactionBySong.get(songId) || null,
    };
  });
}

export { attachReactionData };
