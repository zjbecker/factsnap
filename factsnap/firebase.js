// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { ref, set } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNiqDQ_vTshoXm_WBl-_9zlxMBpXRPTUc",
  authDomain: "fasctsnap.firebaseapp.com",
  projectId: "fasctsnap",
  storageBucket: "fasctsnap.appspot.com",
  messagingSenderId: "992799275601",
  appId: "1:992799275601:web:acd0ab833125f20363d670",
  databaseURL: "https://fasctsnap-default-rtdb.europe-west1.firebasedatabase.app/",
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

export {auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, ref, set}