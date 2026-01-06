"use client";

import { Bell } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  title?: string;
  showNotifications?: boolean;
}

export function Header({ title = "SideBet", showNotifications = true }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-sb-black/95 backdrop-blur-sm border-b border-sb-border z-50 safe-top">
      <div className="flex items-center justify-between h-14 px-4 max-w-md mx-auto">
        {/* Logo / Title */}
        <Link href="/home" className="flex items-center gap-2">
          <span className="text-xl font-bold text-sb-orange">{title}</span>
        </Link>

        {/* Right Actions */}
        {showNotifications && (
          <button className="relative p-2 text-sb-muted hover:text-white transition-colors">
            <Bell size={24} />
            {/* Notification badge - uncomment when needed */}
            {/* <span className="absolute top-1 right-1 w-2 h-2 bg-sb-red rounded-full" /> */}
          </button>
        )}
      </div>
    </header>
  );
}
