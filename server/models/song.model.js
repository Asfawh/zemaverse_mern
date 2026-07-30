import { model, Schema } from 'mongoose';
import { ZEMAVERSE_GENRES } from '../config/genres.js';

const LyricsVersionSchema = new Schema(
  {
    language: { type: String, required: true, trim: true, maxLength: 80 },
    languageCode: { type: String, required: true, trim: true, lowercase: true, maxLength: 12 },
    title: { type: String, trim: true, maxLength: 160 },
    text: { type: String, required: true },
  },
  { _id: false }
);
const SongSchema = new Schema(
  {
    songName: {
      type: String,
      required: [true, 'Song title is required.'],
      minLength: [2, 'Song title must be at least 2 characters long.'],
      maxLength: [160, 'Song name must be less than 160 characters long.'],
    },
    artistName: String,
    fileName: String,
    source: {
      type: String,
      maxLength: [200, 'Source attribution must be less than 200 characters long.'],
    },
    pageNumber: {
      type: Number,
      min: [1, 'Song number must be at least 1.'],
      validate: {
        validator: Number.isInteger,
        message: 'Song number must be a whole number.',
      },
    },

    genre: {
      type: String,
      required: [true, 'Genre is required.'],
      enum: {
        values: ZEMAVERSE_GENRES,
        message: 'Choose a valid Ethiopian genre.',
      },
    },
    verses: {
      type: String,
      default: '',
    },
    primaryLanguage: { type: String, required: true, default: 'Amharic', trim: true },
    primaryLanguageCode: { type: String, required: true, default: 'am', trim: true, lowercase: true },
    lyrics: {
      type: [LyricsVersionSchema],
      default: [],
    },
    externalOnly: { type: Boolean, default: false },
    externalSourceUrl: { type: String, trim: true, maxLength: 500 },
    rightsStatus: {
      type: String,
      enum: ['original', 'authorized', 'metadata-only'],
      default: 'original',
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },

  { timestamps: true, collection: 'zemaverse_songs' }
);
const Song = model('Song', SongSchema);
export default Song;
