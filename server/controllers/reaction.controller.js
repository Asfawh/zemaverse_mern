import { isValidObjectId } from 'mongoose';
import Reaction from '../models/reaction.model.js';
import Song from '../models/song.model.js';
import { attachReactionData } from '../services/reaction.service.js';

const validKinds = new Set(['like', 'love']);

async function setReaction(req, res) {
  const { songId } = req.params;
  const { kind } = req.body;

  if (!isValidObjectId(songId)) {
    return res.status(400).json({ message: 'Invalid ZemaVerse identifier.' });
  }

  if (kind !== null && !validKinds.has(kind)) {
    return res.status(422).json({ message: 'Reaction must be like, love, or null.' });
  }

  try {
    const song = await Song.findById(songId).lean();

    if (!song) {
      return res.status(404).json({ message: 'ZemaVerse not found.' });
    }

    if (kind === null) {
      await Reaction.deleteOne({ user: req.userId, song: songId });
    } else {
      await Reaction.findOneAndUpdate(
        { user: req.userId, song: songId },
        { $set: { kind } },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    const [updatedSong] = await attachReactionData([song], req.userId);
    return res.status(200).json(updatedSong);
  } catch (error) {
    console.error('Reaction update failed', error);
    return res.status(500).json({ message: 'The reaction could not be saved.' });
  }
}

async function getFavorites(req, res) {
  try {
    const reactions = await Reaction.find({ user: req.userId })
      .sort({ updatedAt: -1 })
      .populate('song')
      .lean();

    const favoriteRows = reactions
      .filter((reaction) => reaction.song)
      .map((reaction) => ({
        ...reaction.song,
        favoritedAt: reaction.updatedAt,
      }));

    const favorites = await attachReactionData(favoriteRows, req.userId);
    return res.status(200).json(favorites);
  } catch (error) {
    console.error('Favorites could not be loaded', error);
    return res.status(500).json({ message: 'Favorites could not be loaded.' });
  }
}

export { getFavorites, setReaction };
