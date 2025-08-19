import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import { TripCard } from './TripCard';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

interface Trip {
  id: string;
  title: string;
  departureCity: string;
  arrivalCity: string;
  status: string;
  pricePerKg?: number | null;
  departureDate: string;
}

export function MyTripsList() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await apiFetch('/trips/my-trips');
        setTrips(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return <div>Chargement de vos trajets...</div>;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (trips.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-800">Aucun trajet pour le moment</h3>
        <p className="text-gray-500 mt-2 mb-4">Proposez un trajet pour commencer à transporter des colis.</p>
        <Link to="/new-trip">
            <Button>Proposer un trajet</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  );
}
