
import { initializeApp, getApps, getApp, type FirebaseOptions, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

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

type FirebaseConfigKey = keyof typeof firebaseConfigValues;

const requiredConfigKeys: FirebaseConfigKey[] = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

const envVarNameMap: Record<FirebaseConfigKey, string> = {
  apiKey: 'NEXT_PUBLIC_FIREBASE_API_KEY',
  authDomain: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  projectId: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  storageBucket: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'NEXT_PUBLIC_FIREBASE_APP_ID',
  measurementId: 'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
};

const placeholderValues: Partial<Record<FirebaseConfigKey, string>> = {
  apiKey: "YOUR_API_KEY_FROM_ENV_LOCAL",
  authDomain: "YOUR_AUTH_DOMAIN_FROM_ENV_LOCAL",
  projectId: "YOUR_PROJECT_ID_FROM_ENV_LOCAL",
  storageBucket: "YOUR_STORAGE_BUCKET_FROM_ENV_LOCAL",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID_FROM_ENV_LOCAL",
  appId: "YOUR_APP_ID_FROM_ENV_LOCAL",
};

let configError = false;
const errorMessages: string[] = [];

requiredConfigKeys.forEach(key => {
  const actualEnvVarName = envVarNameMap[key];
  const value = firebaseConfigValues[key];
  const placeholder = placeholderValues[key];

  if (!value) {
    errorMessages.push(`CRITICAL Firebase Configuration Error: ${actualEnvVarName} is missing or empty.`);
    configError = true;
  } else if (placeholder && value === placeholder) {
    errorMessages.push(`CRITICAL Firebase Configuration Error: ${actualEnvVarName} is still set to the placeholder value "${placeholder}".`);
    configError = true;
  }
});

const firebaseConfig: FirebaseOptions = firebaseConfigValues as FirebaseOptions;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (!configError) { // Only proceed if basic env var checks pass (not missing, not placeholder)
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (e: any) {
      console.error(
        "Firebase core initialization failed during initializeApp():",
        e.message,
        "\nThis can happen with a malformed configuration object even if env vars are present."
      );
      configError = true; // Mark as error if initializeApp itself fails
    }
  } else {
    app = getApp();
  }

  if (app && !configError) { // Only try to get services if app initialized and no *initial* configError
    try {
      auth = getAuth(app);
    } catch (e: any) {
      console.error(
        "Firebase Auth initialization (getAuth) failed:",
        e.message,
        "\nThis typically occurs due to an invalid API key, auth domain, or project ID in your .env.local file. Please verify these values in your Firebase project console and ensure .env.local is correctly set up and your dev server was restarted."
      );
      auth = null; // Ensure auth is null if getAuth fails
    }

    try {
      firestore = getFirestore(app);
    } catch (e: any) {
      console.error("Firebase Firestore initialization (getFirestore) failed:", e.message);
      firestore = null; // Ensure firestore is null if getFirestore fails
    }

    try {
      storage = getStorage(app);
    } catch (e: any) {
      console.error("Firebase Storage initialization (getStorage) failed:", e.message);
      storage = null; // Ensure storage is null if getStorage fails
    }
  }
}

if (configError && errorMessages.length > 0) {
  console.error(
    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n" +
    errorMessages.join("\n") + "\n" +
    "Please ensure 'src/.env.local' exists and all NEXT_PUBLIC_FIREBASE_* variables are set to your actual Firebase project credentials.\n" +
    "Refer to 'src/.env.local.example'.\n" +
    "Firebase will not initialize correctly. You MUST RESTART your development server after correcting 'src/.env.local'.\n" +
    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  );
} else if (app && (!auth || !firestore || !storage) && !configError) { 
    console.warn(
        "Firebase services (Auth/Firestore/Storage) may not be fully initialized. This could be due to invalid credentials (even if present in .env.local) or other Firebase setup issues. Some app features might not work as expected."
    );
}


export { app, firestore, auth, storage };
