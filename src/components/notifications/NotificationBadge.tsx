"use client";

interface NotificationBadgeProps {
  count: number;
}

export function NotificationBadge({ count }: NotificationBadgeProps) {
  if (count <= 0) return <></>;

  return (
    <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-sb-orange text-white text-[10px] font-semibold px-1">
      {count > 99 ? '99+' : count}
    </div>
  );
}
