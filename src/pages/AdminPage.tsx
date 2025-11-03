import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { GiveTokensForm } from '../components/admin/GiveTokensForm';
import { ManageUserRole } from '../components/admin/ManageUserRole';
import { ManageTransactions } from '../components/admin/ManageTransactions';
import { Loader2, Lock } from 'lucide-react';

export function AdminPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  const userRole = user?.profile?.role;

  if (userRole !== 'ADMIN' && userRole !== 'MODERATOR') {
    return (
      <div className="min-h-screen bg-neutral-50 py-12 px-4 text-center">
        <Lock className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-red-700">Accès non autorisé</h1>
        <p className="text-neutral-600 mt-2">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">
          Retourner à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-800">
            {userRole === 'ADMIN' ? "Panneau d'Administration" : "Panneau de Modération"}
          </h1>
          <p className="text-lg text-neutral-600 mt-2">
            Bienvenue, {user?.profile?.first_name}.
          </p>
        </div>

        <div className="space-y-8">
          {userRole === 'ADMIN' && (
            <>
              <GiveTokensForm />
              <ManageUserRole />
              <ManageTransactions />
            </>
          )}

          {userRole === 'MODERATOR' && (
            <div className="bg-white p-8 rounded-lg shadow-md border text-center">
              <h2 className="text-xl font-semibold text-neutral-800">Outils de modération</h2>
              <p className="text-neutral-500 mt-2">
                Les fonctionnalités de modération seront bientôt disponibles ici.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}