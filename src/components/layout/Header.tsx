"use client";

import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

interface HeaderProps {
  showNotifications?: boolean;
}

export function Header({ showNotifications = true }: HeaderProps) {
  const { user } = useAuth();
  const router = useRouter();

  const displayName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.firstName || "Guest";

  const handleUserNameClick = () => {
    router.push("/account");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 safe-top">
      <div className="flex items-center justify-between h-[50px] px-4 max-w-md mx-auto">
        {/* Logo + Brand */}
        <div className="flex items-center gap-2">
          {/* Orange Parallelogram Logo */}
          <div
            className="w-6 h-6 bg-sb-orange"
            style={{
              clipPath: "polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)",
            }}
          />
          <span className="text-[16px] font-bold text-white tracking-tight">SIDEBET</span>
        </div>

        {/* Right: User Name + Bell */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleUserNameClick}
            className="text-[10px] font-light italic text-white opacity-90 hover:text-sb-orange hover:opacity-100 transition-colors"
          >
            {displayName}
          </button>
          {showNotifications && (
            <button className="p-1 text-white hover:text-sb-orange transition-colors">
              <Bell size={24} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
