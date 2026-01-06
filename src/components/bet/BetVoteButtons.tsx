'use client';

type BetType = 'YES_NO' | 'OVER_UNDER';
type Category = 'H2H' | 'GROUP';
type VotePick = 'YES' | 'NO' | 'OVER' | 'UNDER';

interface BetVoteButtonsProps {
  betType: BetType;
  category: Category;
  yesPercentage: number;
  noPercentage: number;
  userPick?: VotePick;
  onVote?: (pick: VotePick) => void;
  disabled?: boolean;
  isJudgeMode?: boolean;
}

export function BetVoteButtons({
  betType,
  category,
  yesPercentage,
  noPercentage,
  userPick,
  onVote,
  disabled = false,
  isJudgeMode = false,
}: BetVoteButtonsProps) {
  const accentColor = category === 'H2H' ? 'bg-sb-purple' : 'bg-sb-orange';
  const leftOption = betType === 'YES_NO' ? 'NO' : 'UNDER';
  const rightOption = betType === 'YES_NO' ? 'YES' : 'OVER';
  const leftPick: VotePick = betType === 'YES_NO' ? 'NO' : 'UNDER';
  const rightPick: VotePick = betType === 'YES_NO' ? 'YES' : 'OVER';

  const isLeftSelected = userPick === leftPick;
  const isRightSelected = userPick === rightPick;

  const handleLeftClick = () => {
    if (!disabled && onVote) {
      onVote(leftPick);
    }
  };

  const handleRightClick = () => {
    if (!disabled && onVote) {
      onVote(rightPick);
    }
  };

  // Judge mode has simpler buttons without percentages
  if (isJudgeMode) {
    return (
      <div className="flex gap-3">
        <button
          onClick={handleLeftClick}
          disabled={disabled}
          className={`
            flex-1 py-3 px-4 rounded-lg font-semibold text-sm
            transition-all duration-200
            ${accentColor} text-white
            hover:opacity-90
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {leftOption}
        </button>
        <button
          onClick={handleRightClick}
          disabled={disabled}
          className={`
            flex-1 py-3 px-4 rounded-lg font-semibold text-sm
            transition-all duration-200
            ${accentColor} text-white
            hover:opacity-90
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {rightOption}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Vote buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleLeftClick}
          disabled={disabled}
          className={`
            flex-1 py-3 px-4 rounded-lg font-semibold text-sm
            transition-all duration-200
            ${
              isLeftSelected
                ? `${accentColor} text-white`
                : 'bg-transparent border border-white/30 text-white hover:border-white/50'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {leftOption} {noPercentage}%
        </button>
        <button
          onClick={handleRightClick}
          disabled={disabled}
          className={`
            flex-1 py-3 px-4 rounded-lg font-semibold text-sm
            transition-all duration-200
            ${
              isRightSelected
                ? `${accentColor} text-white`
                : 'bg-transparent border border-white/30 text-white hover:border-white/50'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {rightOption} {yesPercentage}%
        </button>
      </div>

      {/* Progress bar showing vote distribution */}
      <div className="h-1.5 bg-sb-card-hover rounded-full overflow-hidden flex">
        <div
          className={`${category === 'H2H' ? 'bg-sb-purple/60' : 'bg-sb-orange/60'} transition-all duration-300`}
          style={{ width: `${noPercentage}%` }}
        />
        <div
          className={`${category === 'H2H' ? 'bg-sb-purple' : 'bg-sb-orange'} transition-all duration-300`}
          style={{ width: `${yesPercentage}%` }}
        />
      </div>
    </div>
  );
}
