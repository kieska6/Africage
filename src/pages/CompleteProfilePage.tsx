import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { Upload, User, Phone, Calendar, Map, Loader2 } from 'lucide-react';

interface Country {
  name: string;
  code: string;
  phoneCode: string;
}

export function CompleteProfilePage() {
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [selectedCountryData, setSelectedCountryData] = useState<Country | null>(null);

  const { user, profile, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Charger les pays depuis Rest Countries API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setCountriesLoading(true);
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd');
        const data = await response.json();
        
        const formattedCountries = data
          .map((country: any) => ({
            name: country.name.common,
            code: country.cca2,
            phoneCode: country.idd.root + (country.idd.suffixes[0] || ''),
          }))
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
        
        setCountries(formattedCountries);
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError('Impossible de charger la liste des pays. Veuillez réessayer plus tard.');
      } finally {
        setCountriesLoading(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (country) {
      const countryData = countries.find(c => c.name === country);
      setSelectedCountryData(countryData || null);
      
      // Si un indicatif existe et que le téléphone ne commence pas déjà par cet indicatif
      if (countryData?.phoneCode && !phone.startsWith(countryData.phoneCode)) {
        setPhone(countryData.phoneCode);
      }
    }
  }, [country, countries]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatar(e.target.files[0]);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Si un pays est sélectionné et que le téléphone ne commence pas par l'indicatif du pays
    if (selectedCountryData?.phoneCode && !value.startsWith(selectedCountryData.phoneCode)) {
      setPhone(selectedCountryData.phoneCode + value.replace(/^\+?\d+/, ''));
    } else {
      setPhone(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      let avatarUrl = null;

      // Téléverser l'avatar si fourni
      if (avatar) {
        const fileExt = avatar.name.split('.').pop();
        const fileName = `${user.id}/avatar.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatar, { upsert: true });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
        
        avatarUrl = publicUrlData.publicUrl;
      }

      // Mettre à jour le profil utilisateur
      const { error: updateError } = await supabase.from('users').update({
        phone_number: phone,
        country: country,
        date_of_birth: dateOfBirth ? new Date(dateOfBirth).toISOString() : null,
        profile_avatar_url: avatarUrl,
        is_profile_complete: true,
        updated_at: new Date().toISOString()
      }).eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Mettre à jour le contexte
      if (updateUser) {
        await updateUser();
      }

      setSuccess(true);
      
      // Rediriger vers la page d'accueil après 2 secondes
      setTimeout(() => {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }, 2000);

    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la mise à jour du profil.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">
            Profil complété avec succès !
          </h2>
          <p className="text-neutral-600 mb-6">
            Bienvenue sur Africage ! Votre compte est maintenant prêt à l'emploi.
          </p>
          <div className="text-sm text-neutral-500">
            Redirection vers l'accueil...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-800 mb-2">
              Bienvenue, {profile.first_name} !
            </h1>
            <p className="text-neutral-600">Encore une étape pour sécuriser votre compte.</p>
          </div>

          {error && (
            <div className="mb-4">
              <Alert type="error" message={error} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Téléphone
                </label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder={selectedCountryData?.phoneCode || "+221"} 
                  required
                />
                {selectedCountryData && (
                  <p className="text-xs text-neutral-500 mt-1">
                    Indicatif automatique : {selectedCountryData.phoneCode}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date de naissance
                </label>
                <Input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700">
                <Map className="w-4 h-4 inline mr-1" />
                Pays de résidence
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={countriesLoading}
              >
                <option value="">{
                  countriesLoading ? 'Chargement des pays...' : 'Sélectionnez votre pays'
                }</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700">
                <Upload className="w-4 h-4 inline mr-1" />
                Photo de profil (optionnel)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-neutral-400" />
                  <div className="flex text-sm text-neutral-600">
                    <label htmlFor="avatar-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none">
                      <span>Téléversez une image</span>
                      <input id="avatar-upload" name="avatar-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                    </label>
                    <p className="pl-1">ou glissez-déposez</p>
                  </div>
                  <p className="text-xs text-neutral-500">PNG, JPG, GIF jusqu'à 5MB</p>
                </div>
              </div>
              {avatar && (
                <p className="text-sm text-neutral-600 mt-2">
                  Fichier sélectionné : {avatar.name}
                </p>
              )}
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white"
              disabled={countriesLoading}
            >
              Compléter mon profil
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}