import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import Pagination from '../../components/ui/Pagination';
import { StatusChip } from '../../components/ui/StatusChip';
import Modal from '../../components/ui/Modal';
import { DetailRow, CallButton } from './ServiceListPage';
import { useFavorites } from '../../context/FavoritesContext';
import toast from 'react-hot-toast';

const LIMIT = 15;

function DriverListPage({ title, icon, color, bg, fetchAll, serviceType }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filterVerified, setFilterVerified] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const { toggleFavorite, isFavorite } = useFavorites();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (filterVerified !== null) params.is_verified = filterVerified;
      const res = await fetchAll(params);
      const data = res.data;
      setItems(data.data || data);
      setTotal(data.total || (data.data || data).length);
    } catch { setItems([]); setTotal(0); } finally { setLoading(false); }
  }, [page, filterVerified, fetchAll]);

  useEffect(() => { load(); }, [load]);

  return (
    <AppShell>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 20px' }}>
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
          <p style={{ fontSize: 14, color: 'var(--color-on-surface-variant)', paddingLeft: 100 }}>{total} drivers available</p>
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {[{ label: 'All Drivers', val: null }, { label: '✅ Verified Only', val: true }].map(({ label, val }) => (
            <button key={label} onClick={() => { setFilterVerified(val); setPage(1); }} style={{
              padding: '7px 16px', borderRadius: 'var(--radius-full)',
              border: filterVerified === val ? 'none' : '1.5px solid var(--color-outline-variant)',
              background: filterVerified === val ? 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' : 'rgba(255,255,255,0.75)',
              color: filterVerified === val ? '#fff' : 'var(--color-on-surface-variant)',
              fontFamily: 'var(--font-family)', fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* Driver List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 40, animation: 'spin 1s linear infinite', color: 'var(--color-outline)' }}>progress_activity</span>
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-on-surface-variant)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-outline)' }}>person_off</span>
            <p style={{ marginTop: 12, fontWeight: 600 }}>No drivers found</p>
          </div>
        ) : (
          <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map((driver) => {
              const wasFav = serviceType ? isFavorite(driver.id, serviceType) : false;
              return (
                <div
                  key={driver.id}
                  role="button"
                  tabIndex={0}
                  className="animate-fade-in-up glass-card"
                  onClick={() => setSelected(driver)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelected(driver); }}
                  style={{
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px', borderRadius: 'var(--radius-lg)',
                    transition: 'all 0.2s', outline: 'none',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 50, height: 50, borderRadius: '50%', flexShrink: 0,
                    background: `linear-gradient(135deg, ${color}30, ${color}60)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `2px solid ${color}40`,
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 24, color }}>{icon}</span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-on-surface)' }}>{driver.driver_name}</span>
                      {driver.is_verified && <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#3b82f6' }}>verified</span>}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--color-on-surface-variant)', marginBottom: 5 }}>
                      {[driver.vehicle_model, driver.vehicle_number].filter(Boolean).join(' · ')}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <StatusChip isAvailable={driver.is_available} />
                      {driver.base_fare && (
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}>₹{driver.base_fare} base</span>
                      )}
                    </div>
                  </div>

                  {/* Favorite + chevron — button valid because outer is div */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    {serviceType && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const was = isFavorite(driver.id, serviceType);
                          toggleFavorite(driver, serviceType);
                          toast(was ? 'Removed from favorites' : 'Saved to favorites!', {
                            icon: was ? '💔' : '❤️',
                          });
                        }}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          borderRadius: 'var(--radius-full)', transition: 'background 0.15s',
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
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-outline-variant)', flexShrink: 0 }}>chevron_right</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {total > LIMIT && <Pagination page={page} limit={LIMIT} total={total} onPageChange={setPage} />}
      </div>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.driver_name || 'Driver Details'}>
        {selected && (
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20,
              padding: 16, background: 'var(--color-surface-container-low)', borderRadius: 'var(--radius-lg)',
            }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: `linear-gradient(135deg, ${color}30, ${color}60)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `2px solid ${color}40`,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 30, color }}>{icon}</span>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{selected.driver_name}</div>
                <StatusChip isAvailable={selected.is_available} />
              </div>
            </div>
            <DetailRow icon={icon} label="Vehicle" value={[selected.vehicle_model, selected.vehicle_number].filter(Boolean).join(' · ')} />
            <DetailRow icon="currency_rupee" label="Base Fare" value={selected.base_fare ? `₹${selected.base_fare}` : null} />
            <DetailRow icon="verified" label="Status" value={selected.is_verified ? 'Verified Driver' : 'Unverified'} />
            {selected.phone_number && <CallButton phone={selected.phone_number} />}
          </div>
        )}
      </Modal>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </AppShell>
  );
}

export default DriverListPage;
