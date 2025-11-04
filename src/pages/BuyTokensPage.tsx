import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/ui/Alert';
import { Loader2, Coins, Star } from 'lucide-react';
import { useTokenBalance } from '../hooks/useTokenBalance';

// Liens de paiement Stripe mis à jour
const STRIPE_LINK_DISCOVERY = 'https://buy.stripe.com/bJe00i0u1ck1dqf0Pcbsc04'; // Pack Découverte
const STRIPE_LINK_ADVANTAGE = 'https://buy.stripe.com/6oU5kCfoVgAh5XNeG2bsc05'; // Pack Avantage
const STRIPE_LINK_PREMIUM = 'https://buy.stripe.com/4gM4gya4BbfX2LBbtQbsc03'; // Pack Premium

const tokenPacks = [
  {
    name: 'Le Pack Découverte',
    tokens: 1,
    price: 'C$5.00',
    description: 'Idéal pour votre premier envoi.',
    stripeLink: STRIPE_LINK_DISCOVERY,
    isPopular: false,
  },
  {
    name: 'Le Pack Avantage',
    tokens: 5,
    price: 'C$20.00',
    description: 'Notre offre la plus populaire ! Économisez 20%.',
    stripeLink: STRIPE_LINK_ADVANTAGE,
    isPopular: true,
  },
  {
    name: 'Le Pack Premium',
    tokens: 12,
    price: 'C$45.00',
    description: 'La meilleure valeur pour nos utilisateurs actifs.',
    stripeLink: STRIPE_LINK_PREMIUM,
    isPopular: false,
  },
];

export function BuyTokensPage() {
  const { user } = useAuth();
  const { balance: tokenBalance, loading, error } = useTokenBalance();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Acheter des Tokens
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Rechargez votre compte pour envoyer des colis rapidement et en toute sécurité.
          </p>
        </div>

        {error && <Alert type="error" message={error} className="max-w-3xl mx-auto mb-8" />}

        {tokenBalance !== null && (
          <div className="flex justify-center items-center gap-3 mb-12 text-2xl font-bold text-neutral-800 bg-white p-4 rounded-2xl shadow-md max-w-sm mx-auto">
            <Coins className="w-8 h-8 text-primary" />
            <span>Votre solde :</span>
            <span className="text-primary">{tokenBalance} Tokens</span>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tokenPacks.map((pack) => (
            <a
              key={pack.name}
              href={user ? `${pack.stripeLink}?client_reference_id=${user.id}` : '/login'}
              className={`relative block bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                pack.isPopular ? 'border-primary scale-105' : 'border-neutral-200 hover:border-primary/70'
              }`}
            >
              {pack.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    Le plus populaire
                  </div>
                </div>
              )}
              <div className="p-8 text-center flex flex-col h-full">
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">{pack.name}</h3>
                <p className="text-4xl font-bold text-primary mb-2">{pack.tokens} <span className="text-2xl">Tokens</span></p>
                <p className="text-lg text-neutral-600 mb-4">{pack.price}</p>
                <p className="text-neutral-600 leading-relaxed mb-6 flex-grow">{pack.description}</p>
                <div className="mt-auto w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors">
                  Acheter maintenant
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}