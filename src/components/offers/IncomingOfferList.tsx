import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { IncomingOfferCard } from './IncomingOfferCard';
import { Loader2, ServerCrash, Inbox } from 'lucide-react';

// Définition des types pour correspondre à la structure de la carte
interface Traveler {
  first_name: string;
  last_name: string;
}

interface Shipment {
  title: string;
}

interface Transaction {
  id: string;
  traveler_id: string;
  shipment_id: string;
  shipments: Shipment;
  users: Traveler;
}

export function IncomingOfferList() {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select(`
          id,
          traveler_id,
          shipment_id,
          shipments ( title ),
          users!transactions_traveler_id_fkey ( first_name, last_name )
        `)
        .eq('sender_id', user.id)
        .eq('status', 'PENDING');

      if (fetchError) throw fetchError;

      setOffers(data || []);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des offres:", err);
      setError("Impossible de charger les offres reçues.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 text-primary animate-spin mr-3" />
        <span className="text-neutral-600">Chargement des offres...</span>
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

  if (offers.length === 0) {
    return (
      <div className="text-center py-8 bg-neutral-100 rounded-lg">
        <Inbox className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-neutral-700">Aucune nouvelle offre</h3>
        <p className="text-neutral-500 mt-1">Vous serez notifié ici dès que vous recevrez une proposition.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {offers.map((transaction) => (
        <IncomingOfferCard
          key={transaction.id}
          transaction={transaction}
          onOfferAccepted={fetchOffers}
        />
      ))}
    </div>
  );
}