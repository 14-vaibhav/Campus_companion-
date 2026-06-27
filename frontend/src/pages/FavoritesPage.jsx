import { useState } from 'react';
import AppShell from '../components/layout/AppShell';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';

const SERVICE_META = {
  restaurants: { icon: 'restaurant', color: '#f59e0b', bg: '#fef3c7', route: '/services/restaurants' },
  salons:      { icon: 'content_cut', color: '#6b38d4', bg: '#ede9fe', route: '/services/salons' },
  laundries:   { icon: 'local_laundry_service', color: '#0ea5e9', bg: '#e0f2fe', route: '/services/laundries' },
  cabs:        { icon: 'directions_car', color: '#10b981', bg: '#d1fae5', route: '/services/cabs' },
  autos:       { icon: 'electric_rickshaw', color: '#f43f5e', bg: '#ffe4e6', route: '/services/autos' },
};

const FILTERS = ['All', 'Restaurants', 'Salons', 'Laundries', 'Cabs', 'Autos'];

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, removeFavorite } = useFavorites();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? favorites
    : favorites.filter((f) => f.serviceType === activeFilter.toLowerCase());

  const goToService = (serviceType) => {
    const meta = SERVICE_META[serviceType];
    if (meta) navigate(meta.route);
  };

  return (
    <AppShell>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 20px 16px' }}>

        {/* Header */}
        <div className="animate-fade-in-up" style={{ marginBottom: 24 }}>
          <h1 style={{ fontWeight: 800, fontSize: 26, color: 'var(--color-on-surface)', letterSpacing: '-0.02em', marginBottom: 4 }}>
            Saved Services
          </h1>
          <p style={{ color: 'var(--color-on-surface-variant)', fontSize: 14 }}>
            {favorites.length === 0
              ? "You haven't bookmarked anything yet."
              : `${favorites.length} saved service${favorites.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Filter chips */}
        {favorites.length > 0 && (
          <div className="animate-fade-in-up" style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)} style={{
                padding: '7px 16px', borderRadius: 'var(--radius-full)', cursor: 'pointer',
                border: activeFilter === f ? 'none' : '1.5px solid var(--color-outline-variant)',
                background: activeFilter === f ? 'linear-gradient(135deg, var(--color-primary), #ff6b6b)' : 'rgba(255,255,255,0.75)',
                color: activeFilter === f ? '#fff' : 'var(--color-on-surface-variant)',
                fontFamily: 'var(--font-family)', fontWeight: 600, fontSize: 13, transition: 'all 0.2s',
              }}>
                {f}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {favorites.length === 0 ? (
          <div className="glass-card animate-fade-in-up" style={{ padding: 48, textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 56, color: 'var(--color-outline)', marginBottom: 16, display: 'block' }}>
              favorite_border
            </span>
            <p style={{ fontWeight: 700, fontSize: 17, color: 'var(--color-on-surface)', marginBottom: 8 }}>No favorites yet</p>
            <p style={{ fontSize: 14, color: 'var(--color-on-surface-variant)', marginBottom: 24, lineHeight: 1.5 }}>
              Browse services and tap the ♡ button to save your go-to spots here.
            </p>
            <button className="btn-primary" onClick={() => navigate('/home')} style={{ justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>explore</span>
              Explore Services
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card animate-fade-in-up" style={{ padding: 48, textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-outline)', marginBottom: 12, display: 'block' }}>search_off</span>
            <p style={{ fontWeight: 600, fontSize: 16 }}>No {activeFilter} saved</p>
            <button style={{ marginTop: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-family)' }}
              onClick={() => setActiveFilter('All')}>Show all favorites</button>
          </div>
        ) : (
          <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((item) => {
              const meta = SERVICE_META[item.serviceType] || {};
              const displayName = item.name || item.driver_name || 'Unknown';
              const subtitle = item.location || [item.vehicle_model, item.vehicle_number].filter(Boolean).join(' · ') || item.serviceType;
              return (
                <div key={`${item.serviceType}-${item.id}`}
                  className="animate-fade-in-up glass-card"
                  style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px', borderRadius: 'var(--radius-lg)' }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                    background: item.logo_url ? `url(${item.logo_url}) center/cover` : meta.bg,
                    display: item.logo_url ? 'block' : 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    border: '2px solid rgba(255,255,255,0.6)',
                  }}>
                    {!item.logo_url && (
                      <span className="material-symbols-outlined" style={{ fontSize: 26, color: meta.color }}>{meta.icon}</span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-on-surface)', marginBottom: 3 }}
                      className="text-truncate">{displayName}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-on-surface-variant)' }} className="text-truncate">{subtitle}</div>
                    <div style={{
                      display: 'inline-block', marginTop: 5, fontSize: 11, fontWeight: 700,
                      color: meta.color, background: meta.bg, padding: '2px 10px', borderRadius: 99,
                      textTransform: 'capitalize',
                    }}>{item.serviceType}</div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                    <button
                      onClick={() => goToService(item.serviceType)}
                      style={{
                        background: 'var(--color-surface-container)', border: 'none', borderRadius: 'var(--radius-md)',
                        padding: '6px 12px', cursor: 'pointer', fontFamily: 'var(--font-family)',
                        fontSize: 12, fontWeight: 600, color: 'var(--color-on-surface)',
                        display: 'flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
                      View
                    </button>
                    <button
                      onClick={() => removeFavorite(item.id, item.serviceType)}
                      style={{
                        background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)',
                        borderRadius: 'var(--radius-md)', padding: '6px 12px', cursor: 'pointer',
                        fontFamily: 'var(--font-family)', fontSize: 12, fontWeight: 600, color: '#f43f5e',
                        display: 'flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>heart_minus</span>
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick links to services */}
        {favorites.length > 0 && (
          <div className="animate-fade-in-up" style={{ marginTop: 32, textAlign: 'center' }}>
            <button className="btn-secondary" onClick={() => navigate('/home')}
              style={{ width: '100%', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>explore</span>
              Discover More Services
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
