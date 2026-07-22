import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDKOuetZElS7kW6Jaf8GTOilL70qhrttno",
  authDomain: "phase-1-c8aba.firebaseapp.com",
  projectId: "phase-1-c8aba",
  storageBucket: "phase-1-c8aba.firebasestorage.app",
  messagingSenderId: "310443643610",
  appId: "1:310443643610:web:0b78041ad300b2589f8be3",
  measurementId: "G-FJW7PPL65M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics (optional)
export const analytics = getAnalytics(app);

export default app;