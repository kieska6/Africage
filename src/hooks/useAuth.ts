import { useState, useEffect } from 'react';
import { User, SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  role: 'ADMIN' | 'MODERATOR' | 'USER';
  // Ajoutez d'autres champs de profil si nécessaire
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // La méthode onAuthStateChange est la source de vérité unique.
    // Elle se déclenche immédiatement avec la session en cours (ou null)
    // et écoute les changements futurs (connexion, déconnexion).
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('id, role')
          .eq('id', currentUser.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching profile on auth change:", profileError);
          setProfile(null);
        } else {
          setProfile(userProfile);
        }
      } else {
        setProfile(null);
      }
      
      // L'état d'authentification est maintenant connu, on peut arrêter le chargement.
      setLoading(false);
    });

    // Nettoyage de l'écouteur lors du démontage du composant
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (credentials: SignUpWithPasswordCredentials) => {
    const { data, error } = await supabase.auth.signUp(credentials);
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    return { data, error };
  };

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };
}