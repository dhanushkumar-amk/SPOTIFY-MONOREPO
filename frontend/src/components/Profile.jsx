import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { PlayerContext } from '../context/playerContext';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const {url, token} = useContext(PlayerContext)

  // Fetch user info on component mount (optional, adjust API as needed)
  useEffect(() => {
    const fetchUserProfile = async () => {
    //   const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(`${url}/api/user/profile`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setFormData((prev) => ({
            ...prev,
            name: data.name || '',
            email: data.email || '',
          }));
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!formData.currentPassword) {
      setError('Current password is required to update details.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated.');
        setLoading(false);
        return;
      }

      const res = await fetch(`${url}/api/user/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage('Profile updated successfully.');
        setFormData((prev) => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
        }));
      } else {
        setError(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Update Profile</h2>

      {message && <p className="mb-4 text-green-600">{message}</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleSubmit}>

        <label className="block mb-2 font-semibold" htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          className="w-full mb-4 px-3 py-2 border rounded"
        />

        <label className="block mb-2 font-semibold" htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your email"
          className="w-full mb-4 px-3 py-2 border rounded"
        />

        <label className="block mb-2 font-semibold" htmlFor="currentPassword">
          Current Password <span className="text-red-600">*</span>
        </label>
        <input
          type="password"
          id="currentPassword"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          placeholder="Enter current password"
          className="w-full mb-4 px-3 py-2 border rounded"
          required
        />

        <label className="block mb-2 font-semibold" htmlFor="newPassword">New Password</label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="Enter new password (optional)"
          className="w-full mb-6 px-3 py-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
