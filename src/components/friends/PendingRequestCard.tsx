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
    <div className="h-[36px] bg-[rgba(24,24,27,0.4)] rounded-[6px] px-3 flex items-center">
      <div className="flex items-center gap-2 flex-1 overflow-hidden">
        {/* Name */}
        <span className="text-white text-[12px] font-semibold font-montserrat whitespace-nowrap">
          {name}
        </span>

        {/* Username */}
        <span className="text-sb-orange text-[10px] font-semibold font-montserrat whitespace-nowrap">
          @{username}
        </span>
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-5">
        {/* Accept - Green Check */}
        <button
          onClick={onAccept}
          className="flex items-center justify-center hover:opacity-80 transition-opacity"
          aria-label="Accept friend request"
        >
          <Check size={16} className="text-[#00FF11]" strokeWidth={2.5} />
        </button>

        {/* Decline - Red X */}
        <button
          onClick={onDecline}
          className="flex items-center justify-center hover:opacity-80 transition-opacity"
          aria-label="Decline friend request"
        >
          <X size={8} className="text-sb-red" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
