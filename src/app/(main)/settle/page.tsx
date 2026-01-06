"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import {
  SettleTabs,
  SettleTab,
  SummaryCard,
  BalanceSection,
  HistoryFilters,
  HistoryFilter,
  HistoryBetCard,
} from "@/components/settle";
import { BetCard, BetData } from "@/components/bet";
import { sampleSettlements, SettlementPerson, BetToJudge } from "@/lib/data/sampleSettlements";

export default function SettlePage() {
  const [activeTab, setActiveTab] = useState<SettleTab>("balance");
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Local state for settlements (will be replaced with Firebase later)
  const [settlements, setSettlements] = useState(sampleSettlements);

  // Handle marking a person as settled
  const handleMarkSettled = (personId: string, type: 'owed' | 'owes') => {
    const today = new Date();
    const dateStr = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

    setSettlements((prev) => {
      let person: SettlementPerson | undefined;
      const newOwedToYou = [...prev.owedToYou];
      const newYouOwe = [...prev.youOwe];
      const newSettled = [...prev.settled];

      if (type === 'owed') {
        const index = newOwedToYou.findIndex((p) => p.id === personId);
        if (index !== -1) {
          person = { ...newOwedToYou[index], isSettled: true, settledDate: dateStr };
          newOwedToYou.splice(index, 1);
        }
      } else {
        const index = newYouOwe.findIndex((p) => p.id === personId);
        if (index !== -1) {
          person = { ...newYouOwe[index], isSettled: true, settledDate: dateStr };
          newYouOwe.splice(index, 1);
        }
      }

      if (person) {
        newSettled.unshift(person);
      }

      // Recalculate summary
      const youreOwed = newOwedToYou.reduce((sum, p) => sum + Math.abs(p.amount), 0);
      const youOwe = newYouOwe.reduce((sum, p) => sum + Math.abs(p.amount), 0);
      const netBalance = youreOwed - youOwe;

      return {
        ...prev,
        owedToYou: newOwedToYou,
        youOwe: newYouOwe,
        settled: newSettled,
        summary: { netBalance, youreOwed, youOwe },
      };
    });
  };

  // Handle judging a bet
  const handleJudgeBet = (betId: string, result: 'YES' | 'NO' | 'OVER' | 'UNDER') => {
    console.log(`Judged bet ${betId} with result: ${result}`);
    // Remove the judged bet from the list
    setSettlements((prev) => ({
      ...prev,
      betsToJudge: prev.betsToJudge.filter((b) => b.id !== betId),
    }));
    // TODO: In real app, submit to Firebase and update balances
  };

  // Convert BetToJudge to BetData format for BetCard
  const convertToBetData = (bet: BetToJudge): BetData => ({
    id: bet.id,
    type: bet.type,
    category: 'GROUP',
    title: bet.title,
    description: bet.description,
    groupName: bet.groupName,
    creatorName: bet.creatorName,
    playerCount: bet.playerCount,
    wager: bet.pot / bet.playerCount,
    totalPot: bet.pot,
    line: bet.line,
    closingDate: bet.closingDate,
    yesPercentage: bet.yesPercentage,
    noPercentage: bet.noPercentage,
    status: 'JUDGE',
  });

  // Filter history based on selected filter and search query
  const filteredHistory = useMemo(() => {
    let filtered = settlements.history;

    // Apply filter
    if (historyFilter === 'WON') {
      filtered = filtered.filter((bet) => bet.status === 'WON');
    } else if (historyFilter === 'LOST') {
      filtered = filtered.filter((bet) => bet.status === 'LOST');
    } else if (historyFilter === 'H2H') {
      filtered = filtered.filter((bet) => bet.category === 'H2H');
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (bet) =>
          bet.title.toLowerCase().includes(query) ||
          bet.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [settlements.history, historyFilter, searchQuery]);

  // Check if there are any balances
  const hasBalances = settlements.owedToYou.length > 0 || settlements.youOwe.length > 0;

  return (
    <div className="pb-4">
      {/* Tab Navigation */}
      <SettleTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      {activeTab === "balance" && (
        <div className="space-y-6">
          {/* Summary Card */}
          <SummaryCard
            netBalance={settlements.summary.netBalance}
            youreOwed={settlements.summary.youreOwed}
            youOwe={settlements.summary.youOwe}
          />

          {/* Balance Sections */}
          {hasBalances ? (
            <div className="space-y-6">
              <BalanceSection
                title="OWED TO YOU"
                type="owed"
                people={settlements.owedToYou}
                onMarkSettled={(id) => handleMarkSettled(id, 'owed')}
              />
              <BalanceSection
                title="YOU OWE"
                type="owes"
                people={settlements.youOwe}
                onMarkSettled={(id) => handleMarkSettled(id, 'owes')}
              />
              {settlements.settled.length > 0 && (
                <BalanceSection
                  title="RECENTLY SETTLED"
                  type="owed"
                  people={settlements.settled}
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 px-4">
              <div className="text-5xl mb-4">💰</div>
              <h2 className="text-lg font-bold text-white mb-2">All Settled Up!</h2>
              <p className="text-sb-muted text-center">No outstanding balances.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "judge" && (
        <div className="space-y-6">
          {/* Summary Card */}
          <SummaryCard
            netBalance={settlements.summary.netBalance}
            youreOwed={settlements.summary.youreOwed}
            youOwe={settlements.summary.youOwe}
          />

          {/* Bets to Judge */}
          {settlements.betsToJudge.length > 0 ? (
            <div className="space-y-4 px-4">
              {settlements.betsToJudge.map((bet) => (
                <BetCard
                  key={bet.id}
                  bet={convertToBetData(bet)}
                  onJudge={(result) => handleJudgeBet(bet.id, result)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 px-4">
              <div className="text-5xl mb-4">⚖️</div>
              <h2 className="text-lg font-bold text-white mb-2">No Bets to Judge!</h2>
              <p className="text-sb-muted text-center">
                Bets you created that need judging will appear here.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="px-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B3B3B3]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Past Bets..."
                className="
                  w-full h-10 pl-10 pr-4
                  bg-[#2B2B2F] rounded-[6px]
                  text-[12px] text-white placeholder:text-[#B3B3B3]
                  border-none outline-none
                  focus:ring-1 focus:ring-sb-orange/50
                "
              />
            </div>
          </div>

          {/* Filter Pills */}
          <HistoryFilters
            activeFilter={historyFilter}
            onFilterChange={setHistoryFilter}
          />

          {/* History List */}
          {filteredHistory.length > 0 ? (
            <div className="space-y-4 px-4">
              {filteredHistory.map((bet) => (
                <HistoryBetCard key={bet.id} bet={bet} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 px-4">
              <div className="text-5xl mb-4">📜</div>
              <h2 className="text-lg font-bold text-white mb-2">
                {searchQuery ? "No matches found" : "No Past Bets. Really?"}
              </h2>
              <p className="text-sb-muted text-center">
                {searchQuery
                  ? "Try a different search term."
                  : "Your completed bet history will appear here."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
