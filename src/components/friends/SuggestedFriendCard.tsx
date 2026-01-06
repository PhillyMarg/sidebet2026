"use client";

import { UserPlus } from "lucide-react";

interface SuggestedFriendCardProps {
  name: string;
  username: string;
  source: string;
  onAddFriend: () => void;
}

export function SuggestedFriendCard({
  name,
  username,
  source,
  onAddFriend,
}: SuggestedFriendCardProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-sb-card rounded-lg">
      <div className="flex flex-col">
        <span className="text-white font-semibold text-sm">{name}</span>
        <span className="text-sb-orange text-xs">@{username}</span>
        <span className="text-sb-muted text-xs mt-0.5">From: {source}</span>
      </div>
      <button
        onClick={onAddFriend}
        className="w-8 h-8 flex items-center justify-center bg-sb-orange rounded-full hover:opacity-90 transition-opacity"
        aria-label="Add friend"
      >
        <UserPlus size={16} className="text-white" />
      </button>
    </div>
  );
}
