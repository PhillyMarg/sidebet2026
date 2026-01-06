import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  or,
  orderBy,
  serverTimestamp,
  Unsubscribe,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { PersonBalance } from "@/lib/types";

export interface Settlement {
  id: string;
  user1Id: string;
  user2Id: string;
  betIds: string[];
  amount: number;
  status: "PENDING" | "SETTLED";
  settledAt?: Date;
  createdAt: Date;
}

export interface CreateSettlementData {
  user1Id: string;
  user2Id: string;
  betIds: string[];
  amount: number;
}

/**
 * Create a settlement record
 */
export async function createSettlement(data: CreateSettlementData): Promise<string> {
  const settlementsRef = collection(db, "settlements");

  const settlementDoc = {
    user1Id: data.user1Id,
    user2Id: data.user2Id,
    betIds: data.betIds,
    amount: data.amount,
    status: "PENDING",
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(settlementsRef, settlementDoc);
  return docRef.id;
}

/**
 * Get settlement by ID
 */
export async function getSettlementById(settlementId: string): Promise<Settlement | null> {
  const settlementRef = doc(db, "settlements", settlementId);
  const settlementSnap = await getDoc(settlementRef);

  if (!settlementSnap.exists()) {
    return null;
  }

  const data = settlementSnap.data();
  return {
    id: settlementSnap.id,
    user1Id: data.user1Id,
    user2Id: data.user2Id,
    betIds: data.betIds,
    amount: data.amount,
    status: data.status,
    settledAt: data.settledAt?.toDate(),
    createdAt: data.createdAt?.toDate() || new Date(),
  } as Settlement;
}

/**
 * Get all settlements for a user
 */
export async function getSettlementsByUser(userId: string): Promise<Settlement[]> {
  const settlementsRef = collection(db, "settlements");

  const q = query(
    settlementsRef,
    or(
      where("user1Id", "==", userId),
      where("user2Id", "==", userId)
    ),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      user1Id: data.user1Id,
      user2Id: data.user2Id,
      betIds: data.betIds,
      amount: data.amount,
      status: data.status,
      settledAt: data.settledAt?.toDate(),
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Settlement;
  });
}

/**
 * Get pending settlements for a user
 */
export async function getPendingSettlements(userId: string): Promise<Settlement[]> {
  const settlements = await getSettlementsByUser(userId);
  return settlements.filter((s) => s.status === "PENDING");
}

/**
 * Mark a settlement as settled
 */
export async function markAsSettled(settlementId: string): Promise<void> {
  const settlementRef = doc(db, "settlements", settlementId);

  await updateDoc(settlementRef, {
    status: "SETTLED",
    settledAt: serverTimestamp(),
  });
}

/**
 * Calculate balances for a user from settled bets
 * Returns an array of PersonBalance showing who owes whom
 */
export async function calculateBalances(userId: string): Promise<PersonBalance[]> {
  // Get all pending settlements involving this user
  const settlements = await getPendingSettlements(userId);

  // Aggregate balances by other user
  const balanceMap = new Map<
    string,
    {
      netAmount: number;
      bets: { betId: string; betTitle: string; amount: number }[];
    }
  >();

  for (const settlement of settlements) {
    const otherUserId = settlement.user1Id === userId ? settlement.user2Id : settlement.user1Id;
    const isOwed = settlement.user1Id === userId; // user1 is owed money by user2

    const existing = balanceMap.get(otherUserId) || { netAmount: 0, bets: [] };

    // If user1 is the current user, they are owed money (positive)
    // If user2 is the current user, they owe money (negative)
    const amount = isOwed ? settlement.amount : -settlement.amount;

    existing.netAmount += amount;

    for (const betId of settlement.betIds) {
      existing.bets.push({
        betId,
        betTitle: `Bet ${betId.slice(0, 6)}`, // Placeholder - would need to fetch bet titles
        amount: isOwed ? settlement.amount / settlement.betIds.length : -settlement.amount / settlement.betIds.length,
      });
    }

    balanceMap.set(otherUserId, existing);
  }

  // Convert to PersonBalance array
  const balances: PersonBalance[] = [];

  for (const [otherUserId, data] of balanceMap.entries()) {
    balances.push({
      userId: otherUserId,
      userName: `User ${otherUserId.slice(0, 6)}`, // Placeholder - would need to fetch user names
      netAmount: data.netAmount,
      bets: data.bets,
    });
  }

  return balances;
}

/**
 * Subscribe to settlements for a user
 */
export function subscribeToSettlements(
  userId: string,
  callback: (settlements: Settlement[]) => void
): Unsubscribe {
  const settlementsRef = collection(db, "settlements");

  const q = query(
    settlementsRef,
    or(
      where("user1Id", "==", userId),
      where("user2Id", "==", userId)
    ),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const settlements = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        user1Id: data.user1Id,
        user2Id: data.user2Id,
        betIds: data.betIds,
        amount: data.amount,
        status: data.status,
        settledAt: data.settledAt?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Settlement;
    });
    callback(settlements);
  });
}
