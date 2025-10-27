import React from 'react';
import { ProductCard } from '../components/products/ProductCard';
import { products } from '../stripe-config';

export function PricingPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Choisissez votre pack
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Des solutions adaptées à tous vos besoins d'envoi. 
            Commencez avec notre pack découverte ou optez pour nos offres premium.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              isPopular={index === 1} // Le Pack Avantage est le plus populaire
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">
              Garantie de satisfaction
            </h3>
            <p className="text-neutral-600 mb-6">
              Nous sommes convaincus de la qualité de notre service. 
              Si vous n'êtes pas satisfait, nous vous remboursons intégralement.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-neutral-500">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Paiement sécurisé
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Support 24/7
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Remboursement garanti
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}