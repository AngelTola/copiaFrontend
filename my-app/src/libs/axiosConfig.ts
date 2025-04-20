// lib/axiosConfig.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // cambia esto por la URL de tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
