import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBJ9CdT3E7LlbnYbcxAOnY6rjKpqwhd7fI",
  authDomain: "snalvfinalissimo.firebaseapp.com",
  projectId: "snalvfinalissimo",
  storageBucket: "snalvfinalissimo.appspot.com",
  messagingSenderId: "235042227385",
  appId: "1:235042227385:web:3233c7fae032359e61c768",
  measurementId: "G-5L6CY0P5VX",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
