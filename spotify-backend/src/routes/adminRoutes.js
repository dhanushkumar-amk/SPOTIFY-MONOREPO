import express from 'express';
import { getDashboardStats, getMonthlyPlayedSongs } from '../controllers/adminStatsController.js';

const router = express.Router();

// Admin Dashboard Stats
router.get('/stats', getDashboardStats);              // GET /api/admin/stats
router.get('/stats/played', getMonthlyPlayedSongs); // GET /api/admin/stats/songs/chart

export default router;
