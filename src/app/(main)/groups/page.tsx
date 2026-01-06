"use client";

export default function GroupsPage() {
  return (
    <div className="px-4 py-4">
      <h1 className="text-2xl font-bold text-white mb-6">Groups</h1>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">👥</div>
        <h2 className="text-xl font-bold text-white mb-2">No Groups Yet</h2>
        <p className="text-sb-muted text-center mb-6">
          Create a group to start betting with friends.
        </p>
        <button className="px-6 py-3 bg-sb-orange text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors">
          Create Group
        </button>
      </div>
    </div>
  );
}
