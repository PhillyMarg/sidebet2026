"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import { User, UserFormData } from "@/lib/types";

interface ProfileUpdateData {
  firstName: string;
  lastName: string;
  venmoUsername?: string;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: UserFormData) => Promise<void>;
  signUpEmailOnly: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: ProfileUpdateData) => Promise<void>;
  sendPhoneVerification: (phoneNumber: string) => Promise<ConfirmationResult>;
  verifyPhoneCode: (confirmationResult: unknown, code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Declare recaptcha verifier at module level for reuse
let recaptchaVerifier: RecaptchaVerifier | null = null;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, "users", fbUser.uid));
        if (userDoc.exists()) {
          setUser({ uid: fbUser.uid, ...userDoc.data() } as User);
        } else {
          // User exists in auth but not in Firestore (phone auth case)
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (data: UserFormData) => {
    const { email, password, firstName, lastName, venmoUsername } = data;

    // Create Firebase auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { uid } = userCredential.user;

    // Create user document in Firestore
    const userData = {
      email,
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      venmoUsername: venmoUsername || null,
      photoURL: null,
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp(),
    };

    await setDoc(doc(db, "users", uid), userData);
  };

  const signUpEmailOnly = async (email: string, password: string) => {
    // Create Firebase auth user only - profile completion happens separately
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = async (data: ProfileUpdateData) => {
    if (!firebaseUser) {
      throw new Error("No authenticated user");
    }

    const { firstName, lastName, venmoUsername } = data;
    const uid = firebaseUser.uid;

    // Check if user document exists
    const userDoc = await getDoc(doc(db, "users", uid));

    if (userDoc.exists()) {
      // Update existing document
      await updateDoc(doc(db, "users", uid), {
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        venmoUsername: venmoUsername || null,
        lastActive: serverTimestamp(),
      });
    } else {
      // Create new user document (for phone auth or email-only signup)
      const userData = {
        email: firebaseUser.email || null,
        phoneNumber: firebaseUser.phoneNumber || null,
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        venmoUsername: venmoUsername || null,
        photoURL: null,
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp(),
      };

      await setDoc(doc(db, "users", uid), userData);
    }

    // Update local user state
    setUser({
      uid,
      email: firebaseUser.email || "",
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      venmoUsername: venmoUsername || undefined,
    } as User);
  };

  const sendPhoneVerification = async (phoneNumber: string): Promise<ConfirmationResult> => {
    // Clear any existing recaptcha
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    }

    // Create invisible reCAPTCHA
    recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => {
        // reCAPTCHA solved
      },
      "expired-callback": () => {
        // reCAPTCHA expired
        if (recaptchaVerifier) {
          recaptchaVerifier.clear();
          recaptchaVerifier = null;
        }
      },
    });

    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return confirmationResult;
  };

  const verifyPhoneCode = async (confirmationResult: unknown, code: string) => {
    if (!confirmationResult || typeof (confirmationResult as ConfirmationResult).confirm !== "function") {
      throw new Error("Invalid confirmation result");
    }

    await (confirmationResult as ConfirmationResult).confirm(code);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        signIn,
        signUp,
        signUpEmailOnly,
        signOut,
        resetPassword,
        updateUserProfile,
        sendPhoneVerification,
        verifyPhoneCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
