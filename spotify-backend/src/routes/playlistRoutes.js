import express from 'express';
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addSongToPlaylist,
  deletePlaylist,
  getSongsFromPlaylist,
} from '../controllers/playlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/', protect, createPlaylist);
router.get('/', protect, getUserPlaylists);

router.get('/:id', protect, getPlaylistById);
router.delete('/:id', protect, deletePlaylist);
router.get('/:id/songs', protect, getSongsFromPlaylist);


router.post('/add-song', protect, addSongToPlaylist);

export default router;
