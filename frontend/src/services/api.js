import axios from 'axios';

const getBaseURL = () => {
  const isNative = window.Capacitor || window.cordova || !['http:', 'https:'].includes(window.location.protocol);
  if (isNative) {
    return 'http://10.0.2.2:5000/api';
  }
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
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
