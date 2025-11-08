import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, ServerCrash } from 'lucide-react';

interface Shipment {
  id: string;
  title: string;
  pickup_city: string;
  delivery_city: string;
  created_at: string;
}

export function ShipmentList() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        console.log('Début de la récupération des shipments...');
        setLoading(true);
        setError(null);

        // Test simple de connexion
        const { data, error: fetchError } = await supabase
          .from('shipments')
          .select('id, title, pickup_city, delivery_city, created_at')
          .limit(5);

        console.log('Réponse Supabase:', { data, error: fetchError });

        if (fetchError) {
          throw fetchError;
        }

        setShipments(data || []);
      } catch (err: any) {
        console.error('Erreur détaillée:', err);
        setError(`Erreur: ${err.message || 'Impossible de charger les annonces'}`);
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
        <span className="text-neutral-600">Test de connexion...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-2xl">
        <ServerCrash className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-red-700">Erreur de connexion</h3>
        <p className="text-red-600 mt-2">{error}</p>
        <pre className="text-xs mt-4 p-2 bg-red-100 rounded text-left">
          Vérifiez:
          - Variables d'environnement
          - Configuration Supabase
          - Politiques RLS
        </pre>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Test de connexion - {shipments.length} résultats</h3>
      {shipments.map((shipment) => (
        <div key={shipment.id} className="p-4 border rounded">
          <h4 className="font-medium">{shipment.title}</h4>
          <p className="text-sm text-gray-600">{shipment.pickup_city} → {shipment.delivery_city}</p>
        </div>
      ))}
    </div>
  );
}