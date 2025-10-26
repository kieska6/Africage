import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// As a temporary workaround for the environment variable issue,
// we are hardcoding the Supabase credentials here.
// This is not recommended for production applications.
const supabaseUrl = "https://cvgphokecoacqleecflb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2Z3Bob2tlY29hY3FsZWVjZmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNTIwMzcsImV4cCI6MjA1OTcyODAzN30.fnGwyGSuLIHiDjkWI4JuAF22CMvGXN-nFgy39ul1fEQ";


if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);