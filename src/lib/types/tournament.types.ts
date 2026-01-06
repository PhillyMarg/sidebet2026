import { Timestamp } from "firebase/firestore";

export type TournamentType = "single-elimination" | "double-elimination";
export type TournamentStatus = "setup" | "active" | "completed";

export interface TournamentMatch {
  matchId: string;
  participant1: string;
  participant2: string;
  winner?: string;
  playIn: boolean;
}

export interface TournamentRound {
  roundNumber: number;
  matches: TournamentMatch[];
}

export interface Tournament {
  id: string;
  name: string;
  description?: string;
  type: TournamentType;
  createdBy: string;
  participants: string[];
  seeds: { [userId: string]: number };
  rounds: TournamentRound[];
  status: TournamentStatus;
  winner?: string;
  isPublic: boolean;
  accessCode?: string;
  betIds: string[];
  createdAt: Timestamp;
}

export interface CreateTournamentFormData {
  name: string;
  description?: string;
  type: TournamentType;
  participants: string[];
  isPublic: boolean;
}
