import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AppShell from '../components/layout/AppShell';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const [showActivity, setShowActivity] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(
    () => localStorage.getItem('campus_notif') === 'true'
  );

  const handleNotifications = () => {
    const next = !notifEnabled;
    setNotifEnabled(next);
    localStorage.setItem('campus_notif', String(next));
    toast(next ? 'Notifications enabled 🔔' : 'Notifications muted 🔕', {
      icon: next ? '🔔' : '🔕',
    });
  };

  const recentFavorites = favorites.slice(0, 5);

  return (
    <AppShell>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '32px 20px' }}>
        <h1 className="animate-fade-in-up" style={{ fontWeight: 800, fontSize: 24, marginBottom: 24, color: 'var(--color-on-surface)' }}>
          My Profile
        </h1>

        {/* Avatar card */}
        <div className="glass-card animate-fade-in-up" style={{ padding: 28, textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, fontWeight: 800, color: '#fff',
            boxShadow: '0 8px 24px rgba(174,47,52,0.3)',
          }}>
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <h2 style={{ fontWeight: 700, fontSize: 20, color: 'var(--color-on-surface)', marginBottom: 4 }}>{user?.username}</h2>
          <p style={{ fontSize: 14, color: 'var(--color-on-surface-variant)' }}>{user?.email}</p>
          <span style={{
            display: 'inline-block', marginTop: 12, padding: '4px 14px', borderRadius: 'var(--radius-full)',
            background: user?.role === 'admin' ? 'rgba(53,37,205,0.12)' : 'rgba(16,185,129,0.12)',
            color: user?.role === 'admin' ? 'var(--color-primary)' : '#065f46',
            fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
            {user?.role || 'user'}
          </span>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--color-primary)' }}>{favorites.length}</div>
              <div style={{ fontSize: 11, color: 'var(--color-on-surface-variant)', fontWeight: 600 }}>Saved</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="glass-card animate-fade-in-up" style={{ padding: '8px 0', marginBottom: 16 }}>
          {[
            {
              icon: 'favorite',
              label: 'Saved Services',
              badge: favorites.length > 0 ? String(favorites.length) : null,
              action: () => navigate('/favorites'),
            },
            {
              icon: 'palette',
              label: 'Design Playground (Dev)',
              action: () => navigate('/design-playground'),
            },
            {
              icon: 'history',
              label: 'Recent Activity',
              action: () => setShowActivity((s) => !s),
              isExpanded: showActivity,
            },
            {
              icon: notifEnabled ? 'notifications_active' : 'notifications_off',
              label: notifEnabled ? 'Notifications On' : 'Notifications Off',
              action: handleNotifications,
              toggle: true,
              active: notifEnabled,
            },
          ].map(({ icon, label, action, badge, isExpanded, toggle, active }) => (
            <div key={label}>
              <button
                onClick={action}
                style={{
                  all: 'unset', display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 20px', width: '100%', cursor: 'pointer',
                  transition: 'background 0.15s', borderRadius: 'var(--radius-md)', boxSizing: 'border-box',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-container)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                <span className="material-symbols-outlined" style={{
                  color: active ? 'var(--color-primary)' : 'var(--color-primary)', fontSize: 22,
                }}>{icon}</span>
                <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--color-on-surface)', flex: 1 }}>{label}</span>
                {badge && (
                  <span style={{
                    background: 'var(--color-primary)', color: '#fff',
                    fontSize: 11, fontWeight: 700, borderRadius: 99, padding: '2px 8px', minWidth: 20, textAlign: 'center',
                  }}>{badge}</span>
                )}
                {toggle ? (
                  <div style={{
                    width: 40, height: 22, borderRadius: 11,
                    background: active ? 'var(--color-primary)' : 'var(--color-outline-variant)',
                    position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', background: '#fff',
                      position: 'absolute', top: 2, left: active ? 20 : 2,
                      transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }} />
                  </div>
                ) : (
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-outline-variant)' }}>
                    {isExpanded ? 'expand_less' : 'chevron_right'}
                  </span>
                )}
              </button>

              {/* Recent Activity Panel */}
              {isExpanded && (
                <div style={{
                  margin: '0 16px 12px',
                  background: 'var(--color-surface-container-low)',
                  borderRadius: 'var(--radius-md)', padding: 12,
                }}>
                  {recentFavorites.length === 0 ? (
                    <p style={{ fontSize: 13, color: 'var(--color-on-surface-variant)', textAlign: 'center', padding: '8px 0' }}>
                      No activity yet — browse services to get started.
                    </p>
                  ) : (
                    <>
                      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-on-surface-variant)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 10 }}>
                        Recently Saved
                      </p>
                      {recentFavorites.map((fav) => (
                        <div key={`${fav.serviceType}-${fav.id}`} style={{
                          display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0',
                          borderBottom: '1px solid var(--color-outline-variant)',
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-primary)' }}>favorite</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-on-surface)' }}>
                              {fav.name || fav.driver_name}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--color-on-surface-variant)', textTransform: 'capitalize' }}>
                              {fav.serviceType} · {fav.location || fav.vehicle_model || ''}
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        style={{ marginTop: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 600, fontSize: 13, fontFamily: 'var(--font-family)', width: '100%', textAlign: 'center' }}
                        onClick={() => navigate('/favorites')}
                      >
                        View all saved →
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <button className="btn-secondary animate-fade-in-up" onClick={() => { logout(); navigate('/'); }}
          style={{ width: '100%', justifyContent: 'center', color: '#dc2626', borderColor: '#fecaca' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
          Sign Out
        </button>
      </div>
    </AppShell>
  );
}
