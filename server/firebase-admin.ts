import admin from "firebase-admin";

// Initialize Firebase Admin SDK
// For ID token verification, we only need the project ID
// No service account key needed for this use case
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: "weddinginvite-18669",
  });
}

export const adminAuth = admin.auth();
