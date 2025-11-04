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
    console.log('AuthProvider: Initializing session');
    
    const fetchSessionAndProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('AuthProvider: Session error', sessionError);
          setError('Erreur de session: ' + sessionError.message);
          setLoading(false);
          return;
        }
        
        const currentUser = session?.user ?? null;
        console.log('AuthProvider: Current user', currentUser);
        setUser(currentUser);

        if (currentUser) {
          console.log('AuthProvider: Fetching profile for user', currentUser.id);
          const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentUser.id)
            .single();
          
          if (profileError) {
            console.error('AuthProvider: Profile fetch error', profileError);
            setError('Erreur de profil: ' + profileError.message);
          } else {
            console.log('AuthProvider: Profile fetched', userProfile);
            setProfile(userProfile as Profile | null);
          }
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error('AuthProvider: Unexpected error', err);
        setError('Erreur inattendue: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthProvider: Auth state changed', event);
      
      try {
        setLoading(true);
        setError(null);
        
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentUser.id)
            .single();
          
          if (profileError) {
            console.error('AuthProvider: Profile update error', profileError);
            setError('Erreur de mise à jour du profil: ' + profileError.message);
          } else {
            setProfile(userProfile as Profile | null);
          }
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error('AuthProvider: Error in auth state change', err);
        setError('Erreur d\'état d\'authentification: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      authListener.subscription.unsubscribe();
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