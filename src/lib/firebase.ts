
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

// Check if the project ID is still the placeholder
if (firebaseConfig.projectId === "YOUR_PROJECT_ID") {
  console.error(
    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n" +
    "CRITICAL Firebase Configuration Error:\n" +
    "Your Firebase projectId is still set to the placeholder 'YOUR_PROJECT_ID'.\n" +
    "You MUST update src/lib/firebase.ts with your actual Firebase project configuration.\n" +
    "Find this in your Firebase project settings > General > Your apps > Web app > SDK setup and configuration.\n" +
    "The application will not connect to Firestore correctly until this is fixed.\n" +
    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  );
}

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const firestore = getFirestore(app);

export { app, firestore };
