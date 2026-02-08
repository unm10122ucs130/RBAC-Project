// frontend/src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext({});
const BaseURL = 'http://localhost:777';
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (token && username) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ username });
      fetchUserPermissions();
    }
    setLoading(false);
  }, []);

  const fetchUserPermissions = async () => {
    try {
      // In a real app, you would fetch actual permissions from backend
      // For now, we'll simulate based on user role
      const token = localStorage.getItem('token');
      if (token) {
        // Decode JWT to get permissions (simplified)
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log(payload);
        setPermissions(payload.permissions || []);
        setRole(payload.role || null);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${BaseURL}/api/auth/login`, {
        username,
        password
      });
      
      const { token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser({ username });
      await fetchUserPermissions();
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setPermissions([]);
  };

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      loading,
      permissions,
      login,
      logout,
      hasPermission,
      baseURL: BaseURL,
    }}>
      {children}
    </AuthContext.Provider>
  );
};