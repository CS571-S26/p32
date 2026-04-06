// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_TP6P-Oq1kyE7dGDbZHOTPbgThd0fGt8",
  authDomain: "journalkeeper-e3760.firebaseapp.com",
  projectId: "journalkeeper-e3760",
  storageBucket: "journalkeeper-e3760.firebasestorage.app",
  messagingSenderId: "1089358754008",
  appId: "1:1089358754008:web:fc27e93e7058683d1927ad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
