import React, { useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./HomePage";

import AlbumPage from './AlbumPage';

import { useContext } from 'react';
import { PlayerContext } from '../context/playerContext';
import PlayedHistory from './PlayedHistory';
import Music from './Music';
import AlbumOnly from './AlbumOnly';
import PlaylistPage from './PlaylistPage';
import Profile from './Profile';
import PlayList from './Playlist'




const DisplayComponents = ({ isSidebarExpanded }) => {

    const {albumsData} = useContext(PlayerContext)

    const displayRef = useRef();
    const location = useLocation();
    const isAlbum = location.pathname.includes('album');
    const albumId = isAlbum ? location.pathname.split("/").pop() : "";
    const bgColor = isAlbum && albumsData.length > 0 ? albumsData.find((x) => (x._id == albumId )).bgColour : "#121212"

    useEffect(() => {
     if(isAlbum){
        displayRef.current.style.background = `linear-gradient(90deg, ${bgColor} 0%, rgba(18, 18, 18, 0.8) 100%)`;
     }else{
        displayRef.current.style.background = '#121212';
     }
    })


  return (
    <div ref={displayRef}
      className={`m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto transition-all duration-300 ${
        isSidebarExpanded ? 'lg:w-[80%]' : 'lg:w-[88%]'
      } w-[100%]`}
    >

        {albumsData.length > 0 ?

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/album/:id" album={albumsData.find((x) => (x._id == albumId))} element={<AlbumPage />} />
        <Route path='/history' element={<PlayedHistory/>} />
        <Route path='/playlist' element={<PlayList/>} />
          <Route path="/playlist/:id" element={<PlaylistPage />} />
        <Route path='/music' element={<Music/>} />
        <Route path='/collection' element={<AlbumOnly/>} />
        <Route path='/profile' element={<Profile/>} />
      </Routes>
      : null
        }
    </div>
  );
};

export default DisplayComponents;
