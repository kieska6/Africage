import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Package, Plus, Inbox } from 'lucide-react';
import { ShipmentList } from '../components/shipments/ShipmentList';
import { IncomingOfferList } from '../components/offers/IncomingOfferList';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-800">
              Votre Tableau de Bord
            </h1>
            <p className="text-lg text-neutral-600 mt-2">
              Bienvenue, {user?.user_metadata.first_name || user?.email} !
            </p>
          </div>
          <Link to="/create-shipment" className="mt-4 sm:mt-0">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="w-5 h-5 mr-2" />
              Publier une annonce
            </Button>
          </Link>
        </div>

        {/* Section des offres reçues */}
        <div className="bg-white rounded-4xl shadow-xl p-8 mb-8">
          <div className="flex items-center mb-6">
            <Inbox className="w-6 h-6 text-accent mr-3" />
            <h2 className="text-2xl font-bold text-neutral-800">
              Mes Offres Reçues
            </h2>
          </div>
          <IncomingOfferList />
        </div>

        {/* Section des annonces de colis */}
        <div className="bg-white rounded-4xl shadow-xl p-8">
          <div className="flex items-center mb-6">
            <Package className="w-6 h-6 text-accent mr-3" />
            <h2 className="text-2xl font-bold text-neutral-800">
              Mes Annonces de Colis
            </h2>
          </div>
          <ShipmentList />
        </div>
      </div>
    </div>
  );
}