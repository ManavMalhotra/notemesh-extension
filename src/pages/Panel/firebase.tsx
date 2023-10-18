// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// import secrets from 'secrets';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: secrets.REACT_APP_API_KEY,
//   authDomain: secrets.REACT_APP_AUTH_DOMAIN,
//   projectId: secrets.REACT_APP_PROJECT_ID,
//   storageBucket: secrets.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: secrets.REACT_APP_MESSAGING_SENDER_ID,
//   appId: secrets.REACT_APP_APP_ID,
//   measurementId: secrets.REACT_APP_MEASUREMENT_ID,
// };

const firebaseConfig = {
  apiKey: 'AIzaSyAewSrZCX96Gv38Us_r_soNp1ZoZkG4Chg',
  authDomain: 'notemesh-51bb5.firebaseapp.com',
  projectId: 'notemesh-51bb5',
  storageBucket: 'notemesh-51bb5.appspot.com',
  messagingSenderId: '903321720589',
  appId: '1:903321720589:web:64825a017f0e5c3771c244',
  measurementId: 'G-DE59EW6WM3',
};

console.log(firebaseConfig);
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
