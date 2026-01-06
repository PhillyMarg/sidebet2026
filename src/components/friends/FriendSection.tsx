"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FriendSectionProps {
  title: string;
  count: number;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function FriendSection({
  title,
  count,
  children,
  defaultExpanded = true,
}: FriendSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="mb-4">
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-2 px-2"
      >
        <div className="flex items-center gap-1">
          <span className="text-white text-[14px] font-semibold font-montserrat uppercase">
            {title}
          </span>
          <span className="text-sb-orange text-[14px] font-semibold font-montserrat">
            ({count})
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-white transition-transform duration-200 ${
            isExpanded ? "" : "-rotate-90"
          }`}
        />
      </button>

      {/* Section Content */}
      {isExpanded && (
        <div className="flex flex-col gap-[13px] mt-1">{children}</div>
      )}
    </div>
  );
}
