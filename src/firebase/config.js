import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
<<<<<<< HEAD
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
=======
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
>>>>>>> 0346d9d (Primer commit: subiendo proyecto inicial)
