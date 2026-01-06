"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, UserPlus, DollarSign } from "lucide-react";

const navItems = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/groups", icon: Users, label: "Groups" },
  { href: "/friends", icon: UserPlus, label: "Friends" },
  { href: "/settle", icon: DollarSign, label: "Settle" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 safe-bottom z-40 h-20">
      {/* SVG background with curved cutout for FAB */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 393 80"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="navGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1a1d" />
            <stop offset="100%" stopColor="#18181B" />
          </linearGradient>
        </defs>
        {/* Path with curved notch in center - notch is ~90px wide, 45px deep */}
        <path
          d="M0 20 L151.5 20 Q161.5 20 168 28 Q180 45 196.5 45 Q213 45 225 28 Q231.5 20 241.5 20 L393 20 L393 80 L0 80 Z"
          fill="url(#navGradient)"
        />
      </svg>

      {/* Icon and label row */}
      <div className="relative flex items-end justify-between h-full px-8 pb-4 pt-6 max-w-md mx-auto">
        {/* Left tabs - Home and Groups */}
        {navItems.slice(0, 2).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center transition-colors ${
                isActive ? "text-sb-orange" : "text-white hover:text-sb-orange"
              }`}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span
                className="text-[8px] mt-1 font-semibold font-montserrat"
                style={{ textShadow: "0px 4px 4px rgba(0,0,0,0.25)" }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* FAB spacer - empty space in center */}
        <div className="w-20" />

        {/* Right tabs - Friends and Settle */}
        {navItems.slice(2).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center transition-colors ${
                isActive ? "text-sb-orange" : "text-white hover:text-sb-orange"
              }`}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span
                className="text-[8px] mt-1 font-semibold font-montserrat"
                style={{ textShadow: "0px 4px 4px rgba(0,0,0,0.25)" }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
