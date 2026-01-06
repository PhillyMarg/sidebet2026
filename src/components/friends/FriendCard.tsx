"use client";

interface FriendCardProps {
  name: string;
  username: string;
  record?: { wins: number; losses: number; ties: number };
  onChallenge?: () => void;
}

export function FriendCard({ name, username, record, onChallenge }: FriendCardProps) {
  // Format record as "W-L-T" string
  const recordString = record ? `${record.wins}-${record.losses}-${record.ties}` : null;

  return (
    <div className="h-[36px] bg-[rgba(24,24,27,0.4)] rounded-[6px] px-3 flex items-center">
      <div className="flex items-center gap-2 flex-1 overflow-hidden">
        {/* Name */}
        <span className="text-white text-[12px] font-semibold font-montserrat whitespace-nowrap">
          {name}
        </span>

        {/* Username */}
        <span className="text-sb-orange text-[10px] font-semibold font-montserrat whitespace-nowrap">
          @{username}
        </span>

        {/* Record - Purple color matching Figma */}
        {recordString && (
          <span className="text-[#8A38F5] text-[12px] font-semibold font-montserrat whitespace-nowrap">
            {recordString}
          </span>
        )}
      </div>

      {/* Challenge Button - Purple pill matching Figma */}
      <button
        onClick={onChallenge}
        className="h-[15px] px-2 bg-[#8A38F5] text-white text-[6px] font-semibold font-montserrat uppercase rounded-[3px] hover:opacity-90 transition-opacity flex items-center justify-center"
      >
        CHALLENGE
      </button>
    </div>
  );
}
