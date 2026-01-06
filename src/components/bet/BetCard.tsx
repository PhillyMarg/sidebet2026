'use client';

import { useState } from 'react';
import { BetCardCollapsed } from './BetCardCollapsed';
import { BetCardExpanded } from './BetCardExpanded';
import { ConfirmResultModal } from './ConfirmResultModal';

type BetType = 'YES_NO' | 'OVER_UNDER';
type BetCategory = 'H2H' | 'GROUP';
type BetStatus = 'PENDING' | 'OPEN' | 'WON' | 'LOST' | 'JUDGE';
type VotePick = 'YES' | 'NO' | 'OVER' | 'UNDER';

export interface BetData {
  id: string;
  type: BetType;
  category: BetCategory;
  title: string;
  description?: string;

  // For H2H
  challenger?: string;
  challenged?: string;

  // For Group
  groupName?: string;
  creatorName?: string;
  playerCount?: number;

  // Bet details
  wager: number;
  totalPot: number;
  line?: number;
  closingDate: string;

  // Vote state
  yesPercentage: number;
  noPercentage: number;

  // User state
  userPick?: VotePick;
  potentialPayout?: number;

  // Status
  status: BetStatus;
}

interface BetCardProps {
  bet: BetData;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onVote?: (pick: VotePick) => void;
  onJudge?: (result: VotePick) => void;
}

export function BetCard({
  bet,
  isExpanded: controlledExpanded,
  onToggleExpand,
  onVote,
  onJudge,
}: BetCardProps) {
  // Internal expanded state if not controlled
  const [internalExpanded, setInternalExpanded] = useState(false);

  // Judge confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingJudgeResult, setPendingJudgeResult] = useState<VotePick | null>(null);

  // Use controlled or internal expanded state
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const handleToggleExpand = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  // Generate source label based on category
  const sourceLabel = (() => {
    if (bet.category === 'H2H') {
      return `${bet.challenger || 'Unknown'} v. ${bet.challenged || 'Unknown'}`;
    }
    return bet.groupName || 'Unknown Group';
  })();

  // Handle judge action - show confirmation modal
  const handleJudgeClick = (result: VotePick) => {
    setPendingJudgeResult(result);
    setShowConfirmModal(true);
  };

  // Handle confirm judge result
  const handleConfirmJudge = () => {
    if (pendingJudgeResult && onJudge) {
      onJudge(pendingJudgeResult);
    }
    setShowConfirmModal(false);
    setPendingJudgeResult(null);
  };

  // Handle cancel judge
  const handleCancelJudge = () => {
    setShowConfirmModal(false);
    setPendingJudgeResult(null);
  };

  return (
    <>
      <div
        className={`
          transition-all duration-300 ease-in-out
          ${isExpanded ? 'scale-[1.01]' : 'scale-100'}
        `}
      >
        {isExpanded ? (
          <BetCardExpanded
            category={bet.category}
            type={bet.type}
            title={bet.title}
            description={bet.description}
            sourceLabel={sourceLabel}
            creatorName={bet.creatorName}
            wager={bet.wager}
            totalPot={bet.totalPot}
            line={bet.line}
            closingDate={bet.closingDate}
            status={bet.status}
            yesPercentage={bet.yesPercentage}
            noPercentage={bet.noPercentage}
            playerCount={bet.playerCount}
            userPick={bet.userPick}
            potentialPayout={bet.potentialPayout}
            onCollapse={handleToggleExpand}
            onVote={onVote}
            onJudge={handleJudgeClick}
          />
        ) : (
          <BetCardCollapsed
            category={bet.category}
            title={bet.title}
            sourceLabel={sourceLabel}
            totalPot={bet.totalPot}
            playerCount={bet.playerCount}
            closingDate={bet.closingDate}
            status={bet.status}
            onExpand={handleToggleExpand}
          />
        )}
      </div>

      {/* Confirm Result Modal */}
      {pendingJudgeResult && (
        <ConfirmResultModal
          isOpen={showConfirmModal}
          betType={bet.type}
          category={bet.category}
          selectedResult={pendingJudgeResult}
          onConfirm={handleConfirmJudge}
          onCancel={handleCancelJudge}
        />
      )}
    </>
  );
}
