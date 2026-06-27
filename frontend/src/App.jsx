import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { ProtectedRoute, AdminRoute } from './components/layout/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import NotificationsPage from './pages/NotificationsPage';
import DesignPlayground from './pages/DesignPlayground';
import RestaurantsPage from './pages/services/RestaurantsPage';
import SalonsPage from './pages/services/SalonsPage';
import LaundriesPage from './pages/services/LaundriesPage';
import CabsPage from './pages/services/CabsPage';
import AutosPage from './pages/services/AutosPage';
import AdminPage from './pages/admin/AdminPage';

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <NotificationsProvider>
          <HashRouter>
            <Routes>
              {/* Public */}
              <Route path="/" element={<LoginPage />} />

              {/* Protected — any authenticated user */}
              <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
              <Route path="/design-playground" element={<ProtectedRoute><DesignPlayground /></ProtectedRoute>} />
              <Route path="/services/restaurants" element={<ProtectedRoute><RestaurantsPage /></ProtectedRoute>} />
              <Route path="/services/salons" element={<ProtectedRoute><SalonsPage /></ProtectedRoute>} />
              <Route path="/services/laundries" element={<ProtectedRoute><LaundriesPage /></ProtectedRoute>} />
              <Route path="/services/cabs" element={<ProtectedRoute><CabsPage /></ProtectedRoute>} />
              <Route path="/services/autos" element={<ProtectedRoute><AutosPage /></ProtectedRoute>} />

              {/* Admin only — stealth route */}
              <Route path="/control-center" element={<AdminRoute><AdminPage /></AdminRoute>} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>

            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3500,
                style: {
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: 14,
                  borderRadius: 14,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  border: '1px solid rgba(199,196,216,0.4)',
                },
                success: {
                  iconTheme: { primary: '#3525cd', secondary: '#fff' },
                },
                error: {
                  iconTheme: { primary: '#dc2626', secondary: '#fff' },
                },
              }}
            />
          </HashRouter>
        </NotificationsProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}
