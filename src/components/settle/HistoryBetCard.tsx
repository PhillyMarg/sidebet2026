'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Share2 } from 'lucide-react';
import { HistoryBet } from '@/lib/data/sampleSettlements';

interface HistoryBetCardProps {
  bet: HistoryBet;
}

export function HistoryBetCard({ bet }: HistoryBetCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (amount: number) => `$${Math.abs(amount).toFixed(2)}`;

  const borderColor = bet.category === 'H2H' ? 'border-sb-purple' : 'border-sb-orange';
  const labelColor = bet.category === 'H2H' ? 'text-sb-purple' : 'text-sb-orange';
  const potColor = bet.category === 'H2H' ? 'text-sb-purple' : 'text-sb-orange';

  const sourceLabel = bet.category === 'H2H'
    ? `${bet.challenger || 'Unknown'} v. ${bet.challenged || 'Unknown'}`
    : bet.groupName || 'Unknown Group';

  const statusColor = bet.status === 'WON' ? 'text-sb-green' : 'text-sb-red';
  const statusBgColor = bet.status === 'WON' ? 'bg-sb-green/20' : 'bg-sb-red/20';
  const statusLabel = bet.status === 'WON' ? 'YOU WON!' : 'YOU LOST';

  const betTypeLabel = bet.type === 'YES_NO' ? 'Yes/No' : 'Over/Under';

  return (
    <div
      className={`
        bg-sb-card/90 backdrop-blur-sm
        border ${borderColor}
        rounded-lg overflow-hidden
      `}
    >
      {/* Header - clickable to toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-3 hover:bg-sb-card-hover/50 transition-colors"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Top row: Source Label, Status Badge */}
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-medium ${labelColor} truncate`}>
                {sourceLabel}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${statusBgColor} ${statusColor}`}>
                {statusLabel}
              </span>
            </div>

            {/* Bet Title */}
            <h3 className="text-white font-bold text-sm">
              {bet.title}
            </h3>

            {/* Pot and Player Count */}
            <div className="flex items-center gap-3 mt-1">
              <span className={`text-xs ${potColor}`}>
                ${bet.totalPot.toFixed(2)} Pot
              </span>
              {bet.category === 'GROUP' && bet.playerCount && (
                <span className="text-sb-muted text-xs">
                  👤 {bet.playerCount} Players
                </span>
              )}
            </div>
          </div>

          {/* Expand/Collapse chevron */}
          <div className="flex items-center">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-sb-muted" />
            ) : (
              <ChevronDown className="w-5 h-5 text-sb-muted" />
            )}
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-3">
          {/* Description */}
          {bet.description && (
            <p className="text-sb-muted text-xs">
              {bet.description}
            </p>
          )}

          {/* Share button */}
          <button className="flex items-center gap-1 text-sb-muted text-xs hover:text-white transition-colors">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>

          {/* Bet details row */}
          <div className="flex items-center gap-4 text-xs">
            <span className="text-sb-muted">Creator: {bet.creatorName}</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-sb-muted">{betTypeLabel}</span>
          </div>

          {/* Vote Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-sb-green">
                {bet.type === 'YES_NO' ? 'YES' : 'OVER'} {bet.yesPercentage}%
              </span>
              <span className="text-sb-red">
                {bet.type === 'YES_NO' ? 'NO' : 'UNDER'} {bet.noPercentage}%
              </span>
            </div>
            <div className="h-2 bg-sb-border rounded-full overflow-hidden flex">
              <div
                className="bg-sb-green h-full"
                style={{ width: `${bet.yesPercentage}%` }}
              />
              <div
                className="bg-sb-red h-full"
                style={{ width: `${bet.noPercentage}%` }}
              />
            </div>
          </div>

          {/* Closed info line */}
          <div className="text-xs text-sb-muted pt-2 border-t border-sb-border">
            <span>Closed {bet.closedDate}</span>
            <span className="mx-2">|</span>
            <span>Your Pick: <span className="text-white font-semibold">{bet.userPick}</span></span>
            <span className="mx-2">|</span>
            <span>
              Payout: <span className={bet.status === 'WON' ? 'text-sb-green font-semibold' : 'text-sb-red'}>
                {formatCurrency(bet.payout)}
              </span>
            </span>
          </div>

          {/* Result banner */}
          <div className={`text-center py-2 rounded-lg ${statusBgColor}`}>
            <span className={`font-bold ${statusColor}`}>
              {statusLabel}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
