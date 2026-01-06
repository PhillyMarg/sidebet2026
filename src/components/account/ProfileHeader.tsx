"use client";

interface ProfileHeaderProps {
  name: string;
  username: string;
  initials: string;
  memberSince: string;
}

export function ProfileHeader({ name, username, initials, memberSince }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center py-6">
      {/* Avatar Circle */}
      <div className="w-24 h-24 rounded-full bg-sb-orange flex items-center justify-center mb-4">
        <span className="text-white text-3xl font-bold">{initials}</span>
      </div>

      {/* Name */}
      <h2 className="text-xl font-bold text-white mb-1">{name}</h2>

      {/* Username */}
      <p className="text-sb-orange text-base mb-1">@{username}</p>

      {/* Member Since */}
      <p className="text-sb-muted text-sm">Member since {memberSince}</p>
    </div>
  );
}
