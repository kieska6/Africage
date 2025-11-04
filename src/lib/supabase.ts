import { createClient } from '@supabase/supabase-js';

// Vérification des variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://cvgphokecoacqleecflb.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2Z3Bob2tlY29hY3FsZWVjZmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNTIwMzcsImV4cCI6MjA1OTcyODAzN30.fnGwyGSuLIHiDjkWI4JuAF22CMvGXN-nFgy39ul1fEQ";

console.log('Supabase config:', { supabaseUrl, supabaseAnonKey });

// Vérification des identifiants
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
  throw new Error('Missing Supabase credentials. Please check your environment variables.');
}

console.log('Creating Supabase client...');
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('Supabase client created successfully');