import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Loader2, ServerCrash, Inbox, MessageSquare, User, Package } from 'lucide-react';

interface Participant {
  id: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
}
interface ShipmentInfo {
  title: string;
}
interface Conversation {
  id: string;
  shipment: ShipmentInfo;
  sender: Participant;
  traveler: Participant;
}

export function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('conversations')
          .select(`
            id,
            shipment:shipments(title),
            sender:users!conversations_sender_id_fkey(id, first_name, last_name, profile_picture),
            traveler:users!conversations_traveler_id_fkey(id, first_name, last_name, profile_picture)
          `)
          .or(`sender_id.eq.${user.id},traveler_id.eq.${user.id}`);

        if (fetchError) throw fetchError;
        setConversations(data as Conversation[] || []);
      } catch (err: any) {
        setError("Impossible de charger vos conversations.");
        console.error("Error fetching conversations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </div>
    );
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

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <MessageSquare className="w-8 h-8 text-accent mr-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800">Mes Messages</h1>
        </div>

        {conversations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-4xl shadow-lg">
            <Inbox className="w-16 h-16 text-neutral-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-neutral-700">Aucune conversation</h3>
            <p className="text-neutral-500 mt-2">
              Lorsqu'une offre est acceptée, une conversation est créée ici.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-4xl shadow-lg p-6 space-y-4">
            {conversations.map(convo => {
              const otherUser = user?.id === convo.sender.id ? convo.traveler : convo.sender;
              return (
                <Link
                  key={convo.id}
                  to={`/messages/${convo.id}`}
                  className="block p-4 rounded-2xl hover:bg-neutral-50 transition-colors border border-neutral-200"
                >
                  <div className="flex items-center gap-4">
                    {otherUser.profile_picture ? (
                      <img src={otherUser.profile_picture} alt={otherUser.first_name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center">
                        <User className="w-6 h-6 text-neutral-500" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-neutral-800">{otherUser.first_name} {otherUser.last_name}</p>
                      <div className="flex items-center text-sm text-neutral-500 mt-1">
                        <Package className="w-4 h-4 mr-2" />
                        <span>{convo.shipment.title}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}