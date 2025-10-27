import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { Button } from '../components/ui/Button';
import { Package, CreditCard, User, TrendingUp, Briefcase } from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuth();
  const { activeProduct, loading } = useSubscription();

  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">
            Bienvenue, {user?.email}
          </h1>
          <p className="text-neutral-600 mt-2">
            Gérez vos envois et suivez vos transactions depuis votre tableau de bord
          </p>
        </div>

        {/* Subscription Status */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 mb-2">
                Statut de votre abonnement
              </h2>
              {loading ? (
                <p className="text-neutral-600">Chargement...</p>
              ) : activeProduct ? (
                <div className="flex items-center space-x-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Actif
                  </span>
                  <span className="text-neutral-900 font-medium">{activeProduct.name}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-100 text-neutral-800">
                    Aucun pack actif
                  </span>
                </div>
              )}
            </div>
            {!activeProduct && (
              <Link to="/pricing">
                <Button>Choisir un pack</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-accent/10">
                <Package className="w-6 h-6 text-accent" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Colis envoyés</p>
                <p className="text-2xl font-bold text-neutral-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Livraisons réussies</p>
                <p className="text-2xl font-bold text-neutral-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Tokens restants</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {activeProduct ? '5' : '0'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-100">
                <User className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600">Note moyenne</p>
                <p className="text-2xl font-bold text-neutral-900">-</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Actions rapides</h2>
          
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <Link to="/send-package">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white py-4 text-lg font-semibold rounded-2xl">
                <Package className="w-6 h-6 mr-3" />
                Envoyer un colis
              </Button>
            </Link>
            <Link to="/travel">
              <Button className="w-full bg-accent hover:bg-accent/90 text-white py-4 text-lg font-semibold rounded-2xl">
                <Briefcase className="w-6 h-6 mr-3" />
                Voyager
              </Button>
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/shipments">
              <Button variant="outline" className="justify-start p-4 h-auto w-full">
                <Package className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Mes envois</div>
                  <div className="text-sm text-neutral-500">Suivre vos colis</div>
                </div>
              </Button>
            </Link>

            <Link to="/trips">
              <Button variant="outline" className="justify-start p-4 h-auto w-full">
                <Briefcase className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Mes voyages</div>
                  <div className="text-sm text-neutral-500">Gérer vos trajets</div>
                </div>
              </Button>
            </Link>

            <Link to="/pricing">
              <Button variant="outline" className="justify-start p-4 h-auto w-full">
                <CreditCard className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Acheter des tokens</div>
                  <div className="text-sm text-neutral-500">Recharger votre compte</div>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}