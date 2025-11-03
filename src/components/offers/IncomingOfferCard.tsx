import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { Alert } from '../ui/Alert';
import { Check, User, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Définition des types pour les données de la transaction
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
  users: Traveler | null;
}

interface IncomingOfferCardProps {
  transaction: Transaction;
  onOfferAccepted: () => void; // Callback pour rafraîchir la liste parente
}

export function IncomingOfferCard({ transaction, onOfferAccepted }: IncomingOfferCardProps) {
  const { user } = useAuth();
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState('');
  const [isAccepted, setIsAccepted] = useState(false);

  const handleAcceptOffer = async () => {
    if (!user) {
      setError("Vous devez être connecté pour accepter une offre.");
      return;
    }

    setIsAccepting(true);
    setError('');

    try {
      // Étape 1: Mettre à jour le statut de la transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .update({ status: 'CONFIRMED', confirmed_at: new Date().toISOString() })
        .eq('id', transaction.id);

      if (transactionError) throw transactionError;

      // Étape 2: Mettre à jour le statut du colis
      const { error: shipmentError } = await supabase
        .from('shipments')
        .update({ status: 'MATCHED' })
        .eq('id', transaction.shipment_id);

      if (shipmentError) throw shipmentError;

      // Étape 3: Créer une nouvelle conversation
      const { data: newConversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          shipment_id: transaction.shipment_id,
          sender_id: user.id, // L'utilisateur actuel est l'expéditeur
          traveler_id: transaction.traveler_id,
        }).select('id').single();

      if (conversationError) throw conversationError;

      // Étape 4: Envoyer une notification au voyageur
      const { error: notificationError } = await supabase.from('notifications').insert({
        recipient_id: transaction.traveler_id,
        type: 'OFFER_ACCEPTED',
        related_entity_id: newConversation.id,
        content: `Votre offre pour "${transaction.shipments.title}" a été acceptée.`
      });

      if (notificationError) console.error("Error creating notification:", notificationError);

      // Si tout réussit
      setIsAccepted(true);
      setTimeout(() => {
        onOfferAccepted(); // Rafraîchir la liste après un court délai
      }, 1500);

    } catch (err: any) {
      console.error("Erreur lors de l'acceptation de l'offre:", err);
      setError("Impossible d'accepter l'offre. Veuillez réessayer.");
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center text-neutral-500 text-sm mb-1">
            <Package className="w-4 h-4 mr-2" />
            <span>Offre pour : {transaction.shipments.title}</span>
          </div>
          <div className="flex items-center text-neutral-800 font-semibold">
            <User className="w-4 h-4 mr-2 text-accent" />
            <span>De la part de : {transaction.users?.first_name} {transaction.users?.last_name}</span>
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <Button
            onClick={handleAcceptOffer}
            loading={isAccepting}
            disabled={isAccepted}
            className={`w-full ${isAccepted ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary/90'} text-white`}
          >
            {isAccepted ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Acceptée !
              </>
            ) : (
              "Accepter l'offre"
            )}
          </Button>
        </div>
      </div>
      {error && <Alert type="error" message={error} className="mt-4" />}
    </div>
  );
}