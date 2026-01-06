"use client";

import { useState } from "react";
import { Plus, X, Trophy, DollarSign } from "lucide-react";

interface FABProps {
  onCreateBet: () => void;
  onCreateTournament: () => void;
}

export function FAB({ onCreateBet, onCreateTournament }: FABProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleCreateBet = () => {
    setIsOpen(false);
    onCreateBet();
  };

  const handleCreateTournament = () => {
    setIsOpen(false);
    onCreateTournament();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* FAB Container - positioned to float above the bottom nav */}
      {/* Nav is 80px, FAB outer is 82px, so FAB should sit with bottom ~20px into nav */}
      <div className="fixed bottom-[52px] left-1/2 -translate-x-1/2 z-50">
        {/* Options */}
        {isOpen && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col gap-3 items-center">
            {/* Create Tournament */}
            <button
              onClick={handleCreateTournament}
              className="flex items-center gap-3 bg-sb-card border border-sb-border rounded-full pl-4 pr-5 py-3 hover:bg-sb-card-hover transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-sb-purple flex items-center justify-center">
                <Trophy size={20} className="text-white" />
              </div>
              <span className="text-white font-semibold whitespace-nowrap">Tournament</span>
            </button>

            {/* Create Bet */}
            <button
              onClick={handleCreateBet}
              className="flex items-center gap-3 bg-sb-card border border-sb-border rounded-full pl-4 pr-5 py-3 hover:bg-sb-card-hover transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-sb-orange flex items-center justify-center">
                <DollarSign size={20} className="text-white" />
              </div>
              <span className="text-white font-semibold whitespace-nowrap">Create Bet</span>
            </button>
          </div>
        )}

        {/* Main FAB Button with gradient ring */}
        {/* Outer ring: 82px diameter with gradient border (orange to cream) */}
        {/* Inner circle: 64px diameter with solid gradient */}
        <button
          onClick={handleToggle}
          className="relative flex items-center justify-center"
          style={{
            width: "82px",
            height: "82px",
          }}
        >
          {/* Outer gradient ring - 82px */}
          <div
            className={`absolute inset-0 rounded-full transition-opacity duration-200 ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
            style={{
              background: "linear-gradient(135deg, #FF6B35 0%, #D4A574 50%, #C9A87C 100%)",
              boxShadow: "0 4px 20px rgba(255, 107, 53, 0.5), 0 0 30px rgba(255, 107, 53, 0.3)",
            }}
          />

          {/* Inner circle - 64px */}
          <div
            className={`
              relative w-16 h-16 rounded-full flex items-center justify-center
              transition-all duration-200
              ${
                isOpen
                  ? "bg-sb-card border border-sb-border"
                  : ""
              }
            `}
            style={
              !isOpen
                ? {
                    background: "linear-gradient(135deg, #FF6B35 0%, #D9632D 100%)",
                  }
                : undefined
            }
          >
            {isOpen ? (
              <X size={28} className="text-white" />
            ) : (
              <Plus size={32} className="text-white" strokeWidth={2.5} />
            )}
          </div>
        </button>
      </div>
    </>
  );
}
