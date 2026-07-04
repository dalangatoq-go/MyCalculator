import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD07QMa3KMvmjaABA4T7F4L-qmBeSj4Ugc",
  authDomain: "mycalculator-pro123.firebaseapp.com",
  projectId: "mycalculator-pro123",
  storageBucket: "mycalculator-pro123.firebasestorage.app",
  messagingSenderId: "791150769061",
  appId: "REPLACE_WITH_WEB_APP_ID_FROM_FIREBASE_CONSOLE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
