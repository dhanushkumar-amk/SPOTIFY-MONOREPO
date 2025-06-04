// models/playlistModel.js
import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'song',
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Playlist', playlistSchema);
