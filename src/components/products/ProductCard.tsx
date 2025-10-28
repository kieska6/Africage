import React, { useState } from 'react';
import { Product } from '../../stripe-config';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Star, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isPopular?: boolean;
}

export function ProductCard({ product, isPopular = false }: ProductCardProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handlePurchase = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_id: product.priceId,
          mode: product.mode,
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/pricing`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
      isPopular ? 'border-primary scale-105' : 'border-neutral-200 hover:border-primary/70'
    }`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
            <Star className="w-4 h-4 mr-1 fill-current" />
            Le plus populaire
          </div>
        </div>
      )}

      <div className="p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-neutral-900 mb-2">{product.name}</h3>
          <div className="text-4xl font-bold text-primary mb-4">{product.price}</div>
          <p className="text-neutral-600 leading-relaxed">{product.description}</p>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-center text-sm text-neutral-600">
            <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
            <span>Paiement sécurisé</span>
          </div>
          <div className="flex items-center text-sm text-neutral-600">
            <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
            <span>Accès immédiat</span>
          </div>
          <div className="flex items-center text-sm text-neutral-600">
            <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
            <span>Support client 24/7</span>
          </div>
        </div>

        <Button
          onClick={handlePurchase}
          loading={loading}
          className="w-full"
          variant={isPopular ? 'primary' : 'outline'}
        >
          Acheter maintenant
        </Button>
      </div>
    </div>
  );
}