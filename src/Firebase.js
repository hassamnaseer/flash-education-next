// import * as firebase from 'firebase'
import { initializeApp } from 'firebase/app'
import { FacebookAuthProvider, getAuth, GoogleAuthProvider } from 'firebase/auth'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDr_ikwQp1swM8DJxQ0zhqVZ_knCEEyM4Y',
  authDomain: 'letsflashapp-3a0dc.firebaseapp.com',
  projectId: 'letsflashapp-3a0dc',
  storageBucket: 'letsflashapp-3a0dc.appspot.com',
  messagingSenderId: '361656936195',
  appId: '1:361656936195:web:c9cbc77b2322b4c71cab36',
  measurementId: 'G-ZT31TBK7WJ',
}

//Old Configs
// const firebaseConfig = {
//   apiKey: "AIzaSyAgChjz_1keX4ogCQoM0OhxrRlgcSrcFHw",
//   authDomain: "luke-a146f.firebaseapp.com",
//   databaseURL: "https://luke-a146f.firebaseio.com",
//   projectId: "luke-a146f",
//   storageBucket: "luke-a146f.appspot.com",
//   messagingSenderId: "764336787445",
//   appId: "1:764336787445:web:b526e1163bce4a32f51abc"
// };

const app = initializeApp(firebaseConfig)
const Auth = getAuth(app)

export const registerWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(Auth, email, password)
}

export const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(Auth, email, password)
}

export const loginWithGoogle = () => {
  return signInWithPopup(Auth, new GoogleAuthProvider())
}

export const loginWithFacebook = () => {
  return signInWithPopup(Auth, new FacebookAuthProvider())
}

// export const signOutUser = () => {
//   return firebase.auth().signOut();
// };

// // export const currentUser = () => {
// //   return firebase.auth().onAuthStateChanged();
// // };

// export const askForPermissioToReceiveNotifications = async () => {
//   try {
//     Notification.requestPermission().then(function(result) {
//       if (result === "granted") {
//         var text = "HEY! Notification";
//         new Notification("Test", { body: text });
//       }
//     });
//   } catch (error) {
//     console.error("error:", error);
//   }
// };

// export default firebase
