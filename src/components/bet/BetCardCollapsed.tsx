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
  const borderColor = category === 'H2H' ? 'border-sb-purple' : 'border-sb-orange';
  const labelColor = category === 'H2H' ? 'text-sb-purple' : 'text-sb-orange';

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <button
      onClick={onExpand}
      className={`
        w-full text-left
        bg-sb-card/90 backdrop-blur-sm
        border ${borderColor}
        rounded-lg p-3
        hover:bg-sb-card-hover transition-colors
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {/* Top row: Source Label, Date/Status */}
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-medium ${labelColor} truncate`}>
              {sourceLabel}
            </span>
            <BetStatusBadge status={status} closingDate={closingDate} />
          </div>

          {/* Middle row: Bet Title */}
          <h3 className="text-white font-bold text-sm truncate mb-1">
            {title}
          </h3>

          {/* Bottom row: Pot and Player Count */}
          <div className="flex items-center gap-2 text-xs text-sb-muted">
            <span>Pot: {formatCurrency(totalPot)}</span>
            {category === 'GROUP' && playerCount !== undefined && (
              <>
                <span className="text-sb-border">|</span>
                <span>{playerCount} Players</span>
              </>
            )}
          </div>
        </div>

        {/* Right side: Expand chevron */}
        <div className="flex items-center">
          <svg
            className="w-5 h-5 text-sb-muted"
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
      </div>
    </button>
  );
}
