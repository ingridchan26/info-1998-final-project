// useState remembers which page is showing and which group we're in (Unit 2)
import { useState } from "react"
// Styles for the whole app (plain CSS, same as the starter)
import "./App.css"
// The three pages
import CreatePage from "./pages/CreatePage"
import GroupPage from "./pages/GroupPage"
import ResultsPage from "./pages/ResultsPage"
// The type listing every page name
import { Page } from "./types"

// Root component. No router: we switch pages with state, as Unit 2 does
function App() {
  // Start on the Create page
  const [page, setPage] = useState<Page>("create")
  // The id of the group we just created (null = no group yet)
  const [groupId, setGroupId] = useState<string | null>(null)

  // What the app shows
  return (
    <>
      {/* Create page: gets setGroupId so it can save the new group's id */}
      {page === "create" && <CreatePage goTo={setPage} setGroupId={setGroupId} />}
      {/* Group and Results pages need a group, so only show them once we have one */}
      {page === "group" && groupId && <GroupPage goTo={setPage} groupId={groupId} />}
      {page === "results" && groupId && (
        <ResultsPage goTo={setPage} groupId={groupId} setGroupId={setGroupId} />
      )}
    </>
  )
}

// main.tsx imports this and renders it
export default App
