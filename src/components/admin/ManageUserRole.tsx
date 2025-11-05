import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Select } from '../ui/Select';
import { ShieldCheck } from 'lucide-react';

export function ManageUserRole() {
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('USER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 1. Find user ID from email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (userError) {
        throw userError;
      }

      if (!userData) {
        throw new Error("Utilisateur non trouvé avec cet email.");
      }

      const userId = userData.id;

      // 2. Call the RPC function to update the role
      const { error: rpcError } = await supabase.rpc('update_user_role', {
        target_user_id: userId,
        new_role: selectedRole,
      });

      if (rpcError) {
        throw rpcError;
      }

      setSuccess(`Le rôle de ${email} a été mis à jour avec succès en ${selectedRole}.`);
      setEmail('');

    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
        <ShieldCheck className="w-5 h-5 mr-2 text-primary" />
        Gérer les Rôles Utilisateurs
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}
        
        <Input
          label="Email de l'utilisateur"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="utilisateur@exemple.com"
          required
        />
        <Select
          label="Nouveau rôle"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="USER">Utilisateur</option>
          <option value="MODERATOR">Modérateur</option>
          <option value="ADMIN">Administrateur</option>
        </Select>
        <Button type="submit" loading={loading} className="w-full">
          Mettre à jour le rôle
        </Button>
      </form>
    </div>
  );
}