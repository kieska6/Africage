import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, ServerCrash, User, Package, Briefcase, Star } from 'lucide-react';
import { ShipmentCard } from '../components/shipments/ShipmentCard';
import { TripCard } from '../components/trips/TripCard';

// Interfaces
interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
  created_at: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: {
    first_name: string;
    last_name: string;
  }
}

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
  traveler: Traveler | null;
}

export function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);

        const [profileRes, shipmentsRes, tripsRes, reviewsRes] = await Promise.all([
          supabase.from('users').select('*').eq('id', id).single(),
          supabase.from('shipments').select('*').eq('sender_id', id).order('created_at', { ascending: false }),
          supabase.from('trips').select('*, traveler:users!traveler_id(first_name, last_name, profile_picture)').eq('traveler_id', id).order('created_at', { ascending: false }),
          supabase.from('reviews').select('*, reviewer:users!reviews_reviewer_id_fkey(first_name, last_name)').eq('reviewee_id', id)
        ]);

        if (profileRes.error) throw new Error("Profil utilisateur non trouvé.");
        setProfile(profileRes.data);

        if (shipmentsRes.error) throw shipmentsRes.error;
        setShipments(shipmentsRes.data || []);

        if (tripsRes.error) throw tripsRes.error;
        setTrips(tripsRes.data as Trip[] || []);

        if (reviewsRes.error) throw reviewsRes.error;
        setReviews(reviewsRes.data as Review[] || []);

      } catch (err: any) {
        setError("Impossible de charger le profil.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : 'N/A';

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>;
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 text-center">
        <ServerCrash className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-red-700">Profil non trouvé</h3>
        <p className="text-red-600 mt-2">{error || "L'utilisateur que vous cherchez n'existe pas."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-4xl shadow-xl p-8 mb-12">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {profile.profile_picture ? (
              <img src={profile.profile_picture} alt="Profil" className="w-32 h-32 rounded-full object-cover border-4 border-primary" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-neutral-200 flex items-center justify-center border-4 border-primary">
                <User className="w-16 h-16 text-neutral-500" />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold text-neutral-800">{profile.first_name} {profile.last_name}</h1>
              <p className="text-neutral-500 mt-2">Membre depuis {new Date(profile.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}</p>
              <div className="flex items-center gap-2 mt-3 text-lg">
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <span className="font-bold text-neutral-700">{averageRating}</span>
                <span className="text-neutral-500">({reviews.length} avis)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <Package className="w-10 h-10 text-accent mx-auto mb-3" />
            <p className="text-3xl font-bold text-neutral-800">{shipments.length}</p>
            <p className="text-neutral-600">Colis envoyés</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <Briefcase className="w-10 h-10 text-accent mx-auto mb-3" />
            <p className="text-3xl font-bold text-neutral-800">{trips.length}</p>
            <p className="text-neutral-600">Voyages effectués</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border">
            <Star className="w-10 h-10 text-accent mx-auto mb-3" />
            <p className="text-3xl font-bold text-neutral-800">{reviews.length}</p>
            <p className="text-neutral-600">Avis reçus</p>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center mb-6">
            <Star className="w-6 h-6 text-accent mr-3" />
            <h2 className="text-2xl font-bold text-neutral-800">Avis reçus</h2>
          </div>
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">{review.reviewer.first_name} {review.reviewer.last_name}</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-neutral-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-neutral-600 italic">"{review.comment}"</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border">
              <p className="text-neutral-600">{profile.first_name} n'a pas encore reçu d'avis.</p>
            </div>
          )}
        </div>

        <div className="mb-12">
          <div className="flex items-center mb-6">
            <Package className="w-6 h-6 text-accent mr-3" />
            <h2 className="text-2xl font-bold text-neutral-800">Annonces publiées par {profile.first_name}</h2>
          </div>
          {shipments.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {shipments.map(shipment => <ShipmentCard key={shipment.id} shipment={shipment} />)}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border">
              <p className="text-neutral-600">{profile.first_name} n'a publié aucune annonce de colis pour le moment.</p>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center mb-6">
            <Briefcase className="w-6 h-6 text-accent mr-3" />
            <h2 className="text-2xl font-bold text-neutral-800">Trajets publiés par {profile.first_name}</h2>
          </div>
          {trips.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trips.map(trip => <TripCard key={trip.id} trip={trip} />)}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border">
              <p className="text-neutral-600">{profile.first_name} n'a publié aucun trajet pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}