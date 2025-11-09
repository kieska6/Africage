import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { AcceptedShipmentCard } from './AcceptedShipmentCard';
import { Loader2, ServerCrash, Briefcase } from 'lucide-react';

// Types corrigés pour Supabase joins
interface SupabaseShipment {
  title: string;
  pickup_city: string;
  delivery_city: string;
}

interface SupabaseUser {
  first_name: string;
  last_name: string;
}

interface SupabaseTransaction {
  id: string;
  shipments: SupabaseShipment[];
  users: SupabaseUser[];
}

// Type pour notre interface après transformation
interface Transaction {
  id: string;
  shipments: { title: string; pickup_city: string; delivery_city: string };
  users: { first_name: string; last_name: string };
}

export function AcceptedShipmentList() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAcceptedShipments = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Récupération des transports pour user:', user.id);

      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select(`
          id,
          shipments ( title, pickup_city, delivery_city ),
          users!transactions_sender_id_fkey ( first_name, last_name )
        `)
        .eq('traveler_id', user.id)
        .eq('status', 'CONFIRMED');

      console.log('Réponse des transports:', { data, error: fetchError });

      if (fetchError) {
        throw fetchError;
      }

      if (!Array.isArray(data)) {
        throw new Error('Les données reçues ne sont pas un tableau');
      }

      // Transformation des données pour correspondre à notre interface
      const transformedData: Transaction[] = data.map((item: SupabaseTransaction) => ({
        id: item.id,
        shipments: item.shipments[0] || { title: '', pickup_city: '', delivery_city: '' },
        users: item.users[0] || { first_name: '', last_name: '' }
      }));

      setShipments(transformedData);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des transports:", err);
      setError(err.message || "Impossible de charger vos transports à venir.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAcceptedShipments();
  }, [fetchAcceptedShipments]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 text-primary animate-spin mr-3" />
        <span className="text-neutral-600">Chargement des transports...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 bg-red-50 rounded-lg">
        <ServerCrash className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-red-700">Une erreur est survenue</h3>
        <p className="text-red-600 mt-1">{error}</p>
      </div>
    );
  }

  if (shipments.length === 0) {
    return (
      <div className="text-center py-8 bg-neutral-100 rounded-lg">
        <Briefcase className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-neutral-700">Aucun transport à venir</h3>
        <p className="text-neutral-500 mt-1">Parcourez les annonces pour trouver des colis à transporter.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {shipments.map((transaction) => (
        <AcceptedShipmentCard
          key={transaction.id}
          transaction={transaction}
          onUpdate={fetchAcceptedShipments}
        />
      ))}
    </div>
  );
}