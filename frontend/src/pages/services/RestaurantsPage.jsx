import { useState, useEffect } from 'react';
import ServiceListPage, { DetailRow, CallButton, fmtTime } from './ServiceListPage';
import { StatusChip } from '../../components/ui/StatusChip';
import { getRestaurants, getRestaurantById } from '../../services/dataService';

function RestaurantDetail({ r }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      setLightboxIndex((prev) => (prev + 1) % r.menu_images.length);
    }
    if (isRightSwipe) {
      setLightboxIndex((prev) => (prev - 1 + r.menu_images.length) % r.menu_images.length);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % r.menu_images.length);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + r.menu_images.length) % r.menu_images.length);
      } else if (e.key === 'Escape') {
        setLightboxIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, r.menu_images]);

  const showPrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + r.menu_images.length) % r.menu_images.length);
  };

  const showNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % r.menu_images.length);
  };

  return (
    <div>
      {/* Hero image */}
      {r.logo_url && (
        <img src={r.logo_url} alt={r.name} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: 16 }} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: 20, color: 'var(--color-on-surface)' }}>{r.name}</h2>
          <StatusChip isOpen={r.is_open} />
        </div>
        {r.is_verified && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#1d4ed8' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#3b82f6' }}>verified</span> Verified
          </span>
        )}
      </div>

      {r.description && <p style={{ fontSize: 14, color: 'var(--color-on-surface-variant)', lineHeight: 1.6, marginBottom: 16 }}>{r.description}</p>}
      {r.disclaimer && <p style={{ fontSize: 12, color: 'var(--color-outline)', fontStyle: 'italic', marginBottom: 12 }}>{r.disclaimer}</p>}

      <DetailRow icon="location_on" label="Location" value={r.location} />
      <DetailRow icon="schedule" label="Hours" value={r.opening_time && r.closing_time ? `${fmtTime(r.opening_time)} – ${fmtTime(r.closing_time)}` : null} />
      <DetailRow icon="currency_rupee" label="Avg cost for one" value={r.average_cost_for_one ? `₹${r.average_cost_for_one}` : null} />

      {/* Menu image gallery */}
      {r.menu_images?.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-on-surface-variant)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 10 }}>Menu (Tap to Zoom)</p>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {r.menu_images.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Menu ${i + 1}`}
                onClick={() => setLightboxIndex(i)}
                style={{
                  width: 120,
                  height: 90,
                  objectFit: 'cover',
                  borderRadius: 10,
                  flexShrink: 0,
                  border: '2px solid var(--color-outline-variant)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
              />
            ))}
          </div>
        </div>
      )}

      {r.phone_number && <CallButton phone={r.phone_number} />}

      {/* Fullscreen Lightbox Overlay */}
      {lightboxIndex !== null && (
        <div
          onClick={() => setLightboxIndex(null)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 10, 46, 0.92)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.25s ease',
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxIndex(null)}
            style={{
              position: 'absolute', top: 20, right: 20,
              background: 'rgba(255,255,255,0.1)', border: 'none',
              width: 44, height: 44, borderRadius: '50%',
              color: '#ffffff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 24 }}>close</span>
          </button>

          {/* Left Arrow */}
          {r.menu_images.length > 1 && (
            <button
              onClick={showPrev}
              style={{
                position: 'absolute', left: 20,
                background: 'rgba(255,255,255,0.1)', border: 'none',
                width: 48, height: 48, borderRadius: '50%',
                color: '#ffffff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s', zIndex: 10,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 28 }}>chevron_left</span>
            </button>
          )}

          {/* Image Container with Zoom support */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 'calc(100% - 140px)',
              maxHeight: 'calc(100% - 120px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <img
              src={r.menu_images[lightboxIndex]}
              alt={`Menu ${lightboxIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '75dvh',
                objectFit: 'contain',
                borderRadius: 12,
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                border: '2px solid rgba(255,255,255,0.15)',
                animation: 'scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            />
            {/* Index indicator */}
            <div style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: 14,
              fontWeight: 700,
              background: 'rgba(0,0,0,0.4)',
              padding: '6px 16px',
              borderRadius: 99,
              letterSpacing: '0.05em',
            }}>
              {lightboxIndex + 1} / {r.menu_images.length}
            </div>
          </div>

          {/* Right Arrow */}
          {r.menu_images.length > 1 && (
            <button
              onClick={showNext}
              style={{
                position: 'absolute', right: 20,
                background: 'rgba(255,255,255,0.1)', border: 'none',
                width: 48, height: 48, borderRadius: '50%',
                color: '#ffffff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s', zIndex: 10,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 28 }}>chevron_right</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function RestaurantsPage() {
  return (
    <ServiceListPage
      title="Restaurants"
      icon="restaurant"
      color="#f59e0b"
      bg="#fef3c7"
      fetchAll={getRestaurants}
      fetchById={getRestaurantById}
      serviceType="restaurants"
      cardSubtitle={(item) => [item.location, item.average_cost_for_one ? `₹${item.average_cost_for_one}/person` : ''].filter(Boolean).join(' · ')}
      renderDetailContent={(r) => <RestaurantDetail r={r} />}
    />
  );
}
