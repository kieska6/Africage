import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Définition du type pour le profil utilisateur
export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  profile_avatar_url?: string;
  country?: string;
  date_of_birth?: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  kyc_status: 'NOT_SUBMITTED' | 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED';
  is_profile_complete: boolean;
  average_rating: number | null;
  review_count: number;
  is_admin: boolean;
  created_at?: string;
  updated_at?: string;
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
  updateUser: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
    try {
      console.log('📊 Récupération du profil pour userId:', userId);
      
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select(`
          id, 
          email, 
          first_name, 
          last_name, 
          phone_number, 
          profile_avatar_url, 
          country, 
          date_of_birth, 
          role, 
          kyc_status, 
          is_profile_complete, 
          average_rating, 
          review_count, 
          is_admin,
          created_at,
          updated_at
        `)
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.error("❌ Erreur lors de la récupération du profil:", profileError);
        throw profileError;
      }

      console.log('✅ Profil récupéré avec succès:', userProfile);
      return userProfile as Profile;
    } catch (err) {
      console.error("❌ Erreur dans fetchUserProfile:", err);
      return null;
    }
  };

  const updateUserProfile = async () => {
    if (!user) return;
    
    const userProfile = await fetchUserProfile(user.id);
    setProfile(userProfile);
  };

  const refreshProfile = async () => {
    if (!user) return;
    await updateUserProfile();
  };

  useEffect(() => {
    setLoading(true);
    
    // 1. Vérifier la session active au chargement initial
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("❌ Erreur d'authentification:", sessionError.message);
          setError("Erreur lors de la récupération de la session.");
          setLoading(false);
          return;
        }

        console.log('🔄 Session récupérée:', session ? 'Session existante' : 'Pas de session');
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const userProfile = await fetchUserProfile(currentUser.id);
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("❌ Erreur critique lors de l'initialisation:", err);
        setError("Une erreur critique est survenue.");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // 2. Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Changement d\'état d\'auth:', event);
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const userProfile = await fetchUserProfile(currentUser.id);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Test de connexion à la base de données
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { count: _countData, error } = await supabase
          .from('users')
          .select('count', { count: 'exact' })
          .limit(1);
        
        if (error) {
          console.error('❌ Test de connexion Supabase échoué:', error);
          setError('Problème de connexion à la base de données');
        } else {
          console.log('✅ Test de connexion Supabase réussi');
          setError(null);
        }
      } catch (err) {
        console.error('❌ Erreur lors du test de connexion:', err);
        setError('Impossible de se connecter à la base de données');
      }
    };

    testConnection();
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
    signInWithGoogle: () => supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    }),
    updateUser: updateUserProfile,
    refreshProfile,
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