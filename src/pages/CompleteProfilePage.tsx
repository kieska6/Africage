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

const countries: Country[] = [
  { name: 'Afghanistan', code: 'AF', phoneCode: '+93' },
  { name: 'Afrique du Sud', code: 'ZA', phoneCode: '+27' },
  { name: 'Albanie', code: 'AL', phoneCode: '+355' },
  { name: 'Algérie', code: 'DZ', phoneCode: '+213' },
  { name: 'Allemagne', code: 'DE', phoneCode: '+49' },
  { name: 'Andorre', code: 'AD', phoneCode: '+376' },
  { name: 'Angola', code: 'AO', phoneCode: '+244' },
  { name: 'Antarctique', code: 'AQ', phoneCode: '+672' },
  { name: 'Antigua-et-Barbuda', code: 'AG', phoneCode: '+1-268' },
  { name: 'Arabie saoudite', code: 'SA', phoneCode: '+966' },
  { name: 'Argentine', code: 'AR', phoneCode: '+54' },
  { name: 'Arménie', code: 'AM', phoneCode: '+374' },
  { name: 'Australie', code: 'AU', phoneCode: '+61' },
  { name: 'Autriche', code: 'AT', phoneCode: '+43' },
  { name: 'Azerbaïdjan', code: 'AZ', phoneCode: '+994' },
  { name: 'Bahamas', code: 'BS', phoneCode: '+1-242' },
  { name: 'Bahreïn', code: 'BH', phoneCode: '+973' },
  { name: 'Bangladesh', code: 'BD', phoneCode: '+880' },
  { name: 'Barbade', code: 'BB', phoneCode: '+1-246' },
  { name: 'Bélarus', code: 'BY', phoneCode: '+375' },
  { name: 'Belgique', code: 'BE', phoneCode: '+32' },
  { name: 'Belize', code: 'BZ', phoneCode: '+501' },
  { name: 'Bénin', code: 'BJ', phoneCode: '+229' },
  { name: 'Bhoutan', code: 'BT', phoneCode: '+975' },
  { name: 'Bolivie', code: 'BO', phoneCode: '+591' },
  { name: 'Bosnie-Herzégovine', code: 'BA', phoneCode: '+387' },
  { name: 'Botswana', code: 'BW', phoneCode: '+267' },
  { name: 'Brésil', code: 'BR', phoneCode: '+55' },
  { name: 'Brunéi', code: 'BN', phoneCode: '+673' },
  { name: 'Bulgarie', code: 'BG', phoneCode: '+359' },
  { name: 'Burkina Faso', code: 'BF', phoneCode: '+226' },
  { name: 'Burundi', code: 'BI', phoneCode: '+257' },
  { name: 'Cameroun', code: 'CM', phoneCode: '+237' },
  { name: 'Canada', code: 'CA', phoneCode: '+1' },
  { name: 'Cap-Vert', code: 'CV', phoneCode: '+238' },
  { name: 'Chili', code: 'CL', phoneCode: '+56' },
  { name: 'Chine', code: 'CN', phoneCode: '+86' },
  { name: 'Chypre', code: 'CY', phoneCode: '+357' },
  { name: 'Colombie', code: 'CO', phoneCode: '+57' },
  { name: 'Comores', code: 'KM', phoneCode: '+269' },
  { name: 'Congo', code: 'CG', phoneCode: '+242' },
  { name: 'Congo (RDC)', code: 'CD', phoneCode: '+243' },
  { name: 'Corée du Nord', code: 'KP', phoneCode: '+850' },
  { name: 'Corée du Sud', code: 'KR', phoneCode: '+82' },
  { name: 'Costa Rica', code: 'CR', phoneCode: '+506' },
  { name: 'Côte d\'Ivoire', code: 'CI', phoneCode: '+225' },
  { name: 'Croatie', code: 'HR', phoneCode: '+385' },
  { name: 'Cuba', code: 'CU', phoneCode: '+53' },
  { name: 'Danemark', code: 'DK', phoneCode: '+45' },
  { name: 'Djibouti', code: 'DJ', phoneCode: '+253' },
  { name: 'Dominique', code: 'DM', phoneCode: '+1-767' },
  { name: 'Égypte', code: 'EG', phoneCode: '+20' },
  { name: 'Émirats arabes unis', code: 'AE', phoneCode: '+971' },
  { name: 'Équateur', code: 'EC', phoneCode: '+593' },
  { name: 'Érythrée', code: 'ER', phoneCode: '+291' },
  { name: 'Espagne', code: 'ES', phoneCode: '+34' },
  { name: 'Estonie', code: 'EE', phoneCode: '+372' },
  { name: 'Eswatini', code: 'SZ', phoneCode: '+268' },
  { name: 'États-Unis', code: 'US', phoneCode: '+1' },
  { name: 'Éthiopie', code: 'ET', phoneCode: '+251' },
  { name: 'Fidji', code: 'FJ', phoneCode: '+679' },
  { name: 'Finlande', code: 'FI', phoneCode: '+358' },
  { name: 'France', code: 'FR', phoneCode: '+33' },
  { name: 'Gabon', code: 'GA', phoneCode: '+241' },
  { name: 'Gambie', code: 'GM', phoneCode: '+220' },
  { name: 'Géorgie', code: 'GE', phoneCode: '+995' },
  { name: 'Géorgie du Sud-et-les Îles Sandwich du Sud', code: 'GS', phoneCode: '+500' },
  { name: 'Ghana', code: 'GH', phoneCode: '+233' },
  { name: 'Gibraltar', code: 'GI', phoneCode: '+350' },
  { name: 'Grèce', code: 'GR', phoneCode: '+30' },
  { name: 'Grenade', code: 'GD', phoneCode: '+1-473' },
  { name: 'Guatemala', code: 'GT', phoneCode: '+502' },
  { name: 'Guinée', code: 'GN', phoneCode: '+224' },
  { name: 'Guinée équatoriale', code: 'GQ', phoneCode: '+240' },
  { name: 'Guinée-Bissau', code: 'GW', phoneCode: '+245' },
  { name: 'Guyana', code: 'GY', phoneCode: '+592' },
  { name: 'Haïti', code: 'HT', phoneCode: '+509' },
  { name: 'Honduras', code: 'HN', phoneCode: '+504' },
  { name: 'Hong Kong', code: 'HK', phoneCode: '+852' },
  { name: 'Hongrie', code: 'HU', phoneCode: '+36' },
  { name: 'Île Christmas', code: 'CX', phoneCode: '+61' },
  { name: 'Île Norfolk', code: 'NF', phoneCode: '+672' },
  { name: 'Îles Åland', code: 'AX', phoneCode: '+358' },
  { name: 'Îles Cocos', code: 'CC', phoneCode: '+61' },
  { name: 'Îles Cook', code: 'CK', phoneCode: '+682' },
  { name: 'Îles Féroé', code: 'FO', phoneCode: '+298' },
  { name: 'Îles Fidji', code: 'FJ', phoneCode: '+679' },
  { name: 'Îles Malouines', code: 'FK', phoneCode: '+500' },
  { name: 'Îles Mariannes du Nord', code: 'MP', phoneCode: '+1-670' },
  { name: 'Îles Marshall', code: 'MH', phoneCode: '+692' },
  { name: 'Îles Salomon', code: 'SB', phoneCode: '+677' },
  { name: 'Îles Turques-et-Caïques', code: 'TC', phoneCode: '+1-649' },
  { name: 'Îles Vierges américaines', code: 'VI', phoneCode: '+1-340' },
  { name: 'Îles Vierges britanniques', code: 'VG', phoneCode: '+1-284' },
  { name: 'Inde', code: 'IN', phoneCode: '+91' },
  { name: 'Indonésie', code: 'ID', phoneCode: '+62' },
  { name: 'Irak', code: 'IQ', phoneCode: '+964' },
  { name: 'Iran', code: 'IR', phoneCode: '+98' },
  { name: 'Irlande', code: 'IE', phoneCode: '+353' },
  { name: 'Islande', code: 'IS', phoneCode: '+354' },
  { name: 'Israël', code: 'IL', phoneCode: '+972' },
  { name: 'Italie', code: 'IT', phoneCode: '+39' },
  { name: 'Jamaïque', code: 'JM', phoneCode: '+1-876' },
  { name: 'Japon', code: 'JP', phoneCode: '+81' },
  { name: 'Jordanie', code: 'JO', phoneCode: '+962' },
  { name: 'Kazakhstan', code: 'KZ', phoneCode: '+7' },
  { name: 'Kenya', code: 'KE', phoneCode: '+254' },
  { name: 'Kirghizistan', code: 'KG', phoneCode: '+996' },
  { name: 'Kiribati', code: 'KI', phoneCode: '+686' },
  { name: 'Koweït', code: 'KW', phoneCode: '+965' },
  { name: 'Laos', code: 'LA', phoneCode: '+856' },
  { name: 'Lesotho', code: 'LS', phoneCode: '+266' },
  { name: 'Lettonie', code: 'LV', phoneCode: '+371' },
  { name: 'Liban', code: 'LB', phoneCode: '+961' },
  { name: 'Libéria', code: 'LR', phoneCode: '+231' },
  { name: 'Libye', code: 'LY', phoneCode: '+218' },
  { name: 'Liechtenstein', code: 'LI', phoneCode: '+423' },
  { name: 'Lithuanie', code: 'LT', phoneCode: '+370' },
  { name: 'Luxembourg', code: 'LU', phoneCode: '+352' },
  { name: 'Macédoine du Nord', code: 'MK', phoneCode: '+389' },
  { name: 'Madagascar', code: 'MG', phoneCode: '+261' },
  { name: 'Malaisie', code: 'MY', phoneCode: '+60' },
  { name: 'Malawi', code: 'MW', phoneCode: '+265' },
  { name: 'Maldives', code: 'MV', phoneCode: '+960' },
  { name: 'Mali', code: 'ML', phoneCode: '+223' },
  { name: 'Malte', code: 'MT', phoneCode: '+356' },
  { name: 'Maroc', code: 'MA', phoneCode: '+212' },
  { name: 'Maurice', code: 'MU', phoneCode: '+230' },
  { name: 'Mauritanie', code: 'MR', phoneCode: '+222' },
  { name: 'Mexique', code: 'MX', phoneCode: '+52' },
  { name: 'Micronésie', code: 'FM', phoneCode: '+691' },
  { name: 'Moldavie', code: 'MD', phoneCode: '+373' },
  { name: 'Monaco', code: 'MC', phoneCode: '+377' },
  { name: 'Mongolie', code: 'MN', phoneCode: '+976' },
  { name: 'Monténégro', code: 'ME', phoneCode: '+382' },
  { name: 'Mozambique', code: 'MZ', phoneCode: '+258' },
  { name: 'Myanmar (Birmanie)', code: 'MM', phoneCode: '+95' },
  { name: 'Namibie', code: 'NA', phoneCode: '+264' },
  { name: 'Nauru', code: 'NR', phoneCode: '+674' },
  { name: 'Népal', code: 'NP', phoneCode: '+977' },
  { name: 'Nicaragua', code: 'NI', phoneCode: '+505' },
  { name: 'Niger', code: 'NE', phoneCode: '+227' },
  { name: 'Nigeria', code: 'NG', phoneCode: '+234' },
  { name: 'Norvège', code: 'NO', phoneCode: '+47' },
  { name: 'Nouvelle-Zélande', code: 'NZ', phoneCode: '+64' },
  { name: 'Oman', code: 'OM', phoneCode: '+968' },
  { name: 'Ouganda', code: 'UG', phoneCode: '+256' },
  { name: 'Ouzbékistan', code: 'UZ', phoneCode: '+998' },
  { name: 'Pakistan', code: 'PK', phoneCode: '+92' },
  { name: 'Palaos', code: 'PW', phoneCode: '+680' },
  { name: 'Panama', code: 'PA', phoneCode: '+507' },
  { name: 'Papouasie-Nouvelle-Guinée', code: 'PG', phoneCode: '+675' },
  { name: 'Paraguay', code: 'PY', phoneCode: '+595' },
  { name: 'Pays-Bas', code: 'NL', phoneCode: '+31' },
  { name: 'Pérou', code: 'PE', phoneCode: '+51' },
  { name: 'Philippines', code: 'PH', phoneCode: '+63' },
  { name: 'Pologne', code: 'PL', phoneCode: '+48' },
  { name: 'Portugal', code: 'PT', phoneCode: '+351' },
  { name: 'Qatar', code: 'QA', phoneCode: '+974' },
  { name: 'Royaume-Uni', code: 'GB', phoneCode: '+44' },
  { name: 'République centrafricaine', code: 'CF', phoneCode: '+236' },
  { name: 'République de Corée', code: 'KR', phoneCode: '+82' },
  { name: 'République de Chypre', code: 'CY', phoneCode: '+357' },
  { name: 'République de Croatie', code: 'HR', phoneCode: '+385' },
  { name: 'République de Géorgie', code: 'GE', phoneCode: '+995' },
  { name: 'République de Lituanie', code: 'LT', phoneCode: '+370' },
  { name: 'République de Malte', code: 'MT', phoneCode: '+356' },
  { name: 'République de Moldavie', code: 'MD', phoneCode: '+373' },
  { name: 'République de Pologne', code: 'PL', phoneCode: '+48' },
  { name: 'République de Serbie', code: 'RS', phoneCode: '+381' },
  { name: 'République de Slovaquie', code: 'SK', phoneCode: '+421' },
  { name: 'République de Slovénie', code: 'SI', phoneCode: '+386' },
  { name: 'République de Tanzanie', code: 'TZ', phoneCode: '+255' },
  { name: 'République démocratique du Congo', code: 'CD', phoneCode: '+243' },
  { name: 'République dominicaine', code: 'DO', phoneCode: '+1-809' },
  { name: 'République populaire démocratique de Corée', code: 'KP', phoneCode: '+850' },
  { name: 'République tchèque', code: 'CZ', phoneCode: '+420' },
  { name: 'République slovaque', code: 'SK', phoneCode: '+421' },
  { name: 'Réunion', code: 'RE', phoneCode: '+262' },
  { name: 'Roumanie', code: 'RO', phoneCode: '+40' },
  { name: 'Royaume-Uni de Grande-Bretagne et d\'Irlande du Nord', code: 'GB', phoneCode: '+44' },
  { name: 'Russie', code: 'RU', phoneCode: '+7' },
  { name: 'Rwanda', code: 'RW', phoneCode: '+250' },
  { name: 'Saint-Christophe-et-Niévès', code: 'KN', phoneCode: '+1-869' },
  { name: 'Sainte-Hélène, Ascension et Tristan da Cunha', code: 'SH', phoneCode: '+290' },
  { name: 'Sainte-Lucie', code: 'LC', phoneCode: '+1-758' },
  { name: 'Saint-Marin', code: 'SM', phoneCode: '+378' },
  { name: 'Saint-Pierre-et-Miquelon', code: 'PM', phoneCode: '+508' },
  { name: 'Saint-Vincent-et-les-Grenadines', code: 'VC', phoneCode: '+1-784' },
  { name: 'Sainte-Lucie', code: 'LC', phoneCode: '+1-758' },
  { name: 'Saint-Vincent-et-les-Grenadines', code: 'VC', phoneCode: '+1-784' },
  { name: 'Samoa', code: 'WS', phoneCode: '+685' },
  { name: 'Saint-Kitts-et-Nevis', code: 'KN', phoneCode: '+1-869' },
  { name: 'Sainte-Lucie', code: 'LC', phoneCode: '+1-758' },
  { name: 'Saint-Marin', code: 'SM', phoneCode: '+378' },
  { name: 'Saint-Vincent-et-les-Grenadines', code: 'VC', phoneCode: '+1-784' },
  { name: 'Samoa', code: 'WS', phoneCode: '+685' },
  { name: 'Sao Tomé-et-Principe', code: 'ST', phoneCode: '+239' },
  { name: 'Sénégal', code: 'SN', phoneCode: '+221' },
  { name: 'Serbie', code: 'RS', phoneCode: '+381' },
  { name: 'Seychelles', code: 'SC', phoneCode: '+248' },
  { name: 'Sierra Leone', code: 'SL', phoneCode: '+232' },
  { name: 'Singapour', code: 'SG', phoneCode: '+65' },
  { name: 'Slovaquie', code: 'SK', phoneCode: '+421' },
  { name: 'Slovénie', code: 'SI', phoneCode: '+386' },
  { name: 'Somalie', code: 'SO', phoneCode: '+252' },
  { name: 'Soudan', code: 'SD', phoneCode: '+249' },
  { name: 'Soudan du Sud', code: 'SS', phoneCode: '+211' },
  { name: 'Sri Lanka', code: 'LK', phoneCode: '+94' },
  { name: 'Suède', code: 'SE', phoneCode: '+46' },
  { name: 'Suisse', code: 'CH', phoneCode: '+41' },
  { name: 'Suriname', code: 'SR', phoneCode: '+597' },
  { name: 'Syrie', code: 'SY', phoneCode: '+963' },
  { name: 'Tadjikistan', code: 'TJ', phoneCode: '+992' },
  { name: 'Taïwan', code: 'TW', phoneCode: '+886' },
  { name: 'Tanzanie', code: 'TZ', phoneCode: '+255' },
  { name: 'Tchad', code: 'TD', phoneCode: '+235' },
  { name: 'Terres australes et antarctiques françaises', code: 'TF', phoneCode: '+262' },
  { name: 'Territoire britannique de l\'océan Indien', code: 'IO', phoneCode: '+246' },
  { name: 'Territoire palestinien occupé', code: 'PS', phoneCode: '+970' },
  { name: 'Thaïlande', code: 'TH', phoneCode: '+66' },
  { name: 'Timor oriental', code: 'TL', phoneCode: '+670' },
  { name: 'Togo', code: 'TG', phoneCode: '+228' },
  { name: 'Tonga', code: 'TO', phoneCode: '+676' },
  { name: 'Trinité-et-Tobago', code: 'TT', phoneCode: '+1-868' },
  { name: 'Tunisie', code: 'TN', phoneCode: '+216' },
  { name: 'Turkménistan', code: 'TM', phoneCode: '+993' },
  { name: 'Turquie', code: 'TR', phoneCode: '+90' },
  { name: 'Tuvalu', code: 'TV', phoneCode: '+688' },
  { name: 'Ukraine', code: 'UA', phoneCode: '+380' },
  { name: 'Uruguay', code: 'UY', phoneCode: '+598' },
  { name: 'Vanuatu', code: 'VU', phoneCode: '+678' },
  { name: 'Vatican', code: 'VA', phoneCode: '+39' },
  { name: 'Venezuela', code: 'VE', phoneCode: '+58' },
  { name: 'Viêt Nam', code: 'VN', phoneCode: '+84' },
  { name: 'Yémen', code: 'YE', phoneCode: '+967' },
  { name: 'Zambie', code: 'ZM', phoneCode: '+260' },
  { name: 'Zimbabwe', code: 'ZW', phoneCode: '+263' },
  { name: 'Pays inconnu', code: 'XX', phoneCode: '' }
];

export function CompleteProfilePage() {
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedCountryData, setSelectedCountryData] = useState<Country | null>(null);

  const { user, profile, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (country) {
      const countryData = countries.find(c => c.name === country);
      setSelectedCountryData(countryData || null);
      
      // Si un indicatif existe et que le téléphone ne commence pas déjà par cet indicatif
      if (countryData?.phoneCode && !phone.startsWith(countryData.phoneCode)) {
        setPhone(countryData.phoneCode);
      }
    }
  }, [country]);

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