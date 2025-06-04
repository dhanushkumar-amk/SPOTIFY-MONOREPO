import express from 'express';
import { addSong, listSong, removeSong, updateSong, playSong } from '../controllers/songController.js';
import upload from '../middleware/multer.js';

const songRouter = express.Router()

songRouter.post('/add', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), addSong);
songRouter.get('/list',listSong);
songRouter.post('/remove',removeSong)
songRouter.put('/songs/:songId', playSong);
// songRouter.get('/download/:id', downloadSongById);
songRouter.post('/update', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), updateSong);


export default songRouter;
