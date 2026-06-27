import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationsContext';
import Modal from '../../components/ui/Modal';
import FileUploader from '../../components/ui/FileUploader';
import Pagination from '../../components/ui/Pagination';
import { StatusChip } from '../../components/ui/StatusChip';
import toast from 'react-hot-toast';
import {
  getRestaurants, createRestaurant, updateRestaurant, deleteRestaurant,
  getLaundries, createLaundry, updateLaundry, deleteLaundry,
  getSalons, createSalon, updateSalon, deleteSalon,
  getCabs, createCab, updateCab, deleteCab,
  getAutos, createAuto, updateAuto, deleteAuto,
} from '../../services/dataService';

const TABS = [
  { key: 'restaurants', label: 'Restaurants', icon: 'restaurant', color: '#f59e0b' },
  { key: 'salons', label: 'Salons', icon: 'content_cut', color: '#6b38d4' },
  { key: 'laundries', label: 'Laundries', icon: 'local_laundry_service', color: '#0ea5e9' },
  { key: 'cabs', label: 'Cabs', icon: 'directions_car', color: '#10b981' },
  { key: 'autos', label: 'Autos', icon: 'electric_rickshaw', color: '#f43f5e' },
  { key: 'notifications', label: 'Notifications', icon: 'notifications', color: '#818cf8' },
];

const FIELDS = {
  restaurants: [
    { key: 'name', label: 'Name', required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'disclaimer', label: 'Disclaimer', type: 'textarea' },
    { key: 'location', label: 'Location', required: true },
    { key: 'phone_number', label: 'Phone Number', required: true },
    { key: 'opening_time', label: 'Opening Time', type: 'time' },
    { key: 'closing_time', label: 'Closing Time', type: 'time' },
    { key: 'average_cost_for_one', label: 'Avg Cost For One (₹)', type: 'number' },
    { key: 'is_open', label: 'Currently Open', type: 'checkbox' },
    { key: 'is_verified', label: 'Verified', type: 'checkbox' },
    { key: 'logo_url', label: 'Logo Image', type: 'upload' },
  ],
  salons: [
    { key: 'name', label: 'Name', required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'location', label: 'Location', required: true },
    { key: 'phone_number', label: 'Phone Number', required: true },
    { key: 'haircut_price', label: 'Haircut Price (₹)', type: 'number', required: true },
    { key: 'beard_price', label: 'Beard Price (₹)', type: 'number', required: true },
    { key: 'opening_time', label: 'Opening Time', type: 'time' },
    { key: 'closing_time', label: 'Closing Time', type: 'time' },
    { key: 'is_open', label: 'Currently Open', type: 'checkbox' },
    { key: 'is_verified', label: 'Verified', type: 'checkbox' },
    { key: 'logo_url', label: 'Logo Image', type: 'upload' },
  ],
  laundries: [
    { key: 'name', label: 'Name', required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'location', label: 'Location', required: true },
    { key: 'phone_number', label: 'Phone Number', required: true },
    { key: 'price_per_kg', label: 'Price Per Kg (₹)', type: 'number' },
    { key: 'opening_time', label: 'Opening Time', type: 'time' },
    { key: 'closing_time', label: 'Closing Time', type: 'time' },
    { key: 'is_open', label: 'Currently Open', type: 'checkbox' },
    { key: 'is_verified', label: 'Verified', type: 'checkbox' },
    { key: 'logo_url', label: 'Logo Image', type: 'upload' },
  ],
  cabs: [
    { key: 'driver_name', label: 'Driver Name', required: true },
    { key: 'vehicle_number', label: 'Vehicle Number', required: true },
    { key: 'vehicle_model', label: 'Vehicle Model' },
    { key: 'phone_number', label: 'Phone Number', required: true },
    { key: 'base_fare', label: 'Base Fare (₹)', type: 'number' },
    { key: 'is_available', label: 'Currently Available', type: 'checkbox' },
    { key: 'is_verified', label: 'Verified', type: 'checkbox' },
  ],
  autos: [
    { key: 'driver_name', label: 'Driver Name', required: true },
    { key: 'vehicle_number', label: 'Vehicle Number', required: true },
    { key: 'phone_number', label: 'Phone Number', required: true },
    { key: 'base_fare', label: 'Base Fare (₹)', type: 'number' },
    { key: 'is_available', label: 'Currently Available', type: 'checkbox' },
    { key: 'is_verified', label: 'Verified', type: 'checkbox' },
  ],
};

const API = {
  restaurants: { getAll: getRestaurants, create: createRestaurant, update: updateRestaurant, remove: deleteRestaurant },
  salons: { getAll: getSalons, create: createSalon, update: updateSalon, remove: deleteSalon },
  laundries: { getAll: getLaundries, create: createLaundry, update: updateLaundry, remove: deleteLaundry },
  cabs: { getAll: getCabs, create: createCab, update: updateCab, remove: deleteCab },
  autos: { getAll: getAutos, create: createAuto, update: updateAuto, remove: deleteAuto },
};

const LIMIT = 10;

function FormField({ field, value, onChange }) {
  const base = {
    fontFamily: 'var(--font-family)', fontSize: 14,
    padding: '10px 12px', borderRadius: 'var(--radius-md)',
    border: '1.5px solid var(--color-outline-variant)', outline: 'none',
    color: 'var(--color-on-surface)', background: 'rgba(255,255,255,0.9)',
    width: '100%', transition: 'border-color 0.2s',
  };

  if (field.type === 'upload') {
    return <FileUploader label={field.label} currentUrl={value} onUpload={(url) => onChange(field.key, url)} />;
  }
  if (field.type === 'checkbox') {
    return (
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(field.key, e.target.checked)}
          style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-on-surface)' }}>{field.label}</span>
      </label>
    );
  }
  if (field.type === 'textarea') {
    return <textarea rows={3} style={{ ...base, resize: 'vertical' }} value={value || ''} onChange={(e) => onChange(field.key, e.target.value)} required={field.required} />;
  }
  return (
    <input type={field.type || 'text'} style={base} value={value || ''} onChange={(e) => onChange(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)} required={field.required} />
  );
}

export default function AdminPage() {
  const { user, logout } = useAuth();
  const { pushAdminBroadcast, deleteAdminBroadcast, getAdminBroadcasts } = useNotifications();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('restaurants');
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState('');

  // Notifications custom fields
  const [broadcastType, setBroadcastType] = useState('info');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'notifications') {
        const data = getAdminBroadcasts();
        const filtered = search
          ? data.filter(item =>
              item.title.toLowerCase().includes(search.toLowerCase()) ||
              item.body.toLowerCase().includes(search.toLowerCase())
            )
          : data;
        setItems(filtered);
        setTotal(filtered.length);
        return;
      }

      const params = { page, limit: LIMIT };
      if (search) params.search = search;
      const res = await API[activeTab].getAll(params);
      const d = res.data;
      setItems(d.data || d);
      setTotal(d.total || (d.data || d).length);
    } catch { setItems([]); setTotal(0); } finally { setLoading(false); }
  }, [activeTab, page, search, getAdminBroadcasts]);

  useEffect(() => { setPage(1); setSearch(''); }, [activeTab]);
  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    const defaults = {};
    FIELDS[activeTab].forEach(f => { defaults[f.key] = f.type === 'checkbox' ? true : ''; });
    setEditItem(null); setFormData(defaults); setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item); setFormData({ ...item }); setModalOpen(true);
  };

  const handleFieldChange = (key, val) => setFormData(f => ({ ...f, [key]: val }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) {
        await API[activeTab].update(editItem.id, formData);
        toast.success('Updated successfully!');
      } else {
        await API[activeTab].create(formData);
        toast.success('Created successfully!');
      }
      setModalOpen(false); load();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      if (activeTab === 'notifications') {
        deleteAdminBroadcast(id);
        toast.success('Broadcast deleted successfully!');
        setDeleteConfirm(null);
        load();
        return;
      }
      await API[activeTab].remove(id);
      toast.success('Deleted successfully!');
      setDeleteConfirm(null); load();
    } catch { toast.error('Delete failed'); }
  };

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastBody.trim()) {
      toast.error('Title and body are required!');
      return;
    }
    try {
      pushAdminBroadcast({
        type: broadcastType,
        title: broadcastTitle,
        body: broadcastBody,
      });
      toast.success('Broadcast sent to all students! 🔔');
      setBroadcastTitle('');
      setBroadcastBody('');
      load();
    } catch {
      toast.error('Failed to send broadcast');
    }
  };

  const tab = TABS.find(t => t.key === activeTab);

  return (
    <div style={{ minHeight: '100dvh', background: 'linear-gradient(135deg, #0f0a2e 0%, #1e1b4b 50%, #312e81 100%)', display: 'flex', flexDirection: 'column' }}>
      {/* Admin Header */}
      <header style={{
        background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.10)',
        padding: '0 24px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 18 }}>admin_panel_settings</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: '#ffffff', letterSpacing: '-0.01em' }}>Admin Console</span>
          <span style={{
            padding: '2px 10px', borderRadius: 'var(--radius-full)',
            background: 'rgba(129,140,248,0.2)', border: '1px solid rgba(129,140,248,0.3)',
            fontSize: 11, fontWeight: 700, color: '#818cf8', letterSpacing: '0.05em',
          }}>INTERNAL</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{user?.username}</span>
          <button onClick={() => { navigate('/home'); }} style={{
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 'var(--radius-md)', padding: '6px 14px', color: 'rgba(255,255,255,0.8)',
            fontFamily: 'var(--font-family)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span> Back to Hub
          </button>
          <button onClick={() => { logout(); navigate('/'); }} style={{
            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 'var(--radius-md)', padding: '6px 14px', color: '#f87171',
            fontFamily: 'var(--font-family)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>Logout</button>
        </div>
      </header>

      <div style={{ flex: 1, padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: activeTab === 'notifications' ? 'Broadcasts Sent' : 'Total Records', value: total, icon: 'database', color: '#818cf8' },
            { label: 'Active Service', value: tab?.label, icon: tab?.icon, color: tab?.color },
            { label: 'Current Page', value: activeTab === 'notifications' ? '1 of 1' : `${page} of ${Math.ceil(total / LIMIT) || 1}`, icon: 'pages', color: '#34d399' },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.10)', borderRadius: 'var(--radius-lg)', padding: '18px 20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: stat.color }}>{stat.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{stat.label}</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: 22, color: '#ffffff' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          {TABS.map((t) => (
            <button key={t.key} onClick={() => { setActiveTab(t.key); setPage(1); }} style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px',
              borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-family)', fontWeight: 700, fontSize: 13, transition: 'all 0.2s',
              background: activeTab === t.key ? `linear-gradient(135deg, ${t.color}, ${t.color}cc)` : 'rgba(255,255,255,0.08)',
              color: activeTab === t.key ? '#fff' : 'rgba(255,255,255,0.6)',
              boxShadow: activeTab === t.key ? `0 4px 16px ${t.color}40` : 'none',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Notifications Panel vs. Standard Table */}
        {activeTab === 'notifications' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24, alignItems: 'start' }}>
            {/* Create Broadcast Panel */}
            <div style={{
              background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.10)', borderRadius: 'var(--radius-xl)', padding: 24,
            }}>
              <h2 style={{ fontWeight: 700, fontSize: 17, color: '#ffffff', marginBottom: 4 }}>Broadcast Notification</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>Send a global notification to all campus users.</p>
              
              <form onSubmit={handleBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>NOTIFICATION TYPE</label>
                  <select
                    value={broadcastType}
                    onChange={(e) => setBroadcastType(e.target.value)}
                    style={{
                      fontFamily: 'var(--font-family)', fontSize: 14,
                      padding: '10px 12px', borderRadius: 'var(--radius-md)',
                      border: '1.5px solid rgba(255,255,255,0.15)', outline: 'none',
                      color: '#ffffff', background: '#1e1b4b',
                      width: '100%', cursor: 'pointer',
                    }}
                  >
                    <option value="info">Info</option>
                    <option value="deal">Deal</option>
                    <option value="alert">Alert</option>
                    <option value="update">Update</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>TITLE</label>
                  <input
                    type="text"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    maxLength={60}
                    placeholder="Enter short title (e.g. Free haircut today)"
                    style={{
                      fontFamily: 'var(--font-family)', fontSize: 14,
                      padding: '10px 12px', borderRadius: 'var(--radius-md)',
                      border: '1.5px solid rgba(255,255,255,0.15)', outline: 'none',
                      color: '#ffffff', background: 'rgba(255,255,255,0.08)',
                      width: '100%',
                    }}
                    required
                  />
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4, textAlign: 'right' }}>
                    {broadcastTitle.length}/60 chars
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>BODY MESSAGE</label>
                  <textarea
                    rows={4}
                    value={broadcastBody}
                    onChange={(e) => setBroadcastBody(e.target.value)}
                    maxLength={200}
                    placeholder="Enter detailed message body..."
                    style={{
                      fontFamily: 'var(--font-family)', fontSize: 14,
                      padding: '10px 12px', borderRadius: 'var(--radius-md)',
                      border: '1.5px solid rgba(255,255,255,0.15)', outline: 'none',
                      color: '#ffffff', background: 'rgba(255,255,255,0.08)',
                      width: '100%', resize: 'vertical',
                    }}
                    required
                  />
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4, textAlign: 'right' }}>
                    {broadcastBody.length}/200 chars
                  </div>
                </div>

                <button type="submit" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px',
                  background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
                  border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                  fontFamily: 'var(--font-family)', fontWeight: 700, fontSize: 15, color: '#fff',
                  boxShadow: '0 4px 16px rgba(129,140,248,0.4)', marginTop: 8,
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>send</span>
                  Send Broadcast
                </button>
              </form>
            </div>

            {/* Broadcast History List */}
            <div style={{
              background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.10)', borderRadius: 'var(--radius-xl)', overflow: 'hidden',
            }}>
              {/* Header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', gap: 12,
              }}>
                <div>
                  <h2 style={{ fontWeight: 700, fontSize: 17, color: '#ffffff' }}>Active Broadcasts</h2>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Sent announcements visible to everyone</p>
                </div>
                {/* Search */}
                <div style={{ position: 'relative', width: 200 }}>
                  <span className="material-symbols-outlined" style={{
                    position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 16, color: 'rgba(255,255,255,0.35)', pointerEvents: 'none',
                  }}>search</span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search title..."
                    style={{
                      width: '100%', padding: '6px 10px 6px 30px',
                      background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 'var(--radius-md)', color: '#fff',
                      fontFamily: 'var(--font-family)', fontSize: 12, outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Broadcast Table */}
              {loading ? (
                <div style={{ padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 40, animation: 'spin 1s linear infinite' }}>progress_activity</span>
                </div>
              ) : items.length === 0 ? (
                <div style={{ padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 48 }}>notifications_off</span>
                  <p style={{ marginTop: 12, fontWeight: 600 }}>No broadcasts sent yet.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        {['Type', 'Details', 'Sent Date', 'Actions'].map((h) => (
                          <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{
                              display: 'inline-block', fontSize: 11, fontWeight: 800,
                              color: item.iconColor, background: item.iconBg,
                              padding: '3px 8px', borderRadius: 99, textTransform: 'uppercase',
                            }}>
                              {item.type}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', maxWidth: 220 }}>
                            <div style={{ fontWeight: 700, fontSize: 13, color: '#ffffff', marginBottom: 2 }} className="text-truncate">{item.title}</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }} className="text-truncate">{item.body}</div>
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: 12, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>
                            {new Date(item.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <button onClick={() => setDeleteConfirm(item)} style={{
                              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
                              borderRadius: 8, padding: '6px 12px', cursor: 'pointer', color: '#f87171',
                              fontFamily: 'var(--font-family)', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
                            }}>
                              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Table Panel */
          <div style={{
            background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.10)', borderRadius: 'var(--radius-xl)', overflow: 'hidden',
          }}>
            {/* Table Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)',
              gap: 12, flexWrap: 'wrap',
            }}>
              <div>
                <h2 style={{ fontWeight: 700, fontSize: 17, color: '#ffffff' }}>Manage {tab?.label}</h2>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Create, edit, or remove entries</p>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flex: 1, justifyContent: 'flex-end', minWidth: 0 }}>
                {/* Search */}
                <div style={{ position: 'relative', flex: 1, maxWidth: 260 }}>
                  <span className="material-symbols-outlined" style={{
                    position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 18, color: 'rgba(255,255,255,0.35)', pointerEvents: 'none',
                  }}>search</span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder={`Search ${tab?.label?.toLowerCase()}...`}
                    style={{
                      width: '100%', padding: '8px 10px 8px 34px',
                      background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 'var(--radius-md)', color: '#fff',
                      fontFamily: 'var(--font-family)', fontSize: 13, outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(129,140,248,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                  />
                  {search && (
                    <button
                      onClick={() => { setSearch(''); setPage(1); }}
                      style={{
                        position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'rgba(255,255,255,0.4)', fontSize: 16, display: 'flex', alignItems: 'center',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                    </button>
                  )}
                </div>
                <button onClick={load} className="btn-ghost" style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>refresh</span>
                </button>
                <button onClick={openCreate} style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px',
                  background: 'linear-gradient(135deg, #3525cd, #6b38d4)',
                  border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  fontFamily: 'var(--font-family)', fontWeight: 700, fontSize: 13, color: '#fff',
                  boxShadow: '0 4px 16px rgba(53,37,205,0.4)', flexShrink: 0,
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                  Add New
                </button>
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div style={{ padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 40, animation: 'spin 1s linear infinite' }}>progress_activity</span>
              </div>
            ) : items.length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48 }}>inbox</span>
                <p style={{ marginTop: 12, fontWeight: 600 }}>No entries yet. Add your first one!</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      {['Name', 'Location / Vehicle', 'Status', 'Verified', 'Actions'].map((h) => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {item.logo_url && <img src={item.logo_url} alt="" style={{ width: 34, height: 34, borderRadius: 8, objectFit: 'cover' }} />}
                            <span style={{ fontWeight: 700, fontSize: 14, color: '#ffffff' }}>
                              {item.name || item.driver_name}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                          {item.location || [item.vehicle_model, item.vehicle_number].filter(Boolean).join(' · ') || '—'}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <StatusChip isOpen={item.is_open} isAvailable={item.is_available} />
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          {item.is_verified
                            ? <span style={{ color: '#34d399', fontSize: 13, fontWeight: 700 }}>✓ Yes</span>
                            : <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>No</span>}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => openEdit(item)} style={{
                              background: 'rgba(129,140,248,0.15)', border: '1px solid rgba(129,140,248,0.3)',
                              borderRadius: 8, padding: '6px 12px', cursor: 'pointer', color: '#818cf8',
                              fontFamily: 'var(--font-family)', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
                            }}>
                              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>edit</span> Edit
                            </button>
                            <button onClick={() => setDeleteConfirm(item)} style={{
                              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
                              borderRadius: 8, padding: '6px 12px', cursor: 'pointer', color: '#f87171',
                              fontFamily: 'var(--font-family)', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
                            }}>
                              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '8px 16px' }}>
              <Pagination page={page} limit={LIMIT} total={total} onPageChange={setPage} />
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? `Edit ${tab?.label?.slice(0, -1)}` : `Add ${tab?.label?.slice(0, -1)}`} maxWidth={520}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {FIELDS[activeTab]?.map((field) => (
            <div key={field.key}>
              {field.type !== 'checkbox' && field.type !== 'upload' && (
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-on-surface-variant)', marginBottom: 6, letterSpacing: '0.03em' }}>
                  {field.label}{field.required && ' *'}
                </label>
              )}
              <FormField field={field} value={formData[field.key]} onChange={handleFieldChange} />
            </div>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)} style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving} style={{ flex: 2, opacity: saving ? 0.75 : 1 }}>
              {saving ? 'Saving...' : editItem ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete" maxWidth={400}>
        {deleteConfirm && (
          <div>
            <p style={{ color: 'var(--color-on-surface-variant)', lineHeight: 1.6, marginBottom: 20 }}>
              Are you sure you want to delete <strong>{deleteConfirm.name || deleteConfirm.driver_name || deleteConfirm.title}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-secondary" onClick={() => setDeleteConfirm(null)} style={{ flex: 1 }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} style={{
                flex: 1, background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                border: 'none', borderRadius: 'var(--radius-lg)', padding: '13px',
                color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                fontFamily: 'var(--font-family)',
              }}>Delete</button>
            </div>
          </div>
        )}
      </Modal>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
