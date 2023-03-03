import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig ={
  apiKey: "AIzaSyBf17TNZdocFd63jDB14UCRugxL3Sw1xIA",
  authDomain: "testingdatabase-3d8ff.firebaseapp.com",
  databaseURL: "https://testingdatabase-3d8ff-default-rtdb.firebaseio.com",
  projectId: "testingdatabase-3d8ff",
  storageBucket: "testingdatabase-3d8ff.appspot.com",
  messagingSenderId: "396570590316",
  appId: "1:396570590316:web:eb2dc2380bf8f5403e6c49",
  measurementId: "G-XQ7NVWN3X5"
};

firebase.initializeApp(firebaseConfig); 
export const storageRef = firebase.storage().ref();

  