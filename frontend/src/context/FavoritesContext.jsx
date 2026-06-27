import { createContext, useContext, useState, useCallback } from 'react';

const FavoritesContext = createContext(null);

const STORAGE_KEY = 'campus_favorites';

const loadFavorites = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveFavorites = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(loadFavorites);

  const addFavorite = useCallback((item, serviceType) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === item.id && f.serviceType === serviceType);
      if (exists) return prev;
      const next = [{ ...item, serviceType, savedAt: Date.now() }, ...prev];
      saveFavorites(next);
      return next;
    });
  }, []);

  const removeFavorite = useCallback((id, serviceType) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => !(f.id === id && f.serviceType === serviceType));
      saveFavorites(next);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((item, serviceType) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === item.id && f.serviceType === serviceType);
      let next;
      if (exists) {
        next = prev.filter((f) => !(f.id === item.id && f.serviceType === serviceType));
      } else {
        next = [{ ...item, serviceType, savedAt: Date.now() }, ...prev];
      }
      saveFavorites(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((id, serviceType) => {
    return favorites.some((f) => f.id === id && f.serviceType === serviceType);
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider');
  return ctx;
};
