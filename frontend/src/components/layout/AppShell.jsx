import { useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useNotifications } from '../../context/NotificationsContext';

export default function AppShell({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const { favorites } = useFavorites();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef(null);

  // Secret admin trigger: 5 rapid clicks on logo
  const handleLogoClick = () => {
    logoClickCount.current += 1;
    clearTimeout(logoClickTimer.current);
    logoClickTimer.current = setTimeout(() => { logoClickCount.current = 0; }, 2000);
    if (logoClickCount.current >= 5) {
      logoClickCount.current = 0;
      if (isAdmin()) navigate('/control-center');
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="page-gradient" style={{ paddingBottom: '88px' }}>
      {/* Decorative orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Top App Bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(248,249,255,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(199,196,216,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: '64px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={handleLogoClick}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #3525cd, #6b38d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(53,37,205,0.3)',
          }}>
            <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 20 }}>school</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>
            CampusHub
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {user && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--color-surface-container-low)',
              padding: '6px 12px', borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-outline-variant)',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'linear-gradient(135deg, #3525cd, #6b38d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 13, fontWeight: 700,
              }}>
                {user.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-on-surface)', display: 'none' }} className="md-show">
                {user.username}
              </span>
            </div>
          )}
          <button className="btn-icon" onClick={() => navigate('/notifications')} title="Notifications" style={{ position: 'relative' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>notifications</span>
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: 6, right: 6,
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--color-primary)',
                border: '1.5px solid #fff',
              }} />
            )}
          </button>
          <button className="btn-icon" onClick={handleLogout} title="Logout">
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>logout</span>
          </button>
        </div>
      </header>

      {/* Page Content */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <NavLink to="/home" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="material-symbols-outlined icon-filled" style={{ fontSize: 24 }}>grid_view</span>
          Hub
        </NavLink>
        <NavLink to="/favorites" className={({ isActive }) => isActive ? 'active' : ''} style={{ position: 'relative' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 24 }}>favorite</span>
          Saved
          {favorites.length > 0 && (
            <span style={{
              position: 'absolute', top: 4, right: 10,
              background: 'var(--color-primary)', color: '#fff',
              fontSize: 9, fontWeight: 800, borderRadius: 99,
              width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 1,
            }}>{favorites.length > 99 ? '99+' : favorites.length}</span>
          )}
        </NavLink>
        <NavLink to="/notifications" className={({ isActive }) => isActive ? 'active' : ''} style={{ position: 'relative' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 24 }}>notifications</span>
          Alerts
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: 4, right: 10,
              background: 'var(--color-primary)', color: '#fff',
              fontSize: 9, fontWeight: 800, borderRadius: 99,
              width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 1,
            }}>{unreadCount > 99 ? '99+' : unreadCount}</span>
          )}
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
          <span className="material-symbols-outlined" style={{ fontSize: 24 }}>person</span>
          Profile
        </NavLink>
      </nav>
    </div>
  );
}
