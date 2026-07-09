// src/utils/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


// Firebase configuration for the mechanic website
const firebaseConfig = {
  apiKey: "AIzaSyA_2oLg1z7iSA6cCj1kTiTvZ66FUMRroTU",
  authDomain: "mechanic-react-webapp.firebaseapp.com",
  projectId: "mechanic-react-webapp",
  storageBucket: "mechanic-react-webapp.firebasestorage.app",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "1:193511106889:web:113e3e173ce152c6255298",
};

// Connect React app to Firebase
const app = initializeApp(firebaseConfig);

// Connect app to Firestore database
export const db = getFirestore(app);