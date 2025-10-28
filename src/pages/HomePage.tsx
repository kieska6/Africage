import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Package, Users, Shield, Loader2, ServerCrash, Briefcase } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ShipmentCard } from '../components/shipments/ShipmentCard';
import { TripCard } from '../components/trips/TripCard';

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

export function HomePage() {
  const [trackingCode, setTrackingCode] = useState('');
  
  // States for data
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  
  // States for search inputs
  const [shipmentDeparture, setShipmentDeparture] = useState('');
  const [shipmentArrival, setShipmentArrival] = useState('');
  const [tripDeparture, setTripDeparture] = useState('');
  const [tripArrival, setTripArrival] = useState('');

  // States for loading and errors
  const [loading, setLoading] = useState(true);
  const [shipmentLoading, setShipmentLoading] = useState(false);
  const [tripLoading, setTripLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShipments = useCallback(async (departure?: string, arrival?: string) => {
    setShipmentLoading(true);
    try {
      let query = supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });

      if (departure) {
        query = query.ilike('pickup_city', `%${departure}%`);
      }
      if (arrival) {
        query = query.ilike('delivery_city', `%${arrival}%`);
      }

      const { data, error: fetchError } = await query.limit(4);
      if (fetchError) throw fetchError;
      setShipments(data || []);
    } catch (err) {
      console.error("Error fetching shipments:", err);
      setError("Impossible de charger les annonces de colis.");
    } finally {
      setShipmentLoading(false);
    }
  }, []);

  const fetchTrips = useCallback(async (departure?: string, arrival?: string) => {
    setTripLoading(true);
    try {
      let query = supabase
        .from('trips')
        .select('*, traveler:users!traveler_id(first_name, last_name, profile_picture)')
        .order('created_at', { ascending: false });

      if (departure) {
        query = query.ilike('departure_city', `%${departure}%`);
      }
      if (arrival) {
        query = query.ilike('arrival_city', `%${arrival}%`);
      }

      const { data, error: fetchError } = await query.limit(4);
      if (fetchError) throw fetchError;
      setTrips(data as Trip[] || []);
    } catch (err) {
      console.error("Error fetching trips:", err);
      setError("Impossible de charger les trajets.");
    } finally {
      setTripLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      await Promise.all([
        fetchShipments(),
        fetchTrips()
      ]);
      setLoading(false);
    };
    fetchInitialData();
  }, [fetchShipments, fetchTrips]);

  const handleTrackPackage = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Tracking package:', trackingCode);
  };

  const handleShipmentSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchShipments(shipmentDeparture, shipmentArrival);
  };

  const handleTripSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrips(tripDeparture, tripArrival);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-accent text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Envoyez n'importe quoi,
            <br />
            <span className="text-primary">n'importe où en Afrique</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto">
            Connectez-vous avec des voyageurs de confiance pour envoyer vos colis 
            rapidement, en toute sécurité et à prix abordable.
          </p>

          {/* Tracking Form */}
          <div className="bg-white rounded-4xl p-8 max-w-2xl mx-auto shadow-2xl">
            <h3 className="text-2xl font-bold text-neutral-800 mb-6">
              Suivre votre colis
            </h3>
            <form onSubmit={handleTrackPackage} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Entrez votre code de suivi"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  className="w-full text-lg py-4 px-6 rounded-2xl border-2 border-neutral-200 focus:border-primary"
                />
              </div>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl text-lg font-semibold"
              >
                <Search className="w-5 h-5 mr-2" />
                Suivre le colis
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Trois étapes simples pour envoyer ou transporter des colis en toute sécurité
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center p-8 rounded-4xl bg-neutral-50 hover:bg-neutral-100 transition-colors">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-4">
                1. Créez votre annonce
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Décrivez votre colis, indiquez les adresses de départ et d'arrivée, 
                puis proposez une récompense équitable.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center p-8 rounded-4xl bg-neutral-50 hover:bg-neutral-100 transition-colors">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-4">
                2. Trouvez un voyageur
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Des voyageurs vérifiés consultent votre annonce et vous proposent 
                leurs services selon leur itinéraire.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center p-8 rounded-4xl bg-neutral-50 hover:bg-neutral-100 transition-colors">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-4">
                3. Livraison sécurisée
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Suivez votre colis en temps réel et recevez une confirmation 
                de livraison avec code de sécurité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Shipments Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
              Annonces récentes
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Découvrez les dernières demandes d'envoi de colis dans toute l'Afrique
            </p>
          </div>
          
          <form onSubmit={handleShipmentSearch} className="max-w-2xl mx-auto grid sm:grid-cols-3 gap-4 items-end mb-12 bg-white p-6 rounded-2xl shadow-sm">
            <Input placeholder="Ville de départ" value={shipmentDeparture} onChange={e => setShipmentDeparture(e.target.value)} />
            <Input placeholder="Ville d'arrivée" value={shipmentArrival} onChange={e => setShipmentArrival(e.target.value)} />
            <Button type="submit" loading={shipmentLoading} className="h-12"><Search className="w-4 h-4 mr-2" />Rechercher</Button>
          </form>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading && <div className="col-span-full flex justify-center items-center py-10"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>}
            {error && <div className="col-span-full text-center py-10 bg-red-50 rounded-2xl"><ServerCrash className="w-10 h-10 text-red-500 mx-auto mb-2" /><p className="text-red-600">{error}</p></div>}
            {!loading && !error && shipments.length === 0 && <div className="col-span-full text-center py-10 bg-neutral-100 rounded-2xl"><p className="text-neutral-600">Aucune annonce de colis trouvée pour cette recherche.</p></div>}
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

      {/* Recent Trips Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
              Trajets récents
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Trouvez un voyageur qui se rend à votre destination
            </p>
          </div>

          <form onSubmit={handleTripSearch} className="max-w-2xl mx-auto grid sm:grid-cols-3 gap-4 items-end mb-12 bg-neutral-50 p-6 rounded-2xl">
            <Input placeholder="Ville de départ" value={tripDeparture} onChange={e => setTripDeparture(e.target.value)} />
            <Input placeholder="Ville d'arrivée" value={tripArrival} onChange={e => setTripArrival(e.target.value)} />
            <Button type="submit" loading={tripLoading} className="h-12"><Search className="w-4 h-4 mr-2" />Rechercher</Button>
          </form>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading && <div className="col-span-full flex justify-center items-center py-10"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>}
            {error && <div className="col-span-full text-center py-10 bg-red-50 rounded-2xl"><ServerCrash className="w-10 h-10 text-red-500 mx-auto mb-2" /><p className="text-red-600">{error}</p></div>}
            {!loading && !error && trips.length === 0 && <div className="col-span-full text-center py-10 bg-neutral-100 rounded-2xl"><p className="text-neutral-600">Aucun trajet trouvé pour cette recherche.</p></div>}
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

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-accent text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à commencer ?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Rejoignez des milliers d'utilisateurs qui font confiance à Africage 
            pour leurs envois à travers l'Afrique
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/send-package">
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl text-lg font-semibold"
              >
                Envoyer un colis
              </Button>
            </Link>
            <Link to="/travel">
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-accent px-8 py-4 rounded-2xl text-lg font-semibold"
              >
                Devenir voyageur
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}