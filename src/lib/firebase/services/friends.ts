import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  or,
  serverTimestamp,
  Unsubscribe,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Friendship, FriendshipStatus } from "@/lib/types";

/**
 * Send a friend request
 */
export async function sendFriendRequest(
  fromUserId: string,
  toUserId: string
): Promise<string> {
  // Check if friendship already exists
  const existingFriendship = await getFriendshipBetweenUsers(fromUserId, toUserId);
  if (existingFriendship) {
    throw new Error("Friendship already exists or request already sent");
  }

  const friendshipsRef = collection(db, "friendships");

  const friendshipDoc = {
    user1Id: fromUserId,
    user2Id: toUserId,
    status: "pending" as FriendshipStatus,
    requestedBy: fromUserId,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(friendshipsRef, friendshipDoc);
  return docRef.id;
}

/**
 * Accept a friend request
 */
export async function acceptFriendRequest(friendshipId: string): Promise<void> {
  const friendshipRef = doc(db, "friendships", friendshipId);

  await updateDoc(friendshipRef, {
    status: "accepted",
    acceptedAt: serverTimestamp(),
  });
}

/**
 * Decline a friend request
 */
export async function declineFriendRequest(friendshipId: string): Promise<void> {
  const friendshipRef = doc(db, "friendships", friendshipId);
  await deleteDoc(friendshipRef);
}

/**
 * Remove a friend
 */
export async function removeFriend(friendshipId: string): Promise<void> {
  const friendshipRef = doc(db, "friendships", friendshipId);
  await deleteDoc(friendshipRef);
}

/**
 * Get friendship between two users
 */
export async function getFriendshipBetweenUsers(
  userId1: string,
  userId2: string
): Promise<Friendship | null> {
  const friendshipsRef = collection(db, "friendships");

  // Check both directions
  const q = query(
    friendshipsRef,
    or(
      where("user1Id", "==", userId1),
      where("user1Id", "==", userId2)
    )
  );

  const snapshot = await getDocs(q);

  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (
      (data.user1Id === userId1 && data.user2Id === userId2) ||
      (data.user1Id === userId2 && data.user2Id === userId1)
    ) {
      return { id: doc.id, ...data } as Friendship;
    }
  }

  return null;
}

/**
 * Get all accepted friends for a user
 */
export async function getFriends(userId: string): Promise<Friendship[]> {
  const friendshipsRef = collection(db, "friendships");

  // Get friendships where user is user1 or user2 and status is accepted
  const q1 = query(
    friendshipsRef,
    where("user1Id", "==", userId),
    where("status", "==", "accepted")
  );

  const q2 = query(
    friendshipsRef,
    where("user2Id", "==", userId),
    where("status", "==", "accepted")
  );

  const [snapshot1, snapshot2] = await Promise.all([
    getDocs(q1),
    getDocs(q2),
  ]);

  const friendships: Friendship[] = [];

  snapshot1.docs.forEach((doc) => {
    friendships.push({ id: doc.id, ...doc.data() } as Friendship);
  });

  snapshot2.docs.forEach((doc) => {
    friendships.push({ id: doc.id, ...doc.data() } as Friendship);
  });

  return friendships;
}

/**
 * Get pending friend requests received by a user
 */
export async function getPendingRequests(userId: string): Promise<Friendship[]> {
  const friendshipsRef = collection(db, "friendships");

  const q = query(
    friendshipsRef,
    where("user2Id", "==", userId),
    where("status", "==", "pending")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Friendship[];
}

/**
 * Get pending friend requests sent by a user
 */
export async function getSentRequests(userId: string): Promise<Friendship[]> {
  const friendshipsRef = collection(db, "friendships");

  const q = query(
    friendshipsRef,
    where("user1Id", "==", userId),
    where("status", "==", "pending"),
    where("requestedBy", "==", userId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Friendship[];
}

/**
 * Subscribe to friendships for a user (both accepted and pending)
 */
export function subscribeToFriendships(
  userId: string,
  callback: (friendships: Friendship[]) => void
): Unsubscribe {
  const friendshipsRef = collection(db, "friendships");

  // We need to listen to both directions
  const q = query(
    friendshipsRef,
    or(
      where("user1Id", "==", userId),
      where("user2Id", "==", userId)
    )
  );

  return onSnapshot(q, (snapshot) => {
    const friendships = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Friendship[];
    callback(friendships);
  });
}
