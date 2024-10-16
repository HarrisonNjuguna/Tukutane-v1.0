import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "",
    authDomain: "tukutanev1.firebaseapp.com",
    projectId: "tukutanev1",
    storageBucket: "tukutanev1.appspot.com",
    messagingSenderId: "979796171370",
    appId: "1:979796171370:web:c09b914af6b9a4b5d64813",
    measurementId: "G-9Y5ZTMFCFT"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export the Firestore instance
export { auth, db };

