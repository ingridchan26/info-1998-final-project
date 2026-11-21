import { signInWithGoogle } from "../firebase"

const SignIn = () => {
  return (
    <div className="page">
      <h1>Secret Santa</h1>
      <p>Sign in to make a group, draw names, and reveal who you're buying for.</p>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  )
}

export default SignIn