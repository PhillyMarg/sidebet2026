import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch,
  serverTimestamp,
  Unsubscribe,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { NotificationDocType } from "@/lib/firebase/schema";

export interface NotificationData {
  userId: string;
  type: NotificationDocType;
  message: string;
  link?: string;
  metadata?: Record<string, unknown>;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationDocType;
  message: string;
  read: boolean;
  link?: string;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Create a new notification
 */
export async function createNotification(data: NotificationData): Promise<string> {
  const notificationsRef = collection(db, "notifications");

  const notificationDoc = {
    userId: data.userId,
    type: data.type,
    message: data.message,
    read: false,
    link: data.link || null,
    metadata: data.metadata || null,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(notificationsRef, notificationDoc);
  return docRef.id;
}

/**
 * Get all notifications for a user
 */
export async function getNotifications(userId: string): Promise<Notification[]> {
  const notificationsRef = collection(db, "notifications");
  const q = query(
    notificationsRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      type: data.type,
      message: data.message,
      read: data.read,
      link: data.link,
      createdAt: data.createdAt?.toDate() || new Date(),
      metadata: data.metadata,
    } as Notification;
  });
}

/**
 * Mark a notification as read
 */
export async function markAsRead(notificationId: string): Promise<void> {
  const notificationRef = doc(db, "notifications", notificationId);
  await updateDoc(notificationRef, { read: true });
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string): Promise<void> {
  const notificationsRef = collection(db, "notifications");
  const q = query(
    notificationsRef,
    where("userId", "==", userId),
    where("read", "==", false)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return;

  const batch = writeBatch(db);
  snapshot.docs.forEach((doc) => {
    batch.update(doc.ref, { read: true });
  });

  await batch.commit();
}

/**
 * Clear all notifications for a user
 */
export async function clearAllNotifications(userId: string): Promise<void> {
  const notificationsRef = collection(db, "notifications");
  const q = query(notificationsRef, where("userId", "==", userId));

  const snapshot = await getDocs(q);

  if (snapshot.empty) return;

  const batch = writeBatch(db);
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
}

/**
 * Delete a single notification
 */
export async function deleteNotification(notificationId: string): Promise<void> {
  const notificationRef = doc(db, "notifications", notificationId);
  await deleteDoc(notificationRef);
}

/**
 * Subscribe to notifications for a user (real-time updates)
 */
export function subscribeToNotifications(
  userId: string,
  callback: (notifications: Notification[]) => void
): Unsubscribe {
  const notificationsRef = collection(db, "notifications");
  const q = query(
    notificationsRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        type: data.type,
        message: data.message,
        read: data.read,
        link: data.link,
        createdAt: data.createdAt?.toDate() || new Date(),
        metadata: data.metadata,
      } as Notification;
    });
    callback(notifications);
  });
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string): Promise<number> {
  const notificationsRef = collection(db, "notifications");
  const q = query(
    notificationsRef,
    where("userId", "==", userId),
    where("read", "==", false)
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
}
