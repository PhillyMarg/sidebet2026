"use client";

import { useState } from "react";

const FILTERS = ["ALL", "VOTE NOW", "MY BETS", "RESULTS", "URGENT", "H2H"] as const;

type FilterType = (typeof FILTERS)[number];

interface FilterPillsProps {
  onFilterChange?: (filter: FilterType) => void;
}

export function FilterPills({ onFilterChange }: FilterPillsProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("ALL");

  const handleFilterClick = (filter: FilterType) => {
    setSelectedFilter(filter);
    onFilterChange?.(filter);
  };

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-6 py-2">
      {FILTERS.map((filter) => {
        const isSelected = filter === selectedFilter;
        return (
          <button
            key={filter}
            onClick={() => handleFilterClick(filter)}
            className={`
              px-4 py-2 rounded-full text-[12px] font-semibold whitespace-nowrap
              transition-colors border
              ${
                isSelected
                  ? "border-[#F37736] text-[#F37736]"
                  : "border-white/30 text-white hover:border-white/50"
              }
            `}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
