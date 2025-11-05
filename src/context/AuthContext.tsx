import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Définition du type pour le profil utilisateur
export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  kyc_status: 'NOT_SUBMITTED' | 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED';
}

// Définition du type pour la valeur du contexte
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (credentials: SignUpWithPasswordCredentials) => Promise<any>;
  signOut: () => Promise<any>;
  signInWithGoogle: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    // 1. Vérifier la session active au chargement initial
    supabase.auth.getSession().then(async ({ data: { session }, error: sessionError }) => {
      if (sessionError) {
        console.error("Auth Error on getSession:", sessionError.message);
        setError("Erreur lors de la récupération de la session.");
        setLoading(false);
        return;
      }

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentUser.id)
          .single();
        
        if (!profileError) {
          setProfile(userProfile as Profile | null);
        }
      }
      setLoading(false);
    }).catch(err => {
        console.error("Catastrophic error on getSession:", err);
        setError("Une erreur critique est survenue.");
        setLoading(false);
    });

    // 2. Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentUser.id)
          .single();
        
        if (!profileError) {
          setProfile(userProfile as Profile | null);
        }
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    profile,
    loading,
    error,
    signIn: (email: string, password: string) => supabase.auth.signInWithPassword({ email, password }),
    signUp: (credentials: SignUpWithPasswordCredentials) => supabase.auth.signUp(credentials),
    signOut: async () => {
      setProfile(null);
      setUser(null);
      return supabase.auth.signOut();
    },
    signInWithGoogle: () => supabase.auth.signInWithOAuth({ provider: 'google' }),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};