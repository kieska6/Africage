import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useSupabaseConnection } from '../../hooks/useSupabaseConnection';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { 
  Database, 
  User, 
  Package, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Copy,
  Terminal
} from 'lucide-react';

interface DiagnosticResult {
  test: string;
  status: 'success' | 'error' | 'pending';
  data: any;
  error: string | null;
  details: string;
}

export function DatabaseDiagnostic() {
  const { testConnection, connected, loading, error: connectionError } = useSupabaseConnection();
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [runningTest, setRunningTest] = useState(false);

  const runDiagnostics = async () => {
    setRunningTest(true);
    const results: DiagnosticResult[] = [];

    try {
      // Test 1: Configuration Supabase
      console.log('🔍 Test 1: Configuration Supabase');
      results.push({
        test: 'Configuration Supabase',
        status: connected ? 'success' : 'error',
        data: {
          url: import.meta.env.VITE_SUPABASE_URL ? 'Configurée' : 'Manquante',
          key: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configurée' : 'Manquante'
        },
        error: connected ? null : 'Configuration invalide',
        details: 'Vérification des variables d\'environnement'
      });

      // Test 2: Connexion directe
      console.log('🔍 Test 2: Connexion directe');
      try {
        const { error: healthError, count } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        results.push({
          test: 'Connexion base de données',
          status: healthError ? 'error' : 'success',
          data: { healthCheck: 'OK', recordCount: count },
          error: healthError ? healthError.message : null,
          details: 'Test de connexion basique à la base de données'
        });
      } catch (err) {
        results.push({
          test: 'Connexion base de données',
          status: 'error',
          data: null,
          error: err instanceof Error ? err.message : 'Erreur inconnue',
          details: 'Impossible de se connecter à la base de données'
        });
      }

      // Test 3: Table users
      console.log('🔍 Test 3: Table users');
      try {
        const { data: usersData, error: usersError, count: usersCount } = await supabase
          .from('users')
          .select('*', { count: 'exact' })
          .limit(5);

        results.push({
          test: 'Table users',
          status: usersError ? 'error' : 'success',
          data: { 
            recordCount: usersCount,
            sampleData: usersData?.length || 0
          },
          error: usersError ? usersError.message : null,
          details: 'Récupération des utilisateurs'
        });

        // Si on a des données, afficher un échantillon
        if (usersData && usersData.length > 0) {
          console.log('Sample users data:', usersData);
        }
      } catch (err) {
        results.push({
          test: 'Table users',
          status: 'error',
          data: null,
          error: err instanceof Error ? err.message : 'Erreur inconnue',
          details: 'Impossible de lire la table users'
        });
      }

      // Test 4: Table shipments
      console.log('🔍 Test 4: Table shipments');
      try {
        const { data: shipmentsData, error: shipmentsError, count: shipmentsCount } = await supabase
          .from('shipments')
          .select('*', { count: 'exact' })
          .limit(5);

        results.push({
          test: 'Table shipments',
          status: shipmentsError ? 'error' : 'success',
          data: { 
            recordCount: shipmentsCount,
            sampleData: shipmentsData?.length || 0
          },
          error: shipmentsError ? shipmentsError.message : null,
          details: 'Récupération des annonces de colis'
        });

        // Si on a des données, afficher un échantillon
        if (shipmentsData && shipmentsData.length > 0) {
          console.log('Sample shipments data:', shipmentsData);
        }
      } catch (err) {
        results.push({
          test: 'Table shipments',
          status: 'error',
          data: null,
          error: err instanceof Error ? err.message : 'Erreur inconnue',
          details: 'Impossible de lire la table shipments'
        });
      }

      // Test 5: RLS Policies
      console.log('🔍 Test 5: RLS Policies');
      try {
        // Test avec une requête simple pour voir si les RLS bloquent
        const { error: rlsError, data: testData } = await supabase
          .from('users')
          .select('id')
          .limit(1);

        results.push({
          test: 'Row Level Security (RLS)',
          status: rlsError ? 'error' : 'success',
          data: { rlsStatus: rlsError ? 'Bloque les données' : 'Autorise les lectures' },
          error: rlsError ? rlsError.message : null,
          details: 'Vérification des politiques de sécurité RLS'
        });
      } catch (err) {
        results.push({
          test: 'Row Level Security (RLS)',
          status: 'error',
          data: null,
          error: err instanceof Error ? err.message : 'Erreur inconnue',
          details: 'Problème avec les politiques RLS'
        });
      }

    } catch (err) {
      console.error('Erreur lors des diagnostics:', err);
    }

    setDiagnostics(results);
    setRunningTest(false);
  };

  const copyQueryToClipboard = (table: string) => {
    const query = `SELECT * FROM ${table} LIMIT 10;`;
    navigator.clipboard.writeText(query);
  };

  if (!isExpanded) {
    return (
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(true)}
          className="bg-white shadow-lg border-2"
        >
          <Database className="w-4 h-4 mr-2" />
          Diagnostic DB
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 left-4 z-50 w-96 bg-white rounded-lg shadow-xl border max-h-[80vh] overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg flex items-center">
            <Terminal className="w-5 h-5 mr-2" />
            Diagnostic Base de Données
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={runDiagnostics}
              loading={runningTest}
              className="h-8"
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="h-8 w-8 p-0"
            >
              ×
            </Button>
          </div>
        </div>

        <div className="mt-3">
          <Button
            onClick={runDiagnostics}
            loading={runningTest}
            className="w-full"
            disabled={runningTest}
          >
            <Database className="w-4 h-4 mr-2" />
            Lancer le diagnostic complet
          </Button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-96">
        {!diagnostics.length && !runningTest ? (
          <div className="p-4 text-center text-neutral-500">
            <Terminal className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
            <p>Diagnostic non effectué</p>
            <p className="text-xs">Cliquez sur "Lancer le diagnostic" pour commencer</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {diagnostics.map((diagnostic, index) => (
              <div key={index} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{diagnostic.test}</span>
                  <div className="flex items-center gap-1">
                    {diagnostic.status === 'pending' && <RefreshCw className="w-3 h-3 animate-spin text-yellow-500" />}
                    {diagnostic.status === 'success' && <CheckCircle className="w-3 h-3 text-green-500" />}
                    {diagnostic.status === 'error' && <XCircle className="w-3 h-3 text-red-500" />}
                  </div>
                </div>

                <div className="text-xs text-neutral-600 mb-2">
                  {diagnostic.details}
                </div>

                {diagnostic.status === 'success' && diagnostic.data && (
                  <div className="text-xs text-green-600 bg-green-50 p-2 rounded mb-2">
                    <strong>Succès:</strong> {JSON.stringify(diagnostic.data, null, 2)}
                  </div>
                )}

                {diagnostic.status === 'error' && diagnostic.error && (
                  <div className="text-xs text-red-600 bg-red-50 p-2 rounded mb-2">
                    <AlertTriangle className="w-3 h-3 inline mr-1" />
                    <strong>Erreur:</strong> {diagnostic.error}
                  </div>
                )}

                {/* Boutons d'action selon le test */}
                {diagnostic.test === 'Table users' && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyQueryToClipboard('users')}
                      className="text-xs"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copier requête
                    </Button>
                  </div>
                )}

                {diagnostic.test === 'Table shipments' && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyQueryToClipboard('shipments')}
                      className="text-xs"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copier requête
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {runningTest && (
              <div className="p-4 text-center">
                <RefreshCw className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
                <p className="text-sm text-neutral-600">Diagnostic en cours...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}