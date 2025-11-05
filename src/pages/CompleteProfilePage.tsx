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
  { name: 'Afghanistan', code: 'AF' },
  { name: 'Afrique du Sud', code: 'ZA' },
  { name: 'Albanie', code: 'AL' },
  { name: 'Algérie', code: 'DZ' },
  { name: 'Allemagne', code: 'DE' },
  { name: 'Andorre', code: 'AD' },
  { name: 'Angola', code: 'AO' },
  { name: 'Antarctique', code: 'AQ' },
  { name: 'Antigua-et-Barbuda', code: 'AG' },
  { name: 'Arabie saoudite', code: 'SA' },
  { name: 'Argentine', code: 'AR' },
  { name: 'Arménie', code: 'AM' },
  { name: 'Australie', code: 'AU' },
  { name: 'Autriche', code: 'AT' },
  { name: 'Azerbaïdjan', code: 'AZ' },
  { name: 'Bahamas', code: 'BS' },
  { name: 'Bahreïn', code: 'BH' },
  { name: 'Bangladesh', code: 'BD' },
  { name: 'Barbade', code: 'BB' },
  { name: 'Bélarus', code: 'BY' },
  { name: 'Belgique', code: 'BE' },
  { name: 'Belize', code: 'BZ' },
  { name: 'Bénin', code: 'BJ' },
  { name: 'Bhoutan', code: 'BT' },
  { name: 'Bolivie', code: 'BO' },
  { name: 'Bosnie-Herzégovine', code: 'BA' },
  { name: 'Botswana', code: 'BW' },
  { name: 'Brésil', code: 'BR' },
  { name: 'Brunéi', code: 'BN' },
  { name: 'Bulgarie', code: 'BG' },
  { name: 'Burkina Faso', code: 'BF' },
  { name: 'Burundi', code: 'BI' },
  { name: 'Cameroun', code: 'CM' },
  { name: 'Canada', code: 'CA' },
  { name: 'Cap-Vert', code: 'CV' },
  { name: 'Chili', code: 'CL' },
  { name: 'Chine', code: 'CN' },
  { name: 'Chypre', code: 'CY' },
  { name: 'Colombie', code: 'CO' },
  { name: 'Comores', code: 'KM' },
  { name: 'Congo', code: 'CG' },
  { name: 'Congo (RDC)', code: 'CD' },
  { name: 'Corée du Nord', code: 'KP' },
  { name: 'Corée du Sud', code: 'KR' },
  { name: 'Costa Rica', code: 'CR' },
  { name: 'Côte d\'Ivoire', code: 'CI' },
  { name: 'Croatie', code: 'HR' },
  { name: 'Cuba', code: 'CU' },
  { name: 'Danemark', code: 'DK' },
  { name: 'Djibouti', code: 'DJ' },
  { name: 'Dominique', code: 'DM' },
  { name: 'Égypte', code: 'EG' },
  { name: 'Émirats arabes unis', code: 'AE' },
  { name: 'Équateur', code: 'EC' },
  { name: 'Érythrée', code: 'ER' },
  { name: 'Espagne', code: 'ES' },
  { name: 'Estonie', code: 'EE' },
  { name: 'Eswatini', code: 'SZ' },
  { name: 'États-Unis', code: 'US' },
  { name: 'Éthiopie', code: 'ET' },
  { name: 'Fidji', code: 'FJ' },
  { name: 'Finlande', code: 'FI' },
  { name: 'France', code: 'FR' },
  { name: 'Gabon', code: 'GA' },
  { name: 'Gambie', code: 'GM' },
  { name: 'Géorgie', code: 'GE' },
  { name: 'Géorgie du Sud-et-les Îles Sandwich du Sud', code: 'GS' },
  { name: 'Ghana', code: 'GH' },
  { name: 'Gibraltar', code: 'GI' },
  { name: 'Grèce', code: 'GR' },
  { name: 'Grenade', code: 'GD' },
  { name: 'Guatemala', code: 'GT' },
  { name: 'Guinée', code: 'GN' },
  { name: 'Guinée équatoriale', code: 'GQ' },
  { name: 'Guinée-Bissau', code: 'GW' },
  { name: 'Guyana', code: 'GY' },
  { name: 'Haïti', code: 'HT' },
  { name: 'Honduras', code: 'HN' },
  { name: 'Hong Kong', code: 'HK' },
  { name: 'Hongrie', code: 'HU' },
  { name: 'Île Christmas', code: 'CX' },
  { name: 'Île Norfolk', code: 'NF' },
  { name: 'Îles Åland', code: 'AX' },
  { name: 'Îles Cocos', code: 'CC' },
  { name: 'Îles Cook', code: 'CK' },
  { name: 'Îles Féroé', code: 'FO' },
  { name: 'Îles Fidji', code: 'FJ' },
  { name: 'Îles Malouines', code: 'FK' },
  { name: 'Îles Mariannes du Nord', code: 'MP' },
  { name: 'Îles Marshall', code: 'MH' },
  { name: 'Îles Salomon', code: 'SB' },
  { name: 'Îles Turques-et-Caïques', code: 'TC' },
  { name: 'Îles Vierges américaines', code: 'VI' },
  { name: 'Îles Vierges britanniques', code: 'VG' },
  { name: 'Inde', code: 'IN' },
  { name: 'Indonésie', code: 'ID' },
  { name: 'Irak', code: 'IQ' },
  { name: 'Iran', code: 'IR' },
  { name: 'Irlande', code: 'IE' },
  { name: 'Islande', code: 'IS' },
  { name: 'Israël', code: 'IL' },
  { name: 'Italie', code: 'IT' },
  { name: 'Jamaïque', code: 'JM' },
  { name: 'Japon', code: 'JP' },
  { name: 'Jordanie', code: 'JO' },
  { name: 'Kazakhstan', code: 'KZ' },
  { name: 'Kenya', code: 'KE' },
  { name: 'Kirghizistan', code: 'KG' },
  { name: 'Kiribati', code: 'KI' },
  { name: 'Koweït', code: 'KW' },
  { name: 'Laos', code: 'LA' },
  { name: 'Lesotho', code: 'LS' },
  { name: 'Lettonie', code: 'LV' },
  { name: 'Liban', code: 'LB' },
  { name: 'Libéria', code: 'LR' },
  { name: 'Libye', code: 'LY' },
  { name: 'Liechtenstein', code: 'LI' },
  { name: 'Lithuanie', code: 'LT' },
  { name: 'Luxembourg', code: 'LU' },
  { name: 'Macédoine du Nord', code: 'MK' },
  { name: 'Madagascar', code: 'MG' },
  { name: 'Malaisie', code: 'MY' },
  { name: 'Malawi', code: 'MW' },
  { name: 'Maldives', code: 'MV' },
  { name: 'Mali', code: 'ML' },
  { name: 'Malte', code: 'MT' },
  { name: 'Maroc', code: 'MA' },
  { name: 'Maurice', code: 'MU' },
  { name: 'Mauritanie', code: 'MR' },
  { name: 'Mexique', code: 'MX' },
  { name: 'Micronésie', code: 'FM' },
  { name: 'Moldavie', code: 'MD' },
  { name: 'Monaco', code: 'MC' },
  { name: 'Mongolie', code: 'MN' },
  { name: 'Monténégro', code: 'ME' },
  { name: 'Mozambique', code: 'MZ' },
  { name: 'Myanmar (Birmanie)', code: 'MM' },
  { name: 'Namibie', code: 'NA' },
  { name: 'Nauru', code: 'NR' },
  { name: 'Népal', code: 'NP' },
  { name: 'Nicaragua', code: 'NI' },
  { name: 'Niger', code: 'NE' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'Norvège', code: 'NO' },
  { name: 'Nouvelle-Zélande', code: 'NZ' },
  { name: 'Oman', code: 'OM' },
  { name: 'Ouganda', code: 'UG' },
  { name: 'Ouzbékistan', code: 'UZ' },
  { name: 'Pakistan', code: 'PK' },
  { name: 'Palaos', code: 'PW' },
  { name: 'Panama', code: 'PA' },
  { name: 'Papouasie-Nouvelle-Guinée', code: 'PG' },
  { name: 'Paraguay', code: 'PY' },
  { name: 'Pays-Bas', code: 'NL' },
  { name: 'Pérou', code: 'PE' },
  { name: 'Philippines', code: 'PH' },
  { name: 'Pologne', code: 'PL' },
  { name: 'Portugal', code: 'PT' },
  { name: 'Qatar', code: 'QA' },
  { name: 'Royaume-Uni', code: 'GB' },
  { name: 'République centrafricaine', code: 'CF' },
  { name: 'République de Corée', code: 'KR' },
  { name: 'République de Chypre', code: 'CY' },
  { name: 'République de Croatie', code: 'HR' },
  { name: 'République de Géorgie', code: 'GE' },
  { name: 'République de Lituanie', code: 'LT' },
  { name: 'République de Malte', code: 'MT' },
  { name: 'République de Moldavie', code: 'MD' },
  { name: 'République de Pologne', code: 'PL' },
  { name: 'République de Serbie', code: 'RS' },
  { name: 'République de Slovaquie', code: 'SK' },
  { name: 'République de Slovénie', code: 'SI' },
  { name: 'République de Tanzanie', code: 'TZ' },
  { name: 'République démocratique du Congo', code: 'CD' },
  { name: 'République dominicaine', code: 'DO' },
  { name: 'République populaire démocratique de Corée', code: 'KP' },
  { name: 'République tchèque', code: 'CZ' },
  { name: 'République slovaque', code: 'SK' },
  { name: 'Réunion', code: 'RE' },
  { name: 'Roumanie', code: 'RO' },
  { name: 'Royaume-Uni de Grande-Bretagne et d\'Irlande du Nord', code: 'GB' },
  { name: 'Russie', code: 'RU' },
  { name: 'Rwanda', code: 'RW' },
  { name: 'Saint-Christophe-et-Niévès', code: 'KN' },
  { name: 'Sainte-Hélène, Ascension et Tristan da Cunha', code: 'SH' },
  { name: 'Sainte-Lucie', code: 'LC' },
  { name: 'Saint-Marin', code: 'SM' },
  { name: 'Saint-Pierre-et-Miquelon', code: 'PM' },
  { name: 'Saint-Vincent-et-les-Grenadines', code: 'VC' },
  { name: 'Sainte-Lucie', code: 'LC' },
  { name: 'Saint-Vincent-et-les-Grenadines', code: 'VC' },
  { name: 'Samoa', code: 'WS' },
  { name: 'Saint-Kitts-et-Nevis', code: 'KN' },
  { name: 'Sainte-Lucie', code: 'LC' },
  { name: 'Saint-Marin', code: 'SM' },
  { name: 'Saint-Vincent-et-les-Grenadines', code: 'VC' },
  { name: 'Samoa', code: 'WS' },
  { name: 'Sao Tomé-et-Principe', code: 'ST' },
  { name: 'Sénégal', code: 'SN' },
  { name: 'Serbie', code: 'RS' },
  { name: 'Seychelles', code: 'SC' },
  { name: 'Sierra Leone', code: 'SL' },
  { name: 'Singapour', code: 'SG' },
  { name: 'Slovaquie', code: 'SK' },
  { name: 'Slovénie', code: 'SI' },
  { name: 'Somalie', code: 'SO' },
  { name: 'Soudan', code: 'SD' },
  { name: 'Soudan du Sud', code: 'SS' },
  { name: 'Sri Lanka', code: 'LK' },
  { name: 'Suède', code: 'SE' },
  { name: 'Suisse', code: 'CH' },
  { name: 'Suriname', code: 'SR' },
  { name: 'Syrie', code: 'SY' },
  { name: 'Tadjikistan', code: 'TJ' },
  { name: 'Taïwan', code: 'TW' },
  { name: 'Tanzanie', code: 'TZ' },
  { name: 'Tchad', code: 'TD' },
  { name: 'Terres australes et antarctiques françaises', code: 'TF' },
  { name: 'Territoire britannique de l\'océan Indien', code: 'IO' },
  { name: 'Territoire palestinien occupé', code: 'PS' },
  { name: 'Thaïlande', code: 'TH' },
  { name: 'Timor oriental', code: 'TL' },
  { name: 'Togo', code: 'TG' },
  { name: 'Tonga', code: 'TO' },
  { name: 'Trinité-et-Tobago', code: 'TT' },
  { name: 'Tunisie', code: 'TN' },
  { name: 'Turkménistan', code: 'TM' },
  { name: 'Turquie', code: 'TR' },
  { name: 'Tuvalu', code: 'TV' },
  { name: 'Ukraine', code: 'UA' },
  { name: 'Uruguay', code: 'UY' },
  { name: 'Vanuatu', code: 'VU' },
  { name: 'Vatican', code: 'VA' },
  { name: 'Venezuela', code: 'VE' },
  { name: 'Viêt Nam', code: 'VN' },
  { name: 'Yémen', code: 'YE' },
  { name: 'Zambie', code: 'ZM' },
  { name: 'Zimbabwe', code: 'ZW' },
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