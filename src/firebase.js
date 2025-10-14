// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKm6i9IuRNeA2C3_XMZ9d2YhZiP0SJf24",
  authDomain: "wetterly.firebaseapp.com",
  projectId: "wetterly",
  storageBucket: "wetterly.firebasestorage.app",
  messagingSenderId: "16690297959",
  appId: "1:16690297959:web:558b3539afb6e6622d68c2",
  measurementId: "G-2P9RX629WZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firestore = getFirestore(app);