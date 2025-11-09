import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface DataImportTest {
  table: string;
  status: 'success' | 'error' | 'pending';
  recordCount: number | null;
  error: string | null;
  sampleData: any[] | null;
  lastTest: Date | null;
}

export function useDataImport() {
  const [tests, setTests] = useState<Record<string, DataImportTest>>({});
  const [overallStatus, setOverallStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<string[]>([]);

  const testTable = useCallback(async (tableName: string) => {
    setTests(prev => ({
      ...prev,
      [tableName]: {
        table: tableName,
        status: 'pending',
        recordCount: null,
        error: null,
        sampleData: null,
        lastTest: null
      }
    }));

    try {
      console.log(`🔍 Test de la table: ${tableName}`);
      
      // Test de base - récupérer le count et quelques exemples
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .limit(5);

      if (error) {
        throw error;
      }

      const testResult: DataImportTest = {
        table: tableName,
        status: 'success',
        recordCount: count,
        error: null,
        sampleData: data,
        lastTest: new Date()
      };

      setTests(prev => ({
        ...prev,
        [tableName]: testResult
      }));

      console.log(`✅ Table ${tableName} testée avec succès:`, {
        count,
        sampleData: data?.length
      });

    } catch (err: any) {
      console.error(`❌ Erreur lors du test de la table ${tableName}:`, err);
      
      const testResult: DataImportTest = {
        table: tableName,
        status: 'error',
        recordCount: null,
        error: err.message || 'Erreur inconnue',
        sampleData: null,
        lastTest: new Date()
      };

      setTests(prev => ({
        ...prev,
        [tableName]: testResult
      }));
    }
  }, []);

  const testAllTables = useCallback(async () => {
    const tablesToTest = [
      'users',
      'shipments',
      'trips', 
      'transactions',
      'messages',
      'conversations',
      'reviews',
      'notifications',
      'stripe_customers',
      'stripe_subscriptions'
    ];

    setOverallStatus('testing');
    setErrors([]);

    console.log('🔍 Début des tests d\'import des données pour', tablesToTest.length, 'tables');

    // Tester toutes les tables en parallèle
    const promises = tablesToTest.map(tableName => testTable(tableName));
    
    try {
      await Promise.all(promises);
      setOverallStatus('success');
      console.log('✅ Tous les tests d\'import terminés');
    } catch (err) {
      setOverallStatus('error');
      console.error('❌ Erreur lors des tests d\'import');
    }
  }, [testTable]);

  const getTestResult = useCallback((tableName: string) => {
    return tests[tableName];
  }, [tests]);

  const getSuccessfulTables = useCallback(() => {
    return Object.values(tests)
      .filter(test => test.status === 'success')
      .map(test => test.table);
  }, [tests]);

  const getFailedTables = useCallback(() => {
    return Object.values(tests)
      .filter(test => test.status === 'error')
      .map(test => ({ table: test.table, error: test.error }));
  }, [tests]);

  const getSummary = useCallback(() => {
    const allTests = Object.values(tests);
    const successful = allTests.filter(t => t.status === 'success').length;
    const failed = allTests.filter(t => t.status === 'error').length;
    const total = allTests.length;
    
    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? (successful / total) * 100 : 0
    };
  }, [tests]);

  return {
    tests,
    overallStatus,
    errors,
    testTable,
    testAllTables,
    getTestResult,
    getSuccessfulTables,
    getFailedTables,
    getSummary,
    clearTests: () => setTests({})
  };
}