import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"
import withFirebaseAuth from "react-with-firebase-auth"

const firebaseConfig = {
  apiKey: "PASTE_FROM_FIREBASE_CONSOLE",
  authDomain: "PASTE_FROM_FIREBASE_CONSOLE",
  projectId: "PASTE_FROM_FIREBASE_CONSOLE",
  storageBucket: "PASTE_FROM_FIREBASE_CONSOLE",
  messagingSenderId: "PASTE_FROM_FIREBASE_CONSOLE",
  appId: "PASTE_FROM_FIREBASE_CONSOLE",
}

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