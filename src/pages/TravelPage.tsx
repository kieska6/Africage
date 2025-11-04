import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Briefcase, Search } from 'lucide-react';

export function TravelPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Voyager et Gagner
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Rentabilisez vos voyages en transportant des colis pour d'autres membres de la communauté.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-white rounded-4xl shadow-xl p-8 text-center">
            <Briefcase className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">
              Publier un voyage
            </h2>
            <p className="text-neutral-600 mb-8">
              Annoncez votre prochain trajet et recevez des demandes de transport de colis.
            </p>
            <Link to="/create-trip">
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white">
                Proposer un voyage
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-4xl shadow-xl p-8 text-center">
            <Search className="w-16 h-16 text-accent mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">
              Rechercher un colis
            </h2>
            <p className="text-neutral-600 mb-8">
              Trouvez des colis à transporter sur votre itinéraire et gagnez de l'argent.
            </p>
            <Link to="/shipments-list">
              <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-white">
                Trouver un colis à transporter
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}