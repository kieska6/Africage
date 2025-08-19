import React from 'react';
import { Plane, ArrowRight, Calendar, Tag } from 'lucide-react';

// Define the Trip type to match our API response
interface Trip {
  id: string;
  title: string;
  departureCity: string;
  arrivalCity: string;
  status: string;
  pricePerKg?: number | null;
  departureDate: string;
}

interface TripCardProps {
  trip: Trip;
}

export function TripCard({ trip }: TripCardProps) {
  const getStatusChip = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">Disponible</span>;
      case 'FULLY_BOOKED':
        return <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">Complet</span>;
      case 'COMPLETED':
        return <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">Terminé</span>;
      case 'CANCELED':
        return <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">Annulé</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-gray-800">{trip.title}</h3>
        {getStatusChip(trip.status)}
      </div>
      <div className="flex items-center text-gray-600 my-3">
        <span>{trip.departureCity}</span>
        <ArrowRight className="w-4 h-4 mx-2" />
        <span>{trip.arrivalCity}</span>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-500">
         <div className="flex items-center">
            {trip.pricePerKg && (
                <>
                    <Tag className="w-4 h-4 mr-1" />
                    <span>{trip.pricePerKg} XOF/kg</span>
                </>
            )}
         </div>
         <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{new Date(trip.departureDate).toLocaleDateString()}</span>
         </div>
      </div>
    </div>
  );
}
