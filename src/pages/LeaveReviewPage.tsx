import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { LeaveReviewForm } from '../components/reviews/LeaveReviewForm';
import { Loader2, ServerCrash } from 'lucide-react';

interface TransactionDetails {
  id: string;
  sender_id: string;
  traveler_id: string;
}

export function LeaveReviewPage() {
  const { transactionId } = useParams<{ transactionId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState<TransactionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!transactionId) return;

      try {
        const { data, error: fetchError } = await supabase
          .from('transactions')
          .select('id, sender_id, traveler_id')
          .eq('id', transactionId)
          .single();

        if (fetchError) throw fetchError;
        setTransaction(data);
      } catch (err: any) {
        setError("Impossible de charger les détails de la transaction.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>;
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12 px-4 text-center">
        <ServerCrash className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-red-700">Erreur</h3>
        <p className="text-red-600 mt-2">{error || "Transaction non trouvée."}</p>
      </div>
    );
  }

  const revieweeId = user?.id === transaction.sender_id ? transaction.traveler_id : transaction.sender_id;

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800">Laisser un avis</h1>
          <p className="text-lg text-neutral-600 mt-2">Partagez votre expérience pour aider la communauté.</p>
        </div>
        <div className="bg-white rounded-4xl shadow-xl p-8">
          {user && (
            <LeaveReviewForm
              transactionId={transaction.id}
              revieweeId={revieweeId}
              reviewerId={user.id}
              onReviewSubmitted={() => navigate('/dashboard')}
            />
          )}
        </div>
      </div>
    </div>
  );
}