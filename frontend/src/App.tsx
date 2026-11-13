import { useState } from "react"
import "./App.css"
import CreatePage from "./pages/CreatePage"
import GroupPage from "./pages/GroupPage"
import ResultsPage from "./pages/ResultsPage"
import { Page } from "./types"

function App() {
  const [page, setPage] = useState<Page>("create")

  return (
    <>
      {page === "create" && <CreatePage goTo={setPage} />}
      {page === "group" && <GroupPage goTo={setPage} />}
      {page === "results" && <ResultsPage goTo={setPage} />}
    </>
  )
}

export default App
