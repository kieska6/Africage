import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { Alert } from '../ui/Alert';
import { Check, Package, User } from 'lucide-react';

// Définition des types pour les données
interface Traveler {
  first_name: string;
  last_name: string;
}

interface Shipment {
  title: string;
}

interface Transaction {
  id: string;
  shipment_id: string;
  shipments: Shipment;
  users: Traveler | null;
}

interface ConfirmationCardProps {
  transaction: Transaction;
  onConfirmed: () => void; // Callback pour rafraîchir la liste
}

export function ConfirmationCard({ transaction, onConfirmed }: ConfirmationCardProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirmReception = async () => {
    setIsConfirming(true);
    setError('');

    try {
      // Étape 1: Mettre à jour la transaction à COMPLETED
      const { error: transactionError } = await supabase
        .from('transactions')
        .update({ status: 'COMPLETED' })
        .eq('id', transaction.id);

      if (transactionError) throw transactionError;

      // Étape 2: Mettre à jour le colis à DELIVERED (statut final pour un colis)
      const { error: shipmentError } = await supabase
        .from('shipments')
        .update({ status: 'DELIVERED' })
        .eq('id', transaction.shipment_id);

      if (shipmentError) throw shipmentError;

      // Si tout réussit
      setIsConfirmed(true);
      setTimeout(() => {
        onConfirmed(); // Rafraîchir la liste parente
      }, 1500);

    } catch (err: any) {
      console.error("Erreur lors de la confirmation de la réception:", err);
      setError("Impossible de confirmer la réception. Veuillez réessayer.");
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-neutral-700">
            Le colis <strong className="font-semibold text-neutral-900">"{transaction.shipments.title}"</strong> a été marqué comme livré par <strong className="font-semibold text-neutral-900">{transaction.users?.first_name} {transaction.users?.last_name}</strong>.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <Button
            onClick={handleConfirmReception}
            loading={isConfirming}
            disabled={isConfirmed}
            className={`w-full ${isConfirmed ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary/90'} text-white`}
          >
            {isConfirmed ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Confirmé !
              </>
            ) : (
              "Confirmer la réception"
            )}
          </Button>
        </div>
      </div>
      {error && <Alert type="error" message={error} className="mt-4" />}
    </div>
  );
}