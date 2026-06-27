import ServiceListPage, { DetailRow, PriceTag, CallButton, fmtTime } from './ServiceListPage';
import { StatusChip } from '../../components/ui/StatusChip';
import { getLaundries, getLaundryById } from '../../services/dataService';

export default function LaundriesPage() {
  return (
    <ServiceListPage
      title="Laundry Services"
      icon="local_laundry_service"
      color="#0ea5e9"
      bg="#e0f2fe"
      fetchAll={getLaundries}
      fetchById={getLaundryById}
      serviceType="laundries"
      cardSubtitle={(item) => [item.location, item.price_per_kg ? `₹${item.price_per_kg}/kg` : ''].filter(Boolean).join(' · ')}
      renderDetailContent={(l) => (
        <div>
          {l.logo_url && (
            <img src={l.logo_url} alt={l.name} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: 16 }} />
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: 20 }}>{l.name}</h2>
              <StatusChip isOpen={l.is_open} />
            </div>
            {l.is_verified && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#1d4ed8' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>verified</span> Verified
              </span>
            )}
          </div>

          {l.description && <p style={{ fontSize: 14, color: 'var(--color-on-surface-variant)', lineHeight: 1.6, marginBottom: 16 }}>{l.description}</p>}

          <DetailRow icon="location_on" label="Location" value={l.location} />
          <DetailRow icon="schedule" label="Hours" value={l.opening_time && l.closing_time ? `${fmtTime(l.opening_time)} – ${fmtTime(l.closing_time)}` : null} />

          <div style={{ marginTop: 16, background: 'var(--color-surface-container-low)', borderRadius: 'var(--radius-lg)', padding: '16px 16px 4px' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-on-surface-variant)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>Pricing</p>
            <PriceTag label="Wash & Fold (per kg)" value={l.price_per_kg} />
          </div>

          {l.phone_number && <CallButton phone={l.phone_number} />}
        </div>
      )}
    />
  );
}
