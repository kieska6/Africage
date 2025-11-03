import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import { Select } from '../ui/Select';
import { Briefcase, MapPin, Calendar, Weight, DollarSign } from 'lucide-react';
import countriesWithCities from '../../data/countries+cities.json';

interface TripFormData {
  title: string;
  description: string;
  departure_city: string;
  departure_country: string;
  arrival_city: string;
  arrival_country: string;
  departure_date: string;
  arrival_date: string;
  available_weight: string;
  price_per_kg: string;
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
  { code: 'AED', name: 'Dirham des É.A.U.' },
  { code: 'AOA', name: 'Kwanza Angolais' },
  { code: 'AUD', name: 'Dollar Australien' },
  { code: 'BIF', name: 'Franc Burundais' },
  { code: 'BRL', name: 'Réal Brésilien' },
  { code: 'BWP', name: 'Pula Botswanais' },
  { code: 'CAD', name: 'Dollar Canadien' },
  { code: 'CDF', name: 'Franc Congolais' },
  { code: 'CHF', name: 'Franc Suisse' },
  { code: 'CNY', name: 'Yuan Chinois' },
  { code: 'CVE', name: 'Escudo Cap-Verdien' },
  { code: 'DJF', name: 'Franc Djiboutien' },
  { code: 'DZD', name: 'Dinar Algérien' },
  { code: 'EGP', name: 'Livre Égyptienne' },
  { code: 'ERN', name: 'Nakfa Érythréen' },
  { code: 'ETB', name: 'Birr Éthiopien' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'Livre Sterling' },
  { code: 'GHS', name: 'Cedi Ghanéen' },
  { code: 'GMD', name: 'Dalasi Gambien' },
  { code: 'GNF', name: 'Franc Guinéen' },
  { code: 'INR', name: 'Roupie Indienne' },
  { code: 'JPY', name: 'Yen Japonais' },
  { code: 'KES', name: 'Shilling Kenyan' },
  { code: 'KMF', name: 'Franc Comorien' },
  { code: 'LRD', name: 'Dollar Libérien' },
  { code: 'LSL', name: 'Loti Lesothan' },
  { code: 'LYD', name: 'Dinar Libyen' },
  { code: 'MAD', name: 'Dirham Marocain' },
  { code: 'MGA', name: 'Ariary Malgache' },
  { code: 'MRU', name: 'Ouguiya Mauritanien' },
  { code: 'MUR', name: 'Roupie Mauricienne' },
  { code: 'MWK', name: 'Kwacha Malawite' },
  { code: 'MZN', name: 'Metical Mozambicain' },
  { code: 'NAD', name: 'Dollar Namibien' },
  { code: 'NGN', name: 'Naira Nigérian' },
  { code: 'RWF', name: 'Franc Rwandais' },
  { code: 'RUB', name: 'Rouble Russe' },
  { code: 'SAR', name: 'Riyal Saoudien' },
  { code: 'SCR', name: 'Roupie Seychelloise' },
  { code: 'SDG', name: 'Livre Soudanaise' },
  { code: 'SLE', name: 'Leone Sierra-Léonais' },
  { code: 'SOS', name: 'Shilling Somali' },
  { code: 'SSP', name: 'Livre Sud-Soudanaise' },
  { code: 'STN', name: 'Dobra Santoméen' },
  { code: 'SZL', name: 'Lilangeni Swazi' },
  { code: 'TND', name: 'Dinar Tunisien' },
  { code: 'TZS', name: 'Shilling Tanzanien' },
  { code: 'UGX', name: 'Shilling Ougandais' },
  { code: 'USD', name: 'Dollar Américain' },
  { code: 'XAF', name: 'Franc CFA (BEAC)' },
  { code: 'XOF', name: 'Franc CFA (BCEAO)' },
  { code: 'ZAR', name: 'Rand Sud-Africain' },
  { code: 'ZMW', name: 'Kwacha Zambien' },
  { code: 'ZWL', name: 'Dollar Zimbabwéen' },
].sort((a, b) => a.name.localeCompare(b.name));

export function CreateTripForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<TripFormData>({
    title: '',
    description: '',
    departure_city: '',
    departure_country: '',
    arrival_city: '',
    arrival_country: '',
    departure_date: '',
    arrival_date: '',
    available_weight: '',
    price_per_kg: '',
    currency: 'XOF'
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const sortedCountries = [...(countriesWithCities as Country[])].sort((a, b) => a.name.localeCompare(b.name));
    setCountries(sortedCountries);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>, type: 'departure' | 'arrival') => {
    const countryName = e.target.value;
    if (type === 'departure') {
      setFormData(prev => ({ ...prev, departure_country: countryName, departure_city: '' }));
    } else {
      setFormData(prev => ({ ...prev, arrival_country: countryName, arrival_city: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Vous devez être connecté pour publier un voyage.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { title, departure_city, departure_country, arrival_city, arrival_country, departure_date, arrival_date, available_weight, price_per_kg, currency } = formData;
      if (!title || !departure_city || !departure_country || !arrival_city || !arrival_country || !departure_date || !arrival_date || !available_weight || !price_per_kg) {
        throw new Error('Veuillez remplir tous les champs obligatoires.');
      }

      if (new Date(arrival_date) <= new Date(departure_date)) {
        throw new Error('La date d\'arrivée doit être postérieure à la date de départ.');
      }

      const tripData = {
        traveler_id: user.id,
        title,
        description: formData.description || null,
        departure_city,
        departure_country,
        arrival_city,
        arrival_country,
        departure_date,
        arrival_date,
        available_weight: parseFloat(available_weight),
        price_per_kg: parseFloat(price_per_kg),
        currency,
        status: 'AVAILABLE'
      };

      const { error: insertError } = await supabase.from('trips').insert([tripData]);
      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);

    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la publication de votre voyage.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-neutral-800 mb-2">Voyage publié avec succès !</h3>
        <p className="text-neutral-600 mb-4">Votre voyage est maintenant visible. Vous serez notifié des demandes de transport.</p>
        <p className="text-sm text-neutral-500">Redirection vers le tableau de bord...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <Alert type="error" message={error} />}

      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <Briefcase className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-neutral-800">Détails du voyage</h3>
        </div>
        <Input label="Titre du voyage *" name="title" value={formData.title} onChange={handleInputChange} placeholder="Ex: Voyage d'affaires Dakar - Abidjan" required />
        <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 border border-neutral-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none" placeholder="Ajoutez des détails sur votre voyage (horaires, flexibilité, etc.)" />
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-neutral-800">Itinéraire</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Select label="Pays de départ *" name="departure_country" value={formData.departure_country} onChange={(e) => handleCountryChange(e, 'departure')} required>
              <option value="">Choisir un pays</option>
              {countries.map(c => <option key={c.iso2} value={c.name}>{c.name}</option>)}
            </Select>
          </div>
          <div>
            <Input label="Ville de départ *" name="departure_city" value={formData.departure_city} onChange={handleInputChange} required placeholder="Ex: Dakar" />
          </div>
          <div>
            <Select label="Pays d'arrivée *" name="arrival_country" value={formData.arrival_country} onChange={(e) => handleCountryChange(e, 'arrival')} required>
              <option value="">Choisir un pays</option>
              {countries.map(c => <option key={c.iso2} value={c.name}>{c.name}</option>)}
            </Select>
          </div>
          <div>
            <Input label="Ville d'arrivée *" name="arrival_city" value={formData.arrival_city} onChange={handleInputChange} required placeholder="Ex: Abidjan" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-neutral-800">Dates</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Input label="Date de départ *" name="departure_date" type="date" value={formData.departure_date} onChange={handleInputChange} required />
          <Input label="Date d'arrivée *" name="arrival_date" type="date" value={formData.arrival_date} onChange={handleInputChange} required />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <Weight className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-neutral-800">Capacité et Prix</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Input label="Poids disponible (kg) *" name="available_weight" type="number" step="0.5" min="0.5" value={formData.available_weight} onChange={handleInputChange} placeholder="Ex: 10" required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Prix par kg *" name="price_per_kg" type="number" step="100" min="0" value={formData.price_per_kg} onChange={handleInputChange} placeholder="Ex: 5000" required />
            <Select label="Devise *" name="currency" value={formData.currency} onChange={handleInputChange} required>
              {currencies.map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
            </Select>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button type="button" variant="outline" onClick={() => navigate('/dashboard')} className="flex-1 py-3 text-base">Annuler</Button>
        <Button type="submit" loading={loading} className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 text-base font-semibold">Publier le voyage</Button>
      </div>
    </form>
  );
}