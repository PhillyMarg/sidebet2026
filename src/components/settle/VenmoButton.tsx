'use client';

interface VenmoButtonProps {
  type: 'request' | 'send';
  amount: number;
  venmoUsername: string;
  onPress?: () => void;
}

export function VenmoButton({ type, amount, venmoUsername, onPress }: VenmoButtonProps) {
  const formatCurrency = (amount: number) => `$${Math.abs(amount).toFixed(2)}`;

  const handleClick = () => {
    if (onPress) {
      onPress();
      return;
    }

    // Build Venmo deep link
    const txnType = type === 'request' ? 'charge' : 'pay';
    const venmoUrl = `venmo://paycharge?txn=${txnType}&recipients=${venmoUsername}&amount=${Math.abs(amount)}&note=SideBet%20Settlement`;

    // Try to open Venmo, fallback to web
    window.location.href = venmoUrl;
  };

  const label = type === 'request'
    ? `Request ${formatCurrency(amount)} on Venmo`
    : `Send ${formatCurrency(amount)} on Venmo`;

  return (
    <button
      onClick={handleClick}
      className="
        w-full py-3 rounded-lg
        bg-[#008CFF] hover:bg-[#0077DD]
        text-white font-semibold text-sm
        transition-colors
        flex items-center justify-center gap-2
      "
    >
      {/* Venmo-style icon */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.27 3c.84 1.33 1.22 2.72 1.22 4.47 0 5.57-4.76 12.81-8.61 17.53H4.68L2 3.73l6.07-.55 1.31 10.48c1.22-1.99 2.72-5.12 2.72-7.27 0-1.67-.29-2.82-.76-3.78L19.27 3z"/>
      </svg>
      {label}
    </button>
  );
}
