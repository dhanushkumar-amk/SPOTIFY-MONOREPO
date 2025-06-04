// src/pages/Music.jsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { PlayerContext } from '../context/playerContext';
import { useNavigate } from 'react-router-dom';

const Music = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { url, playWithId } = useContext(PlayerContext);
  const navigate = useNavigate();

  const fetchSongs = async () => {
    try {
      const response = await axios.get(`${url}/api/song/list`);
      if (response.data.success) {
        setSongs(response.data.songs);
      }
    } catch (err) {
      console.error("Failed to fetch songs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleSongClick = (song) => {
  playWithId(song._id);             // ✅ Play the song
    // navigate(`/song/${song._id}`); // Optional: navigate to song detail
  };

  if (loading) return <div className="text-white">Loading songs...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-white mb-4">All Songs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {songs.map(song => (
          <div
            key={song._id}
            onClick={() => handleSongClick(song)}
            className="bg-gray-800 hover:bg-gray-700 cursor-pointer rounded-lg p-4 shadow-md transition-transform hover:scale-105"
          >
            <img
              src={song.image}
              alt={song.title}
              className="w-full h-48 object-cover rounded-md mb-3"
            />
            <h2 className="text-white text-lg font-semibold">{song.name}</h2>
            <p className="text-gray-300 text-sm">{song.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Music;
