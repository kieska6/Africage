import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ShipmentCard } from '../components/shipments/ShipmentCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Loader2, ServerCrash } from 'lucide-react';

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

export function SearchPage() {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [results, setResults] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!origin.trim() && !destination.trim()) {
      setError('Veuillez saisir au moins une ville de départ ou d\'arrivée.');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const { data, error: rpcError } = await supabase.rpc('search_shipments', {
        origin_query: origin.trim() || null,
        destination_query: destination.trim() || null
      });

      if (rpcError) {
        throw rpcError;
      }

      setResults(data || []);
    } catch (err: any) {
      setError('Erreur lors de la recherche des colis.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-4">
            Rechercher un colis
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Trouvez des colis correspondant à votre itinéraire en saisissant les villes de départ et d'arrivée.
          </p>
        </div>

        <div className="bg-white rounded-4xl shadow-lg p-8 mb-12 max-w-4xl mx-auto">
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="grid sm:grid-cols-3 gap-4 items-end">
            <Input
              label="Ville de départ"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ex: Dakar"
            />
            <Input
              label="Ville d'arrivée"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ex: Abidjan"
            />
            <Button 
              type="submit" 
              onClick={handleSearch}
              loading={loading}
              className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-white"
            >
              <Search className="w-5 h-5 mr-2" />
              Rechercher
            </Button>
          </form>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-20 bg-red-50 rounded-2xl">
            <ServerCrash className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-700">Oops! Une erreur est survenue.</h3>
            <p className="text-red-600 mt-2">{error}</p>
          </div>
        )}

        {!loading && hasSearched && results.length === 0 && !error && (
          <div className="text-center py-20 bg-neutral-100 rounded-2xl">
            <div className="mb-4 text-6xl">📦</div>
            <h3 className="text-xl font-semibold text-neutral-700">Aucun colis trouvé</h3>
            <p className="text-neutral-500 mt-2">
              Aucun colis ne correspond à votre recherche. Essayez d'élargir vos critères.
            </p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {results.map((shipment) => (
              <ShipmentCard key={shipment.id} shipment={shipment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}