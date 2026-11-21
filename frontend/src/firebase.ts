import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"
import withFirebaseAuth from "react-with-firebase-auth"

const firebaseConfig = {
  apiKey: "AIzaSyAw43w_94Snc-PQP-iuQjSqIZZEmCyBREQ",
  authDomain: "secret-santa-2519b.firebaseapp.com",
  projectId: "secret-santa-2519b",
  storageBucket: "secret-santa-2519b.firebasestorage.app",
  messagingSenderId: "577065959669",
  appId: "1:577065959669:web:e8b82e1e8c5b9e46f885bc"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

const providers = {
  googleProvider: new GoogleAuthProvider(),
}

const createComponentWithAuth = withFirebaseAuth({
  providers,
  firebaseAppAuth: auth,
})

const signInWithGoogle = () => {
  signInWithPopup(auth, providers.googleProvider)
}

const signOutFirebase = () => {
  signOut(auth)
}

export { auth, createComponentWithAuth, signInWithGoogle, signOutFirebase as signOut }