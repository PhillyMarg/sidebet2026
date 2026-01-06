import { Timestamp } from "firebase/firestore";

export type BetType = "YES_NO" | "OVER_UNDER";
export type BetStatus = "OPEN" | "CLOSED" | "JUDGED" | "CANCELLED";
export type BetResult = "yes" | "no" | "over" | "under" | "push";
export type H2HStatus = "pending" | "accepted" | "declined";

export interface BetPick {
  pick: string;
  amount: number;
  timestamp: Timestamp;
}

export interface Bet {
  id: string;
  type: BetType;
  question: string;
  description?: string;
  creatorId: string;
  creatorName: string;
  groupId?: string;
  groupName?: string;

  // H2H specific
  isH2H: boolean;
  challengerId?: string;
  challengerName?: string;
  challengedId?: string;
  challengedName?: string;
  h2hOdds?: string;
  h2hStatus?: H2HStatus;

  // Bet details
  stakes: number;
  overUnderLine?: number;
  closingTime: Timestamp;

  // State
  status: BetStatus;
  result?: BetResult;

  // Participants
  picks: {
    [userId: string]: BetPick;
  };

  pot: number;
  winners?: string[];

  createdAt: Timestamp;
  judgedAt?: Timestamp;
}

export interface CreateBetFormData {
  type: BetType;
  question: string;
  description?: string;
  groupId?: string;
  isH2H: boolean;
  challengedId?: string;
  h2hOdds?: string;
  stakes: number;
  overUnderLine?: number;
  closingTime: Date;
}
