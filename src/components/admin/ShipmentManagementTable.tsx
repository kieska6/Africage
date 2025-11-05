import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Loader2, Package, AlertTriangle, Filter } from 'lucide-react';

interface Shipment {
  id: string;
  title: string;
  user_id: string;
  status: string;
  created_at: string;
}

export function ShipmentManagementTable() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showTransactions, setShowTransactions] = useState(false);

  useEffect(() => {
    fetchShipments();
  }, [filterStatus]);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('shipments')
        .select('id, title, user_id, status, created_at')
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      if (showTransactions) {
        query = query.in('status', ['IN_TRANSIT', 'COMPLETED']);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setShipments(data || []);
    } catch (err: any) {
      setError('Erreur lors du chargement des colis');
      console.error('Shipments fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShipment = async (shipmentId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer définitivement ce colis ?')) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from('shipments')
        .delete()
        .eq('id', shipmentId);

      if (deleteError) throw deleteError;

      // Mettre à jour l'état local
      setShipments(prevShipments =>
        prevShipments.filter(shipment => shipment.id !== shipmentId)
      );
    } catch (err: any) {
      setError('Erreur lors de la suppression du colis');
      console.error('Delete error:', err);
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
      case 'COMPLETED':
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
      case 'COMPLETED':
        return 'Livré';
      case 'CANCELED':
        return 'Annulé';
      default:
        return status;
    }
  };

  const uniqueStatuses = Array.from(new Set(shipments.map(s => s.status)));

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
        <Button onClick={fetchShipments} className="mt-4">
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Contrôles de filtrage */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowTransactions(!showTransactions)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                showTransactions
                  ? 'bg-accent text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showTransactions ? 'Voir tous les colis' : 'Voir les transactions'}
            </button>
          </div>

          {!showTransactions && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-neutral-600">Filtrer par statut:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Tous</option>
                {uniqueStatuses.map(status => (
                  <option key={status} value={status}>{getStatusText(status)}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Tableau des colis */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Titre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Date de création
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {shipments.map((shipment) => (
              <tr key={shipment.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 font-mono">
                  {shipment.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                  {shipment.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 font-mono">
                  {shipment.user_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                    {getStatusText(shipment.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                  {new Date(shipment.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteShipment(shipment.id)}
                    className="border-red-500 text-red-600 hover:bg-red-50"
                  >
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {shipments.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500">
            {showTransactions 
              ? 'Aucune transaction trouvée.' 
              : 'Aucun colis trouvé pour ce filtre.'
            }
          </p>
        </div>
      )}
    </div>
  );
}