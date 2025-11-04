import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';

interface Notification {
  id: string;
  content: string;
  type: 'NEW_OFFER' | 'OFFER_ACCEPTED' | 'NEW_MESSAGE';
  related_entity_id: string;
  is_read: boolean;
  created_at: string;
}

export function NotificationsBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const fetchInitialNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching notifications:", error);
      } else {
        setNotifications(data || []);
        const unread = data?.filter(n => !n.is_read).length || 0;
        setUnreadCount(unread);
      }
    };

    fetchInitialNotifications();

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          if (!newNotification.is_read) {
            setUnreadCount(prev => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notification.id);

      if (!error) {
        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n));
      }
    }

    setIsOpen(false);

    switch (notification.type) {
      case 'NEW_OFFER':
        navigate('/dashboard');
        break;
      case 'OFFER_ACCEPTED':
      case 'NEW_MESSAGE':
        navigate(`/messages/${notification.related_entity_id}`);
        break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-full hover:bg-neutral-100">
        <Bell className="w-5 h-5 text-neutral-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-neutral-200 z-50">
          <div className="p-3 font-semibold border-b">Notifications</div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3 hover:bg-neutral-50 cursor-pointer border-b ${!notif.is_read ? 'bg-blue-50' : ''}`}
                >
                  <p className="text-sm text-neutral-700">{notif.content}</p>
                  <p className="text-xs text-neutral-400 mt-1">{new Date(notif.created_at).toLocaleString('fr-FR')}</p>
                </div>
              ))
            ) : (
              <p className="p-4 text-sm text-neutral-500 text-center">Aucune notification</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}