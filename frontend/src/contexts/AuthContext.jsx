import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, registerUser } from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
  }, [token]);

  const login = async (credentials) => {
    try {
      const data = await loginUser(credentials);
      setToken(data.token);
      toast.success(data.message || 'Login successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await registerUser(userData);
      setToken(data.token);
      toast.success(data.message || 'Registration successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.');
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
