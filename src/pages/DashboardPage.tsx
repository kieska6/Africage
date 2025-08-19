import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { MyShipmentsList } from '../components/dashboard/MyShipmentsList';
import { MyTripsList } from '../components/dashboard/MyTripsList';
import { Package, Plane } from 'lucide-react';

export function DashboardPage() {
  const { user } = useAuth();

  const canSend = user?.role === 'SENDER' || user?.role === 'BOTH';
  const canTravel = user?.role === 'TRAVELER' || user?.role === 'BOTH';

  // Default to 'shipments' if user can send, otherwise 'trips'
  const defaultTab = canSend ? 'shipments' : 'trips';
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Tableau de bord
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenue, {user?.firstName}. Gérez vos activités ici.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {canSend && (
                         <button
                            onClick={() => setActiveTab('shipments')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'shipments'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                         >
                            <Package className="inline-block w-5 h-5 mr-2" />
                            Mes Colis
                         </button>
                    )}
                    {canTravel && (
                        <button
                            onClick={() => setActiveTab('trips')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'trips'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <Plane className="inline-block w-5 h-5 mr-2" />
                            Mes Trajets
                        </button>
                    )}
                </nav>
            </div>

            {/* Content */}
            <div className="p-6">
                {activeTab === 'shipments' && <MyShipmentsList />}
                {activeTab === 'trips' && <MyTripsList />}
            </div>
        </div>
      </div>
    </div>
  );
}