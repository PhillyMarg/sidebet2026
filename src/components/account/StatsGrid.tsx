"use client";

import { StatCard } from "./StatCard";

interface StatsGridProps {
  totalWinnings: number;
  totalLosses: number;
  h2hWins: number;
  h2hLosses: number;
  totalBets: number;
}

export function StatsGrid({ totalWinnings, totalLosses, h2hWins, h2hLosses, totalBets }: StatsGridProps) {
  const formatCurrency = (amount: number, isPositive: boolean): string => {
    const sign = isPositive ? "+" : "-";
    return `${sign}$${Math.abs(amount).toFixed(2)}`;
  };

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {/* Total Winnings */}
      <StatCard
        value={formatCurrency(totalWinnings, true)}
        label="TOTAL WINNINGS"
        valueColor="green"
      />

      {/* Total Losses */}
      <StatCard
        value={formatCurrency(totalLosses, false)}
        label="TOTAL LOSSES"
        valueColor="red"
      />

      {/* H2H Record */}
      <StatCard
        value=""
        label="H2H RECORD"
        mixedParts={{
          first: String(h2hWins),
          second: String(h2hLosses),
        }}
      />

      {/* Total Bets */}
      <StatCard
        value={String(totalBets)}
        label="TOTAL BETS"
        valueColor="white"
      />
    </div>
  );
}
