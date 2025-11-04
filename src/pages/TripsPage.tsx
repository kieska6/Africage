import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TripCard } from '../components/trips/TripCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Search, Loader2, ServerCrash } from 'lucide-react';

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
  traveler: Traveler | null;
}

export function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError('');

      let query = supabase
        .from('trips')
        .select(`
          id,
          title,
          departure_city,
          arrival_city,
          departure_date,
          arrival_date,
          available_weight,
          price_per_kg,
          currency,
          traveler:users!traveler_id (
            first_name,
            last_name,
            profile_picture
          )
        `)
        .eq('status', 'AVAILABLE')
        .order('departure_date', { ascending: true });

      if (departure) {
        query = query.ilike('departure_city', `%${departure}%`);
      }
      if (arrival) {
        query = query.ilike('arrival_city', `%${arrival}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }
      
      setTrips(data as Trip[] || []);
    } catch (err: any) {
      setError('Erreur lors du chargement des voyages.');
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrips();
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Trouver un voyage
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Parcourez les trajets disponibles et trouvez le voyageur parfait pour votre colis.
          </p>
        </div>

        <div className="bg-white rounded-4xl shadow-lg p-6 mb-12 max-w-4xl mx-auto">
          <form onSubmit={handleSearch} className="grid sm:grid-cols-3 gap-4 items-end">
            <Input
              label="Ville de départ"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              placeholder="Ex: Dakar"
            />
            <Input
              label="Ville d'arrivée"
              value={arrival}
              onChange={(e) => setArrival(e.target.value)}
              placeholder="Ex: Abidjan"
            />
            <Button type="submit" className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-white" loading={loading}>
              <Search className="w-5 h-5 mr-2" />
              Rechercher
            </Button>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-50 rounded-2xl">
            <ServerCrash className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-700">Oops! Une erreur est survenue.</h3>
            <p className="text-red-600 mt-2">{error}</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20 bg-neutral-100 rounded-2xl">
            <h3 className="text-xl font-semibold text-neutral-700">Aucun voyage trouvé</h3>
            <p className="text-neutral-500 mt-2">Essayez d'élargir vos critères de recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}