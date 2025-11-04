import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// En production, les variables d'environnement sont obligatoires.
if (import.meta.env.PROD && (!supabaseUrl || !supabaseAnonKey)) {
  console.error('Variables d\'environnement Supabase manquantes en production !');
  throw new Error('Configuration Supabase incomplète pour la production. Veuillez définir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.');
}

// Utiliser les valeurs de fallback uniquement en développement
const finalSupabaseUrl = supabaseUrl || "https://cvgphokecoacqleecflb.supabase.co";
const finalSupabaseAnonKey = supabaseAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2Z3Bob2tlY29hY3FsZWVjZmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNTIwMzcsImV4cCI6MjA1OTcyODAzN30.fnGwyGSuLIHiDjkWI4JuAF22CMvGXN-nFgy39ul1fEQ";

console.log('Supabase URL:', finalSupabaseUrl);

export const supabase = createClient(finalSupabaseUrl, finalSupabaseAnonKey);

console.log('Client Supabase créé.');