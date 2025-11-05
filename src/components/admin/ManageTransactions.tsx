import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Loader2, ListChecks } from 'lucide-react';

interface Transaction {
  id: string;
  status: string;
  shipment_id: string;
  shipments: { title: string };
  sender: { first_name: string; last_name: string };
  traveler: { first_name: string; last_name: string };
}

export function ManageTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select(`
          id,
          status,
          shipment_id,
          shipments ( title ),
          sender:users!transactions_sender_id_fkey ( first_name, last_name ),
          traveler:users!transactions_traveler_id_fkey ( first_name, last_name )
        `)
        .not('status', 'in', '("COMPLETED", "CANCELLED")')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }
      
      setTransactions(data as any || []);
    } catch (err: any) {
      setError("Impossible de charger les transactions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleCancel = async (transactionId: string, shipmentId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette transaction ? Cette action est irréversible.")) {
      return;
    }

    try {
      // Use Promise.all to run updates concurrently
      const [transactionUpdate, shipmentUpdate] = await Promise.all([
        supabase.from('transactions').update({ status: 'CANCELLED' }).eq('id', transactionId),
        supabase.from('shipments').update({ status: 'PENDING_MATCH' }).eq('id', shipmentId)
      ]);

      if (transactionUpdate.error) throw transactionUpdate.error;
      if (shipmentUpdate.error) throw shipmentUpdate.error;

      // Refresh the list
      fetchTransactions();
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'annulation.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
        <ListChecks className="w-5 h-5 mr-2 text-primary" />
        Gérer les Transactions Actives
      </h3>
      {error && <Alert type="error" message={error} />}
      
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : transactions.length === 0 ? (
        <p className="text-neutral-500 text-center py-4">Aucune transaction active pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {transactions.map(tx => (
            <div key={tx.id} className="bg-neutral-50 p-4 rounded-md border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <p className="font-semibold text-neutral-800">{tx.shipments.title}</p>
                <p className="text-sm text-neutral-600">
                  {tx.sender.first_name} → {tx.traveler.first_name}
                </p>
                <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{tx.status}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-red-500 text-red-500 hover:bg-red-50"
                onClick={() => handleCancel(tx.id, tx.shipment_id)}
              >
                Annuler la Transaction
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}