// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8XGV_is2Z7QhTU8h8Sas-Od2vfrlDFLE",
  authDomain: "wynnmarket-756a2.firebaseapp.com",
  projectId: "wynnmarket-756a2",
  storageBucket: "wynnmarket-756a2.firebasestorage.app",
  messagingSenderId: "312110253359",
  appId: "1:312110253359:web:91c8ced16ad8d4e45f0dda",
  measurementId: "G-B9J1D1P362"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { analytics, app, auth, db };
