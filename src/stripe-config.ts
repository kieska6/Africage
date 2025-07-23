export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: string;
}

export const products: Product[] = [
  {
    id: 'prod_SjVx6UIeCx970t',
    priceId: 'price_1Ro2vgAPnnzFZzlH5HIX9DpO',
    name: 'Pack Premium',
    description: 'La meilleure valeur pour nos utilisateurs les plus actifs. Maximisez vos économies avec 3 tokens gratuits et ne vous souciez plus de recharger votre compte.',
    mode: 'payment',
    price: 'C$45.00'
  },
  {
    id: 'prod_SjVoF9FTWbHX2D',
    priceId: 'price_1Ro2nKAPnnzFZzlHojWoK5HO',
    name: 'Le Pack Avantage (Le plus populaire)',
    description: 'Notre offre la plus populaire ! Parfait pour les utilisateurs réguliers. Économisez 20% en obtenant 5 tokens pour le prix de 4.',
    mode: 'payment',
    price: 'C$20.00'
  },
  {
    id: 'prod_SjVnqXIJqtlej7',
    priceId: 'price_1Ro2lVAPnnzFZzlHsIYOSg9N',
    name: 'Le Pack Découverte',
    description: 'Idéal pour votre premier envoi. Obtenez votre premier token et découvrez la simplicité du réseau P2P Africage.',
    mode: 'payment',
    price: 'C$5.00'
  }
];