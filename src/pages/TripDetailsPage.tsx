import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, ServerCrash, MapPin, Calendar, Weight, User, MessageSquare, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface UserProfile {
  first_name: string;
  last_name: string;
  profile_picture: string | null;
}

interface Trip {
  id: string;
  traveler_id: string;
  title: string;
  description: string;
  departure_city: string;
  arrival_city: string;
  departure_date: string;
  arrival_date: string;
  available_weight: number;
  price_per_kg: number;
  currency: string;
  created_at: string;
  traveler: UserProfile | null;
}

export function TripDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('trips')
          .select('*, traveler:users!traveler_id(first_name, last_name, profile_picture)')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error("Trajet non trouvé");

        setTrip(data as Trip);
      } catch (err: any) {
        setError("Impossible de charger les détails du trajet.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 text-center">
        <ServerCrash className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-red-700">Une erreur est survenue</h3>
        <p className="text-red-600 mt-2">{error}</p>
      </div>
    );
  }

  if (!trip) {
    return <div className="text-center py-20">Trajet non trouvé.</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-4xl shadow-xl p-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-800">{trip.title}</h1>
              <p className="text-neutral-500 mt-2">Publié le {new Date(trip.created_at).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-neutral-800 mb-2">Description</h2>
                <p className="text-neutral-600 leading-relaxed">{trip.description || "Aucune description fournie."}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-800 mb-4">Itinéraire et dates</h2>
                <div className="space-y-3 text-neutral-700">
                  <div className="flex items-center"><MapPin className="w-5 h-5 mr-2 text-accent" /> De <strong>{trip.departure_city}</strong> à <strong>{trip.arrival_city}</strong></div>
                  <div className="flex items-center"><Calendar className="w-5 h-5 mr-2 text-accent" /> Départ le <strong>{formatDate(trip.departure_date)}</strong></div>
                  <div className="flex items-center"><Calendar className="w-5 h-5 mr-2 text-accent" /> Arrivée le <strong>{formatDate(trip.arrival_date)}</strong></div>
                </div>
              </div>
               <div>
                <h2 className="text-xl font-semibold text-neutral-800 mb-4">Capacité et prix</h2>
                <div className="grid grid-cols-2 gap-4 text-neutral-700">
                  <div className="flex items-center"><Weight className="w-5 h-5 mr-2 text-accent" /> Poids disponible: <strong>{trip.available_weight} kg</strong></div>
                  {trip.price_per_kg && <div className="flex items-center"><DollarSign className="w-5 h-5 mr-2 text-accent" /> Prix: <strong>{trip.price_per_kg.toLocaleString()} {trip.currency}/kg</strong></div>}
                </div>
              </div>
            </div>
            <div className="md:col-span-1 space-y-6">
              <div className="bg-neutral-50 rounded-2xl p-6 text-center">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">Voyageur</h3>
                {trip.traveler && trip.traveler.profile_picture ? (
                  <img src={trip.traveler.profile_picture} alt="Voyageur" className="w-20 h-20 rounded-full mx-auto mb-3" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-neutral-200 flex items-center justify-center mx-auto mb-3">
                    <User className="w-10 h-10 text-neutral-500" />
                  </div>
                )}
                <Link to={`/users/${trip.traveler_id}`} className="font-bold text-neutral-900 hover:text-accent transition-colors">
                  {trip.traveler ? `${trip.traveler.first_name} ${trip.traveler.last_name}` : 'Utilisateur inconnu'}
                </Link>
                <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-white">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contacter le voyageur
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}