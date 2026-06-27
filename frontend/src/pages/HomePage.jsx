import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppShell from '../components/layout/AppShell';
import GoogleAdBanner from '../components/ui/GoogleAdBanner';

const SERVICES = [
  { key: 'restaurants', label: 'Restaurants', sub: 'Campus dining', icon: 'restaurant', color: '#f59e0b', bg: '#fef3c7' },
  { key: 'salons', label: 'Salons', sub: 'Book your look', icon: 'content_cut', color: '#6b38d4', bg: '#ede9fe' },
  { key: 'laundries', label: 'Laundries', sub: 'Clean & Fresh', icon: 'local_laundry_service', color: '#0ea5e9', bg: '#e0f2fe' },
  { key: 'autos', label: 'Autos', sub: 'Quick campus hop', icon: 'electric_rickshaw', color: '#f43f5e', bg: '#ffe4e6' },
  { key: 'cabs', label: 'Cabs', sub: 'Inter-city travel', icon: 'directions_car', color: '#10b981', bg: '#d1fae5' },
];

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <AppShell>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 20px 16px' }}>

        {/* Hero */}
        <div className="animate-fade-in-up" style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4 }}>
            {greeting} 👋
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-on-surface)', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 6 }}>
            {user?.username || 'Welcome back'}
          </h1>
          <p style={{ fontSize: 15, color: 'var(--color-on-surface-variant)', lineHeight: 1.5 }}>
            What do you need today?
          </p>
        </div>

        {/* Service Cards — 2-col grid, last card spans full width */}
        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
          {SERVICES.map((svc, i) => {
            const isLastOdd = i === SERVICES.length - 1 && SERVICES.length % 2 !== 0;
            return (
              <button
                key={svc.key}
                className="animate-fade-in-up"
                onClick={() => navigate(`/services/${svc.key}`)}
                style={{
                  all: 'unset', cursor: 'pointer',
                  gridColumn: isLastOdd ? '1 / -1' : undefined,
                  background: 'rgba(255,255,255,0.78)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.55)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px 16px',
                  display: 'flex',
                  flexDirection: isLastOdd ? 'row' : 'column',
                  alignItems: isLastOdd ? 'center' : 'flex-start',
                  gap: isLastOdd ? 16 : 12,
                  boxShadow: '0 4px 16px rgba(174,47,52,0.06)',
                  transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 12px 28px ${svc.color}30`;
                  e.currentTarget.style.borderColor = `${svc.color}45`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(174,47,52,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.55)';
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                  background: svc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 26, color: svc.color }}>
                    {svc.icon}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-on-surface)' }}>{svc.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-on-surface-variant)', marginTop: 2 }}>{svc.sub}</div>
                </div>
                <span className="material-symbols-outlined" style={{
                  position: isLastOdd ? 'static' : 'absolute',
                  bottom: isLastOdd ? undefined : 14,
                  right: isLastOdd ? undefined : 14,
                  fontSize: 18,
                  color: 'var(--color-outline-variant)',
                  marginLeft: isLastOdd ? 'auto' : undefined,
                }}>chevron_right</span>
              </button>
            );
          })}
        </div>

        {/* Banner */}
        <div className="animate-fade-in-up glass-card" style={{
          background: 'linear-gradient(135deg, rgba(174,47,52,0.07) 0%, rgba(255,107,107,0.07) 100%)',
          border: '1px solid rgba(174,47,52,0.15)',
          padding: '20px 24px',
          display: 'flex', alignItems: 'center', gap: 16,
          marginBottom: 20,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg, #ae2f34, #ff6b6b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: '0 6px 16px rgba(174,47,52,0.25)',
          }}>
            <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 24 }}>auto_awesome</span>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-primary)' }}>Campus, covered.</div>
            <div style={{ fontSize: 13, color: 'var(--color-on-surface-variant)', marginTop: 2 }}>
              Dining, laundry, transport & grooming — all in one place.
            </div>
          </div>
        </div>

        {/* Google Ads slot */}
        <div className="animate-fade-in-up" style={{ marginBottom: 20 }}>
          <GoogleAdBanner
            slot="YOUR_AD_SLOT_ID"
            format="horizontal"
            responsive={true}
          />
        </div>
      </div>
    </AppShell>
  );
}
