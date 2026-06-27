import { useState } from 'react';
import AppShell from '../components/layout/AppShell';
import SearchBar from '../components/ui/SearchBar';
import { StatusChip } from '../components/ui/StatusChip';
import FileUploader from '../components/ui/FileUploader';
import GoogleAdBanner from '../components/ui/GoogleAdBanner';

const SECTIONS = [
  { key: 'home', label: 'Home Page Components' },
  { key: 'cards', label: 'Service Cards & Listings' },
  { key: 'controls', label: 'Common UI Elements' },
];

const MOCK_SERVICES = [
  { key: 'restaurants', label: 'Restaurants', sub: 'Campus dining', icon: 'restaurant', color: '#f59e0b', bg: '#fef3c7' },
  { key: 'salons', label: 'Salons', sub: 'Book your look', icon: 'content_cut', color: '#6b38d4', bg: '#ede9fe' },
  { key: 'laundries', label: 'Laundries', sub: 'Clean & Fresh', icon: 'local_laundry_service', color: '#0ea5e9', bg: '#e0f2fe' },
  { key: 'autos', label: 'Autos', sub: 'Quick campus hop', icon: 'electric_rickshaw', color: '#f43f5e', bg: '#ffe4e6' },
  { key: 'cabs', label: 'Cabs', sub: 'Inter-city travel', icon: 'directions_car', color: '#10b981', bg: '#d1fae5' },
];

export default function DesignPlayground() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchVal, setSearchVal] = useState('');
  const [mockFavs, setMockFavs] = useState({ r1: true, d1: false });

  return (
    <AppShell>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 20px 32px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: 24, borderBottom: '1px solid var(--color-outline-variant)', paddingBottom: 16 }}>
          <h1 style={{ fontWeight: 800, fontSize: 26, color: 'var(--color-on-surface)', letterSpacing: '-0.02em', marginBottom: 6 }}>
            🎨 Design Playground
          </h1>
          <p style={{ fontSize: 14, color: 'var(--color-on-surface-variant)', lineHeight: 1.5 }}>
            Isolated visual testbench for CampusHub's sunset glassmorphism design tokens.
          </p>
        </div>

        {/* Tabs switcher */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {SECTIONS.map((sec) => (
            <button
              key={sec.key}
              onClick={() => setActiveTab(sec.key)}
              style={{
                padding: '8px 16px', borderRadius: 'var(--radius-full)', cursor: 'pointer',
                border: activeTab === sec.key ? 'none' : '1.5px solid var(--color-outline-variant)',
                background: activeTab === sec.key
                  ? 'linear-gradient(135deg, var(--color-primary), #ff6b6b)'
                  : 'rgba(255,255,255,0.7)',
                color: activeTab === sec.key ? '#fff' : 'var(--color-on-surface-variant)',
                fontFamily: 'var(--font-family)', fontWeight: 700, fontSize: 13,
                transition: 'all 0.2s',
              }}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Home Page Components */}
        {activeTab === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            
            {/* Title / Info */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.05em', marginBottom: 12 }}>
                1. Hero & Greeting Header
              </h3>
              <div style={{ padding: 16, background: 'rgba(255,255,255,0.4)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-outline-variant)' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4 }}>
                  Good afternoon 👋
                </p>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-on-surface)', letterSpacing: '-0.02em', margin: 0 }}>
                  Test User
                </h2>
                <p style={{ fontSize: 14, color: 'var(--color-on-surface-variant)', marginTop: 4 }}>
                  What do you need today?
                </p>
              </div>
            </div>

            {/* Service Grid Card Selector */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.05em', marginBottom: 12 }}>
                2. Grid Service Cards (Hover & Layout test)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {MOCK_SERVICES.map((svc, i) => {
                  const isLastOdd = i === MOCK_SERVICES.length - 1 && MOCK_SERVICES.length % 2 !== 0;
                  return (
                    <div
                      key={svc.key}
                      style={{
                        cursor: 'pointer',
                        gridColumn: isLastOdd ? '1 / -1' : undefined,
                        background: 'rgba(255,255,255,0.78)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.55)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '16px 14px',
                        display: 'flex',
                        flexDirection: isLastOdd ? 'row' : 'column',
                        alignItems: isLastOdd ? 'center' : 'flex-start',
                        gap: isLastOdd ? 14 : 10,
                        boxShadow: '0 4px 16px rgba(174,47,52,0.06)',
                        transition: 'all 0.25s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = `0 10px 24px ${svc.color}25`;
                        e.currentTarget.style.borderColor = `${svc.color}40`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = '';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(174,47,52,0.06)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.55)';
                      }}
                    >
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: svc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 24, color: svc.color }}>
                          {svc.icon}
                        </span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-on-surface)' }}>{svc.label}</div>
                        <div style={{ fontSize: 11, color: 'var(--color-on-surface-variant)', marginTop: 2 }}>{svc.sub}</div>
                      </div>
                      <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-outline-variant)' }}>
                        chevron_right
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info Accent Banner */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.05em', marginBottom: 12 }}>
                3. Crimson Information Banner
              </h3>
              <div className="glass-card" style={{
                background: 'linear-gradient(135deg, rgba(174,47,52,0.07) 0%, rgba(255,107,107,0.07) 100%)',
                border: '1px solid rgba(174,47,52,0.15)',
                padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: 'linear-gradient(135deg, #ae2f34, #ff6b6b)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(174,47,52,0.25)',
                }}>
                  <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 20 }}>auto_awesome</span>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-primary)' }}>Campus, covered.</div>
                  <div style={{ fontSize: 12, color: 'var(--color-on-surface-variant)', marginTop: 2 }}>
                    Dining, laundry, transport & grooming — all in one place.
                  </div>
                </div>
              </div>
            </div>

            {/* Google Ads Placeholder Banner */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.05em', marginBottom: 12 }}>
                4. Google Ads Slot Banner
              </h3>
              <GoogleAdBanner slot="MOCK_AD" format="horizontal" responsive={true} />
            </div>

          </div>
        )}

        {/* Tab 2: Service Cards & Listings */}
        {activeTab === 'cards' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Standard Listing Cards */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.05em', marginBottom: 12 }}>
                Standard Listing Cards (Restaurants / Salons / Laundries)
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Restaurant Mock (Verified & Open) */}
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.6)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#f59e0b' }}>restaurant</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-on-surface)' }}>The Campus Cafe</span>
                      <span className="verified-badge"><span className="material-symbols-outlined">verified</span></span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--color-on-surface-variant)', marginBottom: 6 }}>Block A · ₹150/person</p>
                    <StatusChip isOpen={true} />
                  </div>
                  <button onClick={() => setMockFavs(prev => ({ ...prev, r1: !prev.r1 }))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
                    <span className="material-symbols-outlined" style={{ color: mockFavs.r1 ? '#f43f5e' : 'var(--color-outline-variant)', fontVariationSettings: mockFavs.r1 ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                  </button>
                </div>

                {/* Salon Mock (Unverified & Closed) */}
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.6)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#6b38d4' }}>content_cut</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-on-surface)' }}>Student Haircuts</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--color-on-surface-variant)', marginBottom: 6 }}>Hostel Wing C · ₹80 haircut</p>
                    <StatusChip isOpen={false} />
                  </div>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--color-outline-variant)' }}>favorite</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Driver Listing Cards */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.05em', marginBottom: 12 }}>
                Driver Cards (Cabs / Autos)
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Cab Mock (Available & Verified) */}
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.6)', fontWeight: 800, color: '#10b981', fontSize: 20 }}>
                    R
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-on-surface)' }}>Ramesh Kumar</span>
                      <span className="verified-badge"><span className="material-symbols-outlined">verified</span></span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--color-on-surface-variant)', marginBottom: 6 }}>Swift DZire · DL 1Y 9832</p>
                    <StatusChip isAvailable={true} />
                  </div>
                  <button onClick={() => setMockFavs(prev => ({ ...prev, d1: !prev.d1 }))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
                    <span className="material-symbols-outlined" style={{ color: mockFavs.d1 ? '#f43f5e' : 'var(--color-outline-variant)', fontVariationSettings: mockFavs.d1 ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Notification List Cards */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.05em', marginBottom: 12 }}>
                Notification Feed Cards
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Unread Admin Broadcast */}
                <div style={{ display: 'flex', gap: 14, padding: '16px 18px', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.88)', border: '1px solid rgba(174,47,52,0.25)', borderLeft: '3px solid var(--color-primary)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ffe4e6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ color: '#f43f5e' }}>warning</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-on-surface)' }}>Server Outage Planned</span>
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#818cf8', background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.25)', borderRadius: 99, padding: '1px 7px' }}>CAMPUS</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--color-on-surface-variant)', margin: '0 0 6px' }}>Wi-Fi servers in Hostel Block A will be down tonight between 12:00 AM and 2:00 AM for hardware upgrades.</p>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-outline)' }}>45m ago</span>
                  </div>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)' }} />
                </div>

                {/* Read System Notification */}
                <div style={{ display: 'flex', gap: 14, padding: '16px 18px', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.72)', border: '1px solid rgba(255,255,255,0.45)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(53,37,205,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ color: '#3525cd' }}>waving_hand</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-on-surface)' }}>Welcome to CampusHub!</span>
                    <p style={{ fontSize: 13, color: 'var(--color-on-surface-variant)', margin: '2px 0 6px' }}>Explore dining, transports, laundries, and styling around Block B.</p>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-outline)' }}>2h ago</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: Common UI Elements */}
        {activeTab === 'controls' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Interactive Search */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.05em', marginBottom: 12 }}>
                Search Bar
              </h3>
              <SearchBar value={searchVal} onChange={setSearchVal} placeholder="Search by name..." />
            </div>

            {/* Status Chips */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.05em', marginBottom: 12 }}>
                Status Chips (Vendors & Drivers)
              </h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <StatusChip isOpen={true} />
                <StatusChip isOpen={false} />
                <StatusChip isAvailable={true} />
                <StatusChip isAvailable={false} />
              </div>
            </div>

            {/* Buttons Showcase */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.05em', marginBottom: 12 }}>
                Button Library
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button className="btn-primary" style={{ justifyContent: 'center' }}>Primary Call to Action</button>
                <button className="btn-secondary" style={{ justifyContent: 'center' }}>Secondary Option</button>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn-ghost" style={{ flex: 1 }}>Ghost Cancel</button>
                  <button className="btn-icon" title="Test info"><span className="material-symbols-outlined">info</span></button>
                  <button className="btn-icon" title="Test favorite"><span className="material-symbols-outlined" style={{ color: '#f43f5e' }}>favorite</span></button>
                </div>
              </div>
            </div>

            {/* File Upload States */}
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.05em', marginBottom: 12 }}>
                File Uploader Drag & Drop Dropzone
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Default */}
                <FileUploader label="Default Upload Box" onUpload={() => {}} />

                {/* Progress simulator */}
                <div style={{ padding: 20, background: 'rgba(255,255,255,0.7)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-outline-variant)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                    <span>uploading_file.png</span>
                    <span style={{ color: 'var(--color-primary)' }}>65%</span>
                  </div>
                  <div style={{ width: '100%', height: 6, background: 'var(--color-surface-container)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ width: '65%', height: '100%', background: 'linear-gradient(135deg, var(--color-primary), #ff6b6b)' }} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </AppShell>
  );
}
