import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import { User } from 'lucide-react';

export function UpdateProfileForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName(user.user_metadata.first_name || '');
      setLastName(user.user_metadata.last_name || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!user) {
      setError('Utilisateur non trouvé.');
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        first_name: firstName,
        last_name: lastName,
      }
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      // Also update the public users table
      const { error: publicProfileError } = await supabase
        .from('users')
        .update({ first_name: firstName, last_name: lastName })
        .eq('id', user.id);

      if (publicProfileError) {
        setError(publicProfileError.message);
      } else {
        setSuccess('Profil mis à jour avec succès !');
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-neutral-800 flex items-center">
        <User className="w-5 h-5 mr-2 text-primary" />
        Informations personnelles
      </h3>
      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          label="Prénom"
          name="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <Input
          label="Nom"
          name="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>
      <Input
        label="Email"
        name="email"
        value={user?.email || ''}
        disabled
      />
      <div className="pt-4">
        <Button type="submit" loading={loading} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white">
          Enregistrer les modifications
        </Button>
      </div>
    </form>
  );
}