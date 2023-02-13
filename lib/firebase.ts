import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjt3Xg4k6lyBtLjOHlfCERFO84L3fl_So",
  authDomain: "netflix-clone-58ef6.firebaseapp.com",
  projectId: "netflix-clone-58ef6",
  storageBucket: "netflix-clone-58ef6.appspot.com",
  messagingSenderId: "467435779690",
  appId: "1:467435779690:web:cf4e8195b7dba6c2c17c13"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const auth = getAuth();

export default app
export { auth, db }