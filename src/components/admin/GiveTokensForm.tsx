import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';

export function GiveTokensForm() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const tokensToAdd = parseInt(amount, 10);
    if (isNaN(tokensToAdd) || tokensToAdd <= 0) {
      setError("Veuillez entrer un nombre de tokens valide.");
      setLoading(false);
      return;
    }

    try {
      // 1. Trouver l'ID de l'utilisateur à partir de son email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        throw new Error("Utilisateur non trouvé avec cet email.");
      }

      // 2. Appeler la fonction RPC pour ajouter les tokens
      const { error: rpcError } = await supabase.rpc('add_tokens_to_user', {
        user_id_input: userData.id,
        tokens_to_add: tokensToAdd,
      });

      if (rpcError) {
        throw rpcError;
      }

      setSuccess(`${tokensToAdd} token(s) attribué(s) avec succès à ${email}.`);
      setEmail('');
      setAmount('');
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
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
      <Input
        label="Nombre de tokens à donner"
        type="number"
        min="1"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Ex: 10"
        required
      />
      <Button type="submit" loading={loading}>
        Attribuer les tokens
      </Button>
    </form>
  );
}