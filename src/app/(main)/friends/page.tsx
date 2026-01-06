"use client";

export default function FriendsPage() {
  return (
    <div className="px-4 py-4">
      <h1 className="text-2xl font-bold text-white mb-6">Friends</h1>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">🤝</div>
        <h2 className="text-xl font-bold text-white mb-2">No Friends Yet</h2>
        <p className="text-sb-muted text-center mb-6">
          Add friends to challenge them to head-to-head bets.
        </p>
        <button className="px-6 py-3 bg-sb-orange text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors">
          Add Friend
        </button>
      </div>
    </div>
  );
}
