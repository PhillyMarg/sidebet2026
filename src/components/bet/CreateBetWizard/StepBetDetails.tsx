"use client";

import { CreateBetState } from "./index";

interface StepBetDetailsProps {
  state: CreateBetState;
  updateState: (updates: Partial<CreateBetState>) => void;
  onNext: () => void;
  themeColor: string;
}

export function StepBetDetails({
  state,
  updateState,
  onNext,
  themeColor,
}: StepBetDetailsProps) {
  const isOverUnder = state.betType === "OVER_UNDER";
  const isGroupCategory = state.betCategory === "GROUP";

  const accentBg = isGroupCategory ? "bg-sb-orange" : "bg-sb-purple";
  const accentBorder = isGroupCategory ? "border-sb-orange" : "border-sb-purple";

  const canProceed =
    state.title.trim().length > 0 &&
    (!isOverUnder || (state.line !== undefined && state.line > 0));

  return (
    <div className="flex flex-col gap-6">
      {/* Bet Type Indicator */}
      <div className="flex items-center gap-2">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${accentBg} text-white`}>
          {state.betType === "YES_NO" ? "Yes / No" : "Over / Under"}
        </span>
      </div>

      {/* Title Input */}
      <div className="space-y-2">
        <label className="text-sm text-sb-muted">
          {state.betType === "YES_NO" ? "What's the question?" : "What's being measured?"}
        </label>
        <input
          type="text"
          value={state.title}
          onChange={(e) => updateState({ title: e.target.value })}
          placeholder={
            state.betType === "YES_NO"
              ? "e.g., Will the Eagles win the Super Bowl?"
              : "e.g., Total points in the game"
          }
          className={`
            w-full p-4 rounded-xl border-2 bg-sb-card text-white
            placeholder:text-sb-muted outline-none transition-colors
            ${state.title ? accentBorder : "border-sb-border focus:border-sb-muted"}
          `}
        />
      </div>

      {/* Description Input */}
      <div className="space-y-2">
        <label className="text-sm text-sb-muted">Description (optional)</label>
        <textarea
          value={state.description}
          onChange={(e) => updateState({ description: e.target.value })}
          placeholder="Add any rules, conditions, or details..."
          rows={3}
          className="
            w-full p-4 rounded-xl border-2 border-sb-border bg-sb-card text-white
            placeholder:text-sb-muted outline-none transition-colors resize-none
            focus:border-sb-muted
          "
        />
      </div>

      {/* Line Input (Over/Under only) */}
      {isOverUnder && (
        <div className="space-y-2">
          <label className="text-sm text-sb-muted">Set the Line</label>
          <div className="relative">
            <input
              type="number"
              value={state.line || ""}
              onChange={(e) =>
                updateState({ line: e.target.value ? parseFloat(e.target.value) : undefined })
              }
              placeholder="e.g., 45.5"
              step="0.5"
              className={`
                w-full p-4 rounded-xl border-2 bg-sb-card text-white text-2xl font-bold text-center
                placeholder:text-sb-muted placeholder:text-base placeholder:font-normal
                outline-none transition-colors
                ${state.line ? accentBorder : "border-sb-border focus:border-sb-muted"}
              `}
            />
          </div>
          <p className="text-xs text-sb-muted text-center">
            Bettors will predict if the result is over or under this number
          </p>
        </div>
      )}

      {/* Preview */}
      {state.title && (
        <div className={`p-4 rounded-xl border ${accentBorder} ${isGroupCategory ? "bg-sb-orange/5" : "bg-sb-purple/5"}`}>
          <p className="text-xs text-sb-muted mb-2">Preview</p>
          <p className="text-white font-medium">{state.title}</p>
          {isOverUnder && state.line && (
            <p className={`text-lg font-bold mt-2 ${isGroupCategory ? "text-sb-orange" : "text-sb-purple"}`}>
              Line: {state.line}
            </p>
          )}
          {state.description && (
            <p className="text-sm text-sb-muted mt-2">{state.description}</p>
          )}
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
        Continue
      </button>
    </div>
  );
}
