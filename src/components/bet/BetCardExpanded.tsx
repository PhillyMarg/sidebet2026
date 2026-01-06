'use client';

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
  const borderColor = category === 'H2H' ? 'border-sb-purple' : 'border-sb-orange';
  const labelColor = category === 'H2H' ? 'text-sb-purple' : 'text-sb-orange';
  const potColor = category === 'H2H' ? 'text-sb-purple' : 'text-sb-orange';

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const betTypeLabel = type === 'YES_NO' ? 'Yes/No' : 'Over/Under';
  const userPickLabel = userPick ? (type === 'YES_NO' ? userPick : userPick) : null;

  const canVote = status === 'OPEN' && !userPick;
  const isJudgeMode = status === 'JUDGE';
  const showResult = status === 'WON' || status === 'LOST';

  return (
    <div
      className={`
        bg-sb-card/90 backdrop-blur-sm
        border ${borderColor}
        rounded-lg overflow-hidden
      `}
    >
      {/* Header - clickable to collapse */}
      <button
        onClick={onCollapse}
        className="w-full text-left p-3 hover:bg-sb-card-hover/50 transition-colors"
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

            {/* Bet Title */}
            <h3 className="text-white font-bold text-sm">
              {title}
            </h3>
          </div>

          {/* Collapse chevron */}
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
                d="M5 15l7-7 7 7"
              />
            </svg>
          </div>
        </div>
      </button>

      {/* Expanded content */}
      <div className="px-3 pb-3 space-y-3">
        {/* Description */}
        {description && (
          <p className="text-sb-muted text-xs">
            {description}
          </p>
        )}

        {/* Bet details row */}
        <div className="flex items-center gap-4 text-xs">
          <span className="text-sb-muted">{betTypeLabel}</span>
          {type === 'OVER_UNDER' && line !== undefined && (
            <span className="text-sb-muted">Line: {line}</span>
          )}
        </div>

        {/* Wager and Pot */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-white">
              Wager: <span className="font-semibold">{formatCurrency(wager)}</span>
            </span>
            <span className={potColor}>
              Total Pot: <span className="font-bold">{formatCurrency(totalPot)}</span>
            </span>
          </div>
          {category === 'GROUP' && playerCount !== undefined && (
            <span className="text-sb-muted text-xs">
              👤 {playerCount} Players
            </span>
          )}
        </div>

        {/* Judge Mode */}
        {isJudgeMode && (
          <div className="space-y-3 pt-2">
            <p className="text-white text-sm text-center font-medium">
              What is the correct answer?
            </p>
            <BetVoteButtons
              betType={type}
              category={category}
              yesPercentage={yesPercentage}
              noPercentage={noPercentage}
              onVote={(pick) => onJudge?.(pick)}
              isJudgeMode={true}
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
            onVote={onVote}
            disabled={!canVote}
          />
        )}

        {/* User's pick and potential payout */}
        {userPick && (status === 'OPEN' || showResult) && (
          <div className="flex items-center justify-between text-xs pt-1 border-t border-sb-border">
            <span className="text-sb-muted">
              Your Pick: <span className="text-white font-semibold">{userPickLabel}</span>
            </span>
            {potentialPayout !== undefined && (
              <span className="text-sb-muted">
                Potential Payout: <span className={`font-semibold ${potColor}`}>{formatCurrency(potentialPayout)}</span>
              </span>
            )}
          </div>
        )}

        {/* Won/Lost result display */}
        {showResult && (
          <div className={`text-center py-2 rounded-lg ${status === 'WON' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            <span className={`font-bold ${status === 'WON' ? 'text-green-500' : 'text-red-500'}`}>
              {status === 'WON' ? 'YOU WON!' : 'YOU LOST'}
            </span>
          </div>
        )}

        {/* Pending state message */}
        {status === 'PENDING' && (
          <div className="text-center py-2 rounded-lg bg-yellow-500/20">
            <span className="text-yellow-500 text-sm">
              Waiting for opponent to accept
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
