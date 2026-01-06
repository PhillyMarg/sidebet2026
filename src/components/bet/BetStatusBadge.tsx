'use client';

interface BetStatusBadgeProps {
  status: 'PENDING' | 'OPEN' | 'WON' | 'LOST' | 'JUDGE';
  closingDate?: string;
}

export function BetStatusBadge({ status, closingDate }: BetStatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'PENDING':
        return 'text-[#EAB308]'; // Yellow
      case 'OPEN':
        return 'text-[#9CA3AF]'; // Muted gray
      case 'WON':
        return 'text-[#22C55E]'; // Green
      case 'LOST':
        return 'text-[#EF4444]'; // Red
      case 'JUDGE':
        return 'text-sb-orange'; // Orange
      default:
        return 'text-[#9CA3AF]';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'PENDING':
        return 'PENDING';
      case 'OPEN':
        return closingDate || '';
      case 'WON':
        return 'YOU WON!';
      case 'LOST':
        return 'YOU LOST';
      case 'JUDGE':
        return 'JUDGE BET!';
      default:
        return '';
    }
  };

  return (
    <div className={`flex items-center gap-1 text-xs font-medium ${getStatusStyles()}`}>
      {status === 'OPEN' && closingDate && (
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}
      <span>{getStatusText()}</span>
    </div>
  );
}
