import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "weddinginvite-18669.firebaseapp.com",
  projectId: "weddinginvite-18669",
  storageBucket: "weddinginvite-18669.firebasestorage.app",
  messagingSenderId: "411118688172",
  appId: "1:411118688172:web:ee8a29bdd7fe1c8ee4cc09",
  measurementId: "G-28EVPZ0L29"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider to always show account selection
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
