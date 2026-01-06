"use client";

interface SuggestedFriendCardProps {
  name: string;
  username: string;
  source?: string;
  onAddFriend?: () => void;
}

export function SuggestedFriendCard({
  name,
  username,
  source,
  onAddFriend
}: SuggestedFriendCardProps) {
  return (
    <div className="flex flex-col gap-0">
      {/* Source Banner - Orange transparent background */}
      {source && (
        <div className="h-[12px] bg-[rgba(255,107,53,0.33)] rounded-[6px] px-2 flex items-center justify-center">
          <span className="text-white text-[8px] font-semibold font-montserrat">
            From: {source}
          </span>
        </div>
      )}

      {/* Friend Card */}
      <div className={`h-[36px] bg-[rgba(24,24,27,0.4)] rounded-[6px] px-3 flex items-center ${source ? 'mt-[8px]' : ''}`}>
        <div className="flex items-center gap-2 flex-1 overflow-hidden">
          {/* Name */}
          <span className="text-white text-[12px] font-semibold font-montserrat whitespace-nowrap">
            {name}
          </span>

          {/* Username */}
          <span className="text-sb-orange text-[10px] font-semibold font-montserrat whitespace-nowrap">
            @{username}
          </span>
        </div>

        {/* Challenge Button - Purple pill matching Figma */}
        <button
          onClick={onAddFriend}
          className="h-[15px] px-2 bg-[#8A38F5] text-white text-[6px] font-semibold font-montserrat uppercase rounded-[3px] hover:opacity-90 transition-opacity flex items-center justify-center"
        >
          CHALLENGE
        </button>
      </div>
    </div>
  );
}
