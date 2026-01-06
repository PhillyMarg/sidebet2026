'use client';

interface SummaryCardProps {
  netBalance: number;
  youreOwed: number;
  youOwe: number;
}

export function SummaryCard({ netBalance, youreOwed, youOwe }: SummaryCardProps) {
  const formatCurrency = (amount: number, includeSign: boolean = false) => {
    const absAmount = Math.abs(amount).toFixed(2);
    if (includeSign) {
      return amount >= 0 ? `+$${absAmount}` : `-$${absAmount}`;
    }
    return `$${absAmount}`;
  };

  const netBalanceColor = netBalance >= 0 ? 'text-sb-green' : 'text-sb-red';

  return (
    <div className="mx-4 bg-sb-card border border-sb-border rounded-xl p-4">
      <div className="flex items-center justify-between">
        {/* Net Balance - Left side */}
        <div>
          <p className="text-sb-muted text-xs mb-1">Net Balance:</p>
          <p className={`text-2xl font-bold ${netBalanceColor}`}>
            {formatCurrency(netBalance, true)}
          </p>
        </div>

        {/* You're Owed / You Owe - Right side */}
        <div className="text-right space-y-1">
          <div>
            <span className="text-sb-muted text-xs">You&apos;re Owed: </span>
            <span className="text-sb-green font-semibold text-sm">
              {formatCurrency(youreOwed)}
            </span>
          </div>
          <div>
            <span className="text-sb-muted text-xs">You Owe: </span>
            <span className="text-sb-red font-semibold text-sm">
              {formatCurrency(youOwe)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
