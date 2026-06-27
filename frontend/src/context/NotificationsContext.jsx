import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const NotificationsContext = createContext(null);

const PERSONAL_KEY    = 'campus_notifications';
const ADMIN_KEY       = 'campus_admin_notifications';
const SEEDED_FLAG     = 'campus_notif_seeded';
const READ_IDS_KEY    = 'campus_notif_read_ids';
const DELETED_IDS_KEY = 'campus_notif_deleted_ids';

const TYPE_META = {
  welcome: { icon: 'waving_hand',    iconColor: '#3525cd', iconBg: 'rgba(53,37,205,0.12)' },
  deal:    { icon: 'local_offer',    iconColor: '#f59e0b', iconBg: '#fef3c7' },
  alert:   { icon: 'warning',        iconColor: '#f43f5e', iconBg: '#ffe4e6' },
  update:  { icon: 'system_update',  iconColor: '#10b981', iconBg: '#d1fae5' },
  info:    { icon: 'info',           iconColor: '#0ea5e9', iconBg: '#e0f2fe' },
};

const SEEDS = [
  {
    id: 'seed-1',
    type: 'welcome',
    title: 'Welcome to CampusHub! 👋',
    body: 'Explore restaurants, salons, laundries, cabs & autos — all in one place. Tap any service to get started.',
    source: 'system',
  },
  {
    id: 'seed-2',
    type: 'deal',
    title: '20% off at The Campus Cafe 🏷️',
    body: 'Show this notification at the counter to avail 20% off on all orders this weekend. Valid Sat–Sun only.',
    source: 'system',
  },
  {
    id: 'seed-3',
    type: 'info',
    title: 'New auto-rickshaw drivers registered ℹ️',
    body: '3 new auto drivers have been added near Block C. Check the Autos section to view availability and fares.',
    source: 'system',
  },
];

// Build a notification object with expiry
function makeNotif(partial) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const meta = TYPE_META[partial.type] || TYPE_META.info;
  return {
    id: partial.id || `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: partial.type || 'info',
    title: partial.title || '',
    body: partial.body || '',
    icon: meta.icon,
    iconColor: meta.iconColor,
    iconBg: meta.iconBg,
    timestamp: partial.timestamp || now.toISOString(),
    expiresAt: partial.expiresAt || expiresAt,
    source: partial.source || 'system',
  };
}

// Remove entries whose expiresAt has passed
function purgeExpired(list) {
  const now = new Date();
  return list.filter((n) => new Date(n.expiresAt) > now);
}

function readJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function NotificationsProvider({ children }) {
  const [personalNotifs, setPersonalNotifs] = useState([]);
  const [adminNotifs, setAdminNotifs]       = useState([]);
  const [readIds, setReadIds]               = useState(() => new Set(readJSON(READ_IDS_KEY, [])));
  const [deletedIds, setDeletedIds]         = useState(() => new Set(readJSON(DELETED_IDS_KEY, [])));

  // --- Load & seed on mount ---
  useEffect(() => {
    // 1. Seed personal notifications once
    if (!localStorage.getItem(SEEDED_FLAG)) {
      const seeded = SEEDS.map(makeNotif);
      writeJSON(PERSONAL_KEY, seeded);
      localStorage.setItem(SEEDED_FLAG, 'true');
      setPersonalNotifs(seeded);
    } else {
      const stored = purgeExpired(readJSON(PERSONAL_KEY, []));
      writeJSON(PERSONAL_KEY, stored);
      setPersonalNotifs(stored);
    }

    // 2. Load admin notifications (shared key), purge expired
    const admin = purgeExpired(readJSON(ADMIN_KEY, []));
    writeJSON(ADMIN_KEY, admin);
    setAdminNotifs(admin);
  }, []);

  // Persist readIds whenever they change
  useEffect(() => {
    writeJSON(READ_IDS_KEY, [...readIds]);
  }, [readIds]);

  // Persist deletedIds whenever they change
  useEffect(() => {
    writeJSON(DELETED_IDS_KEY, [...deletedIds]);
  }, [deletedIds]);

  // Re-read admin broadcasts when window gains focus (other tabs may have pushed)
  useEffect(() => {
    const onFocus = () => {
      const admin = purgeExpired(readJSON(ADMIN_KEY, []));
      setAdminNotifs(admin);
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  // --- Merged, sorted, visible notifications ---
  const notifications = [
    ...personalNotifs,
    ...adminNotifs.filter((n) => !deletedIds.has(n.id)),
  ]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .map((n) => ({ ...n, read: readIds.has(n.id) }));

  const unreadCount = notifications.filter((n) => !n.read).length;

  // --- Actions ---
  const markRead = useCallback((id) => {
    setReadIds((prev) => new Set([...prev, id]));
  }, []);

  const markAllRead = useCallback(() => {
    const allIds = [
      ...personalNotifs.map((n) => n.id),
      ...adminNotifs.map((n) => n.id),
    ];
    setReadIds((prev) => new Set([...prev, ...allIds]));
  }, [personalNotifs, adminNotifs]);

  const deleteNotification = useCallback((id) => {
    // If it's personal, remove from array
    setPersonalNotifs((prev) => {
      const next = prev.filter((n) => n.id !== id);
      writeJSON(PERSONAL_KEY, next);
      return next;
    });
    // If it's admin, track as deleted
    setDeletedIds((prev) => new Set([...prev, id]));
    // Also mark as read so badge updates instantly
    setReadIds((prev) => new Set([...prev, id]));
  }, []);

  const clearAll = useCallback(() => {
    setPersonalNotifs([]);
    writeJSON(PERSONAL_KEY, []);
    const adminIds = adminNotifs.map((n) => n.id);
    setDeletedIds((prev) => new Set([...prev, ...adminIds]));
    setReadIds((prev) => new Set([...prev, ...adminIds]));
  }, [adminNotifs]);

  // --- Admin: push a broadcast ---
  const pushAdminBroadcast = useCallback((partial) => {
    const notif = makeNotif({ ...partial, source: 'admin' });
    const updated = [notif, ...purgeExpired(readJSON(ADMIN_KEY, []))];
    writeJSON(ADMIN_KEY, updated);
    setAdminNotifs(updated);
    return notif;
  }, []);

  // --- Admin: delete a broadcast for everyone ---
  const deleteAdminBroadcast = useCallback((id) => {
    const updated = purgeExpired(readJSON(ADMIN_KEY, [])).filter((n) => n.id !== id);
    writeJSON(ADMIN_KEY, updated);
    setAdminNotifs(updated);
  }, []);

  // --- Admin: read all broadcasts ---
  const getAdminBroadcasts = useCallback(() => {
    return purgeExpired(readJSON(ADMIN_KEY, []));
  }, []);

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
