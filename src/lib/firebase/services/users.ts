import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { User, UserStats } from "@/lib/types";

/**
 * Get a user by their UID
 */
export async function getUserById(uid: string): Promise<User | null> {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  }

  return { uid, ...userSnap.data() } as User;
}

/**
 * Update a user's profile
 */
export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<User, "firstName" | "lastName" | "displayName" | "venmoUsername" | "photoURL">>
): Promise<void> {
  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, {
    ...data,
    lastActive: serverTimestamp(),
  });
}

/**
 * Update a user's stats
 */
export async function updateUserStats(
  uid: string,
  stats: Partial<UserStats>
): Promise<void> {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("User not found");
  }

  const currentStats = userSnap.data().stats || {};

  await updateDoc(userRef, {
    stats: {
      ...currentStats,
      ...stats,
    },
    lastActive: serverTimestamp(),
  });
}

/**
 * Increment specific stats for a user
 */
export async function incrementUserStats(
  uid: string,
  increments: Partial<UserStats>
): Promise<void> {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("User not found");
  }

  const currentStats = userSnap.data().stats || {
    wins: 0,
    losses: 0,
    ties: 0,
    totalBets: 0,
    totalWinnings: 0,
    totalLosses: 0,
    h2hWins: 0,
    h2hLosses: 0,
  };

  const newStats = { ...currentStats };

  Object.entries(increments).forEach(([key, value]) => {
    if (typeof value === "number") {
      newStats[key as keyof UserStats] = (currentStats[key as keyof UserStats] || 0) + value;
    }
  });

  await updateDoc(userRef, {
    stats: newStats,
    lastActive: serverTimestamp(),
  });
}
