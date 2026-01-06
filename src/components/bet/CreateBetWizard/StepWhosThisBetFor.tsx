"use client";

import { useState } from "react";
import { Users, User, ChevronDown, Check } from "lucide-react";
import { CreateBetState, BetCategory } from "./index";

// Sample data - in production this would come from Firebase
const sampleGroups = [
  { id: "1", name: "Test Group 1" },
  { id: "2", name: "GOAT Fantasy League" },
  { id: "3", name: "Brandon and Phil" },
];

const sampleFriends = [
  { id: "1", name: "Joe Smith" },
  { id: "2", name: "Tim Jones" },
  { id: "3", name: "Alex Brown" },
];

interface StepWhosThisBetForProps {
  state: CreateBetState;
  updateState: (updates: Partial<CreateBetState>) => void;
  onNext: () => void;
  themeColor: string;
}

export function StepWhosThisBetFor({
  state,
  updateState,
  onNext,
  themeColor,
}: StepWhosThisBetForProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleCategorySelect = (category: BetCategory) => {
    updateState({
      betCategory: category,
      selectedGroupId: undefined,
      selectedGroupName: undefined,
      selectedFriendId: undefined,
      selectedFriendName: undefined,
    });
    setShowDropdown(true);
  };

  const handleGroupSelect = (groupId: string, groupName: string) => {
    updateState({ selectedGroupId: groupId, selectedGroupName: groupName });
    setShowDropdown(false);
  };

  const handleFriendSelect = (friendId: string, friendName: string) => {
    updateState({ selectedFriendId: friendId, selectedFriendName: friendName });
    setShowDropdown(false);
  };

  const canProceed =
    (state.betCategory === "GROUP" && state.selectedGroupId) ||
    (state.betCategory === "H2H" && state.selectedFriendId);

  const isGroupSelected = state.betCategory === "GROUP";
  const isH2HSelected = state.betCategory === "H2H";

  return (
    <div className="flex flex-col gap-6">
      {/* Category Selection */}
      <div className="grid grid-cols-2 gap-4">
        {/* Group Bet Option */}
        <button
          onClick={() => handleCategorySelect("GROUP")}
          className={`
            relative p-4 rounded-xl border-2 transition-all
            flex flex-col items-center gap-3
            ${
              isGroupSelected
                ? "border-sb-orange bg-sb-orange/10"
                : "border-sb-border bg-sb-card hover:border-sb-orange/50"
            }
          `}
        >
          {isGroupSelected && (
            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-sb-orange flex items-center justify-center">
              <Check size={12} className="text-white" />
            </div>
          )}
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center ${
              isGroupSelected ? "bg-sb-orange" : "bg-sb-card-hover"
            }`}
          >
            <Users size={24} className={isGroupSelected ? "text-white" : "text-sb-muted"} />
          </div>
          <div className="text-center">
            <p className={`font-semibold ${isGroupSelected ? "text-sb-orange" : "text-white"}`}>
              Group Bet
            </p>
            <p className="text-xs text-sb-muted mt-1">Bet with your group</p>
          </div>
        </button>

        {/* H2H Bet Option */}
        <button
          onClick={() => handleCategorySelect("H2H")}
          className={`
            relative p-4 rounded-xl border-2 transition-all
            flex flex-col items-center gap-3
            ${
              isH2HSelected
                ? "border-sb-purple bg-sb-purple/10"
                : "border-sb-border bg-sb-card hover:border-sb-purple/50"
            }
          `}
        >
          {isH2HSelected && (
            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-sb-purple flex items-center justify-center">
              <Check size={12} className="text-white" />
            </div>
          )}
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center ${
              isH2HSelected ? "bg-sb-purple" : "bg-sb-card-hover"
            }`}
          >
            <User size={24} className={isH2HSelected ? "text-white" : "text-sb-muted"} />
          </div>
          <div className="text-center">
            <p className={`font-semibold ${isH2HSelected ? "text-sb-purple" : "text-white"}`}>
              Head-to-Head
            </p>
            <p className="text-xs text-sb-muted mt-1">Challenge a friend</p>
          </div>
        </button>
      </div>

      {/* Dropdown Selection */}
      {state.betCategory && (
        <div className="space-y-2">
          <label className="text-sm text-sb-muted">
            {isGroupSelected ? "Select a Group" : "Select a Friend"}
          </label>

          {/* Dropdown Trigger */}
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`
              w-full p-4 rounded-xl border-2 text-left
              flex items-center justify-between
              transition-colors
              ${
                showDropdown
                  ? isGroupSelected
                    ? "border-sb-orange bg-sb-card"
                    : "border-sb-purple bg-sb-card"
                  : "border-sb-border bg-sb-card hover:border-sb-muted"
              }
            `}
          >
            <span
              className={
                (isGroupSelected && state.selectedGroupName) ||
                (isH2HSelected && state.selectedFriendName)
                  ? "text-white"
                  : "text-sb-muted"
              }
            >
              {isGroupSelected
                ? state.selectedGroupName || "Choose a group..."
                : state.selectedFriendName || "Choose a friend..."}
            </span>
            <ChevronDown
              size={20}
              className={`text-sb-muted transition-transform ${showDropdown ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="bg-sb-card border border-sb-border rounded-xl overflow-hidden">
              {isGroupSelected
                ? sampleGroups.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => handleGroupSelect(group.id, group.name)}
                      className={`
                        w-full p-4 text-left flex items-center justify-between
                        hover:bg-sb-card-hover transition-colors border-b border-sb-border last:border-b-0
                        ${
                          state.selectedGroupId === group.id
                            ? "bg-sb-orange/10 text-sb-orange"
                            : "text-white"
                        }
                      `}
                    >
                      <span>{group.name}</span>
                      {state.selectedGroupId === group.id && (
                        <Check size={18} className="text-sb-orange" />
                      )}
                    </button>
                  ))
                : sampleFriends.map((friend) => (
                    <button
                      key={friend.id}
                      onClick={() => handleFriendSelect(friend.id, friend.name)}
                      className={`
                        w-full p-4 text-left flex items-center justify-between
                        hover:bg-sb-card-hover transition-colors border-b border-sb-border last:border-b-0
                        ${
                          state.selectedFriendId === friend.id
                            ? "bg-sb-purple/10 text-sb-purple"
                            : "text-white"
                        }
                      `}
                    >
                      <span>{friend.name}</span>
                      {state.selectedFriendId === friend.id && (
                        <Check size={18} className="text-sb-purple" />
                      )}
                    </button>
                  ))}
            </div>
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
              ? isGroupSelected
                ? "bg-sb-orange hover:bg-sb-orange/90"
                : "bg-sb-purple hover:bg-sb-purple/90"
              : "bg-sb-border text-sb-muted cursor-not-allowed"
          }
        `}
      >
        Continue
      </button>
    </div>
  );
}
