// Import the necessary functions directly from the Firebase package
import { initializeApp,getApps } from "firebase/app";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence,getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaGcXB2r9fy7iG4To-ZsB23fXxHXCTIpY",
  authDomain: "carddigitizer.firebaseapp.com",
  projectId: "carddigitizer",
  storageBucket: "carddigitizer.appspot.com",
  messagingSenderId: "262080489558",
  appId: "1:262080489558:web:eb86d7262bb44437e5f3f7",
  measurementId: "G-E1EPLGJ5M1"
};


let app;
let auth;

// Check if Firebase has already been initialized
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} else {
  app = getApps()[0]; // get the already initialized app
  auth = getAuth(app); // get the already initialized auth
}

const db = getFirestore(app);
export {auth,db};