import React, { useState, useContext, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import { FiSearch } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';
import Login from '../components/Login';
import { PlayerContext } from '../context/playerContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { isLoggedIn, handleLogout, url, playWithId } = useContext(PlayerContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ songs: [], albums: [] });
  const [showResults, setShowResults] = useState(false);
  const dropdownRef = useRef(null);

  // Automatically open login modal after 15 seconds if not logged in
  useEffect(() => {
    let timer;
    if (!isLoggedIn) {
      timer = setTimeout(() => {
        setIsLoginOpen(true);
      }, 15000);
    }
    return () => clearTimeout(timer);
  }, [isLoggedIn]);

  // Fetch search results (debounced)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        fetch(`${url}/api/search?q=${searchQuery}`)
          .then(res => res.json())
          .then(data => {
            setSearchResults(data);
            setShowResults(true);
          })
          .catch(err => {
            console.error('Search error:', err);
            setShowResults(false);
          });
      } else {
        setSearchResults({ songs: [], albums: [] });
        setShowResults(false);
      }
    }, 200); // Debounce delay

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <div className="w-full flex justify-between items-center font-semibold relative">
        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <img
            onClick={() => navigate(-1)}
            src={assets.arrow_left}
            alt="prev"
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
          />
          <img
            onClick={() => navigate(+1)}
            src={assets.arrow_right}
            alt="next"
            className="w-8 bg-black p-2 rounded-2xl cursor-pointer"
          />
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-[400px] mx-4" ref={dropdownRef}>
          <div className="flex items-center bg-[#282828] rounded-full px-4 py-1">
            <FiSearch className="text-white text-lg" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent border-none outline-none text-white ml-2 w-full placeholder:text-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim()) setShowResults(true);
              }}
            />
          </div>

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 mt-2 w-full bg-[#181818] text-white p-4 rounded-lg shadow-lg z-50">
              {searchResults.songs.length === 0 && searchResults.albums.length === 0 ? (
                <p className="text-sm text-gray-400">No results found.</p>
              ) : (
                <>
                  {searchResults.songs.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold mb-1">Songs</h4>
                      <ul>
                        {searchResults.songs.map(song => (
                          <li
                            key={song._id}
                            className="py-1 px-2 hover:bg-[#282828] rounded cursor-pointer"
                            onClick={() => {
                              playWithId(song._id);
                              setShowResults(false);
                            }}
                          >
                            🌿 {song.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {searchResults.albums.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-bold mb-1">Albums</h4>
                      <ul>
                        {searchResults.albums.map(album => (
                          <li
                            key={album._id}
                            className="py-1 px-4 hover:bg-[#282828] rounded cursor-pointer"
                            onClick={() => {
                              navigate(`/album/${album._id}`);
                              setShowResults(false);
                            }}
                          >
                            💿 {album.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Right-Side Links and Login */}
        <div className="flex items-center gap-4">
          <p className="bg-white text-black text-[15px] px-4 py-1 rounded-2xl hidden md:block">Explore Premium</p>
          <p className="bg-white text-black text-[15px] px-4 py-1 rounded-2xl hidden md:block">Install App</p>
          <p className="bg-white text-black text-[15px] px-4 py-1 rounded-2xl hidden md:block">FAQ</p>

          <div
            onClick={isLoggedIn ? handleLogout : () => setIsLoginOpen(true)}
            className={`text-[15px] px-4 py-1 rounded-2xl cursor-pointer hidden md:block ${
              isLoggedIn ? 'bg-red-600 text-white' : 'bg-white text-black'
            }`}
          >
            {isLoggedIn ? 'Logout' : 'Login'}
          </div>

          {isLoginOpen && <Login onClose={() => setIsLoginOpen(false)} />}
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2 mt-4">
        <Link to="/" className="bg-white text-black px-4 py-1 rounded-2xl cursor-pointer">All</Link>
        <Link to="/music" className="bg-black text-white px-4 py-1 rounded-2xl cursor-pointer">Music</Link>
        <Link to="/collection" className="bg-black text-white px-4 py-1 rounded-2xl cursor-pointer">Albums</Link>
      </div>
    </>
  );
};

export default Navbar;
