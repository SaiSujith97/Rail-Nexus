import React, { useState, useEffect, useRef } from 'react';
import { useLocalization } from '../../context/LocalizationContext';
import { useNotification, Notification as NotificationType } from '../../context/NotificationContext';
import { CheckCircleIcon, ExclamationIcon, InfoIcon, WarningSignIcon } from '../../constants';

interface NotificationProps {
  notification: NotificationType;
}

const NOTIFICATION_TIMEOUT = 5000; // 5 seconds

const getIcon = (type: NotificationType['type']) => {
  const className = "h-6 w-6 mr-3 flex-shrink-0";
  switch (type) {
    case 'success': return <CheckCircleIcon className={`${className} text-green-500`} />;
    case 'warning': return <ExclamationIcon className={`${className} text-yellow-500`} />;
    case 'error': return <WarningSignIcon className={`${className} text-red-500`} />;
    case 'info':
    default: return <InfoIcon className={`${className} text-cyan-500`} />;
  }
};

export const Notification: React.FC<NotificationProps> = ({ notification }) => {
  const { removeNotification } = useNotification();
  const { t } = useLocalization();
  const [isPaused, setIsPaused] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const remainingTimeRef = useRef<number>(NOTIFICATION_TIMEOUT);

  useEffect(() => {
    if (!isPaused) {
      startTimeRef.current = Date.now();
      timerRef.current = window.setTimeout(() => {
        handleClose();
      }, remainingTimeRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPaused]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      removeNotification(notification.id);
    }, 500); // Match animation duration
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    const elapsedTime = Date.now() - startTimeRef.current;
    remainingTimeRef.current -= elapsedTime;
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };
  
  const progressBarAnimation = isPaused ? { animationPlayState: 'paused' } : {};

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative w-80 max-w-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl p-4 overflow-hidden mb-4 ${isExiting ? 'animate-fade-out' : 'animate-slide-in-right'}`}
      role="alert"
    >
      <div className="flex items-start">
        {getIcon(notification.type)}
        <div className="flex-1 text-base text-gray-700 dark:text-gray-200">
          {t(notification.messageKey as any, notification.params)}
        </div>
        <button
          onClick={handleClose}
          className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
          aria-label="Dismiss"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="absolute bottom-0 left-0 h-1 bg-cyan-500/50 dark:bg-cyan-400/50 animate-progress-bar" style={progressBarAnimation}></div>
    </div>
  );
};