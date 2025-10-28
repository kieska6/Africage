import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Package, Plus, Inbox, Briefcase, Bell, History, Star } from 'lucide-react';
import { ShipmentList } from '../components/shipments/ShipmentList';
import { IncomingOfferList } from '../components/offers/IncomingOfferList';
import { AcceptedShipmentList } from '../components/my-shipments/AcceptedShipmentList';
import { ConfirmationList } from '../components/confirmations/ConfirmationList';

interface CompletedTransaction {
  id: string;
  shipments: { title: string };
  review_left: boolean;
}

export function DashboardPage() {
  const { user } = useAuth();
  const [completedTransactions, setCompletedTransactions] = useState<CompletedTransaction[]>([]);

  useEffect(() => {
    const fetchCompletedTransactions = async () => {
      if (!user) return;

      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('id, shipments(title)')
        .eq('status', 'COMPLETED')
        .or(`sender_id.eq.${user.id},traveler_id.eq.${user.id}`);

      if (error || !transactions) return;

      const transactionIds = transactions.map(tx => tx.id);
      const { data: reviews } = await supabase
        .from('reviews')
        .select('transaction_id')
        .in('transaction_id', transactionIds)
        .eq('reviewer_id', user.id);

      const reviewedIds = new Set(reviews?.map(r => r.transaction_id));

      const transactionsWithReviewStatus = transactions.map(tx => ({
        ...tx,
        review_left: reviewedIds.has(tx.id),
      }));

      setCompletedTransactions(transactionsWithReviewStatus as CompletedTransaction[]);
    };

    fetchCompletedTransactions();
  }, [user]);

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-800">
              Votre Tableau de Bord
            </h1>
            <p className="text-lg text-neutral-600 mt-2">
              Bienvenue, {user?.user_metadata.first_name || user?.email} !
            </p>
          </div>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link to="/create-trip">
              <Button size="lg" variant="outline">
                <Plus className="w-5 h-5 mr-2" />
                Proposer un voyage
              </Button>
            </Link>
            <Link to="/create-shipment">
              <Button size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Publier une annonce
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-white rounded-4xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <Bell className="w-6 h-6 text-accent mr-3" />
                <h2 className="text-2xl font-bold text-neutral-800">Confirmations en attente</h2>
              </div>
              <ConfirmationList />
            </div>
            <div className="bg-white rounded-4xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <Inbox className="w-6 h-6 text-accent mr-3" />
                <h2 className="text-2xl font-bold text-neutral-800">Mes Offres Reçues</h2>
              </div>
              <IncomingOfferList />
            </div>
             <div className="bg-white rounded-4xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <History className="w-6 h-6 text-accent mr-3" />
                <h2 className="text-2xl font-bold text-neutral-800">Historique des transactions</h2>
              </div>
              <div className="space-y-4">
                {completedTransactions.length > 0 ? completedTransactions.map(tx => (
                  <div key={tx.id} className="flex justify-between items-center bg-neutral-50 p-4 rounded-lg">
                    <p className="text-neutral-700">Colis: "{tx.shipments.title}"</p>
                    {!tx.review_left && (
                      <Link to={`/leave-review/${tx.id}`}>
                        <Button variant="outline" size="sm">
                          <Star className="w-4 h-4 mr-2" />
                          Laisser un avis
                        </Button>
                      </Link>
                    )}
                  </div>
                )) : <p className="text-neutral-500 text-center py-4">Aucune transaction terminée.</p>}
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-white rounded-4xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <Briefcase className="w-6 h-6 text-accent mr-3" />
                <h2 className="text-2xl font-bold text-neutral-800">Mes Transports à Venir</h2>
              </div>
              <AcceptedShipmentList />
            </div>
            <div className="bg-white rounded-4xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <Package className="w-6 h-6 text-accent mr-3" />
                <h2 className="text-2xl font-bold text-neutral-800">Mes Annonces de Colis</h2>
              </div>
              <ShipmentList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}