// Types pour les réponses Supabase
export type SupabaseResponse<T> = {
  data: T | null;
  error: any;
  status: number;
  statusText: string;
};

// Types pour les listes paginées
export type PaginatedResponse<T> = {
  data: T[];
  count: number | null;
  error: any;
};

// Utilitaires de validation
export const validateSupabaseResponse = <T>(
  response: SupabaseResponse<T>
): { data: T; error: null } | { data: null; error: string } => {
  if (response.error) {
    console.error('Erreur Supabase:', response.error);
    return { data: null, error: response.error.message || 'Erreur inconnue' };
  }
  if (!response.data) {
    return { data: null, error: 'Aucune donnée retournée' };
  }
  return { data: response.data, error: null };
};

export const validatePaginatedResponse = <T>(
  response: PaginatedResponse<T>
): { data: T[]; count: number; error: null } | { data: []; count: 0; error: string } => {
  if (response.error) {
    console.error('Erreur Supabase paginée:', response.error);
    return { data: [], count: 0, error: response.error.message || 'Erreur inconnue' };
  }
  return { data: response.data || [], count: response.count || 0, error: null };
};

// Types pour les opérations communes
export type InsertOperation<T> = {
  insert: T[];
  select?: string;
};

export type UpdateOperation<T> = {
  update: Partial<T>;
  eq: [string, string | number];
  select?: string;
};

export type DeleteOperation = {
  eq: [string, string | number];
};

// Utilitaires pour gérer les erreurs de type
export const assertUser = (user: any): asserts user is { id: string; email: string } => {
  if (!user || !user.id || !user.email) {
    throw new Error('Utilisateur non authentifié ou données invalides');
  }
};

export const assertProfile = (profile: any): asserts profile is any => {
  if (!profile || !profile.id) {
    throw new Error('Profil utilisateur invalide');
  }
};

// Fonction pour formater les erreurs Supabase
export const formatSupabaseError = (error: any): string => {
  if (typeof error === 'string') return error;
  
  if (error?.message) return error.message;
  
  if (error?.details) return error.details;
  
  return 'Erreur inconnue';
};

// Constantes pour les tables Supabase
export const SUPABASE_TABLES = {
  USERS: 'users',
  SHIPMENTS: 'shipments',
  TRIPS: 'trips',
  TRANSACTIONS: 'transactions',
  MESSAGES: 'messages',
  CONVERSATIONS: 'conversations',
  REVIEWS: 'reviews',
  NOTIFICATIONS: 'notifications',
  STRIPE_CUSTOMERS: 'stripe_customers',
  STRIPE_SUBSCRIPTIONS: 'stripe_subscriptions'
} as const;

// Fonction pour vérifier la connectivité
export const checkSupabaseConnection = async () => {
  try {
    const start = Date.now();
    const response = await fetch('/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const duration = Date.now() - start;
    
    if (response.ok) {
      return { connected: true, latency: duration };
    } else {
      return { connected: false, latency: null, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    return { connected: false, latency: null, error: error instanceof Error ? error.message : 'Erreur inconnue' };
  }
};