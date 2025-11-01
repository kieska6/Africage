import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2, Shield, UserCog } from 'lucide-react';
import { GiveTokensForm } from '../components/admin/GiveTokensForm';

export function AdminPage() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  const isAuthorized = profile && (profile.role === 'ADMIN' || profile.role === 'MODERATOR');

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12 px-4 text-center">
        <h1 className="text-2xl font-bold text-red-600">Accès non autorisé</h1>
        <p className="text-neutral-600 mt-2">Vous n'avez pas les permissions nécessaires pour voir cette page.</p>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">
          Retourner à l'accueil
        </Link>
      </div>
    );
  }

  const isAdmin = profile.role === 'ADMIN';
  const title = isAdmin ? "Panneau d'Administration" : "Panneau de Modération";
  const Icon = isAdmin ? Shield : UserCog;

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Icon className="w-8 h-8 text-accent mr-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800">{title}</h1>
        </div>

        <div className="bg-white rounded-4xl shadow-xl p-8">
          {isAdmin && (
            <section>
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">Attribuer des Tokens</h2>
              <GiveTokensForm />
            </section>
          )}

          {/* Vous pouvez ajouter d'autres sections pour les modérateurs ici */}
          {!isAdmin && (
            <p className="text-neutral-600">Bienvenue sur le panneau de modération. D'autres fonctionnalités seront bientôt disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
}