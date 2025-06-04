import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpotify, FaUser, FaHistory, FaHome, FaMusic } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight, FiMessageSquare } from 'react-icons/fi';

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`h-full p-2 flex-col gap-2 text-white hidden lg:flex transition-all duration-300 ${
        isExpanded ? 'w-[15%]' : 'w-[7%]'
      }`}
    >
      <div className="bg-[#121212] h-full rounded flex flex-col justify-between">

        {/* ---------- Top Section with Branding and Toggle ---------- */}
        <div className="flex items-center justify-between px-3 py-4">
          {/* Logo + Label */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.location.reload()}
          >
            <FaSpotify className="text-green-500 text-2xl" />
            {isExpanded && (
              <span className="text-white font-bold text-lg">SpotifyChat</span>
            )}
          </div>

          {/* Toggle Button */}
          {isExpanded ? (
            <FiChevronLeft
              size={22}
              className="cursor-pointer text-white"
              onClick={() => setIsExpanded(false)}
            />
          ) : (
            <FiChevronRight
              size={22}
              className="cursor-pointer text-white"
              onClick={() => setIsExpanded(true)}
            />
          )}
        </div>

        {/* ---------- Navigation Menu ---------- */}
        <div className="flex flex-col items-center gap-4 px-2">
          {/* Home */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-2 py-2 rounded hover:bg-[#1e1e1e] cursor-pointer w-full"
          >
            <FaHome size={20} />
            {isExpanded && <p className="font-semibold">Home</p>}
          </div>

          {/* Playlist */}
          <div
            onClick={() => navigate('/playlist')}
            className="flex items-center gap-3 px-2 py-2 rounded hover:bg-[#1e1e1e] cursor-pointer w-full"
          >
            <FaMusic size={20} />
            {isExpanded && <p className="font-semibold">Playlist</p>}
          </div>

          {/* History */}
          <div
            onClick={() => navigate('/history')}
            className="flex items-center gap-3 px-2 py-2 rounded hover:bg-[#1e1e1e] cursor-pointer w-full"
          >
            <FaHistory size={20} />
            {isExpanded && <p className="font-semibold">History</p>}
          </div>

          {/* Profile */}
          <div
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 px-2 py-2 rounded hover:bg-[#1e1e1e] cursor-pointer w-full"
          >
            <FaUser size={20} />
            {isExpanded && <p className="font-semibold">Profile</p>}
          </div>
        </div>

        {/* ---------- Footer (optional) ---------- */}
        <div className="text-sm text-center text-gray-500 py-4">
          {isExpanded ? "💗 spotify" : "💗"}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
