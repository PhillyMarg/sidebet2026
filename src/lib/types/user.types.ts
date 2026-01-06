import { Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  venmoUsername?: string;
  photoURL?: string;
  createdAt: Timestamp;
  lastActive: Timestamp;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  venmoUsername?: string;
}
