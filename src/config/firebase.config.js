// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAnalytics} from 'firebase/analytics';
import {getStorage} from 'firebase/storage';
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAJ-l-xljUjnpdJ1kGOB4Fo9nPM57HtcRw',
  authDomain: 'checkin-862e3.firebaseapp.com',
  projectId: 'checkin-862e3',
  storageBucket: 'checkin-862e3.appspot.com',
  messagingSenderId: '528871740424',
  appId: '1:528871740424:web:de292d3061f8faa50f6dbd',
  measurementId: 'G-P48LXPEMLF',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
