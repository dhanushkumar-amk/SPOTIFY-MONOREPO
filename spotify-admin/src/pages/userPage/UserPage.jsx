// components/admin/UserPage.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useDebounce from '../../utils/useDebounce'; // Adjust path if needed
import { url } from '../../App';
import { toast } from 'react-toastify';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const debouncedSearch = useDebounce(search, 300); // 300ms delay

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${url}/api/user/list`);
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      toast.error('Error fetching users');
    }
  };

  // Remove user
  const handleRemoveUser = async (id) => {
    try {
      const response = await axios.post(`${url}/api/user/remove`, { id });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchUsers();
      }
    } catch (error) {
      toast.error('Error removing user');
    }
  };

  // Filtered and paginated users
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  // Pagination controls
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Load data on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">All Users List</h2>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded w-full"
        />
      </div>

      {/* Table Header */}
      <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
        <b>Icon</b>
        <b>Name</b>
        <b>Email</b>
        <b>Action</b>
      </div>

      {/* User Rows */}
      {paginatedUsers.map((user) => {
        const initials = user.name.charAt(0).toUpperCase();

        return (
          <div
            key={user._id}
            className="grid grid-cols-[0.5fr_1fr_2fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5"
          >
            {/* Avatar with Initials - Black BG, White Text, Small Size */}
            <div
              className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold"
            >
              {initials}
            </div>

            <p>{user.name}</p>
            <p>{user.email}</p>
            <p
              className="cursor-pointer text-red-500 font-bold"
              onClick={() => handleRemoveUser(user._id)}
            >
              x
            </p>
          </div>
        );
      })}

      {/* Pagination Controls - Centered */}
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className={`px-2 py-1 rounded text-sm ${
            currentPage === 1 ? 'bg-gray-300 text-gray-500' : 'bg-gray-200 text-gray-800'
          }`}
        >
          Prev
        </button>

        <span className="text-sm px-2">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className={`px-2 py-1 rounded text-sm ${
            currentPage === totalPages
              ? 'bg-gray-300 text-gray-500'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserPage;
