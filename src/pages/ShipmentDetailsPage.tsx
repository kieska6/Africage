import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, ServerCrash, Package, MapPin, DollarSign, Ruler, Weight, User, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface UserProfile {
  first_name: string;
  last_name: string;
  profile_picture: string | null;
}

interface Shipment {
  id: string;
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
  users: UserProfile;
}

export function ShipmentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShipment = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('shipments')
          .select('*, users(first_name, last_name, profile_picture)')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error("Annonce non trouvée");

        setShipment(data as Shipment);
      } catch (err: any) {
        setError("Impossible de charger les détails de l'annonce.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShipment();
  }, [id]);

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
              <div className="bg-neutral-50 rounded-2xl p-6 text-center">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">Expéditeur</h3>
                {shipment.users.profile_picture ? (
                  <img src={shipment.users.profile_picture} alt="Expéditeur" className="w-20 h-20 rounded-full mx-auto mb-3" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-neutral-200 flex items-center justify-center mx-auto mb-3">
                    <User className="w-10 h-10 text-neutral-500" />
                  </div>
                )}
                <p className="font-bold text-neutral-900">{shipment.users.first_name} {shipment.users.last_name}</p>
                <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-white">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contacter l'expéditeur
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}