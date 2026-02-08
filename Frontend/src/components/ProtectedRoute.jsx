// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, requiredPermission }) => {
  const { user, loading, hasPermission } = useAuth();

  if (loading) {
    return (<Box sx={{ display: 'flex',justifyContent: 'center',alignItems: 'center',height: '100vh' }} >
                 <CircularProgress />
            </Box>);
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;