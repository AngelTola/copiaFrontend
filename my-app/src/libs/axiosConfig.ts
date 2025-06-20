import axios from 'axios';

const api = axios.create({
  baseURL: 'https://copia-backend.vercel.app/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;