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
    const fetchSessionAndProfile = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('id, role')
          .eq('id', session.user.id)
          .single();
        
        if (userProfile) {
          setProfile(userProfile);
        } else if (profileError) {
          console.error("Error fetching profile:", profileError);
        }
      }
      setLoading(false);
    };

    fetchSessionAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('id, role')
          .eq('id', session.user.id)
          .single();
        
        if (userProfile) {
          setProfile(userProfile);
        } else {
          setProfile(null);
          if (profileError) console.error("Error fetching profile on auth change:", profileError);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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