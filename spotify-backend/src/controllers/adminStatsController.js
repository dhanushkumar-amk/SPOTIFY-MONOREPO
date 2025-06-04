import User from '../models/userModel.js';
import Song from '../models/songModel.js';
import Album from '../models/albumModel.js';

export const getDashboardStats = async (req, res) => {
    try {
        const [totalUsers, totalSongs, totalAlbums] = await Promise.all([
            User.countDocuments(),
            Song.countDocuments(),
            Album.countDocuments()
        ]);

        res.status(200).json({
            success: true,
            data: {
                users: totalUsers,
                songs: totalSongs,
                albums: totalAlbums
            }
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getMonthlyPlayedSongs = async (req, res) => {
    try {
        const chartData = await Song.aggregate([
            {
                $match: { playCount: { $gt: 0 } } // Only songs that were played
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m", date: "$updatedAt" }
                        // Or use a separate field like lastPlayed if available
                    },
                    totalPlays: { $sum: "$playCount" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        const labels = chartData.map(item => item._id);
        const data = chartData.map(item => item.totalPlays);

        res.status(200).json({
            success: true,
            data: {
                labels,
                data
            }
        });
    } catch (error) {
        console.error("Error fetching monthly song plays:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
