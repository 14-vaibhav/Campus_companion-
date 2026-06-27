import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Inject JWT token on every request (skip for guest sessions)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campus_token');
  if (token && token !== 'guest') config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — clear token and redirect
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('campus_token');
      localStorage.removeItem('campus_user');
      window.location.hash = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
