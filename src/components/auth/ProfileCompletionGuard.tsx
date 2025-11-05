import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export function ProfileCompletionGuard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (!loading && user && profile) {
        // Si l'utilisateur est chargé mais que le profil n'est pas complet
        if (!profile.is_profile_complete) {
          setCheckingProfile(false);
          return;
        }
      }
      
      setCheckingProfile(false);
    };

    checkProfileCompletion();
  }, [user, profile, loading]);

  // Si on est encore en train de charger l'utilisateur
  if (loading || checkingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-neutral-600">Vérification du profil...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, le rediriger vers la page de connexion
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si le profil n'est pas complet, le rediriger vers la page de complétion
  if (user && profile && !profile.is_profile_complete) {
    return <Navigate to="/complete-profile" state={{ from: location }} replace />;
  }

  // Si tout est bon, afficher les enfants
  return <>{children}</>;
}