import { model, Schema } from 'mongoose';

const reactionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    song: {
      type: Schema.Types.ObjectId,
      ref: 'Song',
      required: true,
    },
    kind: {
      type: String,
      enum: ['like', 'love'],
      required: true,
    },
  },
  { timestamps: true, collection: 'zemaverse_reactions' }
);

reactionSchema.index({ user: 1, song: 1 }, { unique: true });
reactionSchema.index({ song: 1, kind: 1 });
reactionSchema.index({ user: 1, updatedAt: -1 });

const Reaction = model('Reaction', reactionSchema);

export default Reaction;
