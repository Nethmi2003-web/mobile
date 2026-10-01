import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      const storedUser = await AsyncStorage.getItem('userInfo');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.log('Error reading auth state', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  const login = async (email, password) => {
    const response = await client.post('/auth/login', { email, password });
    const { token: newToken, ...userData } = response.data;
    setToken(newToken);
    setUser(userData);
    await AsyncStorage.setItem('userToken', newToken);
    await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const register = async (name, email, password, phone) => {
    const response = await client.post('/auth/register', { name, email, password, phone });
    const { token: newToken, ...userData } = response.data;
    setToken(newToken);
    setUser(userData);
    await AsyncStorage.setItem('userToken', newToken);
    await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
