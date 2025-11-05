import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Star } from 'lucide-react';

interface LeaveReviewFormProps {
  transaction: {
    id: string;
    sender_id: string;
    traveler_id: string;
  };
  revieweeId: string;
  reviewerId: string;
  onReviewSubmitted: () => void;
}

export function LeaveReviewForm({ transaction, revieweeId, reviewerId, onReviewSubmitted }: LeaveReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Veuillez sélectionner une note.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const reviewType = reviewerId === transaction.sender_id ? 'SENDER_TO_TRAVELER' : 'TRAVELER_TO_SENDER';

      const { error: insertError } = await supabase.from('reviews').insert({
        transaction_id: transaction.id,
        reviewee_id: revieweeId,
        reviewer_id: reviewerId,
        rating,
        comment,
        type: reviewType
      });

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        onReviewSubmitted();
      }, 1500);

    } catch (err: any) {
      setError("Une erreur est survenue lors de la soumission de l'avis.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return <Alert type="success" title="Avis envoyé !" message="Merci pour votre contribution." />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert type="error" message={error} />}
      <div>
        <label className="block text-lg font-semibold text-neutral-800 mb-3">Votre note</label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
              aria-label={`Donner ${star} étoiles`}
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= rating ? 'text-yellow-400 fill-current' : 'text-neutral-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="comment" className="block text-lg font-semibold text-neutral-800 mb-3">
          Votre commentaire (optionnel)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
          className="w-full px-4 py-3 border border-neutral-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
          placeholder="Partagez votre expérience..."
        />
      </div>
      <Button type="submit" loading={loading} className="w-full py-3 text-base font-semibold">
        Soumettre l'avis
      </Button>
    </form>
  );
}