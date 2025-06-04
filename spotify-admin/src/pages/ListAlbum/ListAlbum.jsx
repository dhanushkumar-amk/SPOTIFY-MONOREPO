// components/admin/ListAlbum.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../../App';
import { toast } from 'react-toastify';

const ListAlbum = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    bgColour: '',
    image: null,
  });

  const fetchAlbums = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      if (response.data.success) {
        setData(response.data.albums);
      }
    } catch (error) {
      toast.error('Error fetching albums');
    }
  };

  const removeAlbum = async (id) => {
    try {
      const response = await axios.post(`${url}/api/album/remove`, { id });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchAlbums();
      }
    } catch (error) {
      toast.error('Error removing album');
    }
  };

  const openEditModal = (album) => {
    setEditingAlbum(album);
    setFormData({
      name: album.name,
      desc: album.desc,
      bgColour: album.bgColour,
      image: null,
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === 'image' && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('id', editingAlbum._id);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('desc', formData.desc);
    formDataToSend.append('bgColour', formData.bgColour);

    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const response = await axios.post(`${url}/api/album/update`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setIsModalOpen(false);

        // Optimistically update the local state
        const updatedAlbum = response.data.album;
        const updatedAlbums = data.map((album) =>
          album._id === updatedAlbum._id ? updatedAlbum : album
        );
        setData(updatedAlbums);

        // Optionally, refetch albums later to sync with server
        // setTimeout(fetchAlbums, 1000); // Refetch after 1 second
      }
    } catch (error) {
      toast.error('Error updating album');
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Albums List</h2>

      {/* Table Header */}
      <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
        <b>Image</b>
        <b>Name</b>
        <b>Description</b>
        <b>Album Colour</b>
        <b>Action</b>
      </div>

      {/* Album Rows */}
      {data.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5"
        >
          <img className="w-12 h-auto" src={item.image} alt="" />
          <p>{item.name}</p>
          <p>{item.desc}</p>
          <input type="color" value={item.bgColour} />
          <p
            className="cursor-pointer text-red-500 font-bold"
            onClick={() => removeAlbum(item._id)}
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
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false);
            }
          }}
        >
          <div
            className="bg-white p-6 rounded shadow-lg w-full max-w-md mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">Edit Album</h3>
            <form onSubmit={handleSubmit}>
              <input type="hidden" name="id" value={editingAlbum?._id} />

              {/* Name Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>

              {/* Description Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="desc"
                  value={formData.desc}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                //   resize = {"none"}
                ></textarea>
              </div>

              {/* Background Color Field */}
              <div className="m-4">
                <label className="block text-sm font-medium mb-1">Album Colour</label>
                <input
                  type="color"
                  name="bgColour"
                  value={formData.bgColour}
                  onChange={handleChange}
                  className="w-12 h-12  border rounded"
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

                {/* Image Preview Placeholder */}
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Preview"
                      className="w-16 h-16 object-cover border rounded mt-2"
                    />
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-500 transition"
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

export default ListAlbum;
