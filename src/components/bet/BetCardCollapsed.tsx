'use client';

import { BetStatusBadge } from './BetStatusBadge';

type BetCategory = 'H2H' | 'GROUP';
type BetStatus = 'PENDING' | 'OPEN' | 'WON' | 'LOST' | 'JUDGE';

interface BetCardCollapsedProps {
  category: BetCategory;
  title: string;
  sourceLabel: string;
  totalPot: number;
  playerCount?: number;
  closingDate: string;
  status: BetStatus;
  onExpand: () => void;
}

export function BetCardCollapsed({
  category,
  title,
  sourceLabel,
  totalPot,
  playerCount,
  closingDate,
  status,
  onExpand,
}: BetCardCollapsedProps) {
  // Determine left border color based on status and category
  const getLeftBorderColor = () => {
    if (status === 'WON') return 'border-l-[#22C55E]';
    if (status === 'LOST') return 'border-l-[#EF4444]';
    return category === 'H2H' ? 'border-l-sb-purple' : 'border-l-sb-orange';
  };

  const labelColor = category === 'H2H' ? 'text-sb-purple' : 'text-sb-orange';
  const accentColor = category === 'H2H' ? 'text-sb-purple' : 'text-sb-orange';

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <button
      onClick={onExpand}
      className={`
        w-full text-left
        bg-[#18181B]
        border-l-[3px] ${getLeftBorderColor()}
        rounded-lg py-3 px-4
        hover:bg-sb-card-hover transition-colors
      `}
    >
      {/* Row 1: Source Label (left), Date/Status (center) */}
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-xs font-semibold ${labelColor}`}>
          {sourceLabel}
        </span>
        <div className="flex-1 flex justify-center">
          <BetStatusBadge status={status} closingDate={closingDate} />
        </div>
        {/* Empty space on right for collapsed state */}
        <div className="w-4" />
      </div>

      {/* Row 2: Bet Title */}
      <h3 className="text-white font-bold text-sm mb-2">
        {title}
      </h3>

      {/* Row 3: Pot + Players | Chevron */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className={`text-xs font-medium ${accentColor}`}>
            Pot: {formatCurrency(totalPot)}
          </span>
          {category === 'GROUP' && playerCount !== undefined && (
            <>
              <span className={`text-xs ${accentColor}`}>|</span>
              <span className={`text-xs font-medium ${accentColor}`}>
                {playerCount} Players
              </span>
            </>
          )}
        </div>

        {/* Chevron down */}
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </button>
  );
}
