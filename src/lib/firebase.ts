import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBjd8vPdItkJGCbI_4yjEGCEa0XhY0kIc0",
  authDomain: "studio-469727693-aab99.firebaseapp.com",
  projectId: "studio-469727693-aab99",
  storageBucket: "studio-469727693-aab99.firebasestorage.app",
  messagingSenderId: "301941408568",
  appId: "1:301941408568:web:9c5a70490e63450b97f7cd"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
