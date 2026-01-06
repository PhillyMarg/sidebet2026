"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, UserPlus, DollarSign, Plus } from "lucide-react";

const navItems = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/groups", icon: Users, label: "Groups" },
  { href: "/friends", icon: UserPlus, label: "Friends" },
  { href: "/settle", icon: DollarSign, label: "Settle" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      {/* FAB Button - Positioned above nav */}
      <Link
        href="/create"
        className="fixed bottom-[44px] left-1/2 -translate-x-1/2 z-50 flex items-center justify-center"
      >
        {/* Outer gradient ring */}
        <div
          className="w-[64px] h-[64px] rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #FF6B35 0%, #E8D5B7 50%, #D4A574 100%)",
          }}
        >
          {/* Inner circle */}
          <div
            className="w-[54px] h-[54px] rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #E8D5B7 0%, #D4A574 50%, #C49A6C 100%)",
            }}
          >
            <Plus size={28} className="text-sb-orange" strokeWidth={2.5} />
          </div>
        </div>
      </Link>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 h-[80px]">
        {/* SVG background with curved cutout */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 393 80"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="navBgGradient" x1="0%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#2D2520" />
              <stop offset="50%" stopColor="#3D2D25" />
              <stop offset="100%" stopColor="#5C3D2E" />
            </linearGradient>
          </defs>
          <path
            d="M0 0
               L156 0
               C156 0 156 0 160 4
               A36 36 0 0 0 233 4
               C237 0 237 0 237 0
               L393 0
               L393 80
               L0 80
               Z"
            fill="url(#navBgGradient)"
          />
        </svg>

        {/* Navigation content */}
        <div className="relative flex h-full">
          {/* Left side - Home and Groups */}
          <div className="flex-1 flex items-center justify-around pt-2">
            {navItems.slice(0, 2).map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 transition-colors ${
                    isActive ? "text-sb-orange" : "text-white hover:text-sb-orange"
                  }`}
                >
                  <item.icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
                  <span
                    className="text-[8px] font-semibold font-montserrat uppercase"
                    style={{ textShadow: "0px 4px 4px rgba(0,0,0,0.25)" }}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Center spacer for FAB */}
          <div className="w-[80px]" />

          {/* Right side - Friends and Settle */}
          <div className="flex-1 flex items-center justify-around pt-2">
            {navItems.slice(2).map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 transition-colors ${
                    isActive ? "text-sb-orange" : "text-white hover:text-sb-orange"
                  }`}
                >
                  <item.icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
                  <span
                    className="text-[8px] font-semibold font-montserrat uppercase"
                    style={{ textShadow: "0px 4px 4px rgba(0,0,0,0.25)" }}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
