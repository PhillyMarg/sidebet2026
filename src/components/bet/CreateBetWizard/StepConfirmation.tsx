"use client";

import { Users, User, HelpCircle, TrendingUp, DollarSign, Clock, AlertCircle } from "lucide-react";
import { CreateBetState } from "./index";

interface StepConfirmationProps {
  state: CreateBetState;
  themeColor: string;
  onConfirm: () => void;
}

export function StepConfirmation({
  state,
  themeColor,
  onConfirm,
}: StepConfirmationProps) {
  const isGroupCategory = state.betCategory === "GROUP";
  const isH2H = state.betCategory === "H2H";

  const accentBg = isGroupCategory ? "bg-sb-orange" : "bg-sb-purple";
  const accentBorder = isGroupCategory ? "border-sb-orange" : "border-sb-purple";
  const accentText = isGroupCategory ? "text-sb-orange" : "text-sb-purple";
  const accentBgLight = isGroupCategory ? "bg-sb-orange/10" : "bg-sb-purple/10";

  // Format closing time for display
  const getClosingDisplay = () => {
    if (!state.closingDate || !state.closingTime) return "Not set";
    const date = new Date(`${state.closingDate}T${state.closingTime}`);
    return date.toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Bet Summary Card */}
      <div className={`rounded-2xl border-2 ${accentBorder} overflow-hidden`}>
        {/* Header */}
        <div className={`${accentBg} p-4`}>
          <div className="flex items-center gap-3">
            {isGroupCategory ? (
              <Users size={24} className="text-white" />
            ) : (
              <User size={24} className="text-white" />
            )}
            <div>
              <p className="text-white/80 text-xs">
                {isGroupCategory ? "Group Bet" : "Head-to-Head"}
              </p>
              <p className="text-white font-semibold">
                {isGroupCategory ? state.selectedGroupName : `vs ${state.selectedFriendName}`}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-sb-card p-4 space-y-4">
          {/* Bet Type Badge */}
          <div className="flex items-center gap-2">
            {state.betType === "YES_NO" ? (
              <HelpCircle size={16} className={accentText} />
            ) : (
              <TrendingUp size={16} className={accentText} />
            )}
            <span className={`text-sm font-medium ${accentText}`}>
              {state.betType === "YES_NO" ? "Yes / No" : "Over / Under"}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white">{state.title}</h3>

          {/* Description */}
          {state.description && (
            <p className="text-sb-muted text-sm">{state.description}</p>
          )}

          {/* Line (Over/Under) */}
          {state.betType === "OVER_UNDER" && state.line && (
            <div className={`p-3 rounded-xl ${accentBgLight} flex items-center justify-center`}>
              <span className={`text-3xl font-bold ${accentText}`}>{state.line}</span>
              <span className="text-sb-muted ml-2">Line</span>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-sb-border" />

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${accentBgLight} flex items-center justify-center`}>
                <DollarSign size={20} className={accentText} />
              </div>
              <div>
                <p className="text-xs text-sb-muted">Wager</p>
                <p className="text-white font-bold">${state.wagerAmount}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${accentBgLight} flex items-center justify-center`}>
                <Clock size={20} className={accentText} />
              </div>
              <div>
                <p className="text-xs text-sb-muted">Closes</p>
                <p className="text-white font-bold text-sm">{getClosingDisplay()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Notice */}
      <div className="flex items-start gap-3 p-4 bg-sb-card rounded-xl border border-sb-border">
        <AlertCircle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="text-white font-medium">Before you confirm</p>
          <p className="text-sb-muted mt-1">
            {isH2H
              ? `Your friend will need to accept this bet. The wager of $${state.wagerAmount} will be held until the bet is resolved.`
              : `This bet will be posted to ${state.selectedGroupName}. Group members can place their picks until the closing time.`}
          </p>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={onConfirm}
        className={`
          w-full py-4 rounded-xl font-semibold text-white
          transition-all
          ${accentBg} hover:opacity-90
        `}
        style={{
          boxShadow: isGroupCategory
            ? "0 4px 20px rgba(255, 107, 53, 0.4)"
            : "0 4px 20px rgba(123, 44, 191, 0.4)",
        }}
      >
        {isH2H ? "Send Challenge" : "Post Bet"}
      </button>

      <p className="text-center text-xs text-sb-muted">
        By confirming, you agree to the terms of this bet
      </p>
    </div>
  );
}
