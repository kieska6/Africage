import React, { useState } from 'react';
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
}

const countries: Country[] = [
  { name: 'Afrique du Sud', code: 'ZA' },
  { name: 'Algérie', code: 'DZ' },
  { name: 'Angola', code: 'AO' },
  { name: 'Bénin', code: 'BJ' },
  { name: 'Botswana', code: 'BW' },
  { name: 'Burkina Faso', code: 'BF' },
  { name: 'Burundi', code: 'BI' },
  { name: 'Cameroun', code: 'CM' },
  { name: 'Cap-Vert', code: 'CV' },
  { name: 'République centrafricaine', code: 'CF' },
  { name: 'Tchad', code: 'TD' },
  { name: 'Comores', code: 'KM' },
  { name: 'République du Congo', code: 'CG' },
  { name: 'République démocratique du Congo', code: 'CD' },
  { name: 'Djibouti', code: 'DJ' },
  { name: 'Égypte', code: 'EG' },
  { name: 'Guinée équatoriale', code: 'GQ' },
  { name: 'Érythrée', code: 'ER' },
  { name: 'Éthiopie', code: 'ET' },
  { name: 'Gabon', code: 'GA' },
  { name: 'Gambie', code: 'GM' },
  { name: 'Ghana', code: 'GH' },
  { name: 'Guinée', code: 'GN' },
  { name: 'Guinée-Bissau', code: 'GW' },
  { name: 'Côte d\'Ivoire', code: 'CI' },
  { name: 'Kenya', code: 'KE' },
  { name: 'Lesotho', code: 'LS' },
  { name: 'Libéria', code: 'LR' },
  { name: 'Libye', code: 'LY' },
  { name: 'Madagascar', code: 'MG' },
  { name: 'Malawi', code: 'MW' },
  { name: 'Mali', code: 'ML' },
  { name: 'Maroc', code: 'MA' },
  { name: 'Mauritanie', code: 'MR' },
  { name: 'Maurice', code: 'MU' },
  { name: 'Mozambique', code: 'MZ' },
  { name: 'Namibie', code: 'NA' },
  { name: 'Niger', code: 'NE' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'Ouganda', code: 'UG' },
  { name: 'République arabe sahraouie', code: 'EH' },
  { name: 'République de São Tomé-et-Principe', code: 'ST' },
  { name: 'Sénégal', code: 'SN' },
  { name: 'Seychelles', code: 'SC' },
  { name: 'Sierra Leone', code: 'SL' },
  { name: 'Somalie', code: 'SO' },
  { name: 'Soudan', code: 'SD' },
  { name: 'Soudan du Sud', code: 'SS' },
  { name: 'Swaziland', code: 'SZ' },
  { name: 'Tanzanie', code: 'TZ' },
  { name: 'Togo', code: 'TG' },
  { name: 'Tunisie', code: 'TN' },
  { name: 'Zambie', code: 'ZM' },
  { name: 'Zimbabwe', code: 'ZW' },
  { name: 'France', code: 'FR' },
  { name: 'États-Unis', code: 'US' },
  { name: 'Canada', code: 'CA' },
  { name: 'Australie', code: 'AU' },
  { name: 'Royaume-Uni', code: 'GB' },
  { name: 'Allemagne', code: 'DE' },
  { name: 'Italie', code: 'IT' },
  { name: 'Espagne', code: 'ES' },
  { name: 'Portugal', code: 'PT' },
  { name: 'Pays-Bas', code: 'NL' },
  { name: 'Belgique', code: 'BE' },
  { name: 'Suisse', code: 'CH' },
  { name: 'Autriche', code: 'AT' },
  { name: 'Suède', code: 'SE' },
  { name: 'Norvège', code: 'NO' },
  { name: 'Danemark', code: 'DK' },
  { name: 'Finlande', code: 'FI' },
  { name: 'Irlande', code: 'IE' },
  { name: 'Grèce', code: 'GR' },
  { name: 'Turquie', code: 'TR' },
  { name: 'Israël', code: 'IL' },
  { name: 'Japon', code: 'JP' },
  { name: 'Corée du Sud', code: 'KR' },
  { name: 'Chine', code: 'CN' },
  { name: 'Inde', code: 'IN' },
  { name: 'Brésil', code: 'BR' },
  { name: 'Argentine', code: 'AR' },
  { name: 'Colombie', code: 'CO' },
  { name: 'Mexique', code: 'MX' },
  { name: 'Chili', code: 'CL' },
  { name: 'Pérou', code: 'PE' },
  { name: 'Venezuela', code: 'VE' },
  { name: 'Équateur', code: 'EC' },
  { name: 'Cuba', code: 'CU' },
  { name: 'République dominicaine', code: 'DO' },
  { name: 'Haïti', code: 'HT' },
  { name: 'Jamaïque', code: 'JM' },
  { name: 'Trinité-et-Tobago', code: 'TT' },
  { name: 'Bahamas', code: 'BS' },
  { name: 'Barbade', code: 'BB' },
  { name: 'Grenade', code: 'GD' },
  { name: 'Sainte-Lucie', code: 'LC' },
  { name: 'Saint-Vincent-et-les-Grenadines', code: 'VC' },
  { name: 'Antigua-et-Barbuda', code: 'AG' },
  { name: 'Dominique', code: 'DM' },
  { name: 'Saint-Kitts-et-Nevis', code: 'KN' },
  { name: 'Belize', code: 'BZ' },
  { name: 'Guatemala', code: 'GT' },
  { name: 'Honduras', code: 'HN' },
  { name: 'El Salvador', code: 'SV' },
  { name: 'Nicaragua', code: 'NI' },
  { name: 'Costa Rica', code: 'CR' },
  { name: 'Panama', code: 'PA' },
  { name: 'Guyana', code: 'GY' },
  { name: 'Suriname', code: 'SR' },
  { name: 'Paraguay', code: 'PY' },
  { name: 'Bolivie', code: 'BO' },
  { name: 'Uruguay', code: 'UY' },
  { name: 'Nouvelle-Zélande', code: 'NZ' },
  { name: 'Fidji', code: 'FJ' },
  { name: 'Papouasie-Nouvelle-Guinée', code: 'PG' },
  { name: 'Indonésie', code: 'ID' },
  { name: 'Malaisie', code: 'MY' },
  { name: 'Thaïlande', code: 'TH' },
  { name: 'Vietnam', code: 'VN' },
  { name: 'Philippines', code: 'PH' },
  { name: 'Singapour', code: 'SG' },
  { name: 'Hong Kong', code: 'HK' },
  { name: 'Taïwan', code: 'TW' },
  { name: 'Sri Lanka', code: 'LK' },
  { name: 'Népal', code: 'NP' },
  { name: 'Bhoutan', code: 'BT' },
  { name: 'Bangladesh', code: 'BD' },
  { name: 'Pakistan', code: 'PK' },
  { name: 'Afghanistan', code: 'AF' },
  { name: 'Iran', code: 'IR' },
  { name: 'Irak', code: 'IQ' },
  { name: 'Syrie', code: 'SY' },
  { name: 'Liban', code: 'LB' },
  { name: 'Jordanie', code: 'JO' },
  { name: 'Arabie saoudite', code: 'SA' },
  { name: 'Koweït', code: 'KW' },
  { name: 'Bahreïn', code: 'BH' },
  { name: 'Qatar', code: 'QA' },
  { name: 'Émirats arabes unis', code: 'AE' },
  { name: 'Yémen', code: 'YE' },
  { name: 'Oman', code: 'OM' },
  { name: 'Azerbaïdjan', code: 'AZ' },
  { name: 'Arménie', code: 'AM' },
  { name: 'Géorgie', code: 'GE' },
  { name: 'Russie', code: 'RU' },
  { name: 'Ukraine', code: 'UA' },
  { name: 'Biélorussie', code: 'BY' },
  { name: 'Pologne', code: 'PL' },
  { name: 'République tchèque', code: 'CZ' },
  { name: 'Slovaquie', code: 'SK' },
  { name: 'Hongrie', code: 'HU' },
  { name: 'Roumanie', code: 'RO' },
  { name: 'Bulgarie', code: 'BG' },
  { name: 'Serbie', code: 'RS' },
  { name: 'Croatie', code: 'HR' },
  { name: 'Slovénie', code: 'SI' },
  { name: 'Bosnie-Herzégovine', code: 'BA' },
  { name: 'Monténégro', code: 'ME' },
  { name: 'Albanie', code: 'AL' },
  { name: 'Macédoine du Nord', code: 'MK' },
  { name: 'Grèce', code: 'GR' },
  { name: 'Chypre', code: 'CY' },
  { name: 'Malte', code: 'MT' },
  { name: 'Islande', code: 'IS' },
  { name: 'Liechtenstein', code: 'LI' },
  { name: 'Monaco', code: 'MC' },
  { name: 'Saint-Marin', code: 'SM' },
  { name: 'Vatican', code: 'VA' },
  { name: 'Andorre', code: 'AD' },
  { name: 'Luxembourg', code: 'LU' },
  { name: 'Estonie', code: 'EE' },
  { name: 'Lettonie', code: 'LV' },
  { name: 'Lituanie', code: 'LT' },
  { name: 'Moldavie', code: 'MD' },
  { name: 'Gibraltar', code: 'GI' },
  { name: 'Îles Féroé', code: 'FO' },
  { name: 'Groenland', code: 'GL' },
  { name: 'Svalbard et Jan Mayen', code: 'SJ' },
  { name: 'Îles Åland', code: 'AX' },
  { name: 'Îles Vierges américaines', code: 'VI' },
  { name: 'Îles Vierges britanniques', code: 'VG' },
  { name: 'Îles Caïmans', code: 'KY' },
  { name: 'Bermudes', code: 'BM' },
  { name: 'Îles Turques-et-Caïques', code: 'TC' },
  { name: 'Îles Marshall', code: 'MH' },
  { name: 'Îles Salomon', code: 'SB' },
  { name: 'Vanuatu', code: 'VU' },
  { name: 'Samoa', code: 'WS' },
  { name: 'Tonga', code: 'TO' },
  { name: 'Kiribati', code: 'KI' },
  { name: 'Micronésie', code: 'FM' },
  { name: 'Nauru', code: 'NR' },
  { name: 'Tuvalu', code: 'TV' },
  { name: 'Île Christmas', code: 'CX' },
  { name: 'Île Norfolk', code: 'NF' },
  { name: 'Îles Cocos', code: 'CC' },
  { name: 'Îles Malouines', code: 'FK' },
  { name: 'Géorgie du Sud-et-les Îles Sandwich du Sud', code: 'GS' },
  { name: 'Territoire britannique de l\'océan Indien', code: 'IO' },
  { name: 'Antarctique', code: 'AQ' },
  { name: 'Pays inconnu', code: 'XX' }
];

export function CompleteProfilePage() {
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { user, profile, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatar(e.target.files[0]);
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
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Profil complété avec succès !</h2>
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
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+221771234567"
                  required
                />
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
                className="w-full px-4 py-3 border border-neutral-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                required
              >
                <option value="">Sélectionnez votre pays</option>
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
            >
              Compléter mon profil
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}