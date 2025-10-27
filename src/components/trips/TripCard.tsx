import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { MapPin, Calendar, Weight, User } from 'lucide-react';

interface Traveler {
  first_name: string;
  last_name: string;
  profile_picture: string | null;
}

interface Trip {
  id: string;
  title: string;
  departure_city: string;
  arrival_city: string;
  departure_date: string;
  arrival_date: string;
  available_weight: number;
  traveler: Traveler;
}

interface TripCardProps {
  trip: Trip;
}

export function TripCard({ trip }: TripCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="bg-white rounded-4xl p-6 shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full">
      <div className="flex items-center mb-4">
        {trip.traveler.profile_picture ? (
          <img
            src={trip.traveler.profile_picture}
            alt={`${trip.traveler.first_name} ${trip.traveler.last_name}`}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center mr-3">
            <User className="w-5 h-5 text-neutral-500" />
          </div>
        )}
        <div>
          <p className="font-semibold text-neutral-800 truncate">
            {trip.traveler.first_name} {trip.traveler.last_name}
          </p>
          <p className="text-sm text-neutral-500">Voyageur</p>
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-neutral-800 mb-3 truncate">{trip.title}</h3>
      
      <div className="space-y-2 text-neutral-600 text-sm mb-4 flex-grow">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-neutral-400" />
          <span className="truncate">{trip.departure_city} → {trip.arrival_city}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-neutral-400" />
          <span>{formatDate(trip.departure_date)} - {formatDate(trip.arrival_date)}</span>
        </div>
        <div className="flex items-center">
          <Weight className="w-4 h-4 mr-2 text-neutral-400" />
          <span>{trip.available_weight} kg disponibles</span>
        </div>
      </div>
      
      <Link to={`/trips/${trip.id}`} className="mt-auto">
        <Button className="w-full bg-accent hover:bg-accent/90 text-white rounded-2xl">
          Voir le trajet
        </Button>
      </Link>
    </div>
  );
}