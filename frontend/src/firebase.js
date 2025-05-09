import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCK8SFN3aRH7Y2-UzBnX-WsNm2suV4fY6o",
    authDomain: "localhire-c4f7d.firebaseapp.com",
    projectId: "localhire-c4f7d",
    storageBucket: "localhire-c4f7d.firebasestorage.app",
    messagingSenderId: "42885283349",
    appId: "1:42885283349:web:716fbaaacefaa95ccf581c",
    measurementId: "G-D8HTNLW08K"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Enable offline persistence (optional)
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.log('Persistence failed - multiple tabs open');
  } else if (err.code === 'unimplemented') {
    console.log('Browser doesnt support persistence');
  }
});
