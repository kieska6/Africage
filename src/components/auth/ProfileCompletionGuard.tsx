import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export function ProfileCompletionGuard() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    // Should be handled by ProtectedRoute, but as a fallback
    return <Navigate to="/login" replace />;
  }

  if (profile.is_profile_complete) {
    return <Outlet />;
  } else {
    return <Navigate to="/complete-profile" replace />;
  }
}