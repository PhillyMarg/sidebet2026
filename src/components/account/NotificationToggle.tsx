"use client";

interface NotificationToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function NotificationToggle({ enabled, onToggle }: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-white text-sm font-medium">Push Notifications</span>
      <button
        onClick={() => onToggle(!enabled)}
        className={`
          relative w-12 h-6 rounded-full transition-colors duration-200
          ${enabled ? "bg-sb-orange" : "bg-sb-muted"}
        `}
      >
        <span
          className={`
            absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200
            ${enabled ? "translate-x-7" : "translate-x-1"}
          `}
        />
      </button>
    </div>
  );
}
