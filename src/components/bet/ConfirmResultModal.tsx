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
  betType,
  category,
  selectedResult,
  onConfirm,
  onCancel,
}: ConfirmResultModalProps) {
  if (!isOpen) return null;

  const borderColor = category === 'H2H' ? 'border-sb-purple' : 'border-sb-orange';
  const confirmBgColor = category === 'H2H' ? 'bg-sb-purple' : 'bg-sb-orange';

  const resultLabel = (() => {
    switch (selectedResult) {
      case 'YES':
        return 'YES';
      case 'NO':
        return 'NO';
      case 'OVER':
        return 'OVER';
      case 'UNDER':
        return 'UNDER';
      default:
        return selectedResult;
    }
  })();

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
          bg-sb-card border ${borderColor}
          rounded-xl p-6
          space-y-4
        `}
      >
        {/* Title */}
        <h2 className="text-white text-lg font-bold text-center">
          CONFIRM RESULT
        </h2>

        {/* Message */}
        <p className="text-white text-sm text-center">
          You&apos;re about to select <span className="font-bold">{resultLabel}</span> as the winning answer.
        </p>

        {/* Warning */}
        <p className="text-sb-muted text-xs text-center italic">
          This cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className={`
              flex-1 py-3 px-4 rounded-lg
              font-semibold text-sm
              bg-transparent border ${borderColor} text-white
              hover:bg-sb-card-hover transition-colors
            `}
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            className={`
              flex-1 py-3 px-4 rounded-lg
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
