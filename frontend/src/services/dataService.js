import api from './api';

const buildQuery = (params) =>
  new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null))).toString();

const DEFAULT_RESTAURANTS = [
  { 
    id: 'r-1', 
    name: 'The Campus Cafe', 
    location: 'Block A', 
    phone_number: '+919876543210', 
    opening_time: '08:00:00', 
    closing_time: '22:00:00', 
    average_cost_for_one: 150, 
    is_open: true, 
    is_verified: true, 
    description: 'Best coffee and quick snacks on campus. Famous for grilled sandwiches, maggi, and cold coffee.', 
    disclaimer: 'Prices exclude local tax.',
    logo_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500',
    menu_images: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
      'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=500'
    ]
  },
  { 
    id: 'r-2', 
    name: 'Red Chillies Canteen', 
    location: 'Block C', 
    phone_number: '+919999988888', 
    opening_time: '09:00:00', 
    closing_time: '21:00:00', 
    average_cost_for_one: 100, 
    is_open: false, 
    is_verified: true, 
    description: 'Traditional North and South Indian meals. Hot lunches served daily.',
    logo_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500',
    menu_images: [
      'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500'
    ]
  },
  { 
    id: 'r-3', 
    name: 'Sunset Snacks', 
    location: 'Near Sports Ground', 
    phone_number: '+918888877777', 
    opening_time: '16:00:00', 
    closing_time: '23:00:00', 
    average_cost_for_one: 60, 
    is_open: true, 
    is_verified: false, 
    description: 'Evening tea and hot pakoras. Perfect post-game hangout spot.',
    logo_url: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=500',
    menu_images: []
  }
];

const DEFAULT_SALONS = [
  { id: 's-1', name: "Dhruv's Salon", location: 'Block B', phone_number: '+91 77777 66666', haircut_price: 100, beard_price: 80, opening_time: '09:00:00', closing_time: '20:00:00', is_open: true, is_verified: true, description: 'Verified campus barber. Haircuts, styling, shaves, and grooming.' },
  { id: 's-2', name: 'Style Studio', location: 'Block D (First Floor)', phone_number: '+91 66666 55555', haircut_price: 120, beard_price: 90, opening_time: '10:00:00', closing_time: '19:00:00', is_open: false, is_verified: false, description: 'Modern hair styling salon for students.' }
];

const DEFAULT_LAUNDRIES = [
  { id: 'l-1', name: 'Quick Wash Laundry', location: 'Block B', phone_number: '+91 88888 99999', price_per_kg: 10, opening_time: '08:00:00', closing_time: '20:00:00', is_open: true, is_verified: true, description: 'Same-day laundry and iron services.' },
  { id: 'l-2', name: 'Clean Express', location: 'Block E', phone_number: '+91 55555 44444', price_per_kg: 12, opening_time: '09:00:00', closing_time: '18:00:00', is_open: false, is_verified: false, description: 'Dry cleaning and standard laundry washes.' }
];

const DEFAULT_CABS = [
  { id: 'c-1', driver_name: 'Ramesh Kumar', vehicle_number: 'DL 1Y 9832', vehicle_model: 'Maruti Swift DZire', phone_number: '+91 99999 11111', base_fare: 50, is_available: true, is_verified: true },
  { id: 'c-2', driver_name: 'Suresh Singh', vehicle_number: 'DL 1Y 4567', vehicle_model: 'Toyota Etios', phone_number: '+91 99999 22222', base_fare: 60, is_available: false, is_verified: false }
];

const DEFAULT_AUTOS = [
  { id: 'a-1', driver_name: 'Anil Auto', vehicle_number: 'DL 1A 2345', phone_number: '+91 99999 33333', base_fare: 20, is_available: true, is_verified: true },
  { id: 'a-2', driver_name: 'Sunil Rickshaw', vehicle_number: 'DL 1A 6789', phone_number: '+91 99999 44444', base_fare: 20, is_available: false, is_verified: false }
];

// Seed versioning to force re-seed when updates are made to defaults
const SEED_VERSION = 'v3';
if (localStorage.getItem('mock_data_version') !== SEED_VERSION) {
  localStorage.removeItem('mock_restaurants');
  localStorage.removeItem('mock_salons');
  localStorage.removeItem('mock_laundries');
  localStorage.removeItem('mock_cabs');
  localStorage.removeItem('mock_autos');
  localStorage.setItem('mock_data_version', SEED_VERSION);
}

const getList = (key, defaults) => {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(data);
  } catch {
    return defaults;
  }
};

const saveList = (key, list) => {
  localStorage.setItem(key, JSON.stringify(list));
};

// RESTAURANTS
export const getRestaurants = async (params = {}) => {
  try {
    return await api.get(`/restaurants?${buildQuery(params)}`);
  } catch {
    let list = getList('mock_restaurants', DEFAULT_RESTAURANTS);
    if (params.is_open !== undefined) list = list.filter(r => r.is_open === params.is_open);
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(r => r.name.toLowerCase().includes(q));
    }
    return { data: list };
  }
};
export const getRestaurantById = async (id) => {
  try {
    return await api.get(`/restaurants/${id}`);
  } catch {
    const list = getList('mock_restaurants', DEFAULT_RESTAURANTS);
    const item = list.find(r => r.id === id) || list[0];
    return { data: item };
  }
};
export const createRestaurant = async (data) => {
  try {
    return await api.post('/restaurants', data);
  } catch {
    const list = getList('mock_restaurants', DEFAULT_RESTAURANTS);
    const newItem = { id: `r-${Date.now()}`, ...data };
    list.push(newItem);
    saveList('mock_restaurants', list);
    return { data: newItem };
  }
};
export const updateRestaurant = async (id, data) => {
  try {
    return await api.put(`/restaurants/${id}`, data);
  } catch {
    const list = getList('mock_restaurants', DEFAULT_RESTAURANTS);
    const idx = list.findIndex(r => r.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      saveList('mock_restaurants', list);
      return { data: list[idx] };
    }
    return { data };
  }
};
export const deleteRestaurant = async (id) => {
  try {
    return await api.delete(`/restaurants/${id}`);
  } catch {
    let list = getList('mock_restaurants', DEFAULT_RESTAURANTS);
    list = list.filter(r => r.id !== id);
    saveList('mock_restaurants', list);
    return { data: { success: true } };
  }
};

// LAUNDRIES
export const getLaundries = async (params = {}) => {
  try {
    return await api.get(`/laundries?${buildQuery(params)}`);
  } catch {
    let list = getList('mock_laundries', DEFAULT_LAUNDRIES);
    if (params.is_open !== undefined) list = list.filter(l => l.is_open === params.is_open);
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(l => l.name.toLowerCase().includes(q));
    }
    return { data: list };
  }
};
export const getLaundryById = async (id) => {
  try {
    return await api.get(`/laundries/${id}`);
  } catch {
    const list = getList('mock_laundries', DEFAULT_LAUNDRIES);
    const item = list.find(l => l.id === id) || list[0];
    return { data: item };
  }
};
export const createLaundry = async (data) => {
  try {
    return await api.post('/laundries', data);
  } catch {
    const list = getList('mock_laundries', DEFAULT_LAUNDRIES);
    const newItem = { id: `l-${Date.now()}`, ...data };
    list.push(newItem);
    saveList('mock_laundries', list);
    return { data: newItem };
  }
};
export const updateLaundry = async (id, data) => {
  try {
    return await api.put(`/laundries/${id}`, data);
  } catch {
    const list = getList('mock_laundries', DEFAULT_LAUNDRIES);
    const idx = list.findIndex(l => l.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      saveList('mock_laundries', list);
      return { data: list[idx] };
    }
    return { data };
  }
};
export const deleteLaundry = async (id) => {
  try {
    return await api.delete(`/laundries/${id}`);
  } catch {
    let list = getList('mock_laundries', DEFAULT_LAUNDRIES);
    list = list.filter(l => l.id !== id);
    saveList('mock_laundries', list);
    return { data: { success: true } };
  }
};

// SALONS
export const getSalons = async (params = {}) => {
  try {
    return await api.get(`/salons?${buildQuery(params)}`);
  } catch {
    let list = getList('mock_salons', DEFAULT_SALONS);
    if (params.is_open !== undefined) list = list.filter(s => s.is_open === params.is_open);
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q));
    }
    return { data: list };
  }
};
export const getSalonById = async (id) => {
  try {
    return await api.get(`/salons/${id}`);
  } catch {
    const list = getList('mock_salons', DEFAULT_SALONS);
    const item = list.find(s => s.id === id) || list[0];
    return { data: item };
  }
};
export const createSalon = async (data) => {
  try {
    return await api.post('/salons', data);
  } catch {
    const list = getList('mock_salons', DEFAULT_SALONS);
    const newItem = { id: `s-${Date.now()}`, ...data };
    list.push(newItem);
    saveList('mock_salons', list);
    return { data: newItem };
  }
};
export const updateSalon = async (id, data) => {
  try {
    return await api.put(`/salons/${id}`, data);
  } catch {
    const list = getList('mock_salons', DEFAULT_SALONS);
    const idx = list.findIndex(s => s.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      saveList('mock_salons', list);
      return { data: list[idx] };
    }
    return { data };
  }
};
export const deleteSalon = async (id) => {
  try {
    return await api.delete(`/salons/${id}`);
  } catch {
    let list = getList('mock_salons', DEFAULT_SALONS);
    list = list.filter(s => s.id !== id);
    saveList('mock_salons', list);
    return { data: { success: true } };
  }
};

// CABS
export const getCabs = async (params = {}) => {
  try {
    return await api.get(`/cabs?${buildQuery(params)}`);
  } catch {
    let list = getList('mock_cabs', DEFAULT_CABS);
    if (params.is_verified !== undefined) list = list.filter(c => c.is_verified === params.is_verified);
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(c => c.driver_name.toLowerCase().includes(q));
    }
    return { data: list };
  }
};
export const getCabById = async (id) => {
  try {
    return await api.get(`/cabs/${id}`);
  } catch {
    const list = getList('mock_cabs', DEFAULT_CABS);
    const item = list.find(c => c.id === id) || list[0];
    return { data: item };
  }
};
export const createCab = async (data) => {
  try {
    return await api.post('/cabs', data);
  } catch {
    const list = getList('mock_cabs', DEFAULT_CABS);
    const newItem = { id: `c-${Date.now()}`, ...data };
    list.push(newItem);
    saveList('mock_cabs', list);
    return { data: newItem };
  }
};
export const updateCab = async (id, data) => {
  try {
    return await api.put(`/cabs/${id}`, data);
  } catch {
    const list = getList('mock_cabs', DEFAULT_CABS);
    const idx = list.findIndex(c => c.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      saveList('mock_cabs', list);
      return { data: list[idx] };
    }
    return { data };
  }
};
export const deleteCab = async (id) => {
  try {
    return await api.delete(`/cabs/${id}`);
  } catch {
    let list = getList('mock_cabs', DEFAULT_CABS);
    list = list.filter(c => c.id !== id);
    saveList('mock_cabs', list);
    return { data: { success: true } };
  }
};

// AUTOS
export const getAutos = async (params = {}) => {
  try {
    return await api.get(`/autos?${buildQuery(params)}`);
  } catch {
    let list = getList('mock_autos', DEFAULT_AUTOS);
    if (params.is_verified !== undefined) list = list.filter(a => a.is_verified === params.is_verified);
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(a => a.driver_name.toLowerCase().includes(q));
    }
    return { data: list };
  }
};
export const getAutoById = async (id) => {
  try {
    return await api.get(`/autos/${id}`);
  } catch {
    const list = getList('mock_autos', DEFAULT_AUTOS);
    const item = list.find(a => a.id === id) || list[0];
    return { data: item };
  }
};
export const createAuto = async (data) => {
  try {
    return await api.post('/autos', data);
  } catch {
    const list = getList('mock_autos', DEFAULT_AUTOS);
    const newItem = { id: `a-${Date.now()}`, ...data };
    list.push(newItem);
    saveList('mock_autos', list);
    return { data: newItem };
  }
};
export const updateAuto = async (id, data) => {
  try {
    return await api.put(`/autos/${id}`, data);
  } catch {
    const list = getList('mock_autos', DEFAULT_AUTOS);
    const idx = list.findIndex(a => a.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      saveList('mock_autos', list);
      return { data: list[idx] };
    }
    return { data };
  }
};
export const deleteAuto = async (id) => {
  try {
    return await api.delete(`/autos/${id}`);
  } catch {
    let list = getList('mock_autos', DEFAULT_AUTOS);
    list = list.filter(a => a.id !== id);
    saveList('mock_autos', list);
    return { data: { success: true } };
  }
};

// IMAGE UPLOAD
export const uploadImage = (file) => {
  const form = new FormData();
  form.append('image', file);
  return api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
};
