import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { ConfirmationCard } from './ConfirmationCard';
import { Loader2, ServerCrash, Bell } from 'lucide-react';

// Types corrigés pour Supabase joins
interface SupabaseShipment {
  title: string;
}

interface SupabaseUser {
  first_name: string;
  last_name: string;
}

interface SupabaseTransaction {
  id: string;
  shipment_id: string;
  shipments: SupabaseShipment[];
  users: SupabaseUser[];
}

// Type pour notre interface après transformation
interface Transaction {
  id: string;
  shipment_id: string;
  shipments: { title: string };
  users: { first_name: string; last_name: string };
}

export function ConfirmationList() {
  const { user } = useAuth();
  const [confirmations, setConfirmations] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfirmations = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Récupération des confirmations pour user:', user.id);

      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select(`
          id,
          shipment_id,
          shipments ( title ),
          users!transactions_traveler_id_fkey ( first_name, last_name )
        `)
        .eq('sender_id', user.id)
        .eq('status', 'DELIVERED');

      console.log('Réponse des confirmations:', { data, error: fetchError });

      if (fetchError) {
        throw fetchError;
      }

      if (!Array.isArray(data)) {
        throw new Error('Les données reçues ne sont pas un tableau');
      }

      // Transformation des données pour correspondre à notre interface
      const transformedData: Transaction[] = data.map((item: SupabaseTransaction) => ({
        id: item.id,
        shipment_id: item.shipment_id,
        shipments: item.shipments[0] || { title: '' },
        users: item.users[0] || { first_name: '', last_name: '' }
      }));

      setConfirmations(transformedData);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des confirmations:", err);
      setError(err.message || "Impossible de charger les confirmations en attente.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConfirmations();
  }, [fetchConfirmations]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 text-primary animate-spin mr-3" />
        <span className="text-neutral-600">Chargement...</span>
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

  if (confirmations.length === 0) {
    return (
      <div className="text-center py-8 bg-neutral-100 rounded-lg">
        <Bell className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-neutral-700">Aucune confirmation en attente</h3>
        <p className="text-neutral-500 mt-1">Vous n'avez aucune livraison à confirmer pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {confirmations.map((transaction) => (
        <ConfirmationCard
          key={transaction.id}
          transaction={transaction}
          onConfirmed={fetchConfirmations}
        />
      ))}
    </div>
  );
}