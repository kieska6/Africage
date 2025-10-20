import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Package, Users, Shield, MapPin, Calendar, DollarSign } from 'lucide-react';

export function HomePage() {
  const [trackingCode, setTrackingCode] = useState('');

  const handleTrackPackage = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement package tracking
    console.log('Tracking package:', trackingCode);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-accent text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Envoyez n'importe quoi,
            <br />
            <span className="text-primary">n'importe où en Afrique</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto">
            Connectez-vous avec des voyageurs de confiance pour envoyer vos colis 
            rapidement, en toute sécurité et à prix abordable.
          </p>

          {/* Tracking Form */}
          <div className="bg-white rounded-4xl p-8 max-w-2xl mx-auto shadow-2xl">
            <h3 className="text-2xl font-bold text-neutral-800 mb-6">
              Suivre votre colis
            </h3>
            <form onSubmit={handleTrackPackage} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Entrez votre code de suivi"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  className="w-full text-lg py-4 px-6 rounded-2xl border-2 border-neutral-200 focus:border-primary"
                />
              </div>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl text-lg font-semibold"
              >
                <Search className="w-5 h-5 mr-2" />
                Suivre le colis
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Trois étapes simples pour envoyer ou transporter des colis en toute sécurité
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center p-8 rounded-4xl bg-neutral-50 hover:bg-neutral-100 transition-colors">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-4">
                1. Créez votre annonce
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Décrivez votre colis, indiquez les adresses de départ et d'arrivée, 
                puis proposez une récompense équitable.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center p-8 rounded-4xl bg-neutral-50 hover:bg-neutral-100 transition-colors">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-4">
                2. Trouvez un voyageur
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Des voyageurs vérifiés consultent votre annonce et vous proposent 
                leurs services selon leur itinéraire.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center p-8 rounded-4xl bg-neutral-50 hover:bg-neutral-100 transition-colors">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-4">
                3. Livraison sécurisée
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Suivez votre colis en temps réel et recevez une confirmation 
                de livraison avec code de sécurité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Announcements Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
              Annonces récentes
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Découvrez les dernières demandes d'envoi de colis dans toute l'Afrique
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Announcement Card 1 */}
            <div className="bg-white rounded-4xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  Urgent
                </span>
                <span className="text-neutral-500 text-sm">Il y a 2h</span>
              </div>
              
              <h3 className="text-xl font-bold text-neutral-800 mb-2">
                iPhone 15 Pro Max
              </h3>
              
              <div className="flex items-center text-neutral-600 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">Dakar → Abidjan</span>
              </div>
              
              <div className="flex items-center text-neutral-600 mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">Avant le 25 Jan</span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-green-600 font-bold">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span>25 000 XOF</span>
                </div>
                <span className="text-neutral-500 text-sm">0.5 kg</span>
              </div>
              
              <Button className="w-full bg-accent hover:bg-accent/90 text-white rounded-2xl">
                Voir les détails
              </Button>
            </div>

            {/* Announcement Card 2 */}
            <div className="bg-white rounded-4xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                  Standard
                </span>
                <span className="text-neutral-500 text-sm">Il y a 5h</span>
              </div>
              
              <h3 className="text-xl font-bold text-neutral-800 mb-2">
                Documents officiels
              </h3>
              
              <div className="flex items-center text-neutral-600 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">Bamako → Ouagadougou</span>
              </div>
              
              <div className="flex items-center text-neutral-600 mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">Avant le 30 Jan</span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-green-600 font-bold">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span>15 000 XOF</span>
                </div>
                <span className="text-neutral-500 text-sm">0.2 kg</span>
              </div>
              
              <Button className="w-full bg-accent hover:bg-accent/90 text-white rounded-2xl">
                Voir les détails
              </Button>
            </div>

            {/* Announcement Card 3 */}
            <div className="bg-white rounded-4xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                  Fragile
                </span>
                <span className="text-neutral-500 text-sm">Il y a 1j</span>
              </div>
              
              <h3 className="text-xl font-bold text-neutral-800 mb-2">
                Médicaments
              </h3>
              
              <div className="flex items-center text-neutral-600 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">Accra → Lagos</span>
              </div>
              
              <div className="flex items-center text-neutral-600 mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">Avant le 28 Jan</span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-green-600 font-bold">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span>35 000 XOF</span>
                </div>
                <span className="text-neutral-500 text-sm">1.2 kg</span>
              </div>
              
              <Button className="w-full bg-accent hover:bg-accent/90 text-white rounded-2xl">
                Voir les détails
              </Button>
            </div>

            {/* Announcement Card 4 */}
            <div className="bg-white rounded-4xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                  Express
                </span>
                <span className="text-neutral-500 text-sm">Il y a 3j</span>
              </div>
              
              <h3 className="text-xl font-bold text-neutral-800 mb-2">
                Vêtements traditionnels
              </h3>
              
              <div className="flex items-center text-neutral-600 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">Kinshasa → Brazzaville</span>
              </div>
              
              <div className="flex items-center text-neutral-600 mb-4">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">Avant le 2 Fév</span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-green-600 font-bold">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span>20 000 XOF</span>
                </div>
                <span className="text-neutral-500 text-sm">2.0 kg</span>
              </div>
              
              <Button className="w-full bg-accent hover:bg-accent/90 text-white rounded-2xl">
                Voir les détails
              </Button>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl text-lg font-semibold"
            >
              Voir toutes les annonces
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-accent text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à commencer ?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Rejoignez des milliers d'utilisateurs qui font confiance à Africage 
            pour leurs envois à travers l'Afrique
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl text-lg font-semibold"
            >
              Envoyer un colis
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-accent px-8 py-4 rounded-2xl text-lg font-semibold"
            >
              Devenir voyageur
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}