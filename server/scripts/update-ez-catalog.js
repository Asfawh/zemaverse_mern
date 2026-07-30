import mongoose from 'mongoose';
import Song from '../models/song.model.js';
import User from '../models/user-model.js';
import dbConnect from '../config/mongoose.config.js';

await dbConnect();

const metadataResult = await Song.updateMany(
  { rightsStatus: 'metadata-only' },
  { $set: { source: 'EZ-metadata', genre: 'Ethio-Pop' } }
);

await Song.updateOne(
  { pageNumber: 1 },
  { $set: { genre: 'Traditional Ethiopian' } }
);
await Song.updateOne(
  { pageNumber: 2 },
  { $set: { genre: 'Tizita' } }
);

const editorPassword = process.env.EDITOR_PASSWORD;
if (!editorPassword) throw new Error('EDITOR_PASSWORD is required');

let editor = await User.findOne({ username: 'cho' });
if (!editor) {
  editor = new User({
    username: 'cho',
    email: 'cho@zemaverse.com',
    password: editorPassword,
  });
} else {
  editor.password = editorPassword;
}
await editor.save();

console.log(JSON.stringify({
  metadataMatched: metadataResult.matchedCount,
  metadataUpdated: metadataResult.modifiedCount,
  editor: editor.username,
}, null, 2));

await mongoose.disconnect();
