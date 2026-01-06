import { Timestamp } from "firebase/firestore";

export type FriendshipStatus = "pending" | "accepted";

export interface Friendship {
  id: string;
  user1Id: string;
  user2Id: string;
  status: FriendshipStatus;
  requestedBy: string;
  createdAt: Timestamp;
  acceptedAt?: Timestamp;
}
