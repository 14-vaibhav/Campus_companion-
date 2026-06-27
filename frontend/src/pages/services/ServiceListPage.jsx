import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import SearchBar from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';
import { StatusChip } from '../../components/ui/StatusChip';
import Modal from '../../components/ui/Modal';
import { useFavorites } from '../../context/FavoritesContext';
import toast from 'react-hot-toast';

const LIMIT = 10;

// Helper to format time "09:00:00" → "9:00 AM"
const fmtTime = (t) => {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`;
};

const formatCost = (n) => n != null ? `₹${n}` : '';

export default function ServiceListPage({
  title, icon, color, bg,
  fetchAll, fetchById,
  renderDetailContent,
  cardSubtitle,
  filterBarExtras,
  serviceType,
}) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(null); // null=all, true=open, false=closed
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (search) params.search = search;
      if (filterOpen !== null) params.is_open = filterOpen;
      const res = await fetchAll(params);
      const data = res.data;
      setItems(data.data || data);
      setTotal(data.total || (data.data || data).length);
    } catch {
      setItems([]); setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, search, filterOpen, fetchAll]);

  useEffect(() => { load(); }, [load]);

  const openDetail = async (item) => {
    if (!fetchById) { setSelected(item); return; }
    setDetailLoading(true);
    setSelected(item);
    try {
      const res = await fetchById(item.id);
      setSelected(res.data);
    } catch {} finally {
      setDetailLoading(false);
    }
  };

  return (
    <AppShell>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 20px' }}>
        {/* Header */}
        <div className="animate-fade-in-up" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 36, height: 36, borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.6)',
                border: '1.5px solid var(--color-outline-variant)', transition: 'all 0.15s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#ffffff'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.6)'}
              title="Back"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-on-surface)' }}>arrow_back</span>
            </button>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 22, color }}>{icon}</span>
            </div>
            <h1 style={{ fontWeight: 800, fontSize: 24, color: 'var(--color-on-surface)', letterSpacing: '-0.01em' }}>{title}</h1>
          </div>
          <p style={{ fontSize: 14, color: 'var(--color-on-surface-variant)', paddingLeft: 100 }}>
            {total} {total === 1 ? 'result' : 'results'} found
          </p>
        </div>

        {/* Search */}
        <div className="animate-fade-in-up" style={{ marginBottom: 16 }}>
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder={`Search by name...`} />
        </div>

        {/* Filter chips */}
        <div className="animate-fade-in-up" style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {[{ label: 'All', val: null }, { label: 'Open Now', val: true }, { label: 'Closed', val: false }].map(({ label, val }) => (
            <button key={label} onClick={() => { setFilterOpen(val); setPage(1); }} style={{
              padding: '7px 16px', borderRadius: 'var(--radius-full)',
              border: filterOpen === val ? 'none' : '1.5px solid var(--color-outline-variant)',
              background: filterOpen === val ? 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' : 'rgba(255,255,255,0.75)',
              color: filterOpen === val ? '#fff' : 'var(--color-on-surface-variant)',
              fontFamily: 'var(--font-family)', fontWeight: 600, fontSize: 13,
              cursor: 'pointer', transition: 'all 0.2s',
              backdropFilter: 'blur(8px)',
            }}>
              {label === 'Open Now' && <span style={{ marginRight: 5 }}>🟢</span>}
              {label}
            </button>
          ))}
          {filterBarExtras}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-on-surface-variant)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 40, animation: 'spin 1s linear infinite' }}>progress_activity</span>
            <p style={{ marginTop: 12, fontWeight: 500 }}>Loading...</p>
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-on-surface-variant)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-outline)' }}>search_off</span>
            <p style={{ marginTop: 12, fontWeight: 600, fontSize: 16 }}>No results found</p>
            <p style={{ fontSize: 14, marginTop: 4 }}>Try a different location or filter</p>
          </div>
        ) : (
          <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map((item) => {
              const wasFav = serviceType ? isFavorite(item.id, serviceType) : false;
              return (
                /* outer wrapper is a div so we can nest a real <button> for the heart */
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  className="animate-fade-in-up glass-card"
                  onClick={() => openDetail(item)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openDetail(item); }}
                  style={{
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px', borderRadius: 'var(--radius-lg)',
                    transition: 'all 0.2s', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    outline: 'none',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${color}20`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; }}
                >
                  {/* Logo / avatar */}
                  <div style={{
                    width: 56, height: 56, borderRadius: 14, flexShrink: 0,
                    background: item.logo_url ? `url(${item.logo_url}) center/cover` : bg,
                    display: item.logo_url ? 'block' : 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid rgba(255,255,255,0.6)',
                  }}>
                    {!item.logo_url && <span className="material-symbols-outlined" style={{ fontSize: 28, color }}>{icon}</span>}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span className="text-truncate" style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-on-surface)' }}>
                        {item.name || item.driver_name}
                      </span>
                      {item.is_verified && (
                        <span className="verified-badge">
                          <span className="material-symbols-outlined">verified</span>
                        </span>
                      )}
                    </div>
                    <p className="text-truncate" style={{ fontSize: 13, color: 'var(--color-on-surface-variant)', marginBottom: 6 }}>
                      {cardSubtitle(item)}
                    </p>
                    <StatusChip isOpen={item.is_open} isAvailable={item.is_available} />
                  </div>

                  {/* Favorite button + chevron — button is valid here because outer is a div */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    {serviceType && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const was = isFavorite(item.id, serviceType);
                          toggleFavorite(item, serviceType);
                          toast(was ? 'Removed from favorites' : 'Saved to favorites!', {
                            icon: was ? '💔' : '❤️',
                          });
                        }}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          borderRadius: 'var(--radius-full)', transition: 'background 0.15s', flexShrink: 0,
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        title={wasFav ? 'Remove from favorites' : 'Save to favorites'}
                        aria-label={wasFav ? 'Remove from favorites' : 'Save to favorites'}
                      >
                        <span className="material-symbols-outlined" style={{
                          fontSize: 20,
                          color: wasFav ? '#f43f5e' : 'var(--color-outline-variant)',
                          fontVariationSettings: wasFav ? "'FILL' 1" : "'FILL' 0",
                        }}>favorite</span>
                      </button>
                    )}
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-outline-variant)' }}>chevron_right</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {total > LIMIT && (
          <Pagination page={page} limit={LIMIT} total={total} onPageChange={setPage} />
        )}
      </div>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || selected?.driver_name || 'Details'} maxWidth={560}>
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 36, animation: 'spin 1s linear infinite' }}>progress_activity</span>
          </div>
        ) : selected && renderDetailContent(selected)}
      </Modal>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AppShell>
  );
}

// ---- Shared detail helpers ----
export function DetailRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--color-outline-variant)' }}>
      <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-secondary)', flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-on-surface-variant)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-on-surface)', marginTop: 2 }}>{value}</div>
      </div>
    </div>
  );
}

export function PriceTag({ label, value }) {
  if (!value) return null;
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 0', borderBottom: '1px solid var(--color-outline-variant)',
    }}>
      <span style={{ fontSize: 14, color: 'var(--color-on-surface)' }}>{label}</span>
      <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-primary)' }}>₹{value}</span>
    </div>
  );
}

export function CallButton({ phone }) {
  const handleCall = () => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <button className="btn-primary" onClick={handleCall} style={{ width: '100%', marginTop: 16 }}>
      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>call</span>
      Call {phone}
    </button>
  );
}

export { fmtTime, formatCost };
