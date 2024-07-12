// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "noteapp-5d0aa.firebaseapp.com",
  projectId: "noteapp-5d0aa",
  storageBucket: "noteapp-5d0aa.appspot.com",
  messagingSenderId: "251098819043",
  appId: "1:251098819043:web:d80f1bc68e1b6bed0018d6"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
