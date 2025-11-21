import admin from "firebase-admin";

// Initialize Firebase Admin SDK with service account credentials
if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (!serviceAccount) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is not set");
  }
  
  try {
    const serviceAccountJson = JSON.parse(serviceAccount);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountJson),
      projectId: serviceAccountJson.project_id, // Use project ID from service account JSON
    });
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
    throw error;
  }
}

export const adminAuth = admin.auth();
