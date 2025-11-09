import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface SupabaseStatus {
  connected: boolean;
  loading: boolean;
  error: string | null;
  tablesInfo: {
    tableName: string;
    recordCount: number | null;
    exists: boolean;
  }[];
  lastTest: Date | null;
}

export function useSupabaseConnection() {
  const [status, setStatus] = useState<SupabaseStatus>({
    connected: false,
    loading: true,
    error: null,
    tablesInfo: [],
    lastTest: null
  });

  const testConnection = async () => {
    setStatus(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🔍 Test de connexion Supabase en cours...');
      
      // Test de connexion basic
      const { count: _countData, error: healthError } = await supabase
        .from('users')
        .select('count', { count: 'exact' })
        .limit(1);

      if (healthError) {
        throw healthError;
      }

      // Test des tables principales
      const tablesToTest = [
        'users',
        'shipments', 
        'trips',
        'transactions',
        'messages',
        'conversations',
        'reviews',
        'notifications'
      ];

      const tablesInfo = await Promise.all(
        tablesToTest.map(async (tableName) => {
          try {
            const { count, error } = await supabase
              .from(tableName)
              .select('*', { count: 'exact', head: true });

            return {
              tableName,
              recordCount: count,
              exists: !error
            };
          } catch {
            return {
              tableName,
              recordCount: null,
              exists: false
            };
          }
        })
      );

      setStatus({
        connected: true,
        loading: false,
        error: null,
        tablesInfo,
        lastTest: new Date()
      });

      console.log('✅ Connexion Supabase réussie');
      console.log('📊 Informations des tables:', tablesInfo);

    } catch (err: any) {
      console.error('❌ Erreur de connexion Supabase:', err);
      setStatus({
        connected: false,
        loading: false,
        error: err.message || 'Erreur de connexion inconnue',
        tablesInfo: [],
        lastTest: new Date()
      });
    }
  };

  const testSpecificTable = async (tableName: string) => {
    try {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .limit(1);

      if (error) {
        return { success: false, error: error.message, count: 0 };
      }

      return { success: true, data, count };
    } catch (err: any) {
      return { success: false, error: err.message, count: 0 };
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return {
    ...status,
    testConnection,
    testSpecificTable,
    refetch: testConnection
  };
}