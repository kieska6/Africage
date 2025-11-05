import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { DollarSign, Users, Shield, Loader2, ServerCrash, PackagePlus, Star, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ShipmentCard } from '../components/shipments/ShipmentCard';
import { TripCard } from '../components/trips/TripCard';
import { useAuth } from '../context/AuthContext';

// Interfaces for the data
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

const LoggedInHomePage = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [shipmentsRes, tripsRes] = await Promise.all([
        supabase.from('shipments').select('*').order('created_at', { ascending: false }).limit(4),
        supabase.from('trips').select('*, traveler:users!traveler_id(first_name, last_name, profile_picture)').order('created_at', { ascending: false }).limit(4)
      ]);

      if (shipmentsRes.error) throw shipmentsRes.error;
      setShipments(shipmentsRes.data || []);

      if (tripsRes.error) throw tripsRes.error;
      setTrips(tripsRes.data as Trip[] || []);

    } catch (err) {
      console.error("Error fetching initial data:", err);
      setError("Impossible de charger les données.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return (
    <>
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
              Annonces récentes
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading && <div className="col-span-full flex justify-center items-center py-10"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>}
            {error && <div className="col-span-full text-center py-10 bg-red-50 rounded-2xl"><ServerCrash className="w-10 h-10 text-red-500 mx-auto mb-2" /><p className="text-red-600">{error}</p></div>}
            {!loading && !error && shipments.map(shipment => <ShipmentCard key={shipment.id} shipment={shipment} />)}
          </div>
          <div className="text-center mt-12">
            <Link to="/shipments-list">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl text-lg font-semibold">
                Voir toutes les annonces
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
              Trajets récents
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading && <div className="col-span-full flex justify-center items-center py-10"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>}
            {error && <div className="col-span-full text-center py-10 bg-red-50 rounded-2xl"><ServerCrash className="w-10 h-10 text-red-500 mx-auto mb-2" /><p className="text-red-600">{error}</p></div>}
            {!loading && !error && trips.map(trip => <TripCard key={trip.id} trip={trip} />)}
          </div>
          <div className="text-center mt-12">
            <Link to="/trips">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl text-lg font-semibold">
                Voir tous les trajets
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

const LandingPage = () => (
  <>
    <section className="bg-primary text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Envoyez et transportez des colis entre continents, <span className="text-accent">en toute confiance.</span>
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto">
          Africage connecte les expéditeurs avec des voyageurs vérifiés pour des livraisons rapides, économiques et sécurisées.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-2xl text-lg font-semibold">
              Créer un compte
            </Button>
          </Link>
          <Link to="/shipments-list">
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-2xl text-lg font-semibold">
              Voir les annonces
            </Button>
          </Link>
        </div>
      </div>
    </section>

    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Comment ça marche ?</h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">Un processus simple et transparent en quatre étapes.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center"><div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"><PackagePlus className="w-8 h-8 text-primary" /></div><h3 className="text-xl font-bold mb-2">1. Publiez</h3><p className="text-neutral-600">Créez une annonce pour votre colis ou votre voyage en quelques clics.</p></div>
          <div className="text-center"><div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"><Users className="w-8 h-8 text-primary" /></div><h3 className="text-xl font-bold mb-2">2. Connectez</h3><p className="text-neutral-600">Recevez des offres de voyageurs ou trouvez des colis sur votre trajet.</p></div>
          <div className="text-center"><div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"><ShieldCheck className="w-8 h-8 text-primary" /></div><h3 className="text-xl font-bold mb-2">3. Sécurisez</h3><p className="text-neutral-600">Confirmez les détails, suivez votre envoi et utilisez notre code de livraison unique.</p></div>
          <div className="text-center"><div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"><Star className="w-8 h-8 text-primary" /></div><h3 className="text-xl font-bold mb-2">4. Évaluez</h3><p className="text-neutral-600">Laissez un avis pour renforcer la confiance au sein de la communauté.</p></div>
        </div>
      </div>
    </section>

    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-6">Vos envois, notre priorité.</h2>
          <div className="space-y-6">
            <div className="flex items-start"><div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0"><Shield className="w-6 h-6 text-accent" /></div><div><h3 className="text-xl font-semibold">Sécurité Renforcée</h3><p className="text-neutral-600">Avec la vérification d'identité (KYC) et un système d'évaluation, nous bâtissons une communauté de confiance.</p></div></div>
            <div className="flex items-start"><div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0"><DollarSign className="w-6 h-6 text-accent" /></div><div><h3 className="text-xl font-semibold">Économies Intelligentes</h3><p className="text-neutral-600">Évitez les frais exorbitants des services de livraison traditionnels. Négociez directement avec les voyageurs.</p></div></div>
            <div className="flex items-start"><div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0"><Users className="w-6 h-6 text-accent" /></div><div><h3 className="text-xl font-semibold">Communauté Solidaire</h3><p className="text-neutral-600">Rejoignez un réseau de membres qui s'entraident pour connecter les continents.</p></div></div>
          </div>
        </div>
        <div className="hidden md:block"><img src="https://i.ibb.co/ZzcJW9rL/Africage-remove-BG.png" alt="Africage Logo" className="rounded-lg" /></div>
      </div>
    </section>

    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-accent text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à révolutionner vos envois ?</h2>
        <p className="text-xl mb-8 text-white/90">Rejoignez Africage aujourd'hui et découvrez une nouvelle façon d'envoyer et de voyager.</p>
        <Link to="/signup">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-2xl text-lg font-semibold">
            Rejoignez-nous maintenant
          </Button>
        </Link>
      </div>
    </section>
  </>
);

export function HomePage() {
  const { user } = useAuth();
  return user ? <LoggedInHomePage /> : <LandingPage />;
}