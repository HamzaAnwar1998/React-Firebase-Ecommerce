import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyB-DzFXOPWWcf_kyzkpWIfeIclyp0ACovQ",
    authDomain: "react-firebase-ecommerce-5aeaf.firebaseapp.com",
    projectId: "react-firebase-ecommerce-5aeaf",
    storageBucket: "react-firebase-ecommerce-5aeaf.appspot.com",
    messagingSenderId: "485009995833",
    appId: "1:485009995833:web:7e6c94e6d79547953575e8",
    measurementId: "G-7JLNJ71K36"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const fs = firebase.firestore();
const storage = firebase.storage();

export {auth, fs, storage}