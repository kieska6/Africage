import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Alert } from '../components/ui/Alert';
import { Loader2, UploadCloud } from 'lucide-react';
import countriesData from '../data/countries+cities.json';

interface Country {
  name: string;
  iso2: string;
  cities: string[];
}

export function CompleteProfilePage() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const countries: Country[] = (countriesData as Country[]).sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    if (!authLoading && profile?.is_profile_complete) {
      navigate('/dashboard');
    }
  }, [profile, authLoading, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      let avatarUrl = profile?.profile_avatar_url || null;

      if (avatarFile) {
        const filePath = `public/${user.id}/${Date.now()}_${avatarFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        
        avatarUrl = urlData.publicUrl;
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({
          phone_number: phoneNumber,
          country: country,
          date_of_birth: dateOfBirth,
          profile_avatar_url: avatarUrl,
          is_profile_complete: true,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Force a refresh of the session to get the new profile data
      await supabase.auth.refreshSession();
      navigate('/dashboard');

    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !profile) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800">
            Bienvenue, {profile.first_name}!
          </h1>
          <p className="text-lg text-neutral-600 mt-2">
            Encore une étape pour sécuriser votre compte et commencer.
          </p>
        </div>
        <div className="bg-white rounded-4xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <Alert type="error" message={error} />}
            
            <Input
              label="Numéro de téléphone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              placeholder="+XX XXX XXX XXX"
            />

            <Select
              label="Pays de résidence"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            >
              <option value="" disabled>Sélectionnez votre pays</option>
              {countries.map(c => <option key={c.iso2} value={c.name}>{c.name}</option>)}
            </Select>

            <Input
              label="Date de naissance"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Photo de profil (optionnel)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-neutral-400" />
                  <div className="flex text-sm text-neutral-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80">
                      <span>Téléversez un fichier</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                    </label>
                  </div>
                  <p className="text-xs text-neutral-500">PNG, JPG, GIF jusqu'à 2MB</p>
                </div>
              </div>
              {avatarFile && <p className="text-sm text-neutral-600 mt-2">Fichier : {avatarFile.name}</p>}
            </div>

            <Button type="submit" loading={loading} className="w-full py-3 text-base font-semibold">
              Terminer mon profil
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}