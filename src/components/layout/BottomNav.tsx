"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, UserPlus, Wallet } from "lucide-react";

const navItems = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/groups", icon: Users, label: "Groups" },
  { href: "/friends", icon: UserPlus, label: "Friends" },
  { href: "/settle", icon: Wallet, label: "Settle" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-sb-black border-t border-sb-border safe-bottom z-40">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto relative">
        {/* Left tabs */}
        {navItems.slice(0, 2).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
                isActive ? "text-sb-orange" : "text-sb-muted hover:text-white"
              }`}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-2xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* FAB spacer */}
        <div className="w-16" />

        {/* Right tabs */}
        {navItems.slice(2).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
                isActive ? "text-sb-orange" : "text-sb-muted hover:text-white"
              }`}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-2xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
