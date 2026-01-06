"use client";

import { useAuth } from "@/lib/hooks/useAuth";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="px-4 py-4">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          Hey, {user?.firstName || "there"}! 👋
        </h1>
        <p className="text-sb-muted mt-1">Ready to make some bets?</p>
      </div>

      {/* Filter Pills - TODO */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {["ALL", "OPEN", "MY PICKS", "PENDING", "SOON"].map((filter) => (
          <button
            key={filter}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === "ALL"
                ? "bg-sb-orange text-white"
                : "bg-sb-card text-sb-muted hover:text-white border border-sb-border"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">🎲</div>
        <h2 className="text-xl font-bold text-white mb-2">No Active Bets</h2>
        <p className="text-sb-muted text-center mb-6">
          Create one, chump! Tap the + button below.
        </p>
      </div>

      {/* TODO: BetCard list will go here */}
    </div>
  );
}
