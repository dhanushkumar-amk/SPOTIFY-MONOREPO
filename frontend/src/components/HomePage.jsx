import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";
import { useContext } from "react";
import { PlayerContext } from "../context/playerContext";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Home = () => {
  const { songsData, albumsData } = useContext(PlayerContext);
  const [displayedSongs, setDisplayedSongs] = useState([]); // Songs currently displayed
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [page, setPage] = useState(1); // Pagination state
  const songsPerPage = 18; // Number of songs per page (6 columns × 3 rows)
  const itemsPerRow = 6; // Fixed number of songs per row

  // Simulate fetching songs from an API
  const fetchSongs = async () => {
    if (loading) return; // Prevent multiple simultaneous API calls
    setLoading(true);

    try {
      // Simulate API call with a delay
      const newSongs = await new Promise((resolve) =>
        setTimeout(() => resolve(songsData.slice(0, page * songsPerPage)), 1000)
      );

      // Append new songs to the existing list
      setDisplayedSongs(newSongs);
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch songs when page changes
  useEffect(() => {
    fetchSongs();
  }, [page]);

  // Pagination handlers
  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <>
      <Navbar />

      {/* Featured Albums Section */}
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Featured Albums</h1>
        <div className="flex overflow-auto">
          {albumsData.map((item, index) => (
            <AlbumItem
              key={index}
              name={item.name}
              desc={item.desc}
              id={item._id}
              image={item.image}
            />
          ))}
        </div>
      </div>

      {/* Songs for You Section */}
      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Songs for You</h1>
        <div
          className={`grid gap-4`}
          style={{ gridTemplateColumns: `repeat(${itemsPerRow}, minmax(0, 1fr))` }}
        >
          {displayedSongs
            .slice((page - 1) * songsPerPage, page * songsPerPage) // Display songs for the current page
            .map((item, index) => (
              <SongItem
                key={index}
                name={item.name}
                author={item.author}
                id={item._id}
                image={item.image}
              />
            ))}
        </div>

       <div className="flex justify-center mt-4 space-x-2">
      {/* Previous Button */}
      <button
        className={`p-2 rounded-full bg-gray-800 text-white transition-colors hover:bg-green-500 ${
          page === 1 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={handlePrevPage}
        disabled={page === 1} // Disable "Previous" button on the first page
      >
        <FaChevronLeft className="w-4 h-4" />
      </button>

      {/* Next Button */}
      <button
        className="p-2 rounded-full bg-gray-800 text-white transition-colors hover:bg-green-500"
        onClick={handleNextPage}
      >
        <FaChevronRight className="w-4 h-4" />
      </button>
    </div>
      </div>

      {/* Loading Indicator */}
      {/* {loading && <p className="text-center mt-4">Loading more songs...</p>} */}
    </>
  );
};

export default Home;
