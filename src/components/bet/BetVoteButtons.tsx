'use client';

type BetType = 'YES_NO' | 'OVER_UNDER';
type Category = 'H2H' | 'GROUP';
type BetStatus = 'PENDING' | 'OPEN' | 'WON' | 'LOST' | 'JUDGE';
type VotePick = 'YES' | 'NO' | 'OVER' | 'UNDER';

interface BetVoteButtonsProps {
  betType: BetType;
  category: Category;
  yesPercentage: number;
  noPercentage: number;
  userPick?: VotePick;
  status?: BetStatus;
  onVote?: (pick: VotePick) => void;
  disabled?: boolean;
  isJudgeMode?: boolean;
  judgeSelection?: VotePick;
}

export function BetVoteButtons({
  betType,
  category,
  yesPercentage,
  noPercentage,
  userPick,
  status,
  onVote,
  disabled = false,
  isJudgeMode = false,
  judgeSelection,
}: BetVoteButtonsProps) {
  const leftOption = betType === 'YES_NO' ? 'NO' : 'UNDER';
  const rightOption = betType === 'YES_NO' ? 'YES' : 'OVER';
  const leftPick: VotePick = betType === 'YES_NO' ? 'NO' : 'UNDER';
  const rightPick: VotePick = betType === 'YES_NO' ? 'YES' : 'OVER';

  const isLeftSelected = userPick === leftPick;
  const isRightSelected = userPick === rightPick;

  // For judge mode
  const isLeftJudgeSelected = judgeSelection === leftPick;
  const isRightJudgeSelected = judgeSelection === rightPick;

  // Get the accent color based on category
  const getAccentBg = () => {
    return category === 'H2H' ? 'bg-sb-purple' : 'bg-sb-orange';
  };

  // Get selected button color based on status
  const getSelectedBg = () => {
    if (status === 'WON') return 'bg-[#22C55E]';
    if (status === 'LOST') return 'bg-[#EF4444]';
    return category === 'H2H' ? 'bg-sb-purple' : 'bg-sb-orange';
  };

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

  // Judge mode - buttons that can be clicked to select result
  if (isJudgeMode) {
    return (
      <div className="flex gap-3">
        <button
          onClick={handleLeftClick}
          disabled={disabled}
          className={`
            flex-1 py-2.5 px-4 rounded-md font-semibold text-sm
            transition-all duration-200
            ${
              isLeftJudgeSelected
                ? `${getAccentBg()} text-white`
                : 'bg-transparent border border-white text-white hover:bg-white/10'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {leftOption}
        </button>
        <button
          onClick={handleRightClick}
          disabled={disabled}
          className={`
            flex-1 py-2.5 px-4 rounded-md font-semibold text-sm
            transition-all duration-200
            ${
              isRightJudgeSelected
                ? `${getAccentBg()} text-white`
                : 'bg-transparent border border-white text-white hover:bg-white/10'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {rightOption}
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={handleLeftClick}
        disabled={disabled}
        className={`
          flex-1 py-2.5 px-4 rounded-md font-semibold text-sm
          transition-all duration-200
          ${
            isLeftSelected
              ? `${getSelectedBg()} text-white`
              : 'bg-[#18181B] border border-white text-white hover:bg-white/10'
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
          flex-1 py-2.5 px-4 rounded-md font-semibold text-sm
          transition-all duration-200
          ${
            isRightSelected
              ? `${getSelectedBg()} text-white`
              : 'bg-[#18181B] border border-white text-white hover:bg-white/10'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {rightOption} {yesPercentage}%
      </button>
    </div>
  );
}
