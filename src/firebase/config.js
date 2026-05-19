import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // <-- Faltaba importar Storage

const firebaseConfig = {
  apiKey: "AIzaSyDDmHYc3qmFI0P3wtHYnMtiy1tqc7v_UVs",
  authDomain: "programacion-web-25d5b.firebaseapp.com",
  projectId: "programacion-web-25d5b",
  storageBucket: "programacion-web-25d5b.firebasestorage.app",
  messagingSenderId: "448597561705",
  appId: "1:448597561705:web:fb669a6f4d604035af2df8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // <-- Faltaba exportar Storage