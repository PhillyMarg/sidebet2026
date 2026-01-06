import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Bet, BetType, BetStatus, BetResult } from "@/lib/types";

export interface CreateBetData {
  type: BetType;
  question: string;
  description?: string;
  creatorId: string;
  creatorName: string;
  groupId?: string;
  groupName?: string;
  isH2H: boolean;
  challengerId?: string;
  challengerName?: string;
  challengedId?: string;
  challengedName?: string;
  stakes: number;
  overUnderLine?: number;
  closingTime: Date;
}

/**
 * Create a new bet
 */
export async function createBet(data: CreateBetData): Promise<string> {
  const betsRef = collection(db, "bets");

  const betDoc = {
    type: data.type,
    question: data.question,
    description: data.description || null,
    creatorId: data.creatorId,
    creatorName: data.creatorName,
    groupId: data.groupId || null,
    groupName: data.groupName || null,
    isH2H: data.isH2H,
    challengerId: data.challengerId || null,
    challengerName: data.challengerName || null,
    challengedId: data.challengedId || null,
    challengedName: data.challengedName || null,
    stakes: data.stakes,
    overUnderLine: data.overUnderLine || null,
    closingTime: Timestamp.fromDate(data.closingTime),
    status: data.isH2H ? "PENDING" : "OPEN",
    result: null,
    picks: {},
    pot: 0,
    winners: [],
    createdAt: serverTimestamp(),
    judgedAt: null,
  };

  const docRef = await addDoc(betsRef, betDoc);
  return docRef.id;
}

/**
 * Get a single bet by ID
 */
export async function getBetById(betId: string): Promise<Bet | null> {
  const betRef = doc(db, "bets", betId);
  const betSnap = await getDoc(betRef);

  if (!betSnap.exists()) {
    return null;
  }

  return { id: betSnap.id, ...betSnap.data() } as Bet;
}

/**
 * Get all bets for a user (as creator, challenger, or group member)
 */
export async function getBetsByUser(userId: string): Promise<Bet[]> {
  const betsRef = collection(db, "bets");

  // Get bets where user is the creator
  const creatorQuery = query(betsRef, where("creatorId", "==", userId));
  const creatorSnap = await getDocs(creatorQuery);

  // Get H2H bets where user is challenged
  const challengedQuery = query(betsRef, where("challengedId", "==", userId));
  const challengedSnap = await getDocs(challengedQuery);

  // Combine and dedupe results
  const betsMap = new Map<string, Bet>();

  creatorSnap.docs.forEach((doc) => {
    betsMap.set(doc.id, { id: doc.id, ...doc.data() } as Bet);
  });

  challengedSnap.docs.forEach((doc) => {
    betsMap.set(doc.id, { id: doc.id, ...doc.data() } as Bet);
  });

  return Array.from(betsMap.values());
}

/**
 * Get all bets for a group
 */
export async function getBetsByGroup(groupId: string): Promise<Bet[]> {
  const betsRef = collection(db, "bets");
  const q = query(
    betsRef,
    where("groupId", "==", groupId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Bet));
}

/**
 * Vote/pick on a bet
 */
export async function voteBet(
  betId: string,
  userId: string,
  pick: "YES" | "NO" | "OVER" | "UNDER",
  amount: number
): Promise<void> {
  const betRef = doc(db, "bets", betId);
  const betSnap = await getDoc(betRef);

  if (!betSnap.exists()) {
    throw new Error("Bet not found");
  }

  const betData = betSnap.data();
  const picks = betData.picks || {};

  // Add user's pick
  picks[userId] = {
    pick,
    amount,
    timestamp: serverTimestamp(),
  };

  // Update pot
  const newPot = (betData.pot || 0) + amount;

  await updateDoc(betRef, {
    picks,
    pot: newPot,
  });
}

/**
 * Judge/settle a bet
 */
export async function judgeBet(
  betId: string,
  result: BetResult
): Promise<void> {
  const betRef = doc(db, "bets", betId);

  await updateDoc(betRef, {
    status: "JUDGED",
    result,
    judgedAt: serverTimestamp(),
  });
}

/**
 * Accept an H2H bet challenge
 */
export async function acceptH2HBet(betId: string): Promise<void> {
  const betRef = doc(db, "bets", betId);

  await updateDoc(betRef, {
    h2hStatus: "accepted",
    status: "OPEN",
  });
}

/**
 * Decline an H2H bet challenge
 */
export async function declineH2HBet(betId: string): Promise<void> {
  const betRef = doc(db, "bets", betId);

  await updateDoc(betRef, {
    h2hStatus: "declined",
    status: "CANCELLED",
  });
}

/**
 * Subscribe to real-time bet updates
 */
export function subscribeToBets(
  callback: (bets: Bet[]) => void,
  filterOptions?: {
    userId?: string;
    groupId?: string;
    status?: BetStatus;
  }
): Unsubscribe {
  const betsRef = collection(db, "bets");
  let q = query(betsRef, orderBy("createdAt", "desc"));

  if (filterOptions?.groupId) {
    q = query(betsRef, where("groupId", "==", filterOptions.groupId), orderBy("createdAt", "desc"));
  } else if (filterOptions?.status) {
    q = query(betsRef, where("status", "==", filterOptions.status), orderBy("createdAt", "desc"));
  }

  return onSnapshot(q, (snapshot) => {
    const bets = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Bet[];
    callback(bets);
  });
}

/**
 * Subscribe to bets for a specific user
 */
export function subscribeToUserBets(
  userId: string,
  groupIds: string[],
  callback: (bets: Bet[]) => void
): Unsubscribe {
  const betsRef = collection(db, "bets");

  // Listen to all bets and filter client-side for now
  // In production, you might want to use Cloud Functions for complex queries
  return onSnapshot(
    query(betsRef, orderBy("createdAt", "desc")),
    (snapshot) => {
      const allBets = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Bet[];

      // Filter bets relevant to the user
      const userBets = allBets.filter((bet) => {
        // User is the creator
        if (bet.creatorId === userId) return true;
        // User is challenged in H2H
        if (bet.challengedId === userId) return true;
        // User is challenger in H2H
        if (bet.challengerId === userId) return true;
        // Bet is in one of user's groups
        if (bet.groupId && groupIds.includes(bet.groupId)) return true;
        // User has a pick on this bet
        if (bet.picks && bet.picks[userId]) return true;
        return false;
      });

      callback(userBets);
    }
  );
}
