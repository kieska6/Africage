import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import { ShipmentCard } from './ShipmentCard';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

// Define the Shipment type again, or import from a shared types file
interface Shipment {
  id: string;
  title: string;
  pickupCity: string;
  deliveryCity: string;
  status: string;
  proposedPrice: number;
  createdAt: string;
}

export function MyShipmentsList() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const data = await apiFetch('/shipments/my-shipments');
        setShipments(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, []);

  if (loading) {
    return <div>Chargement de vos colis...</div>;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (shipments.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-800">Aucun colis pour le moment</h3>
        <p className="text-gray-500 mt-2 mb-4">Commencez par créer votre première annonce d'envoi.</p>
        <Link to="/new-shipment">
            <Button>Créer une annonce</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shipments.map((shipment) => (
        <ShipmentCard key={shipment.id} shipment={shipment} />
      ))}
    </div>
  );
}
