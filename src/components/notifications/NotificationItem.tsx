"use client";

import { Notification, NotificationType } from "@/lib/data/sampleNotifications";

interface NotificationItemProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
}

function getBorderColor(type: NotificationType): string {
  switch (type) {
    case 'BET_WON':
      return 'border-l-green-500';
    case 'BET_LOST':
      return 'border-l-red-500';
    case 'FRIEND_REQUEST':
    case 'BET_CHALLENGE':
    case 'BET_CLOSING':
    case 'PAYMENT_REQUEST':
    default:
      return 'border-l-sb-orange';
  }
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const borderColor = getBorderColor(notification.type);

  return (
    <button
      onClick={() => onClick(notification)}
      className={`
        w-full text-left px-4 py-3
        border-l-4 ${borderColor}
        hover:bg-sb-card-hover transition-colors
        ${notification.read ? 'opacity-70' : 'opacity-100'}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-white flex-1 leading-snug">
          {notification.message}
        </p>
        <span className="text-xs text-sb-muted whitespace-nowrap">
          {notification.time}
        </span>
      </div>
    </button>
  );
}
