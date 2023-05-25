import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyC5C5fsTM_w4-25pUhh7pe_Cs_xRA8zmQU",
  authDomain: "grandlim.firebaseapp.com",
  projectId: "grandlim",
  storageBucket: "grandlim.appspot.com",
  messagingSenderId: "16078704039",
  appId: "1:16078704039:web:783eb90b6a7c1939ed3a82"
};

const app = initializeApp(firebaseConfig);
export const Auth = getAuth(app)
export const provider = new GoogleAuthProvider()