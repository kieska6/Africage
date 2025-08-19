import React from 'react';
import { Package, ArrowRight, Calendar, Tag } from 'lucide-react';

// Define the Shipment type to match our API response
interface Shipment {
  id: string;
  title: string;
  pickupCity: string;
  deliveryCity: string;
  status: string;
  proposedPrice: number;
  createdAt: string;
}

interface ShipmentCardProps {
  shipment: Shipment;
}

export function ShipmentCard({ shipment }: ShipmentCardProps) {
  const getStatusChip = (status: string) => {
    switch (status) {
      case 'PENDING_MATCH':
        return <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">En attente</span>;
      case 'MATCHED':
        return <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">Confirmé</span>;
      case 'IN_TRANSIT':
        return <span className="px-2 py-1 text-xs font-medium text-purple-800 bg-purple-100 rounded-full">En transit</span>;
      case 'DELIVERED':
        return <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">Livré</span>;
      case 'CANCELED':
        return <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">Annulé</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-gray-800">{shipment.title}</h3>
        {getStatusChip(shipment.status)}
      </div>
      <div className="flex items-center text-gray-600 my-3">
        <span>{shipment.pickupCity}</span>
        <ArrowRight className="w-4 h-4 mx-2" />
        <span>{shipment.deliveryCity}</span>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-500">
         <div className="flex items-center">
            <Tag className="w-4 h-4 mr-1" />
            <span>{shipment.proposedPrice} XOF</span>
         </div>
         <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{new Date(shipment.createdAt).toLocaleDateString()}</span>
         </div>
      </div>
    </div>
  );
}
