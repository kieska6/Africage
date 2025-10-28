import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Package, Plus, MapPin, Calendar, DollarSign, Eye } from 'lucide-react';

interface Shipment {
  id: string;
  title: string;
  description?: string;
  weight: number;
  pickup_city: string;
  pickup_country: string;
  delivery_city: string;
  delivery_country: string;
  proposed_price: number | null;
  currency: string;
  status: string;
  created_at: string;
  is_urgent: boolean;
  is_fragile: boolean;
}

export function ShipmentsPage() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchMyShipments();
    }
  }, [user]);

  const fetchMyShipments = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError('');
      
      const { data, error: fetchError } = await supabase
        .from('shipments')
        .select('*')
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }
      
      setShipments(data || []);
    } catch (err: any) {
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
        return 'bg-neutral-100 text-neutral-800';
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
      <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Mes envois</h1>
            <p className="text-neutral-600 mt-2">
              Gérez et suivez tous vos colis
            </p>
          </div>
          <Link to="/create-shipment">
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
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
            <Package className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Aucun envoi pour le moment
            </h3>
            <p className="text-neutral-600 mb-6">
              Créez votre première annonce de colis pour commencer
            </p>
            <Link to="/create-shipment">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Créer une annonce
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {shipment.title}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                        {getStatusText(shipment.status)}
                      </span>
                      {shipment.is_urgent && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Urgent
                        </span>
                      )}
                      {shipment.is_fragile && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          Fragile
                        </span>
                      )}
                    </div>
                    {shipment.description && (
                      <p className="text-neutral-600 mb-3">{shipment.description}</p>
                    )}
                  </div>
                  <Link to={`/shipments/${shipment.id}`}>
                    <Button variant="outline" size="sm" as="div">
                      <Eye className="w-4 h-4 mr-2" />
                      Voir détails
                    </Button>
                  </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center text-neutral-600">
                    <MapPin className="w-4 h-4 mr-2 text-neutral-400" />
                    <span>
                      {shipment.pickup_city}, {shipment.pickup_country} → {shipment.delivery_city}, {shipment.delivery_country}
                    </span>
                  </div>
                  <div className="flex items-center text-neutral-600">
                    <Package className="w-4 h-4 mr-2 text-neutral-400" />
                    <span>{shipment.weight} kg</span>
                  </div>
                  <div className="flex items-center text-neutral-600">
                    <DollarSign className="w-4 h-4 mr-2 text-neutral-400" />
                    <span>{shipment.proposed_price != null ? shipment.proposed_price.toLocaleString() : 'N/A'} {shipment.currency}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <div className="flex items-center justify-between text-sm text-neutral-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Créé le {new Date(shipment.created_at).toLocaleDateString('fr-FR')}
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