// useState stores data; useEffect runs code when the page loads (Unit 2, Lecture 5)
import { useEffect, useState } from "react"
// One card per giver
import RevealCard from "../components/RevealCard"
// Where the backend lives
import { API_URL } from "../constants/consts"
// Shapes of an assignment and of the page names
import { Assignment, Page } from "../types"

// Props this page receives, marked readonly (Unit 2 convention)
type Props = {
  // Switch to another page
  readonly goTo: (page: Page) => void
  // Which group to show
  readonly groupId: string
  // Clear the group after deleting it
  readonly setGroupId: (id: string | null) => void
}

// Page 3: Results, where each person reveals who they're buying for
const ResultsPage = ({ goTo, groupId, setGroupId }: Props) => {
  // The giver -> receiver pairs from the server
  const [assignments, setAssignments] = useState<Assignment[]>([])
  // Error message to show, if any
  const [error, setError] = useState("")

  // When the page loads, GET the assignments
  useEffect(() => {
    // GET /groups/:id/assignments
    fetch(`${API_URL}/groups/${groupId}/assignments`)
      // Parse the JSON reply
      .then((res) => res.json())
      // An array means it worked; anything else is an error object
      .then((data) => (Array.isArray(data) ? setAssignments(data) : setError(data.error)))
  }, [groupId])

  // DELETE /groups/:id to delete the group and start over
  const startOver = async () => {
    // No body needed; the id is in the URL
    await fetch(`${API_URL}/groups/${groupId}`, { method: "DELETE" })
    // Forget the deleted group
    setGroupId(null)
    // Back to the Create page
    goTo("create")
  }

  // What the page shows
  return (
    <div className="card">
      {/* Page title */}
      <h1>Results</h1>
      {/* One RevealCard per giver */}
      {assignments.map((assignment) => (
        <RevealCard key={assignment.giver} assignment={assignment} />
      ))}
      {/* Only show an error if there is one */}
      {error && <p className="error">{error}</p>}
      {/* Delete the group */}
      <button onClick={startOver}>Delete group and start over</button>
    </div>
  )
}

// Default export so App.tsx can import it by name
export default ResultsPage
