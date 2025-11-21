import { initializeApp } from "firebase/app";
import { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from "firebase/auth";

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

const firebaseConfig = {
  apiKey: apiKey || "",
  authDomain: projectId ? `${projectId}.firebaseapp.com` : "",
  projectId: projectId || "",
  storageBucket: projectId ? `${projectId}.firebasestorage.app` : "",
  appId: appId || "",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

// Handle redirect results from Firebase
export async function handleGoogleRedirect() {
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      return result.user;
    }
  } catch (error: any) {
    console.error("Firebase redirect error:", error);
    throw error;
  }
}

// Sign in with Google
export function signInWithGoogle() {
  signInWithRedirect(auth, googleProvider);
}
