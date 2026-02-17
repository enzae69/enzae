// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALbCmk9pVv5WUc1w9Zf9fSHshjhEc7UOw",
  authDomain: "sudoku-multiplayer-18534.firebaseapp.com",
  projectId: "sudoku-multiplayer-18534",
  storageBucket: "sudoku-multiplayer-18534.firebasestorage.app",
  messagingSenderId: "401519012394",
  appId: "1:401519012394:web:41470fa60f037bd73c7153",
  measurementId: "G-1B6EV80YYX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
