import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { AcceptedShipmentCard } from './AcceptedShipmentCard';
import { Loader2, ServerCrash, Briefcase } from 'lucide-react';

// Définition des types pour les données
interface Sender {
  first_name: string;
  last_name: string;
}

interface Shipment {
  title: string;
  pickup_city: string;
  delivery_city: string;
}

interface Transaction {
  id: string;
  shipments: Shipment;
  users: Sender;
}

export function AcceptedShipmentList() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAcceptedShipments = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select(`
          id,
          shipments ( title, pickup_city, delivery_city ),
          users!transactions_sender_id_fkey ( first_name, last_name )
        `)
        .eq('traveler_id', user.id)
        .eq('status', 'CONFIRMED');

      if (fetchError) throw fetchError;

      setShipments(data as any || []);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des transports:", err);
      setError("Impossible de charger vos transports à venir.");
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
        <p className="text-neutral-500 mt-1">Lorsqu'un expéditeur acceptera votre offre, le colis apparaîtra ici.</p>
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