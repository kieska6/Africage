import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { CheckCircle, ArrowRight } from 'lucide-react';

export function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Merci pour votre achat !
          </h1>
          
          <p className="text-neutral-600 mb-8">
            Votre solde de tokens sera mis à jour dans quelques instants. 
            Vous pouvez maintenant retourner à votre tableau de bord.
          </p>

          <Link to="/dashboard">
            <Button className="w-full flex items-center justify-center bg-primary hover:bg-primary/90 text-white">
              Retourner au tableau de bord
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}