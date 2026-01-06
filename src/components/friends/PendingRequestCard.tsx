"use client";

import { Check, X } from "lucide-react";

interface PendingRequestCardProps {
  name: string;
  username: string;
  onAccept: () => void;
  onDecline: () => void;
}

export function PendingRequestCard({
  name,
  username,
  onAccept,
  onDecline,
}: PendingRequestCardProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-sb-card rounded-lg">
      <div className="flex flex-col">
        <span className="text-white font-semibold text-sm">{name}</span>
        <span className="text-sb-orange text-xs">@{username}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onAccept}
          className="w-8 h-8 flex items-center justify-center bg-sb-green rounded-full hover:opacity-90 transition-opacity"
          aria-label="Accept friend request"
        >
          <Check size={16} className="text-white" />
        </button>
        <button
          onClick={onDecline}
          className="w-8 h-8 flex items-center justify-center bg-sb-red rounded-full hover:opacity-90 transition-opacity"
          aria-label="Decline friend request"
        >
          <X size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
}
