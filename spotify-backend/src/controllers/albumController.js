// controllers/albumController.js

import { v2 as cloudinary } from 'cloudinary';
import albumModel from '../models/albumModel.js';

// Import Redis client
import redisClient from '../config/redis.js';

// Promisify Redis methods
const getAsync = redisClient.get.bind(redisClient);
const setexAsync = redisClient.setex.bind(redisClient);
const delAsync = redisClient.del.bind(redisClient);

const addAlbum = async (req, res) => {
    try {
        const name = req.body.name;
        const desc = req.body.desc;
        const bgColour = req.body.bgColour;
        const imageFile = req.file;

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: "image",
        });

        const albumData = {
            name,
            desc,
            bgColour,
            image: imageUpload.secure_url,
        };

        const album = new albumModel(albumData);
        await album.save();

        // Clear Redis cache
        await delAsync('albums:all');

        res.json({ success: true, message: "Album Added" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const listAlbum = async (req, res) => {
    const cacheKey = 'albums:all'; // Redis key for storing all albums

    try {
        // Try to get from Redis first
        const cachedAlbums = await getAsync(cacheKey);
        if (cachedAlbums) {
            return res.json({
                success: true,
                albums: JSON.parse(cachedAlbums),
                source: 'cache'
            });
        }

        // Not in cache, fetch from MongoDB
        const allAlbums = await albumModel.find({});

        // Store in Redis for next time (1 hour)
        await setexAsync(cacheKey, 3600, JSON.stringify(allAlbums));

        res.json({
            success: true,
            albums: allAlbums,
            source: 'database'
        });

    } catch (error) {
        console.error('Redis/Mongo Error:', error);
        res.json({ success: false, message: error.message });
    }
};

const removeAlbum = async (req, res) => {
    try {
        await albumModel.findByIdAndDelete(req.body.id);

        // Clear Redis cache
        await delAsync('albums:all');

        res.json({ success: true, message: "Album Removed" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const updateAlbum = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: "Album ID is required" });
        }

        const updateData = {};

        // Only include fields that are provided
        if (req.body.name) updateData.name = req.body.name;
        if (req.body.desc) updateData.desc = req.body.desc;
        if (req.body.bgColour) updateData.bgColour = req.body.bgColour;

        // Handle image upload if provided
        if (req.file) {
            const imageUpload = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "image",
            });
            updateData.image = imageUpload.secure_url;
        }

        // Find and update the album
        const updatedAlbum = await albumModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedAlbum) {
            return res.status(404).json({ success: false, message: "Album not found" });
        }

        // Clear Redis cache
        await delAsync('albums:all');

        res.json({ success: true, message: "Album Updated", album: updatedAlbum });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addAlbum, listAlbum, removeAlbum, updateAlbum };
