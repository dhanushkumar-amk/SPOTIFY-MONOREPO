import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { PlayerContext } from '../context/playerContext';
import toast from 'react-hot-toast';

// Add this array somewhere at the top of your component file
const emojis = ['🎵', '🎶', '🎸', '🎤', '🥁', '🎻', '🎧', '📀', '🎹', '🎷'];

// Helper function to get a random emoji
const getRandomEmoji = () => {
  return emojis[Math.floor(Math.random() * emojis.length)];
};


const PlaylistPage = () => {
  const { id } = useParams(); // playlist id from URL
  const { url, token, playWithId } = useContext(PlayerContext);

  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loadingPlaylist, setLoadingPlaylist] = useState(false);
  const [loadingSongs, setLoadingSongs] = useState(false);

  // Fetch playlist details (name, description)
  useEffect(() => {
    const fetchPlaylist = async () => {
      setLoadingPlaylist(true);
      try {
        const res = await fetch(`${url}/api/playlist/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setPlaylist(data.playlist);
        } else {
          toast.error(data.error || 'Failed to load playlist details');
        }
      } catch (error) {
        console.error('Fetch playlist error:', error);
        toast.error('Something went wrong while loading playlist details');
      }
      setLoadingPlaylist(false);
    };

    fetchPlaylist();
  }, [id, url, token]);

  // Fetch songs in the playlist
  useEffect(() => {
    const fetchSongs = async () => {
      setLoadingSongs(true);
      try {
        const res = await fetch(`${url}/api/playlist/${id}/songs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setSongs(data.songs || []);
        } else {
          toast.error(data.error || 'Failed to load songs');
        }
      } catch (error) {
        console.error('Fetch songs error:', error);
        toast.error('Something went wrong while loading songs');
      }
      setLoadingSongs(false);
    };

    fetchSongs();
  }, [id, url, token]);



  if (loadingPlaylist || loadingSongs) {
    return <p className="text-gray-400">Loading playlist...</p>;
  }

  if (!playlist) {
    return <p className="text-gray-400">Playlist not found.</p>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto text-white">
      <h1 className="text-4xl font-bold mb-4">{playlist.name}</h1>
      <p className="mb-6 text-gray-400">{playlist.description || 'No description'}</p>

      <h2 className="text-2xl font-semibold mb-2">Songs</h2>
      {songs.length === 0 ? (
        <p className="text-gray-400">No songs in this playlist.</p>
      ) : (
       <ul>
  {songs.map((song) => (
    <li onClick={() => playWithId(song._id)}  key={song._id} className="mb-4 flex items-center space-x-4">
      {/* Song Image */}
      <div className="w-16 h-16 flex items-center justify-center rounded text-4xl">
                {getRandomEmoji()}
              </div>

      {/* Song details */}
      <div>
        <p className="font-medium">{song.name}</p>
        <p className="text-sm text-gray-400">{song.album}</p>
        {/* <p className="text-xs text-gray-500">{formatDuration(song.duration)}</p> */}
      </div>
    </li>
  ))}
</ul>

      )}
    </div>
  );
};

export default PlaylistPage;
