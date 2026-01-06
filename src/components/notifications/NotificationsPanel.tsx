"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Notification } from "@/lib/data/sampleNotifications";
import { NotificationItem } from "./NotificationItem";

interface NotificationsPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onClearAll: () => void;
  onMarkRead: (id: string) => void;
}

export function NotificationsPanel({
  notifications,
  onClose,
  onClearAll,
  onMarkRead,
}: NotificationsPanelProps) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close panel
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    // Delay adding listener to prevent immediate close from bell click
    const timeout = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleNotificationClick = (notification: Notification) => {
    onMarkRead(notification.id);
    if (notification.link) {
      router.push(notification.link);
    }
    onClose();
  };

  return (
    <div
      ref={panelRef}
      className="absolute top-full right-0 mt-2 w-[340px] max-h-[400px] bg-sb-card border border-sb-border rounded-lg shadow-lg overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-sb-border">
        <span className="text-sm font-semibold text-white">Notifications:</span>
        <div className="flex items-center gap-3">
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-sb-muted hover:text-sb-orange transition-colors"
            >
              Clear All Notifications
            </button>
          )}
          <button
            onClick={onClose}
            className="text-sb-muted hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="max-h-[340px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <span className="text-sm text-sb-muted">No Notifications</span>
          </div>
        ) : (
          <div className="divide-y divide-sb-border">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={handleNotificationClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
