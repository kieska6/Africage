import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useSubscription } from '../hooks/useSubscription';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

export function SuccessPage() {
  const { refetch } = useSubscription();

  useEffect(() => {
    // Refetch subscription data after successful payment
    const timer = setTimeout(() => {
      refetch();
    }, 2000);

    return () => clearTimeout(timer);
  }, [refetch]);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Paiement réussi !
          </h1>
          
          <p className="text-neutral-600 mb-8">
            Votre achat a été traité avec succès. Vous pouvez maintenant profiter 
            de tous les avantages de votre pack.
          </p>

          <div className="space-y-4">
            <Link to="/dashboard">
              <Button className="w-full flex items-center justify-center bg-primary hover:bg-primary/90 text-white">
                <Package className="w-4 h-4 mr-2" />
                Aller au tableau de bord
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            
            <Link to="/pricing">
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                Voir les autres packs
              </Button>
            </Link>
          </div>

          <div className="mt-8 p-4 bg-primary/10 rounded-lg">
            <p className="text-sm text-primary">
              <strong>Prochaines étapes :</strong> Consultez votre tableau de bord 
              pour commencer à utiliser vos tokens et créer votre première annonce d'envoi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}