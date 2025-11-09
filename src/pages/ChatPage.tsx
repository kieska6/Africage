import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Send, Loader2, ServerCrash, User } from 'lucide-react';
import { useChatScroll } from '../hooks/useChatScroll';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

interface Conversation {
  sender_id: string;
  traveler_id: string;
  shipment: {
    title: string;
  };
}

interface Participant {
  id: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
}

export function ChatPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [participants, setParticipants] = useState<{ sender: Participant; traveler: Participant } | null>(null);

  useChatScroll(messages);

  const fetchInitialData = async () => {
    if (!conversationId || !user) return;
    
    setLoading(true);
    setError('');

    try {
      // Récupérer les informations de la conversation
      const { data: convoData, error: convoError } = await supabase
        .from('conversations')
        .select(`
          sender_id,
          traveler_id,
          shipment:shipments(title),
          sender:users!conversations_sender_id_fkey(id, first_name, last_name, profile_picture),
          traveler:users!conversations_traveler_id_fkey(id, first_name, last_name, profile_picture)
        `)
        .eq('id', conversationId)
        .single();

      if (convoError) throw convoError;
      if (!convoData) throw new Error('Conversation non trouvée');

      const formattedConvo = {
        sender_id: convoData.sender_id,
        traveler_id: convoData.traveler_id,
        shipment: convoData.shipment[0],
        sender: convoData.sender[0],
        traveler: convoData.traveler[0]
      };

      setConversation(formattedConvo);
      setParticipants({
        sender: convoData.sender[0],
        traveler: convoData.traveler[0]
      });

      // Vérifier que l'utilisateur est bien participant
      const isParticipant = convoData.sender_id === user.id || convoData.traveler_id === user.id;
      if (!isParticipant) {
        throw new Error('Vous n\'êtes pas autorisé à accéder à cette conversation');
      }

      // Récupérer l'historique des messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;
      setMessages(messagesData || []);

    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement de la conversation");
      console.error('Error fetching chat data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [conversationId, user]);

  useEffect(() => {
    if (!conversationId || !user) return;

    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((currentMessages) => [...currentMessages, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !conversationId) return;

    const content = newMessage.trim();
    setNewMessage('');

    try {
      const { error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content,
      });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError("Erreur lors de l'envoi du message");
      setNewMessage(content); // Restaurer le message en cas d'erreur
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12 px-4 text-center">
        <ServerCrash className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-red-700">Erreur</h3>
        <p className="text-red-600 mt-2">{error}</p>
        <button
          onClick={() => navigate('/messages')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Retour aux messages
        </button>
      </div>
    );
  }

  if (!conversation || !participants) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12 px-4 text-center">
        <ServerCrash className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-red-700">Conversation non trouvée</h3>
        <p className="text-red-600 mt-2">La conversation que vous recherchez n'existe pas.</p>
      </div>
    );
  }

  const otherParticipant = user?.id === conversation.sender_id 
    ? participants.traveler 
    : participants.sender;

  const otherParticipantName = `${otherParticipant.first_name} ${otherParticipant.last_name}`;

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-4xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {otherParticipant.profile_picture ? (
                <img 
                  src={otherParticipant.profile_picture} 
                  alt={otherParticipantName}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center mr-3">
                  <User className="w-6 h-6 text-neutral-500" />
                </div>
              )}
              <div>
                <h2 className="font-bold text-neutral-800">{otherParticipantName}</h2>
                <p className="text-sm text-neutral-600">{conversation.shipment.title}</p>
              </div>
            </div>
            <Link to="/messages" className="text-primary hover:text-primary/80">
              Retour
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-4xl shadow-xl p-6">
          <div className="flex-1 overflow-y-auto max-h-96 space-y-4 mb-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${
                    message.sender_id === user?.id
                      ? 'bg-accent text-white rounded-br-lg'
                      : 'bg-neutral-100 text-neutral-800 rounded-bl-lg'
                  }`}
                >
                  <p className="break-words">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.sender_id === user?.id ? 'text-accent/80' : 'text-neutral-500'}`}>
                    {new Date(message.created_at).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {error && <Alert type="error" message={error} className="mb-4" />}

          <form onSubmit={handleSendMessage} className="flex items-center gap-4">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Écrivez votre message..."
              className="flex-1"
              autoComplete="off"
            />
            <Button 
              type="submit" 
              disabled={!newMessage.trim()}
              className="h-12 w-12 p-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}