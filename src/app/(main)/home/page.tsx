"use client";

import { useState, useMemo } from "react";
import { FilterPills } from "@/components/ui/FilterPills";
import { SearchBar } from "@/components/ui/SearchBar";
import { BetCard } from "@/components/bet/BetCard";
import { sampleBets, SampleBetData } from "@/lib/data/sampleBets";

type FilterType = "ALL" | "VOTE NOW" | "MY BETS" | "RESULTS" | "URGENT" | "H2H";

// Filter bets based on selected filter
function filterBets(bets: SampleBetData[], filter: FilterType): SampleBetData[] {
  switch (filter) {
    case 'ALL':
      return bets;
    case 'VOTE NOW':
      return bets.filter(b => b.status === 'OPEN' && !b.userPick);
    case 'MY BETS':
      return bets.filter(b => b.userPick);
    case 'RESULTS':
      return bets.filter(b => b.status === 'WON' || b.status === 'LOST');
    case 'URGENT':
      return bets.filter(b => {
        if (!b.closingTime) return false;
        const closing = new Date(b.closingTime);
        const now = new Date();
        const hoursUntilClose = (closing.getTime() - now.getTime()) / (1000 * 60 * 60);
        return hoursUntilClose <= 24 && hoursUntilClose > 0 && b.status === 'OPEN';
      });
    case 'H2H':
      return bets.filter(b => b.category === 'H2H');
    default:
      return bets;
  }
}

// Search bets by title (case-insensitive)
function searchBets(bets: SampleBetData[], query: string): SampleBetData[] {
  if (!query.trim()) return bets;
  const lowerQuery = query.toLowerCase();
  return bets.filter(b => b.title.toLowerCase().includes(lowerQuery));
}

export default function HomePage() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Filter and search bets
  const filteredBets = useMemo(() => {
    const filtered = filterBets(sampleBets, selectedFilter);
    return searchBets(filtered, searchQuery);
  }, [selectedFilter, searchQuery]);

  // Handle filter change
  const handleFilterChange = (filter: FilterType) => {
    setSelectedFilter(filter);
    setExpandedCardId(null); // Collapse any expanded card when filter changes
  };

  // Handle search change
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setExpandedCardId(null); // Collapse any expanded card when searching
  };

  // Handle card expansion toggle - only one card can be expanded at a time
  const handleToggleExpand = (cardId: string) => {
    setExpandedCardId(prev => prev === cardId ? null : cardId);
  };

  // Handle vote action (placeholder for now)
  const handleVote = (betId: string, pick: 'YES' | 'NO' | 'OVER' | 'UNDER') => {
    console.log('[HomePage] Vote placed:', { betId, pick });
  };

  // Handle judge action (placeholder for now)
  const handleJudge = (betId: string, result: 'YES' | 'NO' | 'OVER' | 'UNDER') => {
    console.log('[HomePage] Judge result:', { betId, result });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sticky header with filter pills and search */}
      <div className="sticky top-0 z-10 bg-[#1C1C1E]">
        {/* Filter Pills */}
        <div className="mt-2">
          <FilterPills onFilterChange={handleFilterChange} />
        </div>

        {/* Search Bar */}
        <div className="mt-4 pb-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Bet Cards List */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        {filteredBets.length === 0 ? (
          /* Empty State */
          <div className="flex items-center justify-center h-full">
            <p className="text-[14px] font-light italic text-white text-center">
              No bets found. Try a different filter!
            </p>
          </div>
        ) : (
          /* Cards List */
          <div className="flex flex-col gap-2">
            {filteredBets.map((bet) => (
              <BetCard
                key={bet.id}
                bet={bet}
                isExpanded={expandedCardId === bet.id}
                onToggleExpand={() => handleToggleExpand(bet.id)}
                onVote={(pick) => handleVote(bet.id, pick)}
                onJudge={(result) => handleJudge(bet.id, result)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
