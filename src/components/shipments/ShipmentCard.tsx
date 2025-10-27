import React from 'react';
import { Package, MapPin, DollarSign } from 'lucide-react';

// Définition du type pour un objet annonce
interface Shipment {
  id: string;
  title: string;
  pickup_city: string;
  delivery_city: string;
  proposed_price: number | null;
  currency: string;
}

interface ShipmentCardProps {
  shipment: Shipment;
}

export function ShipmentCard({ shipment }: ShipmentCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-neutral-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-800">{shipment.title}</h3>
            <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              Publié
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 text-neutral-600">
        <div className="flex items-center">
          <MapPin className="w-5 h-5 mr-3 text-neutral-400" />
          <span>
            De: <span className="font-medium">{shipment.pickup_city}</span> à <span className="font-medium">{shipment.delivery_city}</span>
          </span>
        </div>
        <div className="flex items-center">
          <DollarSign className="w-5 h-5 mr-3 text-neutral-400" />
          <span>
            Récompense : <span className="font-medium">{shipment.proposed_price?.toLocaleString() ?? 'N/A'} {shipment.currency}</span>
          </span>
        </div>
      </div>
    </div>
  );
}