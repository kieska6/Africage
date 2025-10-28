import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Loader2, ServerCrash, MapPin, Ruler, Weight, User, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';

interface UserProfile {
  first_name: string;
  last_name: string;
  profile_picture: string | null;
}

interface Shipment {
  id: string;
  sender_id: string;
  title: string;
  description: string;
  pickup_city: string;
  delivery_city: string;
  proposed_price: number;
  currency: string;
  weight: number;
  length: number | null;
  width: number | null;
  height: number | null;
  created_at: string;
  sender: UserProfile | null;
}

export function ShipmentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offerSent, setOfferSent] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    const fetchShipmentAndOffer = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        setActionError('');

        // Fetch shipment details with an explicit join
        const { data, error: fetchError } = await supabase
          .from('shipments')
          .select('*, sender:users!sender_id(first_name, last_name, profile_picture)')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error("Annonce non trouvée");

        setShipment(data as Shipment);

        // If user is logged in, check for an existing offer
        if (user) {
          const { data: offerData, error: offerError } = await supabase
            .from('transactions')
            .select('id')
            .eq('shipment_id', id)
            .eq('traveler_id', user.id)
            .maybeSingle();
          
          if (offerError) console.error("Error checking for existing offer:", offerError);
          
          if (offerData) {
            setOfferSent(true);
          }
        }

      } catch (err: any) {
        setError("Impossible de charger les détails de l'annonce.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShipmentAndOffer();
  }, [id, user]);

  const handleMakeOffer = async () => {
    if (!user || !shipment) return;

    setIsSubmitting(true);
    setActionError('');

    const security_code = Math.floor(100000 + Math.random() * 900000).toString();

    const { error: insertError } = await supabase.from('transactions').insert({
      shipment_id: shipment.id,
      traveler_id: user.id,
      sender_id: shipment.sender_id,
      status: 'PENDING',
      agreed_price: shipment.proposed_price,
      currency: shipment.currency,
      security_code,
    });

    if (insertError) {
      setActionError("Une erreur est survenue lors de l'envoi de votre offre. Veuillez réessayer.");
      console.error("Error making offer:", insertError);
    } else {
      setOfferSent(true);
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 text-center">
        <ServerCrash className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-red-700">Une erreur est survenue</h3>
        <p className="text-red-600 mt-2">{error}</p>
      </div>
    );
  }

  if (!shipment) {
    return <div className="text-center py-20">Annonce non trouvée.</div>;
  }

  const canMakeOffer = user && user.id !== shipment.sender_id;

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-4xl shadow-xl p-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-800">{shipment.title}</h1>
              <p className="text-neutral-500 mt-2">Publié le {new Date(shipment.created_at).toLocaleDateString('fr-FR')}</p>
            </div>
            <div className="mt-4 md:mt-0 text-2xl font-bold text-green-600">
              {shipment.proposed_price.toLocaleString()} {shipment.currency}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-neutral-800 mb-2">Description</h2>
                <p className="text-neutral-600 leading-relaxed">{shipment.description || "Aucune description fournie."}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-800 mb-4">Détails du colis</h2>
                <div className="grid grid-cols-2 gap-4 text-neutral-700">
                  <div className="flex items-center"><Weight className="w-5 h-5 mr-2 text-accent" /> Poids: <strong>{shipment.weight} kg</strong></div>
                  {shipment.length && <div className="flex items-center"><Ruler className="w-5 h-5 mr-2 text-accent" /> Dimensions: <strong>{shipment.length}x{shipment.width}x{shipment.height} cm</strong></div>}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-800 mb-4">Itinéraire</h2>
                <div className="flex items-center text-neutral-700">
                  <MapPin className="w-5 h-5 mr-2 text-accent" />
                  De <strong>{shipment.pickup_city}</strong> à <strong>{shipment.delivery_city}</strong>
                </div>
              </div>
            </div>
            <div className="md:col-span-1 space-y-6">
              <div className="bg-neutral-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4 text-center">Expéditeur</h3>
                <div className="flex flex-col items-center text-center">
                  {shipment.sender && shipment.sender.profile_picture ? (
                    <img src={shipment.sender.profile_picture} alt="Expéditeur" className="w-20 h-20 rounded-full mb-3" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-neutral-200 flex items-center justify-center mx-auto mb-3">
                      <User className="w-10 h-10 text-neutral-500" />
                    </div>
                  )}
                  <Link to={`/users/${shipment.sender_id}`} className="font-bold text-neutral-900 hover:text-accent transition-colors">
                    {shipment.sender ? `${shipment.sender.first_name} ${shipment.sender.last_name}` : 'Utilisateur inconnu'}
                  </Link>
                </div>
                
                {canMakeOffer && (
                  <Button 
                    onClick={handleMakeOffer}
                    loading={isSubmitting}
                    disabled={offerSent}
                    className="w-full mt-6 bg-primary hover:bg-primary/90 text-white"
                  >
                    {offerSent ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Offre envoyée !
                      </>
                    ) : (
                      'Proposer de prendre en charge'
                    )}
                  </Button>
                )}
                {actionError && <Alert type="error" message={actionError} className="mt-4" />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}