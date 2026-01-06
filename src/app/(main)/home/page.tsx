"use client";

import { FilterPills } from "@/components/ui/FilterPills";
import { SearchBar } from "@/components/ui/SearchBar";

export default function HomePage() {
  return (
    <div className="flex flex-col h-full">
      {/* Filter Pills */}
      <div className="mt-2">
        <FilterPills />
      </div>

      {/* Search Bar */}
      <div className="mt-4">
        <SearchBar />
      </div>

      {/* Empty State - Centered in remaining space */}
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[14px] font-light italic text-white text-center px-6">
          No Active Bets. Create One, Chump!
        </p>
      </div>
    </div>
  );
}
