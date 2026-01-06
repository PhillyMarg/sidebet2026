'use client';

type BetType = 'YES_NO' | 'OVER_UNDER';
type BetCategory = 'H2H' | 'GROUP';
type VotePick = 'YES' | 'NO' | 'OVER' | 'UNDER';

interface ConfirmResultModalProps {
  isOpen: boolean;
  betType: BetType;
  category: BetCategory;
  selectedResult: VotePick;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmResultModal({
  isOpen,
  category,
  selectedResult,
  onConfirm,
  onCancel,
}: ConfirmResultModalProps) {
  if (!isOpen) return null;

  const accentColor = category === 'H2H' ? 'text-sb-purple' : 'text-sb-orange';
  const topBorderColor = category === 'H2H' ? 'border-t-sb-purple' : 'border-t-sb-orange';
  const confirmBgColor = category === 'H2H' ? 'bg-sb-purple' : 'bg-sb-orange';
  const cancelBorderColor = category === 'H2H' ? 'border-sb-purple' : 'border-sb-orange';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div
        className={`
          relative w-full max-w-sm
          bg-[#18181B]
          border-t-4 ${topBorderColor}
          rounded-xl p-6
          space-y-4
        `}
      >
        {/* Title */}
        <h2 className="text-white text-lg font-bold text-center">
          CONFIRM RESULT
        </h2>

        {/* Message */}
        <p className="text-[#9CA3AF] text-sm text-center">
          You&apos;re about to select <span className={`font-bold ${accentColor}`}>{selectedResult}</span> as the winning answer.
        </p>

        {/* Warning */}
        <p className="text-[#9CA3AF] text-xs text-center italic">
          This cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className={`
              flex-1 py-3 px-4 rounded-md
              font-semibold text-sm
              bg-transparent border ${cancelBorderColor} text-white
              hover:bg-sb-card-hover transition-colors
            `}
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            className={`
              flex-1 py-3 px-4 rounded-md
              font-semibold text-sm
              ${confirmBgColor} text-white
              hover:opacity-90 transition-opacity
            `}
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
}
