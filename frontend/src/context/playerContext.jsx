// context/playerContext.js
import { createContext, useEffect, useRef, useState } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';



export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const url = "https://spotify-monorepo-t5km.onrender.com";
  const [songsData, setSongsData] = useState([]);
  const [albumsData, setAlbumData] = useState([]);




  const [token, setToken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if a token exists in localStorage on app load
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);


  // Login function
  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken); // Save token to localStorage
    setToken(newToken);
    setIsLoggedIn(true);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    setToken('');
    setIsLoggedIn(false);
  };

  const getSongsData = async () => {
    try {
      const response = await axios.get(`${url}/api/song/list`);
      setSongsData(response.data.songs);
      if (response.data.songs.length > 0) {
        setTrack(response.data.songs[0]);
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const getAlbumsData = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      setAlbumData(response.data.albums);
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  useEffect(() => {
    getSongsData();
    getAlbumsData();
  }, []);

  // Audio & Seekbar Refs
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  // Track State
  const [track, setTrack] = useState(null);

  // Play Status
  const [playStatus, setPlayStatus] = useState(false);

  // Time Tracker
  const [time, setTime] = useState({
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 }
  });

  // Shuffle Mode
  const [shuffle, setShuffle] = useState(
    localStorage.getItem("shuffle") === "true"
  );

  // Volume
  const [volume, setVolume] = useState(
    parseFloat(localStorage.getItem("player_volume")) || 0.7
  );

  // Played Songs History (with timestamp)
  const [playedHistory, setPlayedHistory] = useState(() => {
    const saved = localStorage.getItem("played_history");
    return saved ? JSON.parse(saved) : [];
  });

  // Sync volume with localStorage
  useEffect(() => {
    localStorage.setItem("player_volume", volume.toString());
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Sync playedHistory with localStorage
  useEffect(() => {
    localStorage.setItem("played_history", JSON.stringify(playedHistory));
  }, [playedHistory]);

  // Persist current track and duration in localStorage
  useEffect(() => {
    if (track) {
      localStorage.setItem("current_track", JSON.stringify(track));
    }
  }, [track]);

  useEffect(() => {
    const currentTime = time.currentTime.minute * 60 + time.currentTime.second;
    localStorage.setItem("current_duration", currentTime.toString());
  }, [time.currentTime]);

  // Restore last played song and duration on component mount
  useEffect(() => {
    const savedTrack = localStorage.getItem("current_track");
    const savedDuration = localStorage.getItem("current_duration");

    if (savedTrack && songsData.length > 0) {
      const parsedTrack = JSON.parse(savedTrack);
      const foundTrack = songsData.find(song => song._id === parsedTrack._id);

      if (foundTrack) {
        setTrack(foundTrack);

        if (savedDuration) {
          const duration = parseInt(savedDuration, 10);
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.currentTime = duration;
            }
          }, 0);
        }
      }
    }
  }, [songsData]);

  // Play / Pause
  const play = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setPlayStatus(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayStatus(false);
    }
  };


  const incrementPlayCount = async (songId) => {
  try {
    await axios.put(`${url}/api/songs/${songId}`);
    console.log("Play count updated for song:", songId);
  } catch (error) {
    console.error("Failed to update play count:", error);
  }
};

  // Play by ID
  const playWithId = (id) => {
    const nextTrack = songsData.find(song => song._id === id);
    if (nextTrack) {
      setTrack(nextTrack);
       // Increment play count
    incrementPlayCount(id);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(err => console.error("Playback failed:", err));
          setPlayStatus(true);
        }
      }, 0);
    }
  };

  // Previous Song
  const previousSong = () => {
    let index = songsData.findIndex(song => song._id === track?._id);

    if (shuffle && songsData.length > 1) {
      let newIndex = index;
      while (newIndex === index) {
        newIndex = Math.floor(Math.random() * songsData.length);
      }
      setTrack(songsData[newIndex]);
      incrementPlayCount(newIndex);
      addPlayedSong(newIndex);
    } else if (index > 0) {
      setTrack(songsData[index - 1]);
      addPlayedSong(index - 1);
    }

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
        setPlayStatus(true);
      }
    }, 0);
  };

  // Next Song
  const nextSong = () => {
    let index = songsData.findIndex(song => song._id === track?._id);

    let newIndex;

    if (shuffle && songsData.length > 1) {
      const maxAttempts = 10;
      let attempts = 0;
      do {
        newIndex = Math.floor(Math.random() * songsData.length);
        attempts++;
      } while (
        newIndex === index ||
        playedHistory.some((item) => item.index === newIndex) &&
        attempts < maxAttempts
      );

      if (newIndex === index) {
        newIndex = (index + 1) % songsData.length;
      }
    } else if (index < songsData.length - 1) {
      newIndex = index + 1;
    } else {
      return;
    }

    // Set new track first
    setTrack(songsData[newIndex]);
    incrementPlayCount(newIndex);

    // Then add to history
    addPlayedSong(newIndex);

    // Then play
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
        setPlayStatus(true);
      }
    }, 0);
  };

  // Add song to played history
  const addPlayedSong = (index) => {
    const newEntry = {
      index,
      timestamp: new Date().toISOString()
    };

    const updatedHistory = [...playedHistory, newEntry];

    if (updatedHistory.length > 20) {
      updatedHistory.shift(); // Keep only last 20 entries
    }

    setPlayedHistory(updatedHistory);
  };

  // Seek Song
  const seekSong = (e) => {
    if (!audioRef.current || !seekBg.current) return;
    const clickPosition = e.nativeEvent.offsetX;
    const totalWidth = seekBg.current.offsetWidth;
    const duration = audioRef.current.duration;
    const newTime = (clickPosition / totalWidth) * duration;
    audioRef.current.currentTime = newTime;
  };

  // Keyboard shortcut: K to toggle play/pause
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key.toLowerCase() === 'k') {
//         e.preventDefault();
//         if (playStatus) pause();
//         else play();
//       }
//     };
//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [playStatus]);

  // Update time and seek bar
  useEffect(() => {
    const updateProgress = () => {
      if (!audioRef.current || !seekBar.current) return;

      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      seekBar.current.style.width = `${progress}%`;

      setTime({
        currentTime: {
          second: Math.floor(audioRef.current.currentTime % 60),
          minute: Math.floor(audioRef.current.currentTime / 60)
        },
        totalTime: {
          second: Math.floor(audioRef.current.duration % 60),
          minute: Math.floor(audioRef.current.duration / 60)
        }
      });
    };

    const interval = setInterval(() => {
      if (audioRef.current && !audioRef.current.paused) updateProgress();
    }, 1000);

    if (audioRef.current) {
      audioRef.current.ontimeupdate = updateProgress;
    }

    // Automatically play next song when current song ends
    const handleEnded = () => {
      nextSong();
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleEnded);
    }

    return () => {
      clearInterval(interval);
      if (audioRef.current) {
        audioRef.current.ontimeupdate = null;
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [songsData, track]);

  const contextValue = {
    audioRef,
    seekBg,
    seekBar,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    previousSong,
    nextSong,
    seekSong,
    songsData,
    albumsData,
    shuffle,
    setShuffle,
    volume,
    setVolume,
    playedHistory,
    setPlayedHistory,
    token,
    isLoggedIn,
    handleLogin,
    handleLogout,
     url,

  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
