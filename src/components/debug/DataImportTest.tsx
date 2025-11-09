import { useState } from 'react';
import { useDataImport } from '../../hooks/useDataImport';
import { Button } from '../ui/Button';
import { CheckCircle, XCircle, Loader2, Database, FileText, AlertTriangle } from 'lucide-react';

export function DataImportTest() {
  const {
    tests,
    overallStatus,
    testAllTables,
    getSummary,
    clearTests
  } = useDataImport();
  
  const [isExpanded, setIsExpanded] = useState(false);

  const summary = getSummary();

  if (!isExpanded) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(true)}
          className="bg-white shadow-lg border-2"
        >
          <Database className="w-4 h-4 mr-2" />
          Test Data
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-96 bg-white rounded-lg shadow-xl border max-h-[80vh] overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Test d'Import des Données</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearTests}
              disabled={overallStatus === 'testing'}
            >
              Clear
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

        {/* Summary */}
        <div className="mt-3 p-3 bg-neutral-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span>Résumé:</span>
            <span className="font-medium">
              {summary.successful}/{summary.total} tables OK
              {summary.total > 0 && ` (${Math.round(summary.successRate)}%)`}
            </span>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-3">
          <Button
            onClick={testAllTables}
            loading={overallStatus === 'testing'}
            className="w-full"
            disabled={overallStatus === 'testing'}
          >
            <Database className="w-4 h-4 mr-2" />
            Tester toutes les tables
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="overflow-y-auto max-h-96">
        {Object.keys(tests).length === 0 ? (
          <div className="p-4 text-center text-neutral-500">
            <FileText className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
            <p>Aucun test effectué</p>
            <p className="text-xs">Cliquez sur "Tester toutes les tables" pour commencer</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {Object.values(tests).map((test) => (
              <div key={test.table} className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm font-mono">{test.table}</span>
                  <div className="flex items-center gap-1">
                    {test.status === 'pending' && <Loader2 className="w-3 h-3 animate-spin text-yellow-500" />}
                    {test.status === 'success' && <CheckCircle className="w-3 h-3 text-green-500" />}
                    {test.status === 'error' && <XCircle className="w-3 h-3 text-red-500" />}
                  </div>
                </div>

                {test.status === 'success' && (
                  <div className="text-xs text-neutral-600">
                    <div>Records: {test.recordCount ?? 'N/A'}</div>
                    {test.sampleData && test.sampleData.length > 0 && (
                      <div className="mt-1">
                        <span className="text-neutral-500">Sample data: {test.sampleData.length} items</span>
                      </div>
                    )}
                  </div>
                )}

                {test.status === 'error' && (
                  <div className="text-xs text-red-600 bg-red-50 p-2 rounded mt-1">
                    <AlertTriangle className="w-3 h-3 inline mr-1" />
                    {test.error}
                  </div>
                )}

                {test.lastTest && (
                  <div className="text-xs text-neutral-400 mt-1">
                    {test.lastTest.toLocaleTimeString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}