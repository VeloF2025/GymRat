// Firebase configuration
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Development mode flag
const isDevelopment = process.env.NODE_ENV === 'development';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDevelopmentMockKeyForGymRatApp",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "gymrat-app.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gymrat-app",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "gymrat-app.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-ABCDEFGHIJ"
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Use emulators in development if NEXT_PUBLIC_USE_FIREBASE_EMULATORS is set
if (isDevelopment && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
  // Auth emulator typically runs on port 9099
  connectAuthEmulator(auth, 'http://localhost:9099');
  
  // Firestore emulator typically runs on port 8080
  connectFirestoreEmulator(db, 'localhost', 8080);
  
  // Storage emulator typically runs on port 9199
  connectStorageEmulator(storage, 'localhost', 9199);
  
  console.log('Using Firebase emulators for local development');
}

// Initialize Analytics conditionally (only in browser)
export const initAnalytics = async () => {
  if (typeof window !== 'undefined' && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

export default app;
