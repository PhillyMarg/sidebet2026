import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD646Vq8TzLmm7hbTkzT0eGnqcjZQmsOcs",
  authDomain: "sidebet-2026.firebaseapp.com",
  projectId: "sidebet-2026",
  storageBucket: "sidebet-2026.firebasestorage.app",
  messagingSenderId: "581937754422",
  appId: "1:581937754422:web:f1b6e1f5b074b9ec1c8397"
};

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export { RecaptchaVerifier, signInWithPhoneNumber };

export default app;
