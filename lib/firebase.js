import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDq6YNdszu-gz_Ka2NNm0K8aVI7NBHrv2Y",
  authDomain: "test-6411d.firebaseapp.com",
  projectId: "test-6411d",
  storageBucket: "test-6411d.firebasestorage.app",
  messagingSenderId: "536257385862",
  appId: "1:536257385862:web:1a0c5dd65ee859bf38c807"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
