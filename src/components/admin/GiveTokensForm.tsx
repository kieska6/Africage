import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Coins } from 'lucide-react';

export function GiveTokensForm() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [checkEmail, setCheckEmail] = useState('');
  const [checkLoading, setCheckLoading] = useState(false);
  const [balanceResult, setBalanceResult] = useState<string | null>(null);

  const handleGiveTokens = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (userError || !userData) throw new Error("Utilisateur non trouvé.");

      const { error: rpcError } = await supabase.rpc('add_tokens_to_user', {
        user_id_input: userData.id,
        tokens_to_add: parseInt(amount, 10),
      });

      if (rpcError) throw rpcError;

      setSuccess(`${amount} tokens ont été ajoutés avec succès à ${email}.`);
      setEmail('');
      setAmount('');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckLoading(true);
    setBalanceResult(null);
    setError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('token_balance')
        .eq('email', checkEmail)
        .single();

      if (fetchError || !data) throw new Error("Utilisateur non trouvé.");
      
      setBalanceResult(`Solde de ${checkEmail}: ${data.token_balance} tokens.`);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setCheckLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
        <Coins className="w-5 h-5 mr-2 text-primary" />
        Gérer les Tokens
      </h3>
      
      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      {/* Check Balance Form */}
      <form onSubmit={handleCheckBalance} className="space-y-4 mb-6 pb-6 border-b">
        <h4 className="font-medium">Vérifier le solde d'un utilisateur</h4>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-grow">
            <Input
              label="Email de l'utilisateur"
              type="email"
              value={checkEmail}
              onChange={(e) => setCheckEmail(e.target.value)}
              placeholder="utilisateur@exemple.com"
            />
          </div>
          <Button type="submit" loading={checkLoading} variant="outline">
            Vérifier
          </Button>
        </div>
        {balanceResult && <p className="text-green-700 font-semibold mt-2">{balanceResult}</p>}
      </form>

      {/* Give Tokens Form */}
      <form onSubmit={handleGiveTokens} className="space-y-4">
        <h4 className="font-medium">Attribuer des tokens</h4>
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
          required
        />
        <Button type="submit" loading={loading} className="w-full sm:w-auto">
          Attribuer les tokens
        </Button>
      </form>
    </div>
  );
}