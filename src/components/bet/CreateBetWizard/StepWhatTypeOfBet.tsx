"use client";

import { Check, HelpCircle, TrendingUp } from "lucide-react";
import { CreateBetState } from "./index";

interface StepWhatTypeOfBetProps {
  state: CreateBetState;
  updateState: (updates: Partial<CreateBetState>) => void;
  onNext: () => void;
  themeColor: string;
  isGroupFlow: boolean;
}

export function StepWhatTypeOfBet({
  state,
  updateState,
  onNext,
  themeColor,
  isGroupFlow,
}: StepWhatTypeOfBetProps) {
  const isYesNoSelected = state.betType === "YES_NO";
  const isOverUnderSelected = state.betType === "OVER_UNDER";
  const isGroupCategory = state.betCategory === "GROUP";

  const accentColor = isGroupCategory ? "sb-orange" : "sb-purple";
  const accentBg = isGroupCategory ? "bg-sb-orange" : "bg-sb-purple";
  const accentBorder = isGroupCategory ? "border-sb-orange" : "border-sb-purple";
  const accentText = isGroupCategory ? "text-sb-orange" : "text-sb-purple";
  const accentBgLight = isGroupCategory ? "bg-sb-orange/10" : "bg-sb-purple/10";

  // For Group flow, only type selection
  // For H2H flow, type selection + title + description + line (combined)
  const canProceed = isGroupFlow
    ? state.betType !== null
    : state.betType !== null &&
      state.title.trim().length > 0 &&
      (state.betType !== "OVER_UNDER" || (state.line !== undefined && state.line > 0));

  return (
    <div className="flex flex-col gap-6">
      {/* Bet Type Selection */}
      <div className="space-y-2">
        <label className="text-sm text-sb-muted">Bet Type</label>
        <div className="grid grid-cols-2 gap-4">
          {/* Yes/No Option */}
          <button
            onClick={() => updateState({ betType: "YES_NO", line: undefined })}
            className={`
              relative p-4 rounded-xl border-2 transition-all
              flex flex-col items-center gap-3
              ${
                isYesNoSelected
                  ? `${accentBorder} ${accentBgLight}`
                  : "border-sb-border bg-sb-card hover:border-sb-muted"
              }
            `}
          >
            {isYesNoSelected && (
              <div
                className={`absolute top-2 right-2 w-5 h-5 rounded-full ${accentBg} flex items-center justify-center`}
              >
                <Check size={12} className="text-white" />
              </div>
            )}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isYesNoSelected ? accentBg : "bg-sb-card-hover"
              }`}
            >
              <HelpCircle size={22} className={isYesNoSelected ? "text-white" : "text-sb-muted"} />
            </div>
            <div className="text-center">
              <p className={`font-semibold ${isYesNoSelected ? accentText : "text-white"}`}>
                Yes / No
              </p>
              <p className="text-xs text-sb-muted mt-1">Simple true/false bet</p>
            </div>
          </button>

          {/* Over/Under Option */}
          <button
            onClick={() => updateState({ betType: "OVER_UNDER" })}
            className={`
              relative p-4 rounded-xl border-2 transition-all
              flex flex-col items-center gap-3
              ${
                isOverUnderSelected
                  ? `${accentBorder} ${accentBgLight}`
                  : "border-sb-border bg-sb-card hover:border-sb-muted"
              }
            `}
          >
            {isOverUnderSelected && (
              <div
                className={`absolute top-2 right-2 w-5 h-5 rounded-full ${accentBg} flex items-center justify-center`}
              >
                <Check size={12} className="text-white" />
              </div>
            )}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isOverUnderSelected ? accentBg : "bg-sb-card-hover"
              }`}
            >
              <TrendingUp
                size={22}
                className={isOverUnderSelected ? "text-white" : "text-sb-muted"}
              />
            </div>
            <div className="text-center">
              <p className={`font-semibold ${isOverUnderSelected ? accentText : "text-white"}`}>
                Over / Under
              </p>
              <p className="text-xs text-sb-muted mt-1">Set a number line</p>
            </div>
          </button>
        </div>
      </div>

      {/* H2H Flow: Include title, description, and line in same step */}
      {!isGroupFlow && state.betType && (
        <>
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm text-sb-muted">Bet Title</label>
            <input
              type="text"
              value={state.title}
              onChange={(e) => updateState({ title: e.target.value })}
              placeholder="e.g., Eagles will win the Super Bowl"
              className={`
                w-full p-4 rounded-xl border-2 bg-sb-card text-white
                placeholder:text-sb-muted outline-none transition-colors
                focus:${accentBorder}
                ${state.title ? accentBorder : "border-sb-border"}
              `}
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="text-sm text-sb-muted">Description (optional)</label>
            <textarea
              value={state.description}
              onChange={(e) => updateState({ description: e.target.value })}
              placeholder="Add any additional details..."
              rows={3}
              className="
                w-full p-4 rounded-xl border-2 border-sb-border bg-sb-card text-white
                placeholder:text-sb-muted outline-none transition-colors resize-none
                focus:border-sb-muted
              "
            />
          </div>

          {/* Line Input (Over/Under only) */}
          {isOverUnderSelected && (
            <div className="space-y-2">
              <label className="text-sm text-sb-muted">The Line</label>
              <input
                type="number"
                value={state.line || ""}
                onChange={(e) =>
                  updateState({ line: e.target.value ? parseFloat(e.target.value) : undefined })
                }
                placeholder="e.g., 45.5"
                step="0.5"
                className={`
                  w-full p-4 rounded-xl border-2 bg-sb-card text-white
                  placeholder:text-sb-muted outline-none transition-colors
                  ${state.line ? accentBorder : "border-sb-border"}
                `}
              />
              <p className="text-xs text-sb-muted">
                Players will bet over or under this number
              </p>
            </div>
          )}
        </>
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
