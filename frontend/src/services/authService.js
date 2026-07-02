import api from './api';

export const login = (identifier, password) =>
  api.post('/auth/login', { identifier, password });

export const register = (username, email, password) =>
  api.post('/auth/register', { username, email, password, role: 'user' });

export const getMe = () => api.get('/auth/me');

// Send Google credential (JWT) to backend for verification
export const googleLogin = (credential) =>
  api.post('/auth/google', { credential });

