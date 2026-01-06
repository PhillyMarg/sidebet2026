'use client';

import { useState } from 'react';
import { BetStatusBadge } from './BetStatusBadge';
import { BetVoteButtons } from './BetVoteButtons';

type BetType = 'YES_NO' | 'OVER_UNDER';
type BetCategory = 'H2H' | 'GROUP';
type BetStatus = 'PENDING' | 'OPEN' | 'WON' | 'LOST' | 'JUDGE';
type VotePick = 'YES' | 'NO' | 'OVER' | 'UNDER';

interface BetCardExpandedProps {
  category: BetCategory;
  type: BetType;
  title: string;
  description?: string;
  sourceLabel: string;
  creatorName?: string;
  wager: number;
  totalPot: number;
  line?: number;
  closingDate: string;
  status: BetStatus;
  yesPercentage: number;
  noPercentage: number;
  playerCount?: number;
  userPick?: VotePick;
  potentialPayout?: number;
  onCollapse: () => void;
  onVote?: (pick: VotePick) => void;
  onJudge?: (result: VotePick) => void;
}

export function BetCardExpanded({
  category,
  type,
  title,
  description,
  sourceLabel,
  creatorName,
  wager,
  totalPot,
  line,
  closingDate,
  status,
  yesPercentage,
  noPercentage,
  playerCount,
  userPick,
  potentialPayout,
  onCollapse,
  onVote,
  onJudge,
}: BetCardExpandedProps) {
  const [judgeSelection, setJudgeSelection] = useState<VotePick | undefined>();

  // Determine left border color based on status and category
  const getLeftBorderColor = () => {
    if (status === 'WON') return 'border-l-[#22C55E]';
    if (status === 'LOST') return 'border-l-[#EF4444]';
    return category === 'H2H' ? 'border-l-sb-purple' : 'border-l-sb-orange';
  };

  // Top glow color for expanded state
  const getTopGlow = () => {
    if (status === 'WON') return 'shadow-[0_-2px_10px_rgba(34,197,94,0.3)]';
    if (status === 'LOST') return 'shadow-[0_-2px_10px_rgba(239,68,68,0.3)]';
    return category === 'H2H'
      ? 'shadow-[0_-2px_10px_rgba(123,44,191,0.3)]'
      : 'shadow-[0_-2px_10px_rgba(255,107,53,0.3)]';
  };

  const labelColor = category === 'H2H' ? 'text-sb-purple' : 'text-sb-orange';
  const accentColor = category === 'H2H' ? 'text-sb-purple' : 'text-sb-orange';

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const betTypeLabel = type === 'YES_NO' ? 'Yes/No' : 'Over/Under';

  const canVote = status === 'OPEN' && !userPick;
  const isJudgeMode = status === 'JUDGE';
  const showResult = status === 'WON' || status === 'LOST';

  const handleJudgeVote = (pick: VotePick) => {
    setJudgeSelection(pick);
    onJudge?.(pick);
  };

  // Get pick color based on status
  const getPickColor = () => {
    if (status === 'WON') return 'text-[#22C55E]';
    if (status === 'LOST') return 'text-[#EF4444]';
    return accentColor;
  };

  return (
    <div
      className={`
        bg-[#18181B]
        border-l-[3px] ${getLeftBorderColor()}
        ${getTopGlow()}
        rounded-lg overflow-hidden
      `}
    >
      {/* Header - clickable to collapse */}
      <button
        onClick={onCollapse}
        className="w-full text-left py-3 px-4 hover:bg-sb-card-hover/50 transition-colors"
      >
        {/* Row 1: Source Label (left), Date/Status (right) */}
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-semibold ${labelColor}`}>
            {sourceLabel}
          </span>
          <BetStatusBadge status={status} closingDate={closingDate} />
        </div>

        {/* Row 2: Bet Title */}
        <h3 className="text-white font-bold text-base">
          {title}
        </h3>
      </button>

      {/* Expanded content */}
      <div className="px-4 pb-4 space-y-2">
        {/* Creator */}
        {creatorName && (
          <p className="text-xs">
            <span className="text-[#9CA3AF]">Creator: </span>
            <span className="text-white">{creatorName}</span>
          </p>
        )}

        {/* Description */}
        {description && (
          <p className="text-[#9CA3AF] text-sm italic">
            {description}
          </p>
        )}

        {/* Bet Type */}
        <p className="text-[#9CA3AF] text-xs">
          {betTypeLabel}
        </p>

        {/* Line for Over/Under */}
        {type === 'OVER_UNDER' && line !== undefined && (
          <p className={`text-sm ${accentColor}`}>
            Line: {line}
          </p>
        )}

        {/* Spacer */}
        <div className="h-1" />

        {/* Wager */}
        <p className="text-white text-sm">
          Wager: {formatCurrency(wager)}
        </p>

        {/* Total Pot */}
        <p className={`text-sm font-semibold ${accentColor}`}>
          Total Pot: {formatCurrency(totalPot)}
        </p>

        {/* Player Count */}
        {category === 'GROUP' && playerCount !== undefined && (
          <p className="text-white text-sm">
            👤 {playerCount} Players
          </p>
        )}

        {/* Spacer */}
        <div className="h-1" />

        {/* Judge Mode */}
        {isJudgeMode && (
          <div className="space-y-3 pt-2">
            <p className="text-white text-sm text-center">
              What is the correct answer?
            </p>
            <BetVoteButtons
              betType={type}
              category={category}
              yesPercentage={yesPercentage}
              noPercentage={noPercentage}
              onVote={handleJudgeVote}
              isJudgeMode={true}
              judgeSelection={judgeSelection}
            />
          </div>
        )}

        {/* Voting section (only when status is OPEN) */}
        {status === 'OPEN' && (
          <BetVoteButtons
            betType={type}
            category={category}
            yesPercentage={yesPercentage}
            noPercentage={noPercentage}
            userPick={userPick}
            status={status}
            onVote={onVote}
            disabled={!canVote}
          />
        )}

        {/* Show buttons in WON/LOST state too */}
        {showResult && (
          <BetVoteButtons
            betType={type}
            category={category}
            yesPercentage={yesPercentage}
            noPercentage={noPercentage}
            userPick={userPick}
            status={status}
            disabled={true}
          />
        )}

        {/* Spacer */}
        <div className="h-1" />

        {/* User's pick and potential payout */}
        {userPick && (status === 'OPEN' || showResult) && (
          <div className="flex items-center justify-between text-xs pt-2">
            <span className="text-[#9CA3AF]">
              Your Pick: <span className={`font-semibold ${getPickColor()}`}>{userPick}</span>
            </span>
            {status !== 'LOST' && potentialPayout !== undefined && (
              <span className="text-[#9CA3AF]">
                {status === 'WON' ? 'Payout: ' : 'Potential Payout: '}
                <span className="font-semibold text-white">{formatCurrency(potentialPayout)}</span>
              </span>
            )}
          </div>
        )}

        {/* Pending state message */}
        {status === 'PENDING' && (
          <div className="text-center py-2 rounded-lg bg-[#EAB308]/20">
            <span className="text-[#EAB308] text-sm">
              Waiting for opponent to accept
            </span>
          </div>
        )}

        {/* Collapse chevron at bottom right */}
        <div className="flex justify-end pt-2">
          <svg
            className="w-5 h-5 text-white cursor-pointer"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            onClick={onCollapse}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
