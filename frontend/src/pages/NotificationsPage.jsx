import { useState, useMemo } from 'react';
import AppShell from '../components/layout/AppShell';
import { useNotifications } from '../context/NotificationsContext';

const FILTERS = [
  { key: 'all',    label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'deal',   label: 'Deals' },
  { key: 'alert',  label: 'Alerts' },
  { key: 'update', label: 'Updates' },
  { key: 'info',   label: 'Info' },
];

function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return 'Just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  < 7)  return `${days}d ago`;
  return new Date(isoString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    deleteNotification,
    clearAll,
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = useMemo(() => {
    if (activeFilter === 'all')    return notifications;
    if (activeFilter === 'unread') return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.type === activeFilter);
  }, [notifications, activeFilter]);

  return (
    <AppShell>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 20px 16px' }}>

        {/* Header */}
        <div className="animate-fade-in-up" style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h1 style={{ fontWeight: 800, fontSize: 26, color: 'var(--color-on-surface)', letterSpacing: '-0.02em' }}>
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span style={{
                  background: 'linear-gradient(135deg, var(--color-primary), #ff6b6b)',
                  color: '#fff', fontSize: 11, fontWeight: 800,
                  borderRadius: 99, padding: '3px 9px', lineHeight: 1,
                }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 14 }}>
              {notifications.length === 0
                ? 'All caught up! Nothing here yet.'
                : `${notifications.length} notification${notifications.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="btn-ghost"
              style={{ flexShrink: 0, fontSize: 13, color: 'var(--color-primary)', fontWeight: 700 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>done_all</span>
              Mark all read
            </button>
          )}
        </div>

        {/* Filter chips */}
        {notifications.length > 0 && (
          <div className="animate-fade-in-up" style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                style={{
                  padding: '7px 16px', borderRadius: 'var(--radius-full)', cursor: 'pointer',
                  border: activeFilter === f.key ? 'none' : '1.5px solid var(--color-outline-variant)',
                  background: activeFilter === f.key
                    ? 'linear-gradient(135deg, var(--color-primary), #ff6b6b)'
                    : 'rgba(255,255,255,0.75)',
                  color: activeFilter === f.key ? '#fff' : 'var(--color-on-surface-variant)',
                  fontFamily: 'var(--font-family)', fontWeight: 600, fontSize: 13, transition: 'all 0.2s',
                }}
              >
                {f.label}
                {f.key === 'unread' && unreadCount > 0 && (
                  <span style={{
                    marginLeft: 6, background: activeFilter === 'unread' ? 'rgba(255,255,255,0.3)' : 'var(--color-primary)',
                    color: '#fff', fontSize: 10, fontWeight: 800, borderRadius: 99,
                    padding: '1px 6px', display: 'inline-block', lineHeight: 1.5,
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Empty state */}
        {notifications.length === 0 ? (
          <div className="glass-card animate-fade-in-up" style={{ padding: '56px 32px', textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{
              fontSize: 64, color: 'var(--color-outline)', display: 'block', marginBottom: 16,
            }}>
              notifications_off
            </span>
            <p style={{ fontWeight: 700, fontSize: 17, color: 'var(--color-on-surface)', marginBottom: 8 }}>
              No notifications yet
            </p>
            <p style={{ fontSize: 14, color: 'var(--color-on-surface-variant)', lineHeight: 1.6 }}>
              You're all caught up! Check back later for updates, deals, and campus alerts.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card animate-fade-in-up" style={{ padding: 48, textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-outline)', display: 'block', marginBottom: 12 }}>
              search_off
            </span>
            <p style={{ fontWeight: 600, fontSize: 16, color: 'var(--color-on-surface)' }}>
              No {FILTERS.find(f => f.key === activeFilter)?.label.toLowerCase()} notifications
            </p>
            <button
              style={{
                marginTop: 16, background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--color-primary)', fontWeight: 600, fontSize: 14,
                fontFamily: 'var(--font-family)',
              }}
              onClick={() => setActiveFilter('all')}
            >
              Show all notifications
            </button>
          </div>
        ) : (
          /* Notification list */
          <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((notif) => (
              <div
                key={notif.id}
                className="animate-fade-in-up"
                onClick={() => !notif.read && markRead(notif.id)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  padding: '16px 18px',
                  borderRadius: 'var(--radius-lg)',
                  background: notif.read
                    ? 'rgba(255,255,255,0.72)'
                    : 'rgba(255,255,255,0.88)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: notif.read
                    ? '1px solid rgba(255,255,255,0.45)'
                    : '1px solid rgba(174,47,52,0.25)',
                  borderLeft: notif.read
                    ? '1px solid rgba(255,255,255,0.45)'
                    : '3px solid var(--color-primary)',
                  boxShadow: notif.read
                    ? '0 4px 16px rgba(174,47,52,0.05)'
                    : '0 6px 24px rgba(174,47,52,0.10)',
                  cursor: notif.read ? 'default' : 'pointer',
                  transition: 'all var(--transition-base)',
                  position: 'relative',
                }}
                onMouseEnter={e => { if (!notif.read) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
              >
                {/* Icon */}
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: notif.iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 22, color: notif.iconColor }}>
                    {notif.icon}
                  </span>
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
                    <span style={{
                      fontWeight: notif.read ? 600 : 700, fontSize: 14,
                      color: 'var(--color-on-surface)', lineHeight: 1.3,
                    }}>
                      {notif.title}
                    </span>
                    {notif.source === 'admin' && (
                      <span style={{
                        fontSize: 10, fontWeight: 800, color: '#818cf8',
                        background: 'rgba(129,140,248,0.12)',
                        border: '1px solid rgba(129,140,248,0.25)',
                        borderRadius: 99, padding: '1px 7px', letterSpacing: '0.05em',
                        flexShrink: 0,
                      }}>
                        CAMPUS
                      </span>
                    )}
                  </div>
                  <p style={{
                    fontSize: 13, color: 'var(--color-on-surface-variant)',
                    lineHeight: 1.5, margin: '0 0 6px',
                  }}>
                    {notif.body}
                  </p>
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: 'var(--color-outline)',
                    letterSpacing: '0.02em',
                  }}>
                    {timeAgo(notif.timestamp)}
                  </span>
                </div>

                {/* Unread dot + delete */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  {!notif.read && (
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: 'var(--color-primary)',
                      animation: 'statusPulse 2s infinite',
                      marginTop: 2,
                    }} />
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                    title="Dismiss"
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                      borderRadius: 'var(--radius-sm)', color: 'var(--color-outline)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'color var(--transition-fast)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-danger)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--color-outline)'}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 17 }}>close</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Clear all */}
        {notifications.length > 0 && (
          <div className="animate-fade-in-up" style={{ marginTop: 32, textAlign: 'center' }}>
            <button
              onClick={clearAll}
              className="btn-secondary"
              style={{
                width: '100%', justifyContent: 'center',
                color: '#dc2626', borderColor: '#fecaca',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete_sweep</span>
              Clear All Notifications
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
