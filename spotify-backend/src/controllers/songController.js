// controllers/songController.js

import { v2 as cloudinary } from 'cloudinary';
import songModel from '../models/songModel.js';

// Only import Redis client for listSong caching
import redisClient from '../config/redis.js';

// Promisify Redis methods for async/await
const getAsync = redisClient.get.bind(redisClient);
const setexAsync = redisClient.setex.bind(redisClient);
const delAsync = redisClient.del.bind(redisClient); // 👈 Add this for cache invalidation

const addSong = async (req, res) => {
    try {
        const name = req.body.name;
        const desc = req.body.desc;
        const album = req.body.album;
        const audioFile = req.files.audio[0];
        const imageFile = req.files.image[0];

        const audioUpload = await cloudinary.uploader.upload(audioFile.path, { resource_type: "video" });
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(audioUpload.duration % 60)}`;

        const songData = {
            name,
            desc,
            album,
            image: imageUpload.secure_url,
            file: audioUpload.secure_url,
            duration
        };

        const song = new songModel(songData);
        await song.save();

        // Clear Redis cache
        await delAsync('songs:all');

        res.json({ success: true, message: "Song Added" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const listSong = async (req, res) => {
    const cacheKey = 'songs:all'; // Redis key for storing the full song list

    try {
        // Try to get from Redis first
        const cachedSongs = await getAsync(cacheKey);
        if (cachedSongs) {
            return res.json({
                success: true,
                songs: JSON.parse(cachedSongs),
                source: 'cache'
            });
        }

        // Not in cache, fetch from MongoDB
        const allSongs = await songModel.find({});

        // Store in Redis for next time (e.g., 1 hour)
        await setexAsync(cacheKey, 3600, JSON.stringify(allSongs));

        res.json({
            success: true,
            songs: allSongs,
            source: 'database'
        });

    } catch (error) {
        console.error('Redis/Mongo Error:', error);
        res.json({ success: false, message: error.message });
    }
};

const removeSong = async (req, res) => {
    try {
        await songModel.findByIdAndDelete(req.body.id);

        // Clear Redis cache
        await delAsync('songs:all');

        res.json({ success: true, message: "Song Removed" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const updateSong = async (req, res) => {
    try {
        const { id } = req.body;
        const updateData = {};

        // Only include fields if they are present in the request
        if (req.body.name) updateData.name = req.body.name;
        if (req.body.desc) updateData.desc = req.body.desc;
        if (req.body.album) updateData.album = req.body.album;

        // Handle image upload (if provided)
        if (req.files?.image) {
            const imageFile = req.files.image[0];
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image",
            });
            updateData.image = imageUpload.secure_url;
        }

        // Handle audio upload (if provided)
        if (req.files?.audio) {
            const audioFile = req.files.audio[0];
            const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
                resource_type: "video", // or 'auto' depending on your needs
            });

            updateData.file = audioUpload.secure_url;
            updateData.duration = `${Math.floor(audioUpload.duration / 60)}:${String(
                Math.floor(audioUpload.duration % 60)
            ).padStart(2, "0")}`;
        }

        // Validate ID is provided
        if (!id) {
            return res.status(400).json({ success: false, message: "Song ID is required" });
        }

        // Find and update song
        const updatedSong = await songModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedSong) {
            return res.status(404).json({ success: false, message: "Song not found" });
        }

        // Clear Redis cache
        await delAsync('songs:all');

        res.json({ success: true, message: "Song updated successfully", song: updatedSong });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

 const playSong = async (req, res) => {
    const { songId } = req.params;

    try {
        const song = await Song.findById(songId);
        if (!song) return res.status(404).json({ success: false, message: 'Song not found' });

        song.playCount += 1;
        await song.save();

        res.status(200).json({ success: true, playCount: song.playCount });
    } catch (error) {
        console.error('Error playing song:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};




export { addSong, listSong, removeSong, updateSong, playSong };
