import { Timestamp } from "firebase/firestore";

export type TransactionStatus = "pending" | "settled";
export type SettlementMethod = "venmo" | "cash";

export interface Transaction {
  id: string;
  betId: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  amount: number;
  status: TransactionStatus;
  settledAt?: Timestamp;
  settledVia?: SettlementMethod;
  createdAt: Timestamp;
}

export interface PersonBalance {
  userId: string;
  userName: string;
  venmoUsername?: string;
  netAmount: number; // Positive = they owe you, Negative = you owe them
  bets: {
    betId: string;
    betTitle: string;
    amount: number;
  }[];
}
