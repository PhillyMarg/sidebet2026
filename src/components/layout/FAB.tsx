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

      {/* FAB Container - positioned to sit in the bottom nav cutout */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 safe-bottom">
        {/* Options */}
        {isOpen && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col gap-3 items-center">
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

        {/* Main FAB Button - 64px diameter with orange gradient */}
        <button
          onClick={handleToggle}
          className={`
            w-16 h-16 rounded-full flex items-center justify-center
            transition-all duration-200
            ${
              isOpen
                ? "bg-sb-card border border-sb-border rotate-45"
                : "bg-gradient-to-br from-sb-orange to-[#D9632D] hover:from-orange-500 hover:to-orange-700"
            }
          `}
          style={{
            boxShadow: isOpen
              ? "none"
              : "0 4px 20px rgba(255, 107, 53, 0.5), 0 0 30px rgba(255, 107, 53, 0.3)",
          }}
        >
          {isOpen ? (
            <X size={28} className="text-white -rotate-45" />
          ) : (
            <Plus size={32} className="text-white" strokeWidth={2.5} />
          )}
        </button>
      </div>
    </>
  );
}
