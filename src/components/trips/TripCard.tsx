import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { MapPin, Calendar, Weight, DollarSign, User } from 'lucide-react';

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
  price_per_kg: number | null;
  currency: string;
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
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-4xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-neutral-200 flex flex-col h-full">
      <div className="flex items-center mb-4">
        {trip.traveler.profile_picture ? (
          <img
            src={trip.traveler.profile_picture}
            alt={`${trip.traveler.first_name} ${trip.traveler.last_name}`}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center mr-4">
            <User className="w-6 h-6 text-neutral-500" />
          </div>
        )}
        <div>
          <p className="font-semibold text-neutral-800">
            {trip.traveler.first_name} {trip.traveler.last_name}
          </p>
          <p className="text-sm text-neutral-500">Voyageur vérifié</p>
        </div>
      </div>

      <h3 className="text-xl font-bold text-neutral-800 mb-3 truncate">{trip.title}</h3>

      <div className="space-y-3 text-neutral-600 text-sm mb-4 flex-grow">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-3 text-neutral-400" />
          <span>
            <span className="font-medium">{trip.departure_city}</span> → <span className="font-medium">{trip.arrival_city}</span>
          </span>
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-3 text-neutral-400" />
          <span>
            {formatDate(trip.departure_date)} - {formatDate(trip.arrival_date)}
          </span>
        </div>
        <div className="flex items-center">
          <Weight className="w-4 h-4 mr-3 text-neutral-400" />
          <span>
            Capacité restante : <span className="font-medium">{trip.available_weight} kg</span>
          </span>
        </div>
        {trip.price_per_kg && (
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-3 text-neutral-400" />
            <span>
              Prix : <span className="font-medium">{trip.price_per_kg.toLocaleString()} {trip.currency}/kg</span>
            </span>
          </div>
        )}
      </div>

      <Link to={`/trips/${trip.id}`} className="mt-auto">
        <Button className="w-full bg-accent hover:bg-accent/90 text-white rounded-2xl">
          Voir les détails
        </Button>
      </Link>
    </div>
  );
}