// src/components/PlayedHistory.jsx
import React from 'react';
import { useContext } from 'react';
import { PlayerContext } from '../context/playerContext';

const PlayedHistory = () => {
  const { playedHistory, songsData, setPlayedHistory } = useContext(PlayerContext);

  const formatDate = (timestamp) => {
    const now = new Date();
    const diffTime = Math.abs(now - new Date(timestamp));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const removeSongFromHistory = (indexToRemove) => {
    const updatedHistory = playedHistory.filter((_, index) => index !== indexToRemove);
    setPlayedHistory(updatedHistory);
  };

  const clearHistory = () => {
    setPlayedHistory([]);
  };

  return (
    <div className="text-white p-4 bg-black">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Recently Played</h3>
        <button
          onClick={clearHistory}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          Clear All
        </button>
      </div>

      {/* Empty State */}
      {playedHistory.length === 0 || !songsData || songsData.length === 0 ? (
        <p className="text-gray-500">No recently played songs yet.</p>
      ) : (
        <ul className="space-y-3">
          {playedHistory.map((historyItem, i) => {
            const song = songsData[historyItem.index];
            if (!song) return null;

            return (
              <li key={i} className="flex items-center justify-between bg-[#1a1a1a] p-2 rounded-md">
                <div className="flex items-center gap-3 flex-1">
                  {/* Song Icon */}
                  <img
                    src={song.image}
                    alt={song.name}
                    className="w-10 h-10 rounded border border-green-500"
                  />
                  <div>
                    <p className="font-semibold">{song.name}</p>
                    <p className="text-sm text-gray-400">{song.author}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(historyItem.timestamp)}
                    </p>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeSongFromHistory(i)}
                  className="text-red-400 hover:text-red-300 transition ml-2"
                  aria-label="Remove from history"
                >
                  &times;
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default PlayedHistory;
