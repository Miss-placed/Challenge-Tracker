// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'

export const firebaseApp = initializeApp({
  apiKey: 'AIzaSyAbBAc6ZGp1Zp6zp8jKcG9GeiY7TRhdbXY',
  authDomain: 'checkmate-6b59e.firebaseapp.com',
  projectId: 'checkmate-6b59e',
  storageBucket: 'checkmate-6b59e.firebasestorage.app',
  messagingSenderId: '1037228367228',
  appId: '1:1037228367228:web:4b3e96fe4eaedaaa2698f9',
  measurementId: 'G-5H1P8C2T1H',
})
export const db = getFirestore(firebaseApp)
