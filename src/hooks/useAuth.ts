import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../lib/api';

// Define the user type based on our API's response
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SENDER' | 'TRAVELER' | 'BOTH';
  status: 'PENDING_VERIFICATION' | 'VERIFIED' | 'SUSPENDED' | 'INACTIVE';
  profilePicture?: string;
  createdAt: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const userData = await apiFetch('/auth/me');
        setUser(userData);
      } catch (e) {
        // Token is invalid or expired
        localStorage.removeItem('authToken');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('authToken', response.token);
      setUser(response.user);
      return { success: true };
    } catch (e: any) {
      setError(e.message);
      return { success: false, error: e.message };
    }
  };

  const signUp = async (formData: Omit<User, 'id' | 'status' | 'createdAt'> & { password?: string }) => {
    setError(null);
    try {
      const response = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      localStorage.setItem('authToken', response.token);
      setUser(response.user);
      return { success: true };
    } catch (e: any) {
      setError(e.message);
      return { success: false, error: e.message };
    }
  };

  const signOut = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
  };
}