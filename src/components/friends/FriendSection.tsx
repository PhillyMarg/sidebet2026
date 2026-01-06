"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

interface FriendSectionProps {
  title: string;
  count: number;
  children: React.ReactNode;
  subtitle?: string;
  defaultExpanded?: boolean;
}

export function FriendSection({
  title,
  count,
  children,
  subtitle,
  defaultExpanded = true,
}: FriendSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-2"
      >
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <span className="text-white text-xs font-semibold uppercase tracking-wide">
              {title}
            </span>
            <span className="text-sb-orange text-xs font-semibold">({count})</span>
          </div>
          {subtitle && (
            <span className="text-sb-muted text-xs">From: {subtitle}</span>
          )}
        </div>
        <ChevronRight
          size={18}
          className={`text-sb-muted transition-transform duration-200 ${
            isExpanded ? "rotate-90" : ""
          }`}
        />
      </button>
      {isExpanded && (
        <div className="flex flex-col gap-2 mt-2">{children}</div>
      )}
    </div>
  );
}
