import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Loader2, Database, User, Package, MessageCircle } from 'lucide-react';

interface DashboardData {
  userProfile: any;
  myShipments: any[];
  myTrips: any[];
  recentTransactions: any[];
  notifications: any[];
  messages: any[];
}

export function DashboardDataTest() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const testDashboardData = async () => {
    setLoading(true);
    setErrors({});
    
    const results: Partial<DashboardData> = {};
    const newErrors: Record<string, string> = {};

    try {
      // 1. Test de la table users
      console.log('🔍 Test des données utilisateur...');
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .limit(5);

      if (userError) {
        newErrors.users = userError.message;
      } else {
        results.userProfile = userData;
        console.log('✅ Users:', userData?.length, 'records');
      }

      // 2. Test de la table shipments
      console.log('🔍 Test des colis...');
      const { data: shipmentsData, error: shipmentsError } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (shipmentsError) {
        newErrors.shipments = shipmentsError.message;
      } else {
        results.myShipments = shipmentsData;
        console.log('✅ Shipments:', shipmentsData?.length, 'records');
      }

      // 3. Test de la table trips
      console.log('🔍 Test des trajets...');
      const { data: tripsData, error: tripsError } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (tripsError) {
        newErrors.trips = tripsError.message;
      } else {
        results.myTrips = tripsData;
        console.log('✅ Trips:', tripsData?.length, 'records');
      }

      // 4. Test de la table transactions
      console.log('🔍 Test des transactions...');
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (transactionsError) {
        newErrors.transactions = transactionsError.message;
      } else {
        results.recentTransactions = transactionsData;
        console.log('✅ Transactions:', transactionsData?.length, 'records');
      }

      // 5. Test de la table notifications
      console.log('🔍 Test des notifications...');
      const { data: notificationsData, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (notificationsError) {
        newErrors.notifications = notificationsError.message;
      } else {
        results.notifications = notificationsData;
        console.log('✅ Notifications:', notificationsData?.length, 'records');
      }

      // 6. Test de la table messages
      console.log('🔍 Test des messages...');
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (messagesError) {
        newErrors.messages = messagesError.message;
      } else {
        results.messages = messagesData;
        console.log('✅ Messages:', messagesData?.length, 'records');
      }

      setData(results as DashboardData);
      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        console.log('🎉 Tous les tests du dashboard ont réussi!');
      } else {
        console.log('⚠️ Algunos tests ont échoué:', newErrors);
      }

    } catch (err) {
      console.error('❌ Erreur lors des tests dashboard:', err);
      setErrors({ general: 'Erreur générale lors des tests' });
    } finally {
      setLoading(false);
    }
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-20 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(true)}
          className="bg-white shadow-lg border-2"
        >
          <Database className="w-4 h-4 mr-2" />
          Test Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 w-80 bg-white rounded-lg shadow-xl border max-h-[60vh] overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Test Dashboard Data</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="h-8 w-8 p-0"
          >
            ×
          </Button>
        </div>
        
        <Button
          onClick={testDashboardData}
          loading={loading}
          className="w-full mt-3"
          disabled={loading}
        >
          <Database className="w-4 h-4 mr-2" />
          Tester les données
        </Button>
      </div>

      <div className="overflow-y-auto max-h-96">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2">Test en cours...</span>
          </div>
        )}

        {data && (
          <div className="p-4 space-y-4">
            {/* Résumé */}
            <div className="bg-neutral-50 p-3 rounded-lg">
              <h4 className="font-medium mb-2">Résumé des données:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  <span>Users: {data.userProfile?.length || 0}</span>
                </div>
                <div className="flex items-center">
                  <Package className="w-4 h-4 mr-1" />
                  <span>Shipments: {data.myShipments?.length || 0}</span>
                </div>
                <div className="flex items-center">
                  <Package className="w-4 h-4 mr-1" />
                  <span>Trips: {data.myTrips?.length || 0}</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  <span>Messages: {data.messages?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Erreurs s'il y en a */}
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 p-3 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Erreurs:</h4>
                {Object.entries(errors).map(([table, error]) => (
                  <div key={table} className="text-sm text-red-600 mb-1">
                    <strong>{table}:</strong> {error}
                  </div>
                ))}
              </div>
            )}

            {/* Données d'exemple */}
            {data.userProfile && data.userProfile.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Sample User Data:</h4>
                <div className="bg-neutral-50 p-2 rounded text-xs font-mono max-h-20 overflow-y-auto">
                  {JSON.stringify(data.userProfile[0], null, 2)}
                </div>
              </div>
            )}
          </div>
        )}

        {!data && !loading && (
          <div className="text-center py-8 text-neutral-500">
            <Database className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
            <p>Aucun test effectué</p>
          </div>
        )}
      </div>
    </div>
  );
}