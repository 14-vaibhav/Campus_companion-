import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="page-loading"><span className="material-symbols-outlined spin">progress_activity</span></div>;
  return isAuthenticated() ? children : <Navigate to="/" replace />;
}

export function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <div className="page-loading"><span className="material-symbols-outlined spin">progress_activity</span></div>;
  if (!isAuthenticated()) return <Navigate to="/" replace />;
  if (!isAdmin()) return <Navigate to="/home" replace />;
  return children;
}
