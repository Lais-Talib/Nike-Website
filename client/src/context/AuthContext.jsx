import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi, getProfile, verifyEmail as verifyEmailApi } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('nike_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (userData) => {
    try {
      const { data } = await loginApi(userData);
      setUser(data);
      localStorage.setItem('nike_user', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed',
        isNotVerified: error.response?.data?.isNotVerified
      };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await registerApi(userData);
      // For email verification, we don't log them in immediately
      return { 
        success: true, 
        message: data.message || 'Registration successful! Please check your email to verify.' 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const verifyEmail = async (token) => {
    try {
      const { data } = await verifyEmailApi(token);
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('nike_user', JSON.stringify(data.user));
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Verification failed' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nike_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, verifyEmail }}>
      {children}
    </AuthContext.Provider>
  );
};
