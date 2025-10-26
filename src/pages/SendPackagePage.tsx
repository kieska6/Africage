import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Package, Search } from 'lucide-react';

export function SendPackagePage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Envoyer un colis
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Trouvez des voyageurs fiables pour transporter vos colis en toute sécurité.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-white rounded-4xl shadow-xl p-8 text-center">
            <Package className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">
              Publier une annonce
            </h2>
            <p className="text-neutral-600 mb-8">
              Créez une annonce détaillée pour votre colis et recevez des propositions de voyageurs.
            </p>
            <Link to="/create-shipment">
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white">
                Créer une annonce de colis
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-4xl shadow-xl p-8 text-center">
            <Search className="w-16 h-16 text-accent mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">
              Rechercher un voyage
            </h2>
            <p className="text-neutral-600 mb-8">
              Parcourez les trajets publiés par les voyageurs et trouvez celui qui correspond à votre besoin.
            </p>
            <Link to="/trips">
              <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-white">
                Trouver un voyageur
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}