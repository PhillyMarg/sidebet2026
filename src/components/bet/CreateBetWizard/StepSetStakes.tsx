"use client";

import { useState } from "react";
import { Calendar, Clock, DollarSign } from "lucide-react";
import { CreateBetState } from "./index";

interface StepSetStakesProps {
  state: CreateBetState;
  updateState: (updates: Partial<CreateBetState>) => void;
  onNext: () => void;
  themeColor: string;
  showPreview: boolean; // H2H flow shows preview
}

const WAGER_QUICK_SELECT = [5, 10, 20, 50, 100];

const TIME_QUICK_SELECT = [
  { label: "1 hour", hours: 1 },
  { label: "4 hours", hours: 4 },
  { label: "24 hours", hours: 24 },
  { label: "1 week", hours: 168 },
];

export function StepSetStakes({
  state,
  updateState,
  onNext,
  themeColor,
  showPreview,
}: StepSetStakesProps) {
  const [customWager, setCustomWager] = useState(false);

  const isGroupCategory = state.betCategory === "GROUP";
  const accentBg = isGroupCategory ? "bg-sb-orange" : "bg-sb-purple";
  const accentBorder = isGroupCategory ? "border-sb-orange" : "border-sb-purple";
  const accentText = isGroupCategory ? "text-sb-orange" : "text-sb-purple";
  const accentBgLight = isGroupCategory ? "bg-sb-orange/10" : "bg-sb-purple/10";

  const handleQuickWager = (amount: number) => {
    updateState({ wagerAmount: amount });
    setCustomWager(false);
  };

  const handleTimeQuickSelect = (hours: number) => {
    const now = new Date();
    const closingDate = new Date(now.getTime() + hours * 60 * 60 * 1000);

    const dateStr = closingDate.toISOString().split("T")[0];
    const timeStr = closingDate.toTimeString().slice(0, 5);

    updateState({ closingDate: dateStr, closingTime: timeStr });
  };

  const canProceed =
    state.wagerAmount > 0 && state.closingDate && state.closingTime;

  // Format closing time for display
  const getClosingDisplay = () => {
    if (!state.closingDate || !state.closingTime) return null;
    const date = new Date(`${state.closingDate}T${state.closingTime}`);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Wager Amount Section */}
      <div className="space-y-3">
        <label className="text-sm text-sb-muted flex items-center gap-2">
          <DollarSign size={16} />
          Wager Amount
        </label>

        {/* Quick Select Buttons */}
        <div className="grid grid-cols-5 gap-2">
          {WAGER_QUICK_SELECT.map((amount) => (
            <button
              key={amount}
              onClick={() => handleQuickWager(amount)}
              className={`
                py-3 rounded-xl font-semibold text-sm transition-all
                ${
                  state.wagerAmount === amount && !customWager
                    ? `${accentBg} text-white`
                    : "bg-sb-card border border-sb-border text-white hover:border-sb-muted"
                }
              `}
            >
              ${amount}
            </button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sb-muted text-lg">
            $
          </span>
          <input
            type="number"
            value={customWager ? state.wagerAmount : ""}
            onChange={(e) => {
              setCustomWager(true);
              updateState({ wagerAmount: parseFloat(e.target.value) || 0 });
            }}
            onFocus={() => setCustomWager(true)}
            placeholder="Custom amount"
            className={`
              w-full p-4 pl-8 rounded-xl border-2 bg-sb-card text-white
              placeholder:text-sb-muted outline-none transition-colors
              ${customWager && state.wagerAmount > 0 ? accentBorder : "border-sb-border focus:border-sb-muted"}
            `}
          />
        </div>

        {/* Selected Amount Display */}
        <div className={`text-center py-2 rounded-lg ${accentBgLight}`}>
          <span className={`text-2xl font-bold ${accentText}`}>
            ${state.wagerAmount}
          </span>
        </div>
      </div>

      {/* Closing Time Section */}
      <div className="space-y-3">
        <label className="text-sm text-sb-muted flex items-center gap-2">
          <Clock size={16} />
          Betting Closes
        </label>

        {/* Quick Time Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {TIME_QUICK_SELECT.map((option) => (
            <button
              key={option.label}
              onClick={() => handleTimeQuickSelect(option.hours)}
              className="
                py-2 px-2 rounded-xl text-xs font-medium transition-all
                bg-sb-card border border-sb-border text-white hover:border-sb-muted
              "
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Date and Time Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sb-muted" />
            <input
              type="date"
              value={state.closingDate}
              onChange={(e) => updateState({ closingDate: e.target.value })}
              min={new Date().toISOString().split("T")[0]}
              className={`
                w-full p-4 pl-12 rounded-xl border-2 bg-sb-card text-white
                outline-none transition-colors
                ${state.closingDate ? accentBorder : "border-sb-border"}
              `}
            />
          </div>
          <div className="relative">
            <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sb-muted" />
            <input
              type="time"
              value={state.closingTime}
              onChange={(e) => updateState({ closingTime: e.target.value })}
              className={`
                w-full p-4 pl-12 rounded-xl border-2 bg-sb-card text-white
                outline-none transition-colors
                ${state.closingTime ? accentBorder : "border-sb-border"}
              `}
            />
          </div>
        </div>

        {/* Selected Time Display */}
        {getClosingDisplay() && (
          <div className={`text-center py-2 rounded-lg ${accentBgLight}`}>
            <span className={`text-sm font-medium ${accentText}`}>
              Closes: {getClosingDisplay()}
            </span>
          </div>
        )}
      </div>

      {/* H2H Preview */}
      {showPreview && (
        <div className={`p-4 rounded-xl border ${accentBorder} ${accentBgLight}`}>
          <p className="text-xs text-sb-muted mb-3">Bet Preview</p>

          <div className="space-y-2">
            <p className="text-white font-semibold">{state.title}</p>
            {state.betType === "OVER_UNDER" && state.line && (
              <p className={`font-medium ${accentText}`}>Line: {state.line}</p>
            )}
            {state.description && (
              <p className="text-sm text-sb-muted">{state.description}</p>
            )}

            <div className="pt-2 border-t border-sb-border mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-sb-muted">Challenging:</span>
                <span className="text-white font-medium">{state.selectedFriendName}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-sb-muted">Wager:</span>
                <span className={`font-bold ${accentText}`}>${state.wagerAmount}</span>
              </div>
              {getClosingDisplay() && (
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-sb-muted">Closes:</span>
                  <span className="text-white">{getClosingDisplay()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={!canProceed}
        className={`
          w-full py-4 rounded-xl font-semibold text-white
          transition-all mt-4
          ${
            canProceed
              ? `${accentBg} hover:opacity-90`
              : "bg-sb-border text-sb-muted cursor-not-allowed"
          }
        `}
      >
        Review Bet
      </button>
    </div>
  );
}
