// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD87tKYekwPoFKNWgwWk_Ra7Hn74AnkMvA",
  authDomain: "storage-ec99a.firebaseapp.com",
  projectId: "storage-ec99a",
  storageBucket: "storage-ec99a.appspot.com",
  messagingSenderId: "756878977416",
  appId: "1:756878977416:web:090c78022d0eaf682cf23d",
  measurementId: "G-PDJZ7TMFRN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default storage;