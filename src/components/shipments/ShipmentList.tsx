import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ShipmentCard } from './ShipmentCard';
import { Loader2, ServerCrash, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

// Définition du type pour un objet annonce
interface Shipment {
  id: string;
  title: string;
  pickup_city: string;
  delivery_city: string;
  proposed_price: number | null;
  currency: string;
}

export function ShipmentList() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('shipments')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        setShipments(data || []);
      } catch (err: any) {
        setError('Impossible de charger vos annonces. Veuillez réessayer.');
        console.error('Error fetching shipments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin mr-3" />
        <span className="text-neutral-600">Chargement de vos annonces...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-2xl">
        <ServerCrash className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-red-700">Une erreur est survenue</h3>
        <p className="text-red-600 mt-2">{error}</p>
      </div>
    );
  }

  if (shipments.length === 0) {
    return (
      <div className="text-center py-12 bg-neutral-100 rounded-2xl">
        <Package className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-neutral-700">Aucune annonce pour le moment</h3>
        <p className="text-neutral-500 mt-2 mb-6">Commencez par publier votre première annonce de colis.</p>
        <Link to="/create-shipment">
          <Button>Publier une annonce</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {shipments.map((shipment) => (
        <ShipmentCard key={shipment.id} shipment={shipment} />
      ))}
    </div>
  );
}