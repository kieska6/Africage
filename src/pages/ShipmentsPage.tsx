import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Package, Plus, MapPin, Calendar, DollarSign, Eye } from 'lucide-react';

interface Shipment {
  id: string;
  title: string;
  description?: string;
  weight: number;
  pickupCity: string;
  pickupCountry: string;
  deliveryCity: string;
  deliveryCountry: string;
  proposedPrice: number;
  currency: string;
  status: string;
  createdAt: string;
  isUrgent: boolean;
  isFragile: boolean;
}

export function ShipmentsPage() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyShipments();
  }, []);

  const fetchMyShipments = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/shipments/my-shipments', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      // const data = await response.json();
      
      // Mock data for now
      const mockShipments: Shipment[] = [
        {
          id: '1',
          title: 'iPhone 15 Pro Max',
          description: 'Nouveau iPhone en parfait état',
          weight: 0.5,
          pickupCity: 'Dakar',
          pickupCountry: 'Sénégal',
          deliveryCity: 'Abidjan',
          deliveryCountry: 'Côte d\'Ivoire',
          proposedPrice: 25000,
          currency: 'XOF',
          status: 'PENDING_MATCH',
          createdAt: '2024-01-15T10:00:00Z',
          isUrgent: true,
          isFragile: true
        },
        {
          id: '2',
          title: 'Documents importants',
          description: 'Dossier administratif urgent',
          weight: 0.2,
          pickupCity: 'Bamako',
          pickupCountry: 'Mali',
          deliveryCity: 'Ouagadougou',
          deliveryCountry: 'Burkina Faso',
          proposedPrice: 15000,
          currency: 'XOF',
          status: 'IN_TRANSIT',
          createdAt: '2024-01-10T14:30:00Z',
          isUrgent: true,
          isFragile: false
        }
      ];
      
      setShipments(mockShipments);
    } catch (err) {
      setError('Erreur lors du chargement des envois');
      console.error('Error fetching shipments:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING_MATCH':
        return 'bg-yellow-100 text-yellow-800';
      case 'MATCHED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_TRANSIT':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING_MATCH':
        return 'En attente';
      case 'MATCHED':
        return 'Correspondance trouvée';
      case 'IN_TRANSIT':
        return 'En transit';
      case 'DELIVERED':
        return 'Livré';
      case 'CANCELED':
        return 'Annulé';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes envois</h1>
            <p className="text-gray-600 mt-2">
              Gérez et suivez tous vos colis
            </p>
          </div>
          <Link to="/shipments/new">
            <Button className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau colis
            </Button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {shipments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun envoi pour le moment
            </h3>
            <p className="text-gray-600 mb-6">
              Créez votre première annonce de colis pour commencer
            </p>
            <Link to="/shipments/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Créer une annonce
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {shipment.title}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                        {getStatusText(shipment.status)}
                      </span>
                      {shipment.isUrgent && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Urgent
                        </span>
                      )}
                      {shipment.isFragile && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          Fragile
                        </span>
                      )}
                    </div>
                    {shipment.description && (
                      <p className="text-gray-600 mb-3">{shipment.description}</p>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Voir détails
                  </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span>
                      {shipment.pickupCity}, {shipment.pickupCountry} → {shipment.deliveryCity}, {shipment.deliveryCountry}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Package className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{shipment.weight} kg</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{shipment.proposedPrice.toLocaleString()} {shipment.currency}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Créé le {new Date(shipment.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                      {shipment.status === 'PENDING_MATCH' && (
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          Annuler
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}