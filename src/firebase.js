import app from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDUuh3wM-ZgBMTFT5OHWyDIuGcfD88cRRg",
    authDomain: "detector-bff46.firebaseapp.com",
    databaseURL: "https://detector-bff46.firebaseio.com",
    projectId: "detector-bff46",
    storageBucket: "detector-bff46.appspot.com",
    messagingSenderId: "756969306515",
    appId: "1:756969306515:web:88072d1858018aa1b69066"
  };

  // Initialize Firebase
  app.initializeApp(firebaseConfig);

  const db = app.firestore();
  const auth = app.auth();

  export { db, auth }
