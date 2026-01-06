import { Timestamp } from "firebase/firestore";

export interface UserStats {
  wins: number;
  losses: number;
  ties: number;
  totalBets: number;
  totalWinnings: number;
  totalLosses: number;
  h2hWins: number;
  h2hLosses: number;
}

export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  venmoUsername?: string;
  photoURL?: string;
  phoneNumber?: string;
  createdAt: Timestamp;
  lastActive: Timestamp;
  stats?: UserStats;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  venmoUsername?: string;
}
