import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useUser();

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          background: 'linear-gradient(135deg, hsl(262 47% 45% / 0.05), hsl(262 47% 55% / 0.1))'
        }}
      >
        <CircularProgress size={60} sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;