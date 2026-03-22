// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "mealhub-756e3.firebaseapp.com",
  projectId: "mealhub-756e3",
  storageBucket: "mealhub-756e3.firebasestorage.app",
  messagingSenderId: "380331342420",
  appId: "1:380331342420:web:9a54db52d36c7ee1c4cbc1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
export {app , auth}