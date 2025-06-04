import songModel from './../models/songModel.js';
import albumModel from './../models/albumModel.js';

export const searchAll = async (req, res) => {
  const query = req.query.q;

  if (!query) return res.status(400).json({ error: 'Query parameter q is required' });

  try {
    const songResults = await songModel.find({
      name : { $regex: query, $options: 'i' }
    }).limit(10);

    const albumResults = await albumModel.find({
      name: { $regex: query, $options: 'i' }
    }).limit(10);

    return res.status(200).json({
      songs: songResults,
      albums: albumResults
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
