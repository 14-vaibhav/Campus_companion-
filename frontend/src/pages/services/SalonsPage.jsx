import ServiceListPage, { DetailRow, PriceTag, CallButton, fmtTime } from './ServiceListPage';
import { StatusChip } from '../../components/ui/StatusChip';
import { getSalons, getSalonById } from '../../services/dataService';

export default function SalonsPage() {
  return (
    <ServiceListPage
      title="Salons & Barbershops"
      icon="content_cut"
      color="#6b38d4"
      bg="#ede9fe"
      fetchAll={getSalons}
      fetchById={getSalonById}
      serviceType="salons"
      cardSubtitle={(item) => [item.location, item.haircut_price ? `Haircut ₹${item.haircut_price}` : ''].filter(Boolean).join(' · ')}
      renderDetailContent={(s) => (
        <div>
          {s.logo_url && (
            <img src={s.logo_url} alt={s.name} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: 16 }} />
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: 20, color: 'var(--color-on-surface)' }}>{s.name}</h2>
              <StatusChip isOpen={s.is_open} />
            </div>
            {s.is_verified && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#1d4ed8' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>verified</span> Verified
              </span>
            )}
          </div>

          {s.description && <p style={{ fontSize: 14, color: 'var(--color-on-surface-variant)', lineHeight: 1.6, marginBottom: 16 }}>{s.description}</p>}

          <DetailRow icon="location_on" label="Location" value={s.location} />
          <DetailRow icon="schedule" label="Hours" value={s.opening_time && s.closing_time ? `${fmtTime(s.opening_time)} – ${fmtTime(s.closing_time)}` : null} />

          {/* Price List */}
          <div style={{ marginTop: 16, background: 'var(--color-surface-container-low)', borderRadius: 'var(--radius-lg)', padding: '16px 16px 4px' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-on-surface-variant)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>Price List</p>
            <PriceTag label="Haircut" value={s.haircut_price} />
            <PriceTag label="Beard Trim" value={s.beard_price} />
          </div>

          {s.phone_number && <CallButton phone={s.phone_number} />}
        </div>
      )}
    />
  );
}
