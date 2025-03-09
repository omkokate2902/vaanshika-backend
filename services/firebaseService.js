// services/firebaseService.js
import { initializeApp as initializeAdminApp, cert } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { initializeApp as initializeClientApp } from 'firebase/app';
import { getAuth as getClientAuth } from 'firebase/auth';
import dotenv from 'dotenv';
import { createRequire } from 'module';

dotenv.config();

// Import service account using createRequire for ESM compatibility
const require = createRequire(import.meta.url);
const serviceAccount = require('../vaanshika-firebase-adminsdk-fbsvc-b9fbe6b15d.json');

// ✅ Initialize Firebase Admin SDK (for server-side operations)
initializeAdminApp({
  credential: cert(serviceAccount),
});

// ✅ Firebase Client SDK Configuration (for client-side operations)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

// ✅ Initialize Client App for client-side authentication
const clientApp = initializeClientApp(firebaseConfig);
const clientAuthInstance = getClientAuth(clientApp);

// 🚀 Export Admin and Client Auth instances
export const adminAuth = getAdminAuth();       // Server-side admin operations
export { clientAuthInstance };                 // Client-side auth operations