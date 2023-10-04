import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB4dRmJlpaQgiLp4Wh6P5FEvmiuF2-aSAI",
  authDomain: "corporate-criminal.firebaseapp.com",
  projectId: "corporate-criminal",
  storageBucket: "corporate-criminal.appspot.com",
  messagingSenderId: "135151103038",
  appId: "1:135151103038:web:4c532a6618c3485e62756f",
  measurementId: "G-KLY5R47QKH",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
