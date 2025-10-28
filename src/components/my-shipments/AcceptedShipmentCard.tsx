import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { Alert } from '../ui/Alert';
import { Package, MapPin, User, Send, Check } from 'lucide-react';

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
  users: Sender | null;
}

interface AcceptedShipmentCardProps {
  transaction: Transaction;
  onUpdate: () => void; // Callback pour rafraîchir la liste
}

export function AcceptedShipmentCard({ transaction, onUpdate }: AcceptedShipmentCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [isDelivered, setIsDelivered] = useState(false);

  const handleMarkAsDelivered = async () => {
    setIsUpdating(true);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('transactions')
        .update({ status: 'DELIVERED' })
        .eq('id', transaction.id);

      if (updateError) {
        throw updateError;
      }

      setIsDelivered(true);
      // Attendre un court instant pour que l'utilisateur voie le changement, puis rafraîchir
      setTimeout(() => {
        onUpdate();
      }, 1500);

    } catch (err: any) {
      setError("Une erreur est survenue lors de la mise à jour. Veuillez réessayer.");
      console.error("Error marking as delivered:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center text-neutral-800 font-semibold">
            <Package className="w-4 h-4 mr-2 text-accent" />
            <span>{transaction.shipments.title}</span>
          </div>
          <div className="flex items-center text-neutral-500 text-sm">
            <MapPin className="w-4 h-4 mr-2" />
            <span>De <strong>{transaction.shipments.pickup_city}</strong> à <strong>{transaction.shipments.delivery_city}</strong></span>
          </div>
          <div className="flex items-center text-neutral-500 text-sm">
            <User className="w-4 h-4 mr-2" />
            <span>Pour : {transaction.users?.first_name} {transaction.users?.last_name}</span>
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <Button
            variant="outline"
            className={`w-full ${isDelivered ? 'bg-green-50 border-green-300 text-green-700' : ''}`}
            onClick={handleMarkAsDelivered}
            loading={isUpdating}
            disabled={isDelivered}
          >
            {isDelivered ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Livré !
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Marquer comme livré
              </>
            )}
          </Button>
        </div>
      </div>
      {error && <Alert type="error" message={error} className="mt-3" />}
    </div>
  );
}