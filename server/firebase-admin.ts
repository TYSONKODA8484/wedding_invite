// server/firebase.ts  (replace your current firebase-admin file with this)
import dotenv from "dotenv";
dotenv.config();

import admin from "firebase-admin";

const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!raw) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is not set");
}

// If the JSON was pasted into .env with surrounding single-quotes, remove them.
const cleaned = raw.startsWith("'") && raw.endsWith("'") ? raw.slice(1, -1) : raw;

let serviceAccount: any;
try {
  serviceAccount = JSON.parse(cleaned);
} catch (err) {
  // Provide actionable error message
  throw new Error("Failed to parse FIREBASE_SERVICE_ACCOUNT JSON. Check formatting in .env. " + (err as Error).message);
}

// initialize admin only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    projectId: serviceAccount.project_id,
    // storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined,
  });
}

export default admin;
export const adminAuth = admin.auth();
