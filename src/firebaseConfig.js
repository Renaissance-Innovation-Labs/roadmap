// src/config/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCa5X4yqxHJzVgX-TfRERhrHByorDZzKDQ",
    authDomain: "roadmap-app-227f3.firebaseapp.com",
    projectId: "roadmap-app-227f3",
    storageBucket: "roadmap-app-227f3.firebasestorage.app",
    messagingSenderId: "971357415396",
    appId: "1:971357415396:web:b5b2f404979ed3450489f1",
    measurementId: "G-6DQZCK98FN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
