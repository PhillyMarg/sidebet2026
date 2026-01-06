"use client";

type ValueColor = "green" | "red" | "white" | "mixed";

interface StatCardProps {
  value: string;
  label: string;
  valueColor?: ValueColor;
  // For mixed color values like "12-8" where first is green, second is red
  mixedParts?: {
    first: string;
    second: string;
  };
}

export function StatCard({ value, label, valueColor = "white", mixedParts }: StatCardProps) {
  const getColorClass = (color: ValueColor): string => {
    switch (color) {
      case "green":
        return "text-sb-green";
      case "red":
        return "text-sb-red";
      default:
        return "text-white";
    }
  };

  return (
    <div className="bg-sb-card border border-sb-border rounded-xl p-4 flex flex-col items-center justify-center">
      {/* Value */}
      {mixedParts ? (
        <div className="flex items-center">
          <span className="text-sb-green text-xl font-bold">{mixedParts.first}</span>
          <span className="text-white text-xl font-bold">-</span>
          <span className="text-sb-red text-xl font-bold">{mixedParts.second}</span>
        </div>
      ) : (
        <span className={`text-xl font-bold ${getColorClass(valueColor)}`}>
          {value}
        </span>
      )}

      {/* Label */}
      <p className="text-sb-muted text-2xs font-semibold uppercase tracking-wide mt-1">
        {label}
      </p>
    </div>
  );
}
