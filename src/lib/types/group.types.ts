import { Timestamp } from "firebase/firestore";

export interface Group {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  members: string[];
  admins: string[];
  inviteCode: string;
  createdAt: Timestamp;
}

export interface CreateGroupFormData {
  name: string;
  description?: string;
}
