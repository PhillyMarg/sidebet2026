"use client";

import { useState } from "react";
import { X, ChevronLeft } from "lucide-react";
import { StepWhosThisBetFor } from "./StepWhosThisBetFor";
import { StepWhatTypeOfBet } from "./StepWhatTypeOfBet";
import { StepBetDetails } from "./StepBetDetails";
import { StepSetStakes } from "./StepSetStakes";
import { StepConfirmation } from "./StepConfirmation";

export type BetCategory = "GROUP" | "H2H" | null;

export interface CreateBetState {
  // Step 1
  betCategory: BetCategory;
  selectedGroupId?: string;
  selectedGroupName?: string;
  selectedFriendId?: string;
  selectedFriendName?: string;

  // Step 2
  betType: "YES_NO" | "OVER_UNDER" | null;
  title: string;
  description: string;
  line?: number;

  // Final Step
  wagerAmount: number;
  closingDate: string;
  closingTime: string;
}

const initialState: CreateBetState = {
  betCategory: null,
  betType: null,
  title: "",
  description: "",
  wagerAmount: 10,
  closingDate: "",
  closingTime: "",
};

interface CreateBetWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBetState) => void;
}

export function CreateBetWizard({ isOpen, onClose, onSubmit }: CreateBetWizardProps) {
  const [state, setState] = useState<CreateBetState>(initialState);
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  // Determine total steps based on flow
  // Group flow: 5 steps (Who -> Type -> Details -> Stakes -> Confirm)
  // H2H flow: 4 steps (Who -> Type+Details -> Stakes+Preview -> Confirm)
  const isGroupFlow = state.betCategory === "GROUP";
  const totalSteps = isGroupFlow ? 5 : 4;

  // Theme color based on category
  const themeColor = state.betCategory === "H2H" ? "sb-purple" : "sb-orange";
  const themeColorClass = state.betCategory === "H2H" ? "text-sb-purple" : "text-sb-orange";
  const themeBorderClass = state.betCategory === "H2H" ? "border-sb-purple" : "border-sb-orange";
  const themeBgClass = state.betCategory === "H2H" ? "bg-sb-purple" : "bg-sb-orange";

  const updateState = (updates: Partial<CreateBetState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    setStep((s) => Math.min(s + 1, totalSteps));
  };

  const handleBack = () => {
    if (step === 1) {
      handleClose();
    } else {
      setStep((s) => s - 1);
    }
  };

  const handleClose = () => {
    setState(initialState);
    setStep(1);
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(state);
    handleClose();
  };

  // Get step title
  const getStepTitle = () => {
    if (step === 1) return "Who's This Bet For?";
    if (isGroupFlow) {
      switch (step) {
        case 2:
          return "What Type of Bet?";
        case 3:
          return "Bet Details";
        case 4:
          return "Set the Stakes";
        case 5:
          return "Confirm Your Bet";
      }
    } else {
      switch (step) {
        case 2:
          return "What's The Bet?";
        case 3:
          return "Set the Stakes";
        case 4:
          return "Confirm Your Bet";
      }
    }
    return "";
  };

  // Render current step content
  const renderStepContent = () => {
    if (step === 1) {
      return (
        <StepWhosThisBetFor
          state={state}
          updateState={updateState}
          onNext={handleNext}
          themeColor={themeColor}
        />
      );
    }

    if (isGroupFlow) {
      switch (step) {
        case 2:
          return (
            <StepWhatTypeOfBet
              state={state}
              updateState={updateState}
              onNext={handleNext}
              themeColor={themeColor}
              isGroupFlow={true}
            />
          );
        case 3:
          return (
            <StepBetDetails
              state={state}
              updateState={updateState}
              onNext={handleNext}
              themeColor={themeColor}
            />
          );
        case 4:
          return (
            <StepSetStakes
              state={state}
              updateState={updateState}
              onNext={handleNext}
              themeColor={themeColor}
              showPreview={false}
            />
          );
        case 5:
          return (
            <StepConfirmation
              state={state}
              themeColor={themeColor}
              onConfirm={handleSubmit}
            />
          );
      }
    } else {
      // H2H flow - combined steps
      switch (step) {
        case 2:
          return (
            <StepWhatTypeOfBet
              state={state}
              updateState={updateState}
              onNext={handleNext}
              themeColor={themeColor}
              isGroupFlow={false}
            />
          );
        case 3:
          return (
            <StepSetStakes
              state={state}
              updateState={updateState}
              onNext={handleNext}
              themeColor={themeColor}
              showPreview={true}
            />
          );
        case 4:
          return (
            <StepConfirmation
              state={state}
              themeColor={themeColor}
              onConfirm={handleSubmit}
            />
          );
      }
    }

    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-sb-black">
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${themeBorderClass}`}>
        <button
          onClick={handleBack}
          className="p-2 -ml-2 text-white hover:bg-sb-card rounded-lg transition-colors"
        >
          <ChevronLeft size={24} />
        </button>

        <h1 className="text-lg font-semibold text-white">{getStepTitle()}</h1>

        <button
          onClick={handleClose}
          className="p-2 -mr-2 text-sb-muted hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Progress indicator */}
      <div className="flex gap-1 p-4">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < step ? themeBgClass : "bg-sb-border"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">{renderStepContent()}</div>
    </div>
  );
}

export { CreateBetWizard as default };
