import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Loader2, ServerCrash, MapPin, Ruler, Weight, User } from 'lucide-react';
import { Alert } from '../components/ui/Alert';
import { LeaveReviewForm } from '../components/reviews/LeaveReviewForm';

interface UserProfile {
  first_name: string;
  last_name: string;
  profile_picture: string | null;
}

interface Shipment {
  id: string;
  sender_id: string;
  title: string;
  description: string;
  pickup_city: string;
  delivery_city: string;
  proposed_price: number;
  currency: string;
  weight: number;
  length: number | null;
  width: number | null;
  height: number | null;
  created_at: string;
  status: string;
  sender: UserProfile | null;
}

interface Review {
  id: string;
  transaction_id: string;
  reviewee_id: string;
  reviewer_id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: UserProfile;
}

export function ShipmentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [conversation, setConversation] = useState<any>(null);

  useEffect(() => {
    const fetchShipmentAndReviews = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch shipment details
        const { data, error: fetchError } = await supabase
          .from('shipments')
          .select('*, sender:users!sender_id(first_name, last_name, profile_picture)')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error("Annonce non trouvée");

        setShipment(data as Shipment);

        // Fetch reviews for this shipment
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*, reviewer:users!reviews_reviewer_id_fkey(first_name, last_name)')
          .eq('transaction_id', id);

        if (reviewsError) throw reviewsError;
        setReviews(reviewsData as Review[]);

        // Check if current user has already reviewed
        if (user) {
          const userHasReviewed = reviewsData?.some(review => review.reviewer_id === user.id);
          setHasUserReviewed(!!userHasReviewed);
        }

        // Check if there's a conversation for this shipment
        if (user) {
          const { data: convoData, error: convoError } = await supabase
            .from('conversations')
            .select('*')
            .eq('shipment_id', id)
            .in('sender_id', [user.id])
            .single();

          if (!convoError && convoData) {
            setConversation(convoData);
          }
        }

      } catch (err: any) {
        setError("Impossible de charger les détails de l'annonce.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShipmentAndReviews();
  }, [id, user]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 text-center">
        <ServerCrash className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-red-700">Une erreur est survenue</h3>
        <p className="text-red-600 mt-2">{error}</p>
      </div>
    );
  }

  if (!shipment) {
    return <div className="text-center py-20">Annonce non trouvée.</div>;
  }

  // Vérifier si l'utilisateur peut laisser un avis
  const canLeaveReview = 
    user && 
    shipment.status === 'COMPLETED' && 
    !hasUserReviewed && 
    (user.id === shipment.sender_id);

  // Vérifier si on doit afficher le bouton de conversation
  const canShowChatButton = 
    user && 
    (shipment.status === 'IN_TRANSIT' || shipment.status === 'COMPLETED') && 
    (user.id === shipment.sender_id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-4xl shadow-xl p-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-800">{shipment.title}</h1>
              <p className="text-neutral-500 mt-2">Publié le {new Date(shipment.created_at).toLocaleDateString('fr-FR')}</p>
            </div>
            <div className="mt-4 md:mt-0 text-2xl font-bold text-green-600">
              {shipment.proposed_price.toLocaleString()} {shipment.currency}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-neutral-800 mb-2">Description</h2>
                <p className="text-neutral-600 leading-relaxed">{shipment.description || "Aucune description fournie."}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-800 mb-4">Détails du colis</h2>
                <div className="grid grid-cols-2 gap-4 text-neutral-700">
                  <div className="flex items-center"><Weight className="w-5 h-5 mr-2 text-accent" /> Poids: <strong>{shipment.weight} kg</strong></div>
                  {shipment.length && <div className="flex items-center"><Ruler className="w-5 h-5 mr-2 text-accent" /> Dimensions: <strong>{shipment.length}x{shipment.width}x{shipment.height} cm</strong></div>}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-800 mb-4">Itinéraire</h2>
                <div className="flex items-center text-neutral-700">
                  <MapPin className="w-5 h-5 mr-2 text-accent" />
                  De <strong>{shipment.pickup_city}</strong> à <strong>{shipment.delivery_city}</strong>
                </div>
              </div>
              
              {/* Section des avis existants */}
              {reviews.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-4">Avis sur cet envoi</h3>
                  <div className="space-y-4">
                    {reviews.map(review => (
                      <div key={review.id} className="bg-neutral-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold">{review.reviewer.first_name} {review.reviewer.last_name}</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-neutral-300'}`} viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-neutral-600 italic">"{review.comment}"</p>
                        <p className="text-xs text-neutral-500 mt-2">{formatDate(review.created_at)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="md:col-span-1 space-y-6">
              <div className="bg-neutral-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4 text-center">Expéditeur</h3>
                <div className="flex flex-col items-center text-center">
                  {shipment.sender && shipment.sender.profile_picture ? (
                    <img src={shipment.sender.profile_picture} alt="Expéditeur" className="w-20 h-20 rounded-full mb-3" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-neutral-200 flex items-center justify-center mx-auto mb-3">
                      <User className="w-10 h-10 text-neutral-500" />
                    </div>
                  )}
                  <Link to={`/users/${shipment.sender_id}`} className="font-bold text-neutral-900 hover:text-accent transition-colors">
                    {shipment.sender ? `${shipment.sender.first_name} ${shipment.sender.last_name}` : 'Utilisateur inconnu'}
                  </Link>
                </div>
              </div>

              {/* Bouton de conversation */}
              {canShowChatButton && conversation && (
                <Link 
                  to={`/messages/${conversation.id}`}
                  className="block bg-primary text-white text-center py-3 px-4 rounded-2xl hover:bg-primary/90 transition-colors font-semibold"
                >
                  Voir la conversation
                </Link>
              )}
            </div>
          </div>

          {/* Formulaire de notation - seulement si les conditions sont remplies */}
          {canLeaveReview && (
            <div className="mt-8 pt-8 border-t border-neutral-200">
              <h3 className="text-2xl font-semibold text-neutral-800 mb-6">Laisser un avis</h3>
              <LeaveReviewForm
                transactionId={shipment.id}
                revieweeId={shipment.sender_id}
                reviewerId={user.id}
                onReviewSubmitted={() => {
                  // Rafraîchir la page après soumission
                  window.location.reload();
                }}
              />
            </div>
          )}

          {/* Message si l'envoi n'est pas terminé */}
          {!canLeaveReview && user && shipment.status !== 'COMPLETED' && (
            <div className="mt-8 pt-8 border-t border-neutral-200">
              <Alert type="info" message="Vous ne pouvez laisser un avis que lorsque l'envoi est terminé." />
            </div>
          )}

          {/* Message si l'utilisateur a déjà laissé un avis */}
          {!canLeaveReview && user && hasUserReviewed && (
            <div className="mt-8 pt-8 border-t border-neutral-200">
              <Alert type="success" message="Vous avez déjà laissé un avis pour cet envoi. Merci !" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}