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
    <nav className="fixed bottom-0 left-0 right-0 safe-bottom z-40">
      {/* SVG background with curved cutout */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 375 80"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0H145C145 0 155 0 165 10C175 20 185 30 187.5 30C190 30 200 20 210 10C220 0 230 0 230 0H375V80H0V0Z"
          fill="#18181B"
        />
      </svg>

      <div className="relative flex items-center justify-around h-20 max-w-md mx-auto">
        {/* Left tabs */}
        {navItems.slice(0, 2).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-full pt-2 transition-colors ${
                isActive ? "text-[#F37736]" : "text-white hover:text-[#F37736]"
              }`}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[8px] mt-1 font-semibold">{item.label}</span>
            </Link>
          );
        })}

        {/* FAB spacer */}
        <div className="w-20" />

        {/* Right tabs */}
        {navItems.slice(2).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-full pt-2 transition-colors ${
                isActive ? "text-[#F37736]" : "text-white hover:text-[#F37736]"
              }`}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[8px] mt-1 font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
