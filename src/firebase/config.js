import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCfjp2AfwmSITYBmVO3xxvkvOAY3JTD58E",
  authDomain: "incidencias-b92ae.firebaseapp.com",
  projectId: "incidencias-b92ae",
  storageBucket: "incidencias-b92ae.firebasestorage.app",
  messagingSenderId: "983216356830",
  appId: "1:983216356830:web:329e43d00f1e545917f14f",
  measurementId: "G-THFWW7XX62"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
