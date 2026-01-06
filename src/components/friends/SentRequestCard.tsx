"use client";

interface SentRequestCardProps {
  name: string;
  username: string;
}

export function SentRequestCard({ name, username }: SentRequestCardProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-sb-card rounded-lg">
      <div className="flex flex-col">
        <span className="text-white font-semibold text-sm">{name}</span>
        <span className="text-sb-orange text-xs">@{username}</span>
      </div>
      <span className="text-sb-muted text-xs font-semibold uppercase">Pending...</span>
    </div>
  );
}
