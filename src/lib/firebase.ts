
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// IMPORTANT: Replace with your Firebase project's configuration
// You can find this in your Firebase project settings:
// Project settings > General > Your apps > Web app > SDK setup and configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: "YOUR_API_KEY", // REPLACE THIS
  authDomain: "YOUR_AUTH_DOMAIN", // REPLACE THIS
  projectId: "YOUR_PROJECT_ID", // REPLACE THIS
  storageBucket: "YOUR_STORAGE_BUCKET", // REPLACE THIS
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // REPLACE THIS
  appId: "YOUR_APP_ID", // REPLACE THIS
  measurementId: "YOUR_MEASUREMENT_ID" // Optional, REPLACE THIS if you use Analytics
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const firestore = getFirestore(app);

export { app, firestore };
