
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration will now be read from environment variables
const firebaseConfigValues = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

const requiredEnvVars: (keyof typeof firebaseConfigValues)[] = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

let configError = false;
const errorMessages: string[] = [];

const placeholderValues: Record<string, string> = {
  apiKey: "YOUR_API_KEY_FROM_ENV_LOCAL",
  authDomain: "YOUR_AUTH_DOMAIN_FROM_ENV_LOCAL",
  projectId: "YOUR_PROJECT_ID_FROM_ENV_LOCAL",
  storageBucket: "YOUR_STORAGE_BUCKET_FROM_ENV_LOCAL",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID_FROM_ENV_LOCAL",
  appId: "YOUR_APP_ID_FROM_ENV_LOCAL",
};

requiredEnvVars.forEach(key => {
  const envVarName = `NEXT_PUBLIC_FIREBASE_${key.toUpperCase()}`;
  const value = firebaseConfigValues[key];
  const placeholder = placeholderValues[key];

  if (!value) {
    errorMessages.push(`CRITICAL Firebase Configuration Error: ${envVarName} is missing or empty.`);
    configError = true;
  } else if (placeholder && value === placeholder) {
    errorMessages.push(`CRITICAL Firebase Configuration Error: ${envVarName} is still set to the placeholder value "${placeholder}".`);
    configError = true;
  }
});

if (configError) {
  console.error(
    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n" +
    errorMessages.join("\n") + "\n" +
    "Please ensure 'src/.env.local' exists and all NEXT_PUBLIC_FIREBASE_* variables are set to your actual Firebase project credentials.\n" +
    "Refer to 'src/.env.local.example'.\n" +
    "Firebase will not initialize correctly. You MUST RESTART your development server after correcting 'src/.env.local'.\n" +
    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  );
}

const firebaseConfig: FirebaseOptions = firebaseConfigValues as FirebaseOptions;

// Initialize Firebase
let app;
if (!getApps().length) {
  // Only attempt to initialize if no critical config errors were found
  if (!configError) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (e: any) {
      console.error("Firebase initialization failed:", e.message);
      console.error("This often happens due to an invalid configuration, even if environment variables seem present. Double-check your Firebase project settings and .env.local values.");
      configError = true; // Mark as error to prevent further Firebase calls
    }
  } else {
    console.warn("Firebase initialization skipped due to critical configuration errors.");
  }
} else {
  app = getApp();
}

// Conditionally initialize Firestore and Auth only if app was successfully initialized
const firestore = !configError && app ? getFirestore(app) : null;
const auth = !configError && app ? getAuth(app) : null;

// Export nulls if there was an error so the app can degrade gracefully or components can check
export { app, firestore, auth };
