import React, { useContext, useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import { PlayerContext } from '../context/playerContext';
import { FaPlayCircle, FaRandom, FaRedo } from 'react-icons/fa'; // Importing icons from react-icons

const AlbumPage = ({ album: propAlbum }) => {
  const { id } = useParams();
  const [albumData, setAlbumData] = useState(null);
  const { playWithId, albumsData, songsData } = useContext(PlayerContext);

  useEffect(() => {
    if (albumsData?.length > 0 && id) {
      const foundAlbum = albumsData.find((item) => item._id === id);
      if (foundAlbum) {
        setAlbumData(foundAlbum);
      }
    }
  }, [albumsData, id]);

  // Helper function to calculate total duration of songs in the album
  const calculateTotalDuration = () => {
    if (!songsData || !albumData) return '0 min';

    const filteredSongs = songsData.filter((song) => song.album === albumData.name);
    const totalSeconds = filteredSongs.reduce((acc, song) => {
      const [minutes, seconds] = song.duration.split(':').map(Number);
      return acc + minutes * 60 + seconds;
    }, 0);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} min ${seconds} sec`;
  };

  // Helper function to count the number of songs in the album
  const countSongs = () => {
    if (!songsData || !albumData) return 0;
    return songsData.filter((song) => song.album === albumData.name).length;
  };

  return (
    <>
      <Navbar />
      {albumData ? (
        <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
          {/* Album Image with Play Button Overlay */}
          <div className="relative w-48 h-48">
            <img className="w-full h-full rounded object-cover" src={albumData.image} alt="album" />
            <FaPlayCircle size={40}
              className="absolute  bottom-20 right-20 text-green-500 text-3xl cursor-pointer bg-black bg-opacity-50 rounded-full p-1"
              onClick={() => {
                const firstSongId = songsData.find((song) => song.album === albumData.name)?._id;
                if (firstSongId) playWithId(firstSongId);
              }}
            />
          </div>
          <div className="flex flex-col">
            <p>Playlist</p>
            <h2 className="text-5xl font-bold mb-4 md:text-7xl">{albumData.name}</h2>
            <h4>{albumData.desc}</h4>

            {/* Dynamic Stats */}
            <div className="flex items-center mt-4 text-[#a7a7a7]">
              <div className="flex flex-col">
                <p  className='mb-3' >
                  🚀<b>{countSongs()} songs  </b>,  about {calculateTotalDuration()}
                </p>
                <p>
                  <img src={assets.spotify_logo} className="inline-block w-5 align-middle" alt="Spotify logo" />
                  <b className="ml-1">Spotify </b>
                  💗132,342 likes
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]">
        <p>
          <b className="mr-4">#</b>
          Title
        </p>
        <p>Album</p>
        <p className="hidden sm:block">Date Added</p>
        <img src={assets.clock_icon} alt="clock" className="m-auto w-4" />
      </div>

      <hr className="mb-4" />

      {albumData && songsData && songsData.length > 0 ? (
        songsData
          .filter((song) => song.album === albumData.name)
          .map((item, index) => (
            <div
              onClick={() => playWithId(item._id)}
              className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff26] cursor-pointer"
              key={index}
            >
              <p className="text-white flex items-center">
                <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
                <img src={item.image} className="inline w-10 mr-5" alt="song" />
                {item.name}
              </p>
              <p className="text-[15px]">{albumData.name}</p>
              <p className="text-[15px] hidden sm:block">5 days ago</p>
              <p className="text-[15px] text-center">{item.duration}</p>
            </div>
          ))
      ) : (
        <p className="text-gray-500 p-4">No songs found for this album.</p>
      )}

      {/* Additional Features Section */}
      <div className="mt-8 flex justify-between items-center text-[#a7a7a7]">
        {/* Minimalist Shuffle and Repeat Icons */}
        <div className="flex items-center gap-2">
          <FaRandom
            className="text-lg cursor-pointer hover:text-green-500 transition-colors"
            title="Shuffle"
          />
          <FaRedo
            className="text-lg cursor-pointer hover:text-green-500 transition-colors"
            title="Repeat"
          />
        </div>
        <p className="text-sm">Features: Shuffle, Repeat</p>
      </div>
    </>
  );
};

export default AlbumPage;
