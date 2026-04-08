import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyANVPQwRcVe-YHNAXhNt1WI2whwdWz6rVA",
  authDomain: "lmp-app-cef0a.firebaseapp.com",
  projectId: "lmp-app-cef0a",
  storageBucket: "lmp-app-cef0a.firebasestorage.app",
  messagingSenderId: "112010968145",
  appId: "1:112010968145:web:e73c14c8780ea048b10c70"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
