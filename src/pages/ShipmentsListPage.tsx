import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ShipmentCard } from '../components/shipments/ShipmentCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Search, Loader2, ServerCrash, Package } from 'lucide-react';

interface Shipment {
  id: string;
  title: string;
  pickup_city: string;
  delivery_city: string;
  delivery_date_by: string | null;
  proposed_price: number | null;
  currency: string;
  weight: number;
  is_urgent: boolean;
}

export function ShipmentsListPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');

  const fetchShipments = async () => {
    try {
      setLoading(true);
      setError('');

      let query = supabase
        .from('shipments')
        .select('*')
        .eq('status', 'PENDING_MATCH')
        .order('created_at', { ascending: false });

      if (departure) {
        query = query.ilike('pickup_city', `%${departure}%`);
      }
      if (arrival) {
        query = query.ilike('delivery_city', `%${arrival}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }
      
      setShipments(data as Shipment[] || []);
    } catch (err: any) {
      setError('Erreur lors du chargement des annonces de colis.');
      console.error('Error fetching shipments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchShipments();
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Trouver un colis à transporter
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Parcourez les annonces et trouvez des colis qui correspondent à votre itinéraire.
          </p>
        </div>

        <div className="bg-white rounded-4xl shadow-lg p-6 mb-12 max-w-4xl mx-auto">
          <form onSubmit={handleSearch} className="grid sm:grid-cols-3 gap-4 items-end">
            <Input
              label="Ville de départ"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              placeholder="Ex: Dakar"
            />
            <Input
              label="Ville d'arrivée"
              value={arrival}
              onChange={(e) => setArrival(e.target.value)}
              placeholder="Ex: Abidjan"
            />
            <Button type="submit" className="w-full h-12 text-base" loading={loading}>
              <Search className="w-5 h-5 mr-2" />
              Rechercher
            </Button>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-50 rounded-2xl">
            <ServerCrash className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-700">Oops! Une erreur est survenue.</h3>
            <p className="text-red-600 mt-2">{error}</p>
          </div>
        ) : shipments.length === 0 ? (
          <div className="text-center py-20 bg-neutral-100 rounded-2xl">
            <Package className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-700">Aucune annonce trouvée</h3>
            <p className="text-neutral-500 mt-2">Essayez d'élargir vos critères de recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {shipments.map((shipment) => (
              <ShipmentCard key={shipment.id} shipment={shipment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}