/**
 * Firestore Collections Schema
 *
 * This file documents the data structure for all Firestore collections
 * used in the SideBet application.
 */

import { Timestamp } from "firebase/firestore";

// ============================================================================
// Users Collection - /users/{uid}
// ============================================================================

export interface UserDoc {
  uid: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  phoneNumber?: string;
  venmoUsername?: string;
  createdAt: Timestamp;
  lastActive: Timestamp;
  stats: {
    wins: number;
    losses: number;
    ties: number;
    totalBets: number;
    totalWinnings: number;
    totalLosses: number;
    h2hWins: number;
    h2hLosses: number;
  };
}

// ============================================================================
// Bets Collection - /bets/{betId}
// ============================================================================

export type BetDocType = "YES_NO" | "OVER_UNDER";
export type BetDocCategory = "H2H" | "GROUP";
export type BetDocStatus = "PENDING" | "OPEN" | "CLOSED" | "SETTLED";
export type BetDocResult = "YES" | "NO" | "OVER" | "UNDER" | "PUSH";

export interface BetDocVote {
  oderId: string;
  pick: "YES" | "NO" | "OVER" | "UNDER";
  createdAt: Timestamp;
}

export interface BetDoc {
  id: string;
  type: BetDocType;
  category: BetDocCategory;
  title: string;
  description?: string;

  // H2H specific
  challengerId?: string;
  challengerName?: string;
  challengedId?: string;
  challengedName?: string;

  // Group specific
  groupId?: string;
  groupName?: string;

  // Creator info
  creatorId: string;
  creatorName: string;

  // Bet details
  wager: number;
  totalPot: number;
  line?: number; // For over/under bets

  // Timing
  closingDate: Timestamp;
  createdAt: Timestamp;

  // Status
  status: BetDocStatus;
  result?: BetDocResult;

  // Votes/Picks
  votes: {
    [userId: string]: BetDocVote;
  };

  // Vote counts
  yesCount: number;
  noCount: number;
  overCount?: number;
  underCount?: number;
}

// ============================================================================
// Groups Collection - /groups/{groupId}
// ============================================================================

export interface GroupDoc {
  id: string;
  name: string;
  description?: string;
  creatorId: string;
  creatorName: string;
  inviteCode: string;
  maxWager: number | null;
  memberIds: string[];
  memberCount: number;
  activeBets: number;
  createdAt: Timestamp;
  lastActivityAt: Timestamp;
}

// ============================================================================
// Friendships Collection - /friendships/{friendshipId}
// ============================================================================

export type FriendshipDocStatus = "PENDING" | "ACCEPTED";

export interface FriendshipDoc {
  id: string;
  user1Id: string;
  user2Id: string;
  status: FriendshipDocStatus;
  requesterId: string;
  createdAt: Timestamp;
  acceptedAt?: Timestamp;
  record: {
    [userId: string]: {
      wins: number;
      losses: number;
      ties: number;
    };
  };
}

// ============================================================================
// Notifications Collection - /notifications/{notificationId}
// ============================================================================

export type NotificationDocType =
  | "FRIEND_REQUEST"
  | "BET_CHALLENGE"
  | "BET_CLOSING"
  | "BET_WON"
  | "BET_LOST"
  | "PAYMENT_REQUEST"
  | "GROUP_INVITE";

export interface NotificationDoc {
  id: string;
  userId: string;
  type: NotificationDocType;
  message: string;
  read: boolean;
  link?: string;
  createdAt: Timestamp;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// Settlements Collection - /settlements/{settlementId}
// ============================================================================

export type SettlementDocStatus = "PENDING" | "SETTLED";

export interface SettlementDoc {
  id: string;
  user1Id: string;
  user2Id: string;
  betIds: string[];
  amount: number;
  status: SettlementDocStatus;
  settledAt?: Timestamp;
  createdAt: Timestamp;
}
