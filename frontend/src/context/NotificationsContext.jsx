import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const NotificationsContext = createContext(null);

const READ_IDS_KEY    = 'campus_notif_read_ids';
const DELETED_IDS_KEY = 'campus_notif_deleted_ids';

const TYPE_META = {
  welcome: { icon: 'waving_hand',    iconColor: '#3525cd', iconBg: 'rgba(53,37,205,0.12)' },
  deal:    { icon: 'local_offer',    iconColor: '#f59e0b', iconBg: '#fef3c7' },
  alert:   { icon: 'warning',        iconColor: '#f43f5e', iconBg: '#ffe4e6' },
  update:  { icon: 'system_update',  iconColor: '#10b981', iconBg: '#d1fae5' },
  info:    { icon: 'info',           iconColor: '#0ea5e9', iconBg: '#e0f2fe' },
};

function readJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function NotificationsProvider({ children }) {
  const [backendNotifs, setBackendNotifs] = useState([]);
  const [readIds, setReadIds]             = useState(() => new Set(readJSON(READ_IDS_KEY, [])));
  const [deletedIds, setDeletedIds]       = useState(() => new Set(readJSON(DELETED_IDS_KEY, [])));

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get('/notifications');
      setBackendNotifs(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Persist readIds whenever they change
  useEffect(() => {
    writeJSON(READ_IDS_KEY, [...readIds]);
  }, [readIds]);

  // Persist deletedIds whenever they change
  useEffect(() => {
    writeJSON(DELETED_IDS_KEY, [...deletedIds]);
  }, [deletedIds]);

  // Re-read when focus returns
  useEffect(() => {
    const onFocus = () => {
      fetchNotifications();
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchNotifications]);

  // --- Merged, sorted, visible notifications ---
  const notifications = backendNotifs
    .filter((n) => !deletedIds.has(n.id))
    .map((n) => {
      const meta = TYPE_META[n.type] || TYPE_META.info;
      return {
        ...n,
        icon: meta.icon,
        iconColor: meta.iconColor,
        iconBg: meta.iconBg,
        read: readIds.has(n.id),
      };
    });

  const unreadCount = notifications.filter((n) => !n.read).length;

  // --- Actions ---
  const markRead = useCallback((id) => {
    setReadIds((prev) => new Set([...prev, id]));
  }, []);

  const markAllRead = useCallback(() => {
    const allIds = backendNotifs.map((n) => n.id);
    setReadIds((prev) => new Set([...prev, ...allIds]));
  }, [backendNotifs]);

  const deleteNotification = useCallback((id) => {
    setDeletedIds((prev) => new Set([...prev, id]));
    setReadIds((prev) => new Set([...prev, id]));
  }, []);

  const clearAll = useCallback(() => {
    const allIds = backendNotifs.map((n) => n.id);
    setDeletedIds((prev) => new Set([...prev, ...allIds]));
    setReadIds((prev) => new Set([...prev, ...allIds]));
  }, [backendNotifs]);

  // --- Admin: push a broadcast ---
  const pushAdminBroadcast = useCallback(async (partial) => {
    try {
      const res = await api.post('/notifications', partial);
      setBackendNotifs((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      console.error('Failed to push admin broadcast', err);
      throw err;
    }
  }, []);

  // --- Admin: delete a broadcast for everyone ---
  const deleteAdminBroadcast = useCallback(async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setBackendNotifs((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Failed to delete admin broadcast', err);
      throw err;
    }
  }, []);

  // --- Admin: read all broadcasts ---
  const getAdminBroadcasts = useCallback(() => {
    return backendNotifs;
  }, [backendNotifs]);

  return (
    <NotificationsContext.Provider value={{
      notifications,
      unreadCount,
      markRead,
      markAllRead,
      deleteNotification,
      clearAll,
      pushAdminBroadcast,
      deleteAdminBroadcast,
      getAdminBroadcasts,
      TYPE_META,
    }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
}
