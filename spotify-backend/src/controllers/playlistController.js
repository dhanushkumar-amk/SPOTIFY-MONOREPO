import Playlist from '../models/playlistModel.js';
import Song from '../models/songModel.js';
import redisClient from '../config/redis.js';

// Helper: Generate cache keys
const getCacheKey = {
  userPlaylists: (userId) => `user_playlists:${userId}`,
  playlistById: (userId, playlistId) => `playlist:${userId}:${playlistId}`,
  playlistSongs: (userId, playlistId) => `playlist_songs:${userId}:${playlistId}`,
};

// @desc    Create new playlist
// @route   POST /api/playlists
// @access  Private
export const createPlaylist = async (req, res) => {
  const userId = req.user?.id;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Playlist name is required' });
  }

  try {
    const newPlaylist = new Playlist({
      name,
      description,
      createdBy: userId,
      songs: [],
    });

    await newPlaylist.save();

    // Invalidate cache
    await redisClient.del(getCacheKey.userPlaylists(userId));

    res.status(201).json({
      message: '🎉 Playlist created successfully!',
      playlist: newPlaylist,
    });
  } catch (error) {
    console.error('❌ Create Playlist Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc    Get all playlists of the logged-in user
// @route   GET /api/playlists
// @access  Private
export const getUserPlaylists = async (req, res) => {
  const userId = req.user?.id;
  const cacheKey = getCacheKey.userPlaylists(userId);

  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json({ playlists: JSON.parse(cached), cached: true });
    }

    const playlists = await Playlist.find({ createdBy: userId }).populate('songs', 'title artist duration');
    await redisClient.set(cacheKey, JSON.stringify(playlists), 'EX', 600);

    res.status(200).json({ playlists, cached: false });
  } catch (error) {
    console.error('❌ Fetch Playlists Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc    Get a specific playlist by ID (only if it belongs to the user)
// @route   GET /api/playlists/:id
// @access  Private
export const getPlaylistById = async (req, res) => {
  const userId = req.user?.id;
  const playlistId = req.params.id;
  const cacheKey = getCacheKey.playlistById(userId, playlistId);

  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json({ playlist: JSON.parse(cached), cached: true });
    }

    const playlist = await Playlist.findOne({ _id: playlistId, createdBy: userId })
      .populate('songs', 'name artist duration');

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found or unauthorized' });
    }

    await redisClient.set(cacheKey, JSON.stringify(playlist), 'EX', 600);
    res.status(200).json({ playlist, cached: false });
  } catch (error) {
    console.error('❌ Get Playlist Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc    Add song to playlist (only if owned by the user)
// @route   POST /api/playlists/add-song
// @access  Private
export const addSongToPlaylist = async (req, res) => {
  const userId = req.user?.id;
  const { playlistId, songId } = req.body;

  if (!playlistId || !songId) {
    return res.status(400).json({ error: 'Playlist ID and Song ID are required' });
  }

  try {
    const playlist = await Playlist.findOne({ _id: playlistId, createdBy: userId });

    if (!playlist) {
      return res.status(403).json({ error: 'Unauthorized or Playlist not found' });
    }

    if (playlist.songs.includes(songId)) {
      return res.status(400).json({ error: 'Song already in playlist' });
    }

    playlist.songs.push(songId);
    await playlist.save();

    // Invalidate relevant caches
    await redisClient.del([
      getCacheKey.playlistSongs(userId, playlistId),
      getCacheKey.playlistById(userId, playlistId),
      getCacheKey.userPlaylists(userId)
    ]);

    res.status(200).json({ message: '🎵 Song added to playlist!', playlist });
  } catch (error) {
    console.error('❌ Add Song Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc    Delete a playlist by ID (only if it belongs to the user)
// @route   DELETE /api/playlists/:id
// @access  Private
export const deletePlaylist = async (req, res) => {
  const userId = req.user?.id;
  const playlistId = req.params.id;

  try {
    const playlist = await Playlist.findOne({ _id: playlistId, createdBy: userId });

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found or unauthorized' });
    }

    await Playlist.findByIdAndDelete(playlistId);

    // Invalidate relevant caches
    await redisClient.del([
      getCacheKey.userPlaylists(userId),
      getCacheKey.playlistById(userId, playlistId),
      getCacheKey.playlistSongs(userId, playlistId)
    ]);

    res.status(200).json({ message: '🗑️ Playlist deleted successfully' });
  } catch (error) {
    console.error('❌ Delete Playlist Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc    Get songs from playlist (with cache)
// @route   GET /api/playlists/:id/songs
// @access  Private
export const getSongsFromPlaylist = async (req, res) => {
  const userId = req.user?.id;
  const playlistId = req.params.id;
  const cacheKey = getCacheKey.playlistSongs(userId, playlistId);

  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json({ songs: JSON.parse(cached), cached: true });
    }

    const playlist = await Playlist.findOne({ _id: playlistId, createdBy: userId })
      .populate('songs', 'name duration album imageUrl');

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found or unauthorized' });
    }

    const songs = playlist.songs;
    await redisClient.set(cacheKey, JSON.stringify(songs), 'EX', 600);

    res.status(200).json({ songs, cached: false });
  } catch (error) {
    console.error('❌ Get Songs From Playlist Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
