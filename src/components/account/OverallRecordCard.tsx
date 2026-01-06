"use client";

interface OverallRecordCardProps {
  wins: number;
  losses: number;
  ties: number;
  winRate: number;
}

export function OverallRecordCard({ wins, losses, ties, winRate }: OverallRecordCardProps) {
  return (
    <div className="bg-sb-card border border-sb-border rounded-xl p-4 mb-4">
      {/* Label */}
      <p className="text-sb-muted text-2xs font-semibold uppercase tracking-wide mb-2">
        OVERALL RECORD
      </p>

      {/* Record: W - L - T */}
      <div className="flex items-center gap-1 mb-3">
        <span className="text-sb-green text-2xl font-bold">{wins}</span>
        <span className="text-white text-2xl font-bold"> - </span>
        <span className="text-sb-red text-2xl font-bold">{losses}</span>
        <span className="text-white text-2xl font-bold"> - </span>
        <span className="text-sb-muted text-2xl font-bold">{ties}</span>
      </div>

      {/* Win Rate */}
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-white">{winRate} %</span>
      </div>
      <p className="text-sb-muted text-sm mt-1">Win Rate</p>
    </div>
  );
}
