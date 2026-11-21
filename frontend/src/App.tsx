import { useState } from "react"
import { signOut } from "./firebase"
import { useAuth } from "./components/AuthUserProvider"
import SignIn from "./components/SignIn"
import CreatePage from "./pages/CreatePage"
import GroupPage from "./pages/GroupPage"
import ResultsPage from "./pages/ResultsPage"
import { Page } from "./types"
import "./App.css"

function App() {
  const { user, loading } = useAuth()
  const [page, setPage] = useState<Page>("create")

  if (loading) return <p className="page">Loading...</p>
  if (!user) return <SignIn />

  return (
    <>
      <header className="topbar">
        <span>Signed in as {user.displayName ?? user.email}</span>
        <button onClick={signOut}>Sign out</button>
      </header>
      {page === "create" && <CreatePage goTo={setPage} uid={user.uid} />}
      {page === "group" && <GroupPage goTo={setPage} uid={user.uid} />}
      {page === "results" && <ResultsPage goTo={setPage} uid={user.uid} />}
    </>
  )
}

export default App