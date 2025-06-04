import React, { useState, useEffect, useContext } from 'react';
import { PlayerContext } from '../context/playerContext';
import toast from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const emojiList = ['🎵', '🎶', '🔥', '💿', '📀', '🎧', '🎼', '🎹'];

const PlayList = () => {
  const { url, token } = useContext(PlayerContext);
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState('');



  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${url}/api/playlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        // Add emojis randomly
        const withEmojis = data.playlists.map(p => ({
          ...p,
          name: `${emojiList[Math.floor(Math.random() * emojiList.length)]} ${p.name}`
        }));
        setPlaylists(withEmojis);
      } else {
        toast.error(data.error || 'Failed to fetch playlists');
      }
    } catch (error) {
      toast.error('Error fetching playlists');
      console.log(error);

    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Playlist name is required');
    try {
      const res = await fetch(`${url}/api/playlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Playlist created');
        setName('');
        setDescription('');
        fetchPlaylists();
      } else {
        toast.error(data.error || 'Failed to create playlist');
      }
    } catch (error) {
      toast.error('Error creating playlist');
    }
  };

  const handleDeletePlaylist = async (id) => {
    try {
      const res = await fetch(`${url}/api/playlist/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Playlist deleted');
        setPlaylists(playlists.filter((p) => p._id !== id));
      } else {
        toast.error('Failed to delete playlist');
      }
    } catch (error) {
      toast.error('Error deleting playlist');
    }
  };

  const handleRename = async (id) => {
    if (!editedName.trim()) return toast.error('New name is empty');
    try {
      const res = await fetch(`${url}/api/playlist/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editedName }),
      });
      if (res.ok) {
        toast.success('Playlist renamed');
        setEditingId(null);
        fetchPlaylists();
      } else {
        toast.error('Failed to rename playlist');
      }
    } catch (error) {
      toast.error('Error renaming playlist');
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(playlists);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setPlaylists(reordered);
  };

  return (
    <div className="p-4 text-white max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">🎼 Your Playlists</h2>

      <form onSubmit={handleCreatePlaylist} className="mb-8 bg-[#1f1f1f] p-6 rounded-2xl space-y-4">
        <h3 className="text-xl font-semibold">Create New Playlist</h3>
        <input
          type="text"
          placeholder="Playlist Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-[#2b2b2b] text-white"
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-[#2b2b2b] text-white"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
        >
          Create Playlist
        </button>
      </form>

      {loading ? (
        <p className="text-gray-400">Loading playlists...</p>
      ) : playlists.length === 0 ? (
        <p className="text-gray-400">No playlists found.</p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="playlists">
            {(provided) => (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {playlists.map((playlist, index) => (
                  <Draggable key={playlist._id} draggableId={playlist._id} index={index}>
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className="bg-[#2a2a2a] p-4 rounded-xl hover:shadow-lg transition-shadow relative group"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            {editingId === playlist._id ? (
                              <>
                                <input
                                  type="text"
                                  className="bg-[#1a1a1a] text-white px-2 py-1 rounded w-full mb-1"
                                  value={editedName}
                                  onChange={(e) => setEditedName(e.target.value)}
                                />
                                <button
                                  onClick={() => handleRename(playlist._id)}
                                  className="text-green-500 text-sm mr-2"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="text-gray-400 text-sm"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <h4
                                  onDoubleClick={() => {
                                    setEditingId(playlist._id);
                                    setEditedName(playlist.name);
                                  }}
                                  className="text-lg font-bold mb-1 truncate cursor-pointer"
                                >
                                  {playlist.name}
                                </h4>
                                <p className="text-sm text-gray-400 line-clamp-2">
                                  {playlist.description || 'No description'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {playlist.songs.length} song{playlist.songs.length !== 1 ? 's' : ''}
                                </p>
                              </>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeletePlaylist(playlist._id)}
                            title="Delete Playlist"
                            className="text-red-500 text-sm hover:text-red-700 opacity-0 group-hover:opacity-100"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default PlayList;
