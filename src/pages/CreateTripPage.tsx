import React from 'react';
import { CreateTripForm } from '../components/trips/CreateTripForm';

export function CreateTripPage() {
  return (
    <>
      <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
              Publier une nouvelle annonce de voyage
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Partagez les détails de votre prochain voyage pour recevoir des demandes 
              de transport de colis et rentabiliser votre trajet.
            </p>
          </div>
          
          <div className="bg-white rounded-4xl shadow-xl p-8">
            <CreateTripForm />
          </div>
        </div>
      </div>
    </>
  );
}