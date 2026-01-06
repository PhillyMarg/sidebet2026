"use client";

interface FriendCardProps {
  name: string;
  username: string;
  record?: { wins: number; losses: number; ties: number };
  onChallenge?: () => void;
}

export function FriendCard({ name, username, record, onChallenge }: FriendCardProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-sb-card rounded-lg">
      <div className="flex flex-col">
        <span className="text-white font-semibold text-sm">{name}</span>
        <span className="text-sb-orange text-xs">@{username}</span>
        {record && (
          <div className="flex items-center gap-1 mt-1 text-xs">
            <span className="text-sb-green">{record.wins}</span>
            <span className="text-sb-muted">-</span>
            <span className="text-sb-red">{record.losses}</span>
            <span className="text-sb-muted">-</span>
            <span className="text-sb-muted">{record.ties}</span>
          </div>
        )}
      </div>
      <button
        onClick={onChallenge}
        className="px-3 py-1.5 bg-sb-purple text-white text-xs font-semibold uppercase rounded-full hover:opacity-90 transition-opacity"
      >
        Challenge
      </button>
    </div>
  );
}
