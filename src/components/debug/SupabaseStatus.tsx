import { useState } from 'react';
import { useSupabaseConnection } from '../../hooks/useSupabaseConnection';
import { CheckCircle, XCircle, Loader2, Database, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export function SupabaseStatus() {
  const { connected, loading, error, tablesInfo, lastTest, testConnection } = useSupabaseConnection();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(true)}
          className="bg-white shadow-lg border-2"
        >
          <Database className="w-4 h-4 mr-2" />
          DB Status
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-white rounded-lg shadow-xl border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Connexion Supabase</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={testConnection}
            loading={loading}
            className="h-8 w-8 p-0"
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

      <div className="space-y-3">
        {/* Status principal */}
        <div className="flex items-center gap-2">
          {loading ? (
            <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />
          ) : connected ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          <span className={`font-medium ${connected ? 'text-green-700' : 'text-red-700'}`}>
            {loading ? 'Test en cours...' : connected ? 'Connecté' : 'Déconnecté'}
          </span>
        </div>

        {/* Erreur si présente */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {/* Horodatage du dernier test */}
        {lastTest && (
          <div className="text-xs text-neutral-500">
            Dernier test: {lastTest.toLocaleTimeString()}
          </div>
        )}

        {/* Informations des tables */}
        {connected && tablesInfo.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-neutral-700">Tables:</h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {tablesInfo.map((table) => (
                <div key={table.tableName} className="flex items-center justify-between text-xs">
                  <span className="font-mono">{table.tableName}</span>
                  <div className="flex items-center gap-1">
                    {table.exists ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-neutral-600">
                          {table.recordCount !== null ? table.recordCount : '?'} records
                        </span>
                      </>
                    ) : (
                      <XCircle className="w-3 h-3 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}