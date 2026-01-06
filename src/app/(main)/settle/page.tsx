"use client";

import { useState } from "react";

type SettleTab = "balance" | "judge" | "history";

export default function SettlePage() {
  const [activeTab, setActiveTab] = useState<SettleTab>("balance");

  return (
    <div className="px-4 py-4">
      <h1 className="text-2xl font-bold text-white mb-6">Settle</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["balance", "judge", "history"] as SettleTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
              activeTab === tab
                ? "bg-sb-orange text-white"
                : "bg-sb-card text-sb-muted hover:text-white border border-sb-border"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "balance" && (
        <div>
          {/* Summary Card */}
          <div className="bg-sb-card border border-sb-border rounded-xl p-4 mb-6">
            <div className="text-center mb-4">
              <p className="text-sb-muted text-sm">Net Balance</p>
              <p className="text-3xl font-bold text-sb-green">+$0.00</p>
            </div>
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-sb-muted">You&apos;re Owed</p>
                <p className="text-white font-semibold">$0.00</p>
              </div>
              <div className="text-right">
                <p className="text-sb-muted">You Owe</p>
                <p className="text-white font-semibold">$0.00</p>
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-10">
            <div className="text-5xl mb-4">💰</div>
            <h2 className="text-lg font-bold text-white mb-2">All Settled Up!</h2>
            <p className="text-sb-muted text-center">No outstanding balances.</p>
          </div>
        </div>
      )}

      {activeTab === "judge" && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-5xl mb-4">⚖️</div>
          <h2 className="text-lg font-bold text-white mb-2">No Bets to Judge</h2>
          <p className="text-sb-muted text-center">
            Bets you created that need judging will appear here.
          </p>
        </div>
      )}

      {activeTab === "history" && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-5xl mb-4">📜</div>
          <h2 className="text-lg font-bold text-white mb-2">No History Yet</h2>
          <p className="text-sb-muted text-center">
            Past settled transactions will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
