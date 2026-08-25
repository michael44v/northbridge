import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await api.get('?action=get_profile');
      if (response.data.status === 'success') {
        const fullUser = response.data.data;
        setUser(prev => ({
          ...prev,
          ...fullUser,
          account_status: fullUser.status || fullUser.account_status || 'active'
        }));
      }
    } catch (e) {
      console.error('Failed to refresh user profile:', e);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchProfile();
    }
    setLoading(false);
  }, []);

  // Poll profile periodically if logged in to detect status updates
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      fetchProfile();
    }, 10000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const login = async (email, password, pin = null) => {
    try {
      const response = await api.post('?action=login', { email, password, pin });
      if (response.data.status === 'success') {
        const { access_token, user } = response.data.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        fetchProfile();
        return { success: true };
      } else if (response.data.status === 'pin_required') {
        return { success: false, pin_required: true, message: response.data.message };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, refreshProfile: fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
