// components/admin/ListSong.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../../App';
import { toast } from 'react-toastify';

const ListSong = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    album: '',
    image: null,
    audio: null,
  });
  const [duration, setDuration] = useState('');

  const fetchSongs = async () => {
    try {
      const response = await axios.get(`${url}/api/song/list`);
      if (response.data.success) {
        setData(response.data.songs);
      }
    } catch (error) {
      toast.error('Error fetching songs');
    }
  };

  const removeSong = async (id) => {
    try {
      const response = await axios.post(`${url}/api/song/remove`, { id });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchSongs();
      }
    } catch (error) {
      toast.error('Error removing song');
    }
  };

  const openEditModal = (song) => {
    setEditingSong(song);
    setFormData({
      name: null,
      album: null,
      image: null,
      audio: null,
    });
    setDuration('');
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === 'audio' && files[0]) {
      const file = files[0];
      const audio = document.createElement('audio');
      audio.src = URL.createObjectURL(file);

      audio.addEventListener('loadedmetadata', () => {
        const minutes = Math.floor(audio.duration / 60);
        const seconds = Math.floor(audio.duration % 60);
        const formattedDuration = `${minutes}:${String(seconds).padStart(2, '0')}`;
        setDuration(formattedDuration);
      });
    }

    setFormData({ ...formData, [name]: files[0] });
  };

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   const formDataToSend = new FormData();
//   formDataToSend.append('id', editingSong._id);
//   formDataToSend.append('name', formData.name);
//   formDataToSend.append('album', formData.album);

//   if (formData.image) {
//     formDataToSend.append('image', formData.image);
//   }

//   if (formData.audio) {
//     formDataToSend.append('audio', formData.audio);
//   }

//   try {
//     const response = await axios.post(`${url}/api/song/update`, formDataToSend, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });

//     if (response.data.success) {
//       toast.success(response.data.message);
//       setIsModalOpen(false);
//       fetchSongs();
//     }
//   } catch (error) {
//     toast.error('Error updating song');
//   }
// };

const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('id', editingSong._id);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('album', formData.album);

    if (formData.image) {
        formDataToSend.append('image', formData.image);
    }

    if (formData.audio) {
        formDataToSend.append('audio', formData.audio);
    }

    try {
        const response = await axios.post(`${url}/api/song/update`, formDataToSend, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data.success) {
            toast.success(response.data.message);
            setIsModalOpen(false);

            // Optimistically update the local state
            const updatedSong = response.data.song;
            const updatedSongs = data.map((song) =>
                song._id === updatedSong._id ? updatedSong : song
            );

    


            setData(updatedSongs);


            // Optionally, refetch songs later to sync with server
            setTimeout(fetchSongs, 1000); // Refetch after 1 second
        }
    } catch (error) {
        toast.error('Error updating song');
    }
};

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Songs List</h2>

      {/* Table Header */}
      <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
        <b>Image</b>
        <b>Name</b>
        <b>Album</b>
        <b>Duration</b>
        <b>Delete</b>
        <b>Edit</b>
      </div>

      {/* Song Rows */}
      {data.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5"
        >
          <img className="w-12 h-auto" src={item.image} alt="" />
          <p>{item.name}</p>
          <p>{item.album}</p>
          <p>{item.duration}</p>
          <p
            className="cursor-pointer text-red-500 font-bold"
            onClick={() => removeSong(item._id)}
          >
            x
          </p>
          <p
            className="cursor-pointer text-blue-500 font-bold"
            onClick={() => openEditModal(item)}
          >
            🖋️
          </p>
        </div>
      ))}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
          onClick={handleOverlayClick}
        >
          <div
            className="bg-white p-6 rounded shadow-lg w-full max-w-md mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">Edit Song</h3>
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="id" value={editingSong?._id} />

              {/* Name Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  placeholder='Enter song name'
                  required
                />
              </div>

              {/* Album Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Album</label>

                 <input
                type="text"
                name="album"
                value={formData.album}
                onChange={handleChange}
                placeholder='Enter album'
             className="w-full px-3 py-2 border rounded"
                 required
          />


              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">New Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              {/* Audio Upload + Duration Preview */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">New Audio</label>
                <input
                  type="file"
                  name="audio"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border rounded"
                />

                {/* Show real-time duration if audio is selected */}
                {duration && (
                  <p className="mt-2 text-sm text-gray-600">
                    Duration: <strong>{duration}</strong>
                  </p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
               className='px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-500'>
                  Cancel
                </button>
                <button
                  type="submit"
                 className='bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-500 transition'
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListSong;
