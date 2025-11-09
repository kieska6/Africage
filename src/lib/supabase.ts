import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validation des variables d'environnement
if (import.meta.env.PROD && (!supabaseUrl || !supabaseAnonKey)) {
  console.error('Variables d\'environnement Supabase manquantes en production !');
  throw new Error('Configuration Supabase incomplète pour la production. Veuillez définir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.');
}

// Valeurs de fallback pour le développement
const finalSupabaseUrl = supabaseUrl || "https://cvgphokecoacqleecflb.supabase.co";
const finalSupabaseAnonKey = supabaseAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2Z3Bob2tlY29hY3FsZWVjZmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNTIwMzcsImV4cCI6MjA1OTcyODAzN30.fnGwyGSuLIHiDjkWI4JuAF22CMvGXN-nFgy39ul1fEQ";

console.log('🔗 Connexion Supabase初始化...');
console.log('URL Supabase:', finalSupabaseUrl);
console.log('Clé présente:', !!finalSupabaseAnonKey);

export const supabase = createClient(finalSupabaseUrl, finalSupabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'africage-v1'
    }
  }
});

// Test de connexion
supabase.from('users').select('count').limit(1).then(({ error }) => {
  if (error) {
    console.error('❌ Erreur de connexion Supabase:', error.message);
  } else {
    console.log('✅ Connexion Supabase réussie');
  }
});

export default supabase;