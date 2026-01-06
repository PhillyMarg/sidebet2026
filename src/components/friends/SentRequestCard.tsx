"use client";

interface SentRequestCardProps {
  name: string;
  username: string;
}

export function SentRequestCard({ name, username }: SentRequestCardProps) {
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

      {/* Pending Status */}
      <span className="text-white text-[6px] font-semibold font-montserrat uppercase">
        PENDING...
      </span>
    </div>
  );
}
