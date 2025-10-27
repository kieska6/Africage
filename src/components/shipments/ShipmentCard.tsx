import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { MapPin, Calendar, DollarSign, Package } from 'lucide-react';

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

interface ShipmentCardProps {
  shipment: Shipment;
}

export function ShipmentCard({ shipment }: ShipmentCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <Link to={`/shipments/${shipment.id}`} className="block h-full">
      <div className="bg-white rounded-4xl p-6 shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full border border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          {shipment.is_urgent ? (
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              Urgent
            </span>
          ) : (
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
              Standard
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-neutral-800 mb-2 truncate">{shipment.title}</h3>
        
        <div className="flex items-center text-neutral-600 mb-2">
          <MapPin className="w-4 h-4 mr-2 text-neutral-400" />
          <span className="text-sm truncate">{shipment.pickup_city} → {shipment.delivery_city}</span>
        </div>
        
        <div className="flex items-center text-neutral-600 mb-4">
          <Calendar className="w-4 h-4 mr-2 text-neutral-400" />
          <span className="text-sm">Avant le {formatDate(shipment.delivery_date_by)}</span>
        </div>
        
        <div className="flex items-center justify-between mb-4 flex-grow">
          <div className="flex items-center text-green-600 font-bold">
            <DollarSign className="w-4 h-4 mr-1" />
            <span>{shipment.proposed_price?.toLocaleString() ?? 'N/A'} {shipment.currency}</span>
          </div>
          <div className="flex items-center text-neutral-500 text-sm">
            <Package className="w-4 h-4 mr-1" />
            <span>{shipment.weight} kg</span>
          </div>
        </div>
        
        <Button as="div" className="w-full bg-accent hover:bg-accent/90 text-white rounded-2xl mt-auto">
          Voir les détails
        </Button>
      </div>
    </Link>
  );
}