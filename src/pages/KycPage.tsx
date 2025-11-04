import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { Loader2, ShieldCheck, Clock, AlertCircle, UploadCloud } from 'lucide-react';

export function KycPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [kycStatus, setKycStatus] = useState(profile?.kyc_status);

  useEffect(() => {
    setKycStatus(profile?.kyc_status);
  }, [profile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;

    setLoading(true);
    setError('');

    try {
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('kyc-documents')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('users')
        .update({
          kyc_status: 'PENDING_REVIEW',
          kyc_document_url: urlData.publicUrl,
        })
        .eq('id', user.id);

      if (dbError) throw dbError;

      setKycStatus('PENDING_REVIEW');
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors du téléversement.");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (authLoading) {
      return <div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    switch (kycStatus) {
      case 'VERIFIED':
        return (
          <div className="text-center">
            <ShieldCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-neutral-800">Identité Vérifiée</h2>
            <p className="text-neutral-600 mt-2">Votre identité a été vérifiée avec succès. Merci !</p>
          </div>
        );
      case 'PENDING_REVIEW':
        return (
          <div className="text-center">
            <Clock className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-neutral-800">Vérification en cours</h2>
            <p className="text-neutral-600 mt-2">Votre document est en cours de vérification par notre équipe. Cela prend généralement 24 à 48 heures.</p>
          </div>
        );
      case 'REJECTED':
      case 'NOT_SUBMITTED':
      default:
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            {kycStatus === 'REJECTED' && (
              <Alert type="error" title="Document Rejeté" message="Votre précédent document n'a pas pu être validé. Veuillez en soumettre un nouveau." />
            )}
            {error && <Alert type="error" message={error} />}
            <div>
              <label htmlFor="kyc-file" className="block text-sm font-medium text-neutral-700 mb-2">
                Votre document d'identité (CNI, Passeport)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-neutral-400" />
                  <div className="flex text-sm text-neutral-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none">
                      <span>Téléversez un fichier</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, application/pdf" />
                    </label>
                    <p className="pl-1">ou glissez-déposez</p>
                  </div>
                  <p className="text-xs text-neutral-500">PNG, JPG, PDF jusqu'à 5MB</p>
                </div>
              </div>
              {file && <p className="text-sm text-neutral-600 mt-2">Fichier sélectionné : {file.name}</p>}
            </div>
            <Button type="submit" loading={loading} disabled={!file} className="w-full">
              Soumettre pour vérification
            </Button>
          </form>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800">Vérification d'Identité</h1>
          <p className="text-lg text-neutral-600 mt-2">Pour la sécurité de tous, nous devons vérifier votre identité.</p>
        </div>
        <div className="bg-white rounded-4xl shadow-xl p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}