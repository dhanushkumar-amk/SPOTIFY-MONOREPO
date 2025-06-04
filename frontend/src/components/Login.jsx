// components/Login.js
import React, { useState, useContext } from 'react';
import { PlayerContext } from '../context/playerContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = ({ onClose }) => {
  const { url, handleLogin } = useContext(PlayerContext);
  const [currState, setCurrState] = useState('Login'); // "Sign Up" or "Login"
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false); // State for loading indicator

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading indicator

    let endpoint = currState === 'Login' ? '/api/user/login' : '/api/user/register';

    try {
      const response = await axios.post(`${url}${endpoint}`, data);

      if (response.data.success) {
        handleLogin(response.data.token); // Save token globally
        onClose(); // Close the modal
        toast.success(
          currState === 'Login'
            ? 'Login successful!'
            : 'Registration successful!'
        );
      } else {
        toast.error(response.data.message || 'An error occurred.');
      }
    } catch (error) {
      console.error("Error during login/register:", error);
      toast.error('An error occurred while processing your request.');
    } finally {
      setLoading(false); // Stop loading indicator after request completes
    }
  };

  return (
    <>
      {/* Overlay for login form */}
      <div className="fixed inset-0 bg-black bg-opacity-85 flex items-center justify-center z-50">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[400px] bg-white p-5 rounded-lg shadow-md space-y-6"
        >
          {/* Title and Close Button */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{currState}</h2>
            <button
              type="button"
              onClick={onClose} // Close the modal
              className="w-6 h-6 bg-red-600 rounded-2xl  text-white hover:cursor-pointer transition-colors"
            >
              X
            </button>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            {currState === 'Sign Up' && (
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={data.name}
                onChange={onChangeHandler}
                required
                className="w-full px-4 py-3 border  text-black border-gray-500 rounded-md focus:outline-none focus:border-black placeholder:text-gray-500"
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={data.email}
              onChange={onChangeHandler}
              required
              className="w-full px-4 py-3  text-black border border-gray-500 rounded-md focus:outline-none focus:border-black placeholder:text-gray-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={data.password}
              onChange={onChangeHandler}
              required
              className="w-full px-4 text-black py-3 border border-gray-500 rounded-md focus:outline-none placeholder:text-gray-500 focus:border-black"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-3 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : currState === 'Login' ? 'Login' : 'Create account'}
          </button>

          {/* Toggle between Login and Sign Up */}
          <p className="text-center text-sm mt-4 text-gray-600">
            {currState === 'Login' ? (
              <>
                Don't have an account?{' '}
                <span
                  onClick={() => setCurrState('Sign Up')}
                  className="text-green-500 hover:text-green-600 cursor-pointer underline"
                >
                  Sign up here
                </span>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <span
                  onClick={() => setCurrState('Login')}
                  className="text-green-500 hover:text-green-600 cursor-pointer underline"
                >
                  Login here
                </span>
              </>
            )}
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
