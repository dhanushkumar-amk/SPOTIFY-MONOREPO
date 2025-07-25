import React from 'react';import {assets} from '../../assets/assets';
import {NavLink, Link} from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className='bg-[#003A10] min-h-screen pl-[4vw]'>
      {/* Wrap the logo in a Link to redirect to the home page */}
      <Link
        to='/'
        className='block'>
        <img
          src={assets.logo}
          alt='Spotify Logo'
          className='mt-5 w-[max(10vw,100px)] hidden sm:block'
        />
        <img
          src={assets.logo_small}
          alt='Spotify Logo'
          className='mt-5 w-[max(5vw,40px)] mr-5 sm:hidden block'
        />
      </Link>

      <div className='flex flex-col gap-5 mt-10'>
         <NavLink
          to='/stats'
          className='flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium'>
          <img
            className='w-5'
            src={assets.add_song}
            alt='Add Song'
          />
          <p className='hidden sm:block'>Statatics</p>
        </NavLink>

        <NavLink
          to='/add-song'
          className='flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium'>
          <img
            className='w-5'
            src={assets.add_song}
            alt='Add Song'
          />
          <p className='hidden sm:block'>Add Song</p>
        </NavLink>

        <NavLink
          to='/list-songs'
          className='flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium'>
          <img
            className='w-5'
            src={assets.song_icon}
            alt='List Songs'
          />
          <p className='hidden sm:block'>List Songs</p>
        </NavLink>

        <NavLink
          to='/add-album'
          className='flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium'>
          <img
            className='w-5'
            src={assets.add_album}
            alt='Add Album'
          />
          <p className='hidden sm:block'>Add Album</p>
        </NavLink>

        <NavLink
          to='/list-albums'
          className='flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium'>
          <img
            className='w-5'
            src={assets.album_icon}
            alt='List Album'
          />
          <p className='hidden sm:block'>List Albums</p>
        </NavLink>

        <NavLink
          to='/user-list'
          className='flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium'>
          <img
            className='w-5'
            src={assets.album_icon}
            alt='List Album'
          />
          <p className='hidden sm:block'>User Management</p>
        </NavLink>



      </div>
    </div>
  );
};

export default Sidebar;
