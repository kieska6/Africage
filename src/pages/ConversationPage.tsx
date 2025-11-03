import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Loader2, Send } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

interface Conversation {
    sender_id: string;
    traveler_id: string;
}

export function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!conversationId) return;

    const fetchInitialData = async () => {
      setLoading(true);
      
      const { data: convoData, error: convoError } = await supabase
        .from('conversations')
        .select('sender_id, traveler_id')
        .eq('id', conversationId)
        .single();

      if (convoError) {
        console.error('Error fetching conversation details:', convoError);
        setLoading(false);
        return;
      }
      setConversation(convoData);

      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
      } else {
        setMessages(messagesData || []);
      }
      setLoading(false);
    };

    fetchInitialData();

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
  }, [conversationId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !conversationId || !conversation) return;

    const content = newMessage.trim();
    setNewMessage('');

    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: content,
    });

    if (error) {
      console.error('Error sending message:', error);
      setNewMessage(content); // Restore message on error
    } else {
      // Send notification to the other user
      const recipientId = user.id === conversation.sender_id ? conversation.traveler_id : conversation.sender_id;
      await supabase.from('notifications').insert({
        recipient_id: recipientId,
        type: 'NEW_MESSAGE',
        related_entity_id: conversationId,
        content: `Vous avez reçu un nouveau message.`
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-neutral-100">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-end gap-2 ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl ${
                message.sender_id === user?.id
                  ? 'bg-accent text-white rounded-br-lg'
                  : 'bg-white text-neutral-800 shadow-sm rounded-bl-lg'
              }`}
            >
              <p className="break-words">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t border-neutral-200">
        <form onSubmit={handleSendMessage} className="flex items-center gap-4 max-w-4xl mx-auto">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 h-12"
            autoComplete="off"
          />
          <Button type="submit" disabled={!newMessage.trim()} size="lg" className="h-12">
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}