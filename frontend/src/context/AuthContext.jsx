import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe } from '../services/authService';

const AuthContext = createContext(null);

const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('campus_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('campus_token'));
  const [loading, setLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    const verify = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const res = await getMe();
        setUser(res.data);
        localStorage.setItem('campus_user', JSON.stringify(res.data));
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []); // eslint-disable-line

  const login = useCallback((jwtToken, userData) => {
    localStorage.setItem('campus_token', jwtToken);
    localStorage.setItem('campus_user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
  }, []);

  const loginAsGuest = useCallback(() => {
    const guestUser = { id: 'guest', username: 'Guest', email: 'guest@campus.local', role: 'user', isGuest: true };
    localStorage.setItem('campus_user', JSON.stringify(guestUser));
    // No token — public API routes work without auth
    setToken('guest');
    setUser(guestUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('campus_token');
    localStorage.removeItem('campus_user');
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = () => !!token && !!user;
  const isAdmin = () => user?.role === 'admin';
  const isGuest = () => user?.isGuest === true;

  return (
    <AuthContext.Provider value={{ user, token, login, loginAsGuest, logout, isAuthenticated, isAdmin, isGuest, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
