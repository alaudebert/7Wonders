
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

import "firebase/auth";
import "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAo0HG1crk5182XbHkWV3hSM3vRb0WYMgE",
  authDomain: "wonders-f3179.firebaseapp.com",
  projectId: "wonders-f3179",
  storageBucket: "wonders-f3179.appspot.com",
  messagingSenderId: "421781451419",
  appId: "1:421781451419:web:8d9bc5ce6ac2ef07f5cc3e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);