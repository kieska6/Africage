import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Loader2, UserCheck, UserX, FileText } from 'lucide-react';

interface PendingUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  kyc_document_url: string;
}

export function KycReviewPanel() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPendingUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('id, first_name, last_name, email, kyc_document_url')
        .eq('kyc_status', 'PENDING_REVIEW');

      if (fetchError) throw fetchError;
      setPendingUsers(data || []);
    } catch (err: any) {
      setError("Impossible de charger les demandes de vérification.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingUsers();
  }, [fetchPendingUsers]);

  const handleReview = async (userId: string, newStatus: 'VERIFIED' | 'REJECTED') => {
    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({ kyc_status: newStatus })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Refresh the list
      fetchPendingUsers();
    } catch (err: any) {
      setError(`Erreur lors de la mise à jour du statut de l'utilisateur ${userId}.`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
        <UserCheck className="w-5 h-5 mr-2 text-primary" />
        Vérifications d'Identité en Attente
      </h3>
      {error && <Alert type="error" message={error} />}
      
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : pendingUsers.length === 0 ? (
        <p className="text-neutral-500 text-center py-4">Aucune demande de vérification en attente.</p>
      ) : (
        <div className="space-y-4">
          {pendingUsers.map(user => (
            <div key={user.id} className="bg-neutral-50 p-4 rounded-md border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <p className="font-semibold text-neutral-800">{user.first_name} {user.last_name}</p>
                <p className="text-sm text-neutral-600">{user.email}</p>
                <a
                  href={user.kyc_document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center mt-1"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Voir le document
                </a>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-green-500 text-green-500 hover:bg-green-50"
                  onClick={() => handleReview(user.id, 'VERIFIED')}
                >
                  <UserCheck className="w-4 h-4 mr-1" /> Approuver
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                  onClick={() => handleReview(user.id, 'REJECTED')}
                >
                  <UserX className="w-4 h-4 mr-1" /> Rejeter
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}