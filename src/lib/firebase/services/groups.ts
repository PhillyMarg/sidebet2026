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
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  increment,
  Unsubscribe,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Group } from "@/lib/types";

export interface CreateGroupData {
  name: string;
  description?: string;
  creatorId: string;
  creatorName: string;
  maxWager?: number | null;
}

/**
 * Generate a random invite code
 */
export function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Create a new group
 */
export async function createGroup(data: CreateGroupData): Promise<string> {
  const groupsRef = collection(db, "groups");

  const groupDoc = {
    name: data.name,
    description: data.description || null,
    createdBy: data.creatorId,
    creatorName: data.creatorName,
    inviteCode: generateInviteCode(),
    maxWager: data.maxWager || null,
    members: [data.creatorId],
    admins: [data.creatorId],
    memberCount: 1,
    activeBets: 0,
    createdAt: serverTimestamp(),
    lastActivityAt: serverTimestamp(),
  };

  const docRef = await addDoc(groupsRef, groupDoc);
  return docRef.id;
}

/**
 * Get a group by ID
 */
export async function getGroupById(groupId: string): Promise<Group | null> {
  const groupRef = doc(db, "groups", groupId);
  const groupSnap = await getDoc(groupRef);

  if (!groupSnap.exists()) {
    return null;
  }

  return { id: groupSnap.id, ...groupSnap.data() } as Group;
}

/**
 * Get a group by invite code
 */
export async function getGroupByInviteCode(inviteCode: string): Promise<Group | null> {
  const groupsRef = collection(db, "groups");
  const q = query(groupsRef, where("inviteCode", "==", inviteCode.toUpperCase()));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Group;
}

/**
 * Get all groups for a user
 */
export async function getGroupsByUser(userId: string): Promise<Group[]> {
  const groupsRef = collection(db, "groups");
  const q = query(groupsRef, where("members", "array-contains", userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Group[];
}

/**
 * Join a group
 */
export async function joinGroup(groupId: string, userId: string): Promise<void> {
  const groupRef = doc(db, "groups", groupId);

  await updateDoc(groupRef, {
    members: arrayUnion(userId),
    memberCount: increment(1),
    lastActivityAt: serverTimestamp(),
  });
}

/**
 * Leave a group
 */
export async function leaveGroup(groupId: string, userId: string): Promise<void> {
  const groupRef = doc(db, "groups", groupId);
  const groupSnap = await getDoc(groupRef);

  if (!groupSnap.exists()) {
    throw new Error("Group not found");
  }

  const groupData = groupSnap.data();

  // Check if user is the only admin
  if (groupData.admins.includes(userId) && groupData.admins.length === 1) {
    throw new Error("Cannot leave group: you are the only admin. Transfer ownership first.");
  }

  await updateDoc(groupRef, {
    members: arrayRemove(userId),
    admins: arrayRemove(userId),
    memberCount: increment(-1),
    lastActivityAt: serverTimestamp(),
  });
}

/**
 * Delete a group (admin only)
 */
export async function deleteGroup(groupId: string, userId: string): Promise<void> {
  const groupRef = doc(db, "groups", groupId);
  const groupSnap = await getDoc(groupRef);

  if (!groupSnap.exists()) {
    throw new Error("Group not found");
  }

  const groupData = groupSnap.data();

  if (!groupData.admins.includes(userId)) {
    throw new Error("Only admins can delete a group");
  }

  await deleteDoc(groupRef);
}

/**
 * Update group settings
 */
export async function updateGroup(
  groupId: string,
  data: Partial<Pick<Group, "name" | "description">> & { maxWager?: number | null }
): Promise<void> {
  const groupRef = doc(db, "groups", groupId);

  await updateDoc(groupRef, {
    ...data,
    lastActivityAt: serverTimestamp(),
  });
}

/**
 * Increment active bets count
 */
export async function incrementActiveBets(groupId: string, amount: number = 1): Promise<void> {
  const groupRef = doc(db, "groups", groupId);

  await updateDoc(groupRef, {
    activeBets: increment(amount),
    lastActivityAt: serverTimestamp(),
  });
}

/**
 * Subscribe to user's groups
 */
export function subscribeToUserGroups(
  userId: string,
  callback: (groups: Group[]) => void
): Unsubscribe {
  const groupsRef = collection(db, "groups");
  const q = query(groupsRef, where("members", "array-contains", userId));

  return onSnapshot(q, (snapshot) => {
    const groups = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Group[];
    callback(groups);
  });
}
