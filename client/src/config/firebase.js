// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKOuetZElS7kW6Jaf8GTOilL70qhrttno",
  authDomain: "phase-1-c8aba.firebaseapp.com",
  projectId: "phase-1-c8aba",
  storageBucket: "phase-1-c8aba.firebasestorage.app",
  messagingSenderId: "310443643610",
  appId: "1:310443643610:web:0b78041ad300b2589f8be3",
  measurementId: "G-FJW7PPL65M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;