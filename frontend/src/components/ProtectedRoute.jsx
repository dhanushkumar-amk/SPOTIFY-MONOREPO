// components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { PlayerContext } from '../context/playerContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(PlayerContext);

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
