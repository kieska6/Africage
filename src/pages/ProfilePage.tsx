import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Loader2, ServerCrash, User, Star, Package, Briefcase, Edit, ShieldCheck, List, HelpCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Interfaces
interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  profile_picture: string | null;
  is_identity_verified: boolean;
}

interface Stats {
  sentCount: number;
  transportedCount: number;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: {
    first_name: string;
    last_name: string;
  }
}

const StatCard = ({ icon, value, label, colorClass }: { icon: React.ReactNode, value: number, label: string, colorClass: string }) => (
  <div className="text-center">
    <div className={`text-3xl font-bold ${colorClass}`}>{value}</div>
    <div className="text-sm text-neutral-500 mt-1">{label}</div>
  </div>
);

const ActionButton = ({ icon, label, to }: { icon: React.ReactNode, label: string, to: string }) => (
  <Link to={to} className="flex items-center justify-between p-4 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors">
    <div className="flex items-center">
      {icon}
      <span className="ml-3 font-medium text-neutral-700">{label}</span>
    </div>
    <ChevronRight className="w-5 h-5 text-neutral-400" />
  </Link>
);

export function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats>({ sentCount: 0, transportedCount: 0 });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError('');

        const [profileRes, sentRes, transportedRes, reviewsRes] = await Promise.all([
          supabase.from('users').select('*').eq('id', user.id).single(),
          supabase.from('shipments').select('id', { count: 'exact' }).eq('sender_id', user.id),
          supabase.from('trips').select('id', { count: 'exact' }).eq('traveler_id', user.id),
          supabase.from('reviews').select('*, reviewer:users!reviews_reviewer_id_fkey(first_name, last_name)').eq('reviewee_id', user.id).order('created_at', { ascending: false }).limit(2)
        ]);

        if (profileRes.error) throw new Error("Profil non trouvé.");
        setProfile(profileRes.data);

        setStats({
          sentCount: sentRes.count || 0,
          transportedCount: transportedRes.count || 0,
        });

        if (reviewsRes.error) throw reviewsRes.error;
        setReviews(reviewsRes.data as Review[] || []);

      } catch (err: any) {
        setError("Impossible de charger les informations du profil.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div>;
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12 px-4 text-center">
        <ServerCrash className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-red-700">Erreur</h3>
        <p className="text-red-600 mt-2">{error || "Profil non trouvé."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white text-center py-8 px-4">
          {profile.profile_picture ? (
            <img src={profile.profile_picture} alt="Profil" className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-neutral-200 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
              <User className="w-12 h-12 text-neutral-500" />
            </div>
          )}
          <h1 className="text-2xl font-bold text-neutral-800">{profile.first_name} {profile.last_name}</h1>
          <p className="text-neutral-500 mt-1">{profile.phone || "Numéro non renseigné"}</p>
          {profile.is_identity_verified && (
            <div className="inline-flex items-center bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full mt-3">
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              Identité vérifiée
            </div>
          )}
          <div className="flex justify-center items-center mt-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.round(Number(averageRating)) ? 'text-yellow-400 fill-current' : 'text-neutral-300'}`} />
              ))}
            </div>
            <span className="ml-2 font-bold text-neutral-700">{averageRating}/5</span>
            <span className="ml-1.5 text-neutral-500">({reviews.length} avis)</span>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Stats Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">Statistiques</h2>
            <div className="grid grid-cols-2 gap-4">
              <StatCard icon={<Package />} value={stats.sentCount} label="Colis envoyés" colorClass="text-primary" />
              <StatCard icon={<Briefcase />} value={stats.transportedCount} label="Colis transportés" colorClass="text-accent" />
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">Actions</h2>
            <div className="space-y-3">
              <ActionButton icon={<Edit className="w-5 h-5 text-neutral-500" />} label="Modifier le profil" to="/edit-profile" />
              <ActionButton icon={<ShieldCheck className="w-5 h-5 text-neutral-500" />} label="Vérifier l'identité" to="/verify-identity" />
              <ActionButton icon={<List className="w-5 h-5 text-neutral-500" />} label="Historique des transactions" to="/history" />
              <ActionButton icon={<HelpCircle className="w-5 h-5 text-neutral-500" />} label="Aide & Support" to="/support" />
            </div>
          </div>

          {/* Reviews Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">Derniers avis reçus</h2>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="border-l-4 border-primary pl-4">
                    <div className="flex justify-between items-center mb-1">
                      <strong className="text-neutral-700">{review.reviewer.first_name} {review.reviewer.last_name[0]}.</strong>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-neutral-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 italic">"{review.comment}"</p>
                    <p className="text-xs text-neutral-400 mt-1">{new Date(review.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-neutral-500 py-4">Aucun avis reçu pour le moment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}