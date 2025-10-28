import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import { GoogleIcon } from '../ui/GoogleIcon';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
    } else {
      navigate('/dashboard');
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Se connecter</h2>
        
        {error && (
          <div className="mb-4">
            <Alert type="error" message={error} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="votre@email.com"
          />

          <Input
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />

          <Button
            type="submit"
            loading={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            Se connecter
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-neutral-500">OU</span>
          </div>
        </div>

        <div>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
            onClick={handleGoogleSignIn}
            loading={googleLoading}
          >
            <GoogleIcon className="mr-2" />
            Continuer avec Google
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-600">
            Pas encore de compte ?{' '}
            <Link to="/signup" className="text-primary hover:text-primary/90 font-medium">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}