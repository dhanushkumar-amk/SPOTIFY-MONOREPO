import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { PlayerContext } from '../context/playerContext';
import { FaRegListAlt } from 'react-icons/fa';
import { HiX, HiDownload } from 'react-icons/hi'; // Added Download Icon
import axios from 'axios';
import toast from 'react-hot-toast';

const Player = () => {
  const {
    seekBg,
    seekBar,
    play,
    pause,
    playStatus,
    track,
    time,
    previousSong,
    nextSong,
    seekSong,
    volume,
    setVolume,
    shuffle,
    setShuffle,
    audioRef,
    url
  } = useContext(PlayerContext);

  const [isBuffering, setIsBuffering] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const audio = track ? document.querySelector('audio') : null;
    if (!audio) return;

    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);

    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);

    return () => {
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
    };
  }, [track]);

  const fetchPlaylists = async () => {
    try {
      const res = await axios.get(`${url}/api/playlist`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = res.data;
      if (Array.isArray(data)) {
        setPlaylists(data);
      } else if (Array.isArray(data.playlists)) {
        setPlaylists(data.playlists);
      } else {
        console.error('Unexpected playlist response:', data);
        setPlaylists([]);
      }

      setShowPlaylists(true);
    } catch (error) {
      console.error('Failed to load playlists:', error);
      setPlaylists([]);
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await axios.post(
        `${url}/api/playlist/add-song`,
        { playlistId, songId: track._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Song added to playlist!');
      setShowPlaylists(false);
    } catch (error) {
      console.error('Error adding song:', error.response?.data || error.message || error);
      toast.error(error.response?.data?.error || 'Failed to add song to playlist');
    }
  };

const handleDownload = async (track) => {
  if (!track?.file) {
    toast.error("No file URL found.");
    return;
  }

  try {
    const response = await fetch(track.file);
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${track.name || 'audio'}.mp3`; // Fallback name
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url); // Clean up memory

    toast.success("Download started!");
  } catch (err) {
    console.error("Download error:", err);
    toast.error("Failed to download the song.");
  }
};


  return track ? (
    <>
      <audio ref={audioRef} src={track.file} preload="auto" />

      <div className="h-[10%] bg-black flex justify-between items-center text-white px-4 relative">
        {/* Left: Song Info */}
        <div className="hidden lg:flex items-center gap-4">
          <img src={track.image} className="w-12 rounded" alt="song" />
          <div>
            <p>{track.name}</p>
            <p className="text-sm opacity-75">{track.author}</p>
          </div>
        </div>

        {/* Center: Controls */}
        <div className="flex flex-col items-center gap-1 m-auto">
          <div className="flex gap-4">
            <img
              onClick={() => setShuffle(!shuffle)}
              src={assets.shuffle_icon}
              alt="shuffle"
              className={`w-4 cursor-pointer ${shuffle ? 'opacity-100' : 'opacity-50'}`}
            />
            <img onClick={previousSong} src={assets.prev_icon} alt="prev" className="w-4 cursor-pointer" />
            {playStatus ? (
              <img onClick={pause} src={assets.pause_icon} alt="pause" className="w-4 cursor-pointer" />
            ) : (
              <img onClick={play} src={assets.play_icon} alt="play" className="w-4 cursor-pointer" />
            )}
            <img onClick={nextSong} src={assets.next_icon} alt="next" className="w-4 cursor-pointer" />
            <img src={assets.loop_icon} alt="loop" className="w-4 cursor-pointer" />
          </div>

          {/* Seek Bar */}
          <div className="flex items-center gap-5 w-full max-w-md">
            <p className="text-xs">
              {time.currentTime.minute}:{String(time.currentTime.second).padStart(2, '0')}
            </p>
            <div
              ref={seekBg}
              onClick={seekSong}
              className="flex-grow mt-1 w-80 h-1 bg-gray-300 rounded-full cursor-pointer"
            >
              <hr
                ref={seekBar}
                className="h-1 border-none bg-green-500 rounded-full"
                style={{ width: '0%' }}
              />
            </div>
            <p className="text-xs">
              {time.totalTime.minute}:{String(time.totalTime.second).padStart(2, '0')}
            </p>
          </div>
          {isBuffering && <p className="text-xs text-gray-400">Buffering...</p>}
        </div>

        {/* Right: Volume + Playlist + Download */}
        <div className="hidden lg:flex items-center gap-4">
          <img src={assets.volume_icon} alt="volume" className="w-4" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-1 accent-green-500"
          />
          <div className="flex items-center gap-4">
            <FaRegListAlt
              className="text-xl cursor-pointer"
              title="Add to Playlist"
              onClick={fetchPlaylists}
            />
            <HiDownload
              className={`text-xl ${track ? 'cursor-pointer text-white' : 'opacity-50 cursor-not-allowed'}`}
              title={track ? "Download Song" : "No track available"}
              onClick={() => track && handleDownload(track)}
            />
          </div>
        </div>

        {/* Playlist Modal */}
        {showPlaylists && (
          <div className="absolute bottom-24 right-4 bg-white text-black rounded-lg shadow-xl p-4 z-50 w-72">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-base text-gray-800">Select Playlist</h4>
              <HiX
                className="text-2xl text-gray-500 hover:text-red-500 cursor-pointer"
                onClick={() => setShowPlaylists(false)}
              />
            </div>
            {playlists.length > 0 ? (
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {playlists.map((pl) => (
                  <li
                    key={pl._id}
                    onClick={() => handleAddToPlaylist(pl._id)}
                    className="cursor-pointer px-3 py-2 bg-gray-100 hover:bg-green-100 rounded-md text-sm font-medium"
                  >
                    {pl.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No playlists found.</p>
            )}
          </div>
        )}
      </div>
    </>
  ) : null;
};

export default Player;
