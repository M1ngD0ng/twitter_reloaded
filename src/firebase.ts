import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
 
const firebaseConfig = {
  apiKey: "AIzaSyDQkN1ctSbW03_v9SSyRSzhHLtuiocXQ54",
  authDomain: "twitter-reloaded-cd9af.firebaseapp.com",
  projectId: "twitter-reloaded-cd9af",
  storageBucket: "twitter-reloaded-cd9af.appspot.com",
  messagingSenderId: "962370293113",
  appId: "1:962370293113:web:f4518dde732a54a02073a8"
};

const app = initializeApp(firebaseConfig);

export const auth=getAuth(app);

export const storage=getStorage(app);

export const db=getFirestore(app);