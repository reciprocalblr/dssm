import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore, getFirestore } from "firebase/firestore";
import firebaseConfigFile from "../../firebase-applet-config.json";

// Safe access helper for Vite environment variables with fallback
const getEnv = (key: string): string | undefined => {
  try {
    return (import.meta as unknown as { env?: Record<string, string> }).env?.[key];
  } catch {
    return undefined;
  }
};

// Unified Firebase configuration supporting both bundled config & environment variables
const config = {
  projectId: getEnv("VITE_FIREBASE_PROJECT_ID") || firebaseConfigFile.projectId,
  appId: getEnv("VITE_FIREBASE_APP_ID") || firebaseConfigFile.appId,
  apiKey: getEnv("VITE_FIREBASE_API_KEY") || firebaseConfigFile.apiKey,
  authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN") || firebaseConfigFile.authDomain,
  firestoreDatabaseId: getEnv("VITE_FIREBASE_DATABASE_ID") || firebaseConfigFile.firestoreDatabaseId,
  storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET") || firebaseConfigFile.storageBucket,
  messagingSenderId: getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID") || firebaseConfigFile.messagingSenderId,
};

const app = getApps().length > 0 ? getApp() : initializeApp(config);

const databaseId =
  config.firestoreDatabaseId && config.firestoreDatabaseId !== "(default)"
    ? config.firestoreDatabaseId
    : undefined;

let firestoreDb;
try {
  firestoreDb = initializeFirestore(
    app,
    {
      experimentalAutoDetectLongPolling: true,
      ignoreUndefinedProperties: true,
    },
    databaseId
  );
} catch {
  firestoreDb = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
}

export const db = firestoreDb;
export default app;
