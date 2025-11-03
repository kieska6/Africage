import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Package, Plus, Inbox, Briefcase, Bell, History, Star, Coins, PlusCircle, Loader2, Shield } from 'lucide-react';
import { ShipmentList } from '../components/shipments/ShipmentList';
import { IncomingOfferList } from '../components/offers/IncomingOfferList';
import { AcceptedShipmentList } from '../components/my-shipments/AcceptedShipmentList';
import { ConfirmationList } from '../components/confirmations/ConfirmationList';
import { useTokenBalance } from '../hooks/useTokenBalance';

interface CompletedTransaction {
  id: string;
  shipments: { title: string };
  review_left: boolean;
}

export function DashboardPage() {
  const { user, profile } = useAuth();
  const { balance: tokenBalance, loading: balanceLoading } = useTokenBalance();
  const [completedTransactions, setCompletedTransactions] = React.useState<CompletedTransaction[]>([]);

  React.useEffect(() => {
    if (!user) return;

    const fetchCompletedTransactions = async () => {
      const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select('id, shipments(title)')
        .eq('status', 'COMPLETED')
        .or(`sender_id.eq.${user.id},traveler_id.eq.${user.id}`);

      if (!txError && transactions) {
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
      }
    };

    fetchCompletedTransactions();
  }, [user]);

  const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'MODERATOR';

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-800">
              Votre Tableau de Bord
            </h1>
            <p className="text-lg text-neutral-600 mt-2">
              Bienvenue, {profile?.first_name || user?.email} !
            </p>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 sm:mt-0">
            <Link to="/create-trip">
              <Button size="lg" variant="outline">
                <Plus className="w-5 h-5 mr-2" />
                Proposer un voyage
              </Button>
            </Link>
            <Link to="/create-shipment">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                <Plus className="w-5 h-5 mr-2" />
                Publier une annonce
              </Button>
            </Link>
          </div>
        </div>

        {isAdmin && (
          <div className="mb-8">
            <Link to="/admin">
              <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-white">
                <Shield className="w-5 h-5 mr-2" />
                Accéder au Panneau d'Administration
              </Button>
            </Link>
          </div>
        )}

        {/* Token Balance Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between mb-8 border border-primary/20">
          <div>
            <p className="text-sm text-neutral-500">Votre solde de tokens</p>
            <div className="flex items-center gap-2 mt-1">
              <Coins className="w-6 h-6 text-primary" />
              <span className="text-3xl font-bold text-neutral-800">
                {balanceLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : tokenBalance}
              </span>
            </div>
          </div>
          <Link to="/buy-tokens">
            <Button variant="outline">
              <PlusCircle className="w-4 h-4 mr-2" />
              Recharger
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-white rounded-4xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <Bell className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold text-neutral-800">Confirmations en attente</h2>
              </div>
              <ConfirmationList />
            </div>
            <div className="bg-white rounded-4xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <Inbox className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold text-neutral-800">Mes Offres Reçues</h2>
              </div>
              <IncomingOfferList />
            </div>
             <div className="bg-white rounded-4xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <History className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold text-neutral-800">Historique des transactions</h2>
              </div>
              <div className="space-y-4">
                {completedTransactions.length > 0 ? completedTransactions.map(tx => (
                  <div key={tx.id} className="flex justify-between items-center bg-neutral-50 p-4 rounded-lg">
                    <p className="text-neutral-700">Colis: "{tx.shipments.title}"</p>
                    {!tx.review_left && (
                      <Link to={`/leave-review/${tx.id}`}>
                        <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
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
                <Briefcase className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold text-neutral-800">Mes Transports à Venir</h2>
              </div>
              <AcceptedShipmentList />
            </div>
            <div className="bg-white rounded-4xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <Package className="w-6 h-6 text-primary mr-3" />
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