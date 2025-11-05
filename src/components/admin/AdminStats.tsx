import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, Users, Package } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalShipments: number;
}

export function AdminStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const [usersResult, shipmentsResult] = await Promise.all([
          supabase.rpc('get_total_user_count'),
          supabase.rpc('get_total_shipment_count')
        ]);

        if (usersResult.error) throw usersResult.error;
        if (shipmentsResult.error) throw shipmentsResult.error;

        setStats({
          totalUsers: usersResult.data || 0,
          totalShipments: shipmentsResult.data || 0
        });
      } catch (err: any) {
        setError('Erreur lors du chargement des statistiques');
        console.error('Stats error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-8 bg-red-50 rounded-lg">
        <p className="text-red-600">{error || 'Aucune statistique disponible'}</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center border border-neutral-200">
        <div className="flex items-center justify-center mb-4">
          <Users className="w-12 h-12 text-blue-500" />
        </div>
        <h3 className="text-2xl font-bold text-neutral-800 mb-2">
          {stats.totalUsers.toLocaleString()}
        </h3>
        <p className="text-neutral-600">Utilisateurs inscrits</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg text-center border border-neutral-200">
        <div className="flex items-center justify-center mb-4">
          <Package className="w-12 h-12 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-neutral-800 mb-2">
          {stats.totalShipments.toLocaleString()}
        </h3>
        <p className="text-neutral-600">Colis publiés</p>
      </div>
    </div>
  );
}