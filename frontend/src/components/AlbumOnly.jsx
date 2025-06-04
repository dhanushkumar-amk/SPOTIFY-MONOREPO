// src/pages/AlbumOnly.jsx
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { PlayerContext } from '../context/playerContext';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate

const AlbumOnly = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const { url } = useContext(PlayerContext);
  const navigate = useNavigate(); // ✅ Initialize navigate

  const fetchAlbums = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      if (response.data.success) {
        setAlbums(response.data.albums);
      }
    } catch (err) {
      console.error("Failed to fetch albums:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  if (loading) return <div className="text-white">Loading albums...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Albums</h1>
      <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-5 gap-6">
        {albums.map(album => (
          <div
            key={album._id}
            onClick={() => navigate(`/album/${album._id}`)} // ✅ Navigate to album detail
            className="rounded-lg shadow-lg p-4 cursor-pointer hover:scale-105 transition-transform"
            style={{ backgroundColor: album.bgColour || '#1e1e1e' }}
          >
            <img
              src={album.image}
              alt={album.name}
              className="w-full h-48 object-cover rounded-md mb-3"
            />
            <h2 className="text-white text-lg font-semibold">{album.name}</h2>
            <p className="text-gray-300 text-sm">{album.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumOnly;
