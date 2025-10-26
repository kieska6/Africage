import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import { Select } from '../ui/Select';
import { Package, MapPin, DollarSign, Ruler } from 'lucide-react';
import countriesWithCities from '../../data/countries+cities.json';

interface ShipmentFormData {
  title: string;
  description: string;
  pickup_city: string;
  pickup_country: string;
  delivery_city: string;
  delivery_country: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  proposed_price: string;
  currency: string;
}

interface Country {
  name: string;
  iso2: string;
  cities: City[];
}

interface City {
  id: number;
  name: string;
}

const currencies = [
  // African Currencies
  { code: 'XOF', name: 'Franc CFA (BCEAO)' },
  { code: 'XAF', name: 'Franc CFA (BEAC)' },
  { code: 'DZD', name: 'Dinar Algérien' },
  { code: 'AOA', name: 'Kwanza Angolais' },
  { code: 'BWP', name: 'Pula Botswanais' },
  { code: 'BIF', name: 'Franc Burundais' },
  { code: 'CVE', name: 'Escudo Cap-Verdien' },
  { code: 'KMF', name: 'Franc Comorien' },
  { code: 'CDF', name: 'Franc Congolais' },
  { code: 'DJF', name: 'Franc Djiboutien' },
  { code: 'EGP', name: 'Livre Égyptienne' },
  { code: 'ERN', name: 'Nakfa Érythréen' },
  { code: 'ETB', name: 'Birr Éthiopien' },
  { code: 'GMD', name: 'Dalasi Gambien' },
  { code: 'GHS', name: 'Cedi Ghanéen' },
  { code: 'GNF', name: 'Franc Guinéen' },
  { code: 'KES', name: 'Shilling Kenyan' },
  { code: 'LSL', name: 'Loti Lesothan' },
  { code: 'LRD', name: 'Dollar Libérien' },
  { code: 'LYD', name: 'Dinar Libyen' },
  { code: 'MGA', name: 'Ariary Malgache' },
  { code: 'MWK', name: 'Kwacha Malawite' },
  { code: 'MRU', name: 'Ouguiya Mauritanien' },
  { code: 'MUR', name: 'Roupie Mauricienne' },
  { code: 'MAD', name: 'Dirham Marocain' },
  { code: 'MZN', name: 'Metical Mozambicain' },
  { code: 'NAD', name: 'Dollar Namibien' },
  { code: 'NGN', name: 'Naira Nigérian' },
  { code: 'RWF', name: 'Franc Rwandais' },
  { code: 'STN', name: 'Dobra Santoméen' },
  { code: 'SCR', name: 'Roupie Seychelloise' },
  { code: 'SLE', name: 'Leone Sierra-Léonais' },
  { code: 'SOS', name: 'Shilling Somali' },
  { code: 'ZAR', name: 'Rand Sud-Africain' },
  { code: 'SSP', name: 'Livre Sud-Soudanaise' },
  { code: 'SDG', name: 'Livre Soudanaise' },
  { code: 'SZL', name: 'Lilangeni Swazi' },
  { code: 'TZS', name: 'Shilling Tanzanien' },
  { code: 'TND', name: 'Dinar Tunisien' },
  { code: 'UGX', name: 'Shilling Ougandais' },
  { code: 'ZMW', name: 'Kwacha Zambien' },
  { code: 'ZWL', name: 'Dollar Zimbabwéen' },
  // Major World Currencies
  { code: 'USD', name: 'Dollar Américain' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'Livre Sterling' },
  { code: 'CAD', name: 'Dollar Canadien' },
  { code: 'CHF', name: 'Franc Suisse' },
  { code: 'CNY', name: 'Yuan Chinois' },
  { code: 'JPY', name: 'Yen Japonais' },
  { code: 'AUD', name: 'Dollar Australien' },
  { code: 'INR', name: 'Roupie Indienne' },
  { code: 'BRL', name: 'Réal Brésilien' },
  { code: 'RUB', name: 'Rouble Russe' },
  { code: 'AED', name: 'Dirham des É.A.U.' },
  { code: 'SAR', name: 'Riyal Saoudien' },
];

export function CreateShipmentForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<ShipmentFormData>({
    title: '',
    description: '',
    pickup_city: '',
    pickup_country: '',
    delivery_city: '',
    delivery_country: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    proposed_price: '',
    currency: ''
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [pickupCities, setPickupCities] = useState<City[]>([]);
  const [deliveryCities, setDeliveryCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const sortedCountries = [...(countriesWithCities as Country[])].sort((a, b) => a.name.localeCompare(b.name));
    setCountries(sortedCountries);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>, type: 'pickup' | 'delivery') => {
    const countryName = e.target.value;
    const countryData = countries.find(c => c.name === countryName);
    
    let cities: City[] = [];
    if (countryData && Array.isArray(countryData.cities)) {
      cities = [...countryData.cities]
          .filter(city => city && city.name)
          .sort((a, b) => a.name.localeCompare(b.name));
    }

    if (type === 'pickup') {
      setFormData(prev => ({
        ...prev,
        pickup_country: countryName,
        pickup_city: ''
      }));
      setPickupCities(cities);
    } else {
      setFormData(prev => ({
        ...prev,
        delivery_country: countryName,
        delivery_city: ''
      }));
      setDeliveryCities(cities);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Vous devez être connecté pour publier une annonce');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!formData.title || !formData.pickup_city || !formData.pickup_country || !formData.delivery_city || !formData.delivery_country ||
          !formData.weight || !formData.proposed_price || !formData.currency) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      const shipmentData = {
        sender_id: user.id,
        title: formData.title,
        description: formData.description || null,
        pickup_city: formData.pickup_city,
        pickup_country: formData.pickup_country,
        delivery_city: formData.delivery_city,
        delivery_country: formData.delivery_country,
        pickup_address: `${formData.pickup_city}, ${formData.pickup_country}`,
        delivery_address: `${formData.delivery_city}, ${formData.delivery_country}`,
        weight: parseFloat(formData.weight),
        length: formData.length ? parseFloat(formData.length) : null,
        width: formData.width ? parseFloat(formData.width) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        proposed_price: parseFloat(formData.proposed_price),
        currency: formData.currency,
        status: 'PENDING_MATCH'
      };

      const { error: insertError } = await supabase
        .from('shipments')
        .insert([shipmentData]);

      if (insertError) {
        throw insertError;
      }

      setSuccess(true);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err: any) {
      console.error('Erreur lors de la création de l\'annonce:', err);
      setError(err.message || 'Une erreur est survenue lors de la publication de votre annonce');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-neutral-800 mb-2">
          Annonce publiée avec succès !
        </h3>
        <p className="text-neutral-600 mb-4">
          Votre annonce est maintenant visible par les voyageurs. 
          Vous serez notifié dès qu'un voyageur sera intéressé.
        </p>
        <p className="text-sm text-neutral-500">
          Redirection vers le tableau de bord...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <Alert type="error" message={error} />
      )}

      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <Package className="w-5 h-5 text-accent" />
          <h3 className="text-xl font-semibold text-neutral-800">
            Informations du colis
          </h3>
        </div>

        <Input
          label="Titre de l'annonce *"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Ex: iPhone 15 Pro Max neuf"
          required
        />

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 border border-neutral-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
            placeholder="Décrivez votre colis en détail (état, contenu, précautions particulières...)"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className="w-5 h-5 text-accent" />
          <h3 className="text-xl font-semibold text-neutral-800">
            Itinéraire
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-neutral-700">Point de départ</h4>
            <Select
              label="Pays de départ *"
              name="pickup_country"
              value={formData.pickup_country}
              onChange={(e) => handleCountryChange(e, 'pickup')}
              required
            >
              <option value="" disabled>Choisir un pays</option>
              {countries.map(country => (
                <option key={country.iso2} value={country.name}>{country.name}</option>
              ))}
            </Select>
            <Select
              label="Ville de départ *"
              name="pickup_city"
              value={formData.pickup_city}
              onChange={handleInputChange}
              required
              disabled={pickupCities.length === 0}
            >
              <option value="" disabled>Choisir une ville</option>
              {pickupCities.map(city => (
                <option key={city.id} value={city.name}>{city.name}</option>
              ))}
            </Select>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-neutral-700">Destination</h4>
            <Select
              label="Pays d'arrivée *"
              name="delivery_country"
              value={formData.delivery_country}
              onChange={(e) => handleCountryChange(e, 'delivery')}
              required
            >
              <option value="" disabled>Choisir un pays</option>
              {countries.map(country => (
                <option key={country.iso2} value={country.name}>{country.name}</option>
              ))}
            </Select>
            <Select
              label="Ville d'arrivée *"
              name="delivery_city"
              value={formData.delivery_city}
              onChange={handleInputChange}
              required
              disabled={deliveryCities.length === 0}
            >
              <option value="" disabled>Choisir une ville</option>
              {deliveryCities.map(city => (
                <option key={city.id} value={city.name}>{city.name}</option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <Ruler className="w-5 h-5 text-accent" />
          <h3 className="text-xl font-semibold text-neutral-800">
            Dimensions et poids
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Poids (kg) *"
            name="weight"
            type="number"
            step="0.1"
            min="0.1"
            value={formData.weight}
            onChange={handleInputChange}
            placeholder="Ex: 0.5"
            required
          />

          <div className="space-y-4">
            <label className="block text-sm font-medium text-neutral-700">
              Dimensions (cm) - Optionnel
            </label>
            <div className="grid grid-cols-3 gap-3">
              <Input
                name="length"
                type="number"
                step="0.1"
                min="0"
                value={formData.length}
                onChange={handleInputChange}
                placeholder="Longueur"
              />
              <Input
                name="width"
                type="number"
                step="0.1"
                min="0"
                value={formData.width}
                onChange={handleInputChange}
                placeholder="Largeur"
              />
              <Input
                name="height"
                type="number"
                step="0.1"
                min="0"
                value={formData.height}
                onChange={handleInputChange}
                placeholder="Hauteur"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <DollarSign className="w-5 h-5 text-accent" />
          <h3 className="text-xl font-semibold text-neutral-800">
            Récompense
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="Récompense proposée *"
            name="proposed_price"
            type="number"
            min="1"
            step="any"
            value={formData.proposed_price}
            onChange={handleInputChange}
            placeholder="Ex: 25000"
            required
          />
          <Select
            label="Devise *"
            name="currency"
            value={formData.currency}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>Choisir une devise</option>
            {currencies.map(c => (
              <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
            ))}
          </Select>
        </div>
        <p className="text-sm text-neutral-500">
          Montant que vous êtes prêt à payer pour le transport de votre colis.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="flex-1 py-3 text-base"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          loading={loading}
          className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 text-base font-semibold"
        >
          Publier l'annonce
        </Button>
      </div>
    </form>
  );
}