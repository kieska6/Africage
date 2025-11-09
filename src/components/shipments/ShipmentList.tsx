import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Loader2, ServerCrash, Package, Plus } from 'lucide-react';

interface Shipment {
  id: string;
  title: string;
  pickup_city: string;
  delivery_city: string;
  status: string;
  created_at: string;
}

export function ShipmentList() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyShipments = async () => {
      try {
        setLoading(true);
        setError(null);

        // Test simple de connexion
        const { data, error: fetchError } = await supabase
          .from('shipments')
          .select('id, title, pickup_city, delivery_city, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        console.log('Réponse Supabase pour mes annonces:', { data, error: fetchError });

        if (fetchError) {
          throw fetchError;
        }

        if (!Array.isArray(data)) {
          throw new Error('Les données reçues ne sont pas un tableau');
        }

        setShipments(data as Shipment[]);
      } catch (err: any) {
        console.error('Erreur lors du chargement de mes annonces:', err);
        setError(err.message || 'Impossible de charger vos annonces.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyShipments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 text-primary animate-spin mr-3" />
        <span className="text-neutral-600">Chargement de vos annonces...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 bg-red-50 rounded-lg">
        <ServerCrash className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-red-700">Erreur</h3>
        <p className="text-red-600 mt-1">{error}</p>
      </div>
    );
  }

  if (shipments.length === 0) {
    return (
      <div className="text-center py-8 bg-neutral-100 rounded-lg">
        <Package className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-neutral-700">Aucune annonce</h3>
        <p className="text-neutral-500 mt-1 mb-4">Vous n'avez pas encore publié d'annonces de colis.</p>
        <Link to="/create-shipment">
          <Button className="bg-primary hover:bg-primary/90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Publier une annonce
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {shipments.map((shipment) => (
        <div key={shipment.id} className="p-4 border rounded-lg hover:bg-neutral-50 transition-colors">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-semibold text-neutral-800">{shipment.title}</h4>
              <p className="text-sm text-neutral-600">
                {shipment.pickup_city} → {shipment.delivery_city}
              </p>
              <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                shipment.status === 'PENDING_MATCH' ? 'bg-yellow-100 text-yellow-800' :
                shipment.status === 'MATCHED' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {shipment.status}
              </span>
            </div>
            <Link to={`/shipments/${shipment.id}`}>
              <Button variant="outline" size="sm">Voir</Button>
            </Link>
          </div>
        </div>
      ))}
      
      {shipments.length === 5 && (
        <div className="text-center pt-4">
          <Link to="/shipments">
            <Button variant="outline">Voir toutes mes annonces</Button>
          </Link>
        </div>
      )}
    </div>
  );
}