import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { Notification } from './Notification';

const MAX_NOTIFICATIONS = 2;

export const NotificationSystem: React.FC = () => {
  const { notifications } = useNotification();

  const visibleNotifications = notifications.slice(-MAX_NOTIFICATIONS);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {visibleNotifications.map(notification => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  );
};