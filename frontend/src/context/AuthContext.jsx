import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Set default axios header
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  const backendUrl = 'http://localhost:5000/api';

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const { data } = await axios.get(`${backendUrl}/auth/profile`);
          setUser(data);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setToken(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const { data } = await axios.post(`${backendUrl}/auth/login`, { email, password });
    setToken(data.token);
    setUser({ _id: data._id, name: data.name, email: data.email, role: data.role });
    localStorage.setItem('token', data.token);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post(`${backendUrl}/auth/register`, { name, email, password });
    setToken(data.token);
    setUser({ _id: data._id, name: data.name, email: data.email, role: data.role });
    localStorage.setItem('token', data.token);
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, backendUrl }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
