import axios from 'axios';

const api = axios.create({
  baseURL: 'https://deploy-redibo-back.vercel.app/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;