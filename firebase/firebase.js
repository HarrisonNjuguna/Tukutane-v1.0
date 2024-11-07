import { initializeApp, getApp, getApps } from 'firebase/app'; // Use getApp and getApps to check if app is already initialized
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALT1loRm0CDP9SbISo2H-9nb060yNz14w",
  authDomain: "tukutanev1.firebaseapp.com",
  projectId: "tukutanev1",
  storageBucket: "tukutanev1.appspot.com",
  messagingSenderId: "979796171370",
  appId: "1:979796171370:web:c09b914af6b9a4b5d64813",
  measurementId: "G-9Y5ZTMFCFT"
};

// Initialize Firebase App (only if not already initialized)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth with AsyncStorage for persistence (only if not already initialized)
const auth = !getAuth(app) ? initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
}) : getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Analytics conditionally (only if supported)
let analytics = null;
if (isSupported()) {
  analytics = getAnalytics(app);
}

// Export the Firestore and Auth instances
export { auth, db, analytics };
