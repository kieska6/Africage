import { Link } from 'react-router-dom';

interface Notification {
  id: string;
  message: string;
  type: string;
  link_to: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
}

export function NotificationPanel({ notifications, onNotificationClick }: NotificationPanelProps) {
  const handleClick = (notification: Notification) => {
    onNotificationClick(notification);
  };

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-neutral-500">
        <div className="text-4xl mb-2">🔔</div>
        <p>Aucune notification</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-neutral-100">
      {notifications.map((notification) => (
        <Link
          key={notification.id}
          to={notification.link_to}
          onClick={() => handleClick(notification)}
          className={`block p-4 hover:bg-neutral-50 transition-colors ${
            !notification.is_read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className={`text-sm ${!notification.is_read ? 'font-semibold text-blue-900' : 'text-neutral-700'}`}>
                {notification.message}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {new Date(notification.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            {!notification.is_read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}