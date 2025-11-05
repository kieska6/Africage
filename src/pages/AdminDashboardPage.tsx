import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Loader2, Shield } from 'lucide-react';
import { AdminStats } from '../components/admin/AdminStats';
import { UserManagementTable } from '../components/admin/UserManagementTable';
import { ShipmentManagementTable } from '../components/admin/ShipmentManagementTable';

export function AdminDashboardPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) {
        navigate('/');
        return;
      }

      // Vérification du statut admin
      if (!profile?.is_admin) {
        // Si le profile n'est pas encore chargé, vérifions directement dans la base
        if (profile === null) {
          const { data: userProfile, error } = await supabase
            .from('users')
            .select('is_admin')
            .eq('id', user.id)
            .single();

          if (error || !userProfile?.is_admin) {
            navigate('/');
            return;
          }
        } else if (!profile.is_admin) {
          navigate('/');
          return;
        }
      }

      setLoading(false);
    };

    checkAdminAccess();
  }, [user, profile, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-accent mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-800">
              Panneau d'Administration
            </h1>
          </div>
          <p className="text-xl text-neutral-600">
            Gérez les utilisateurs, les colis et visualisez les statistiques de la plateforme.
          </p>
        </div>

        <div className="space-y-12">
          {/* Statistiques */}
          <section>
            <h2 className="text-3xl font-bold text-neutral-800 mb-6 text-center">
              Statistiques de la Plateforme
            </h2>
            <AdminStats />
          </section>

          {/* Gestion des Utilisateurs */}
          <section>
            <h2 className="text-3xl font-bold text-neutral-800 mb-6 text-center">
              Gestion des Utilisateurs
            </h2>
            <UserManagementTable />
          </section>

          {/* Gestion des Colis */}
          <section>
            <h2 className="text-3xl font-bold text-neutral-800 mb-6 text-center">
              Gestion des Colis
            </h2>
            <ShipmentManagementTable />
          </section>
        </div>
      </div>
    </div>
  );
}