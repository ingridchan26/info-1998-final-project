// useState stores data; useEffect loads it when the page opens (Unit 2, Lecture 5)
import { useEffect, useState } from "react"
// One card per giver
import RevealCard from "../components/RevealCard"
// Where the backend lives
import { API_URL } from "../constants/consts"
// Data shapes
import { Assignment, Page } from "../types"

// What App.tsx passes in (readonly props, Unit 2)
type Props = {
  // Switch to another page
  readonly goTo: (page: Page) => void
  // The signed-in user's id
  readonly uid: string
}

// Page 3: each person reveals who they're buying for
const ResultsPage = ({ goTo, uid }: Props) => {
  // The giver -> receiver pairs from the backend
  const [assignments, setAssignments] = useState<Assignment[]>([])
  // Error message from the backend, if any
  const [error, setError] = useState("")

  // When the page opens, GET /groups/:uid/assignments
  useEffect(() => {
    // Ask the backend for the pairs
    fetch(`${API_URL}/groups/${uid}/assignments`)
      // Turn the reply into a JS object
      .then((res) => res.json())
      // Show the pairs, or the error
      .then((data) => (data.error ? setError(data.error) : setAssignments(data)))
  }, [uid])

  // DELETE /groups/:uid to delete the group and start over
  const startOver = () => {
    // No body needed; the id is in the URL
    fetch(`${API_URL}/groups/${uid}`, { method: "DELETE" })
      // Turn the reply into a JS object
      .then((res) => res.json())
      // Go back to the Create page
      .then(() => goTo("create"))
  }

  // What the page shows
  return (
    <div className="page">
      {/* Page title */}
      <h1>Results</h1>
      {/* Instructions */}
      <p>Pass the screen around. Each person reveals only their own card.</p>
      {/* Only show an error if there is one */}
      {error && <p className="error">{error}</p>}
      {/* One card per giver; key helps React track each card (Unit 2) */}
      {assignments.map((assignment) => (
        <RevealCard key={assignment.giver} assignment={assignment} />
      ))}
      {/* Back to the group, e.g. to change people and press Go! again */}
      <button className="link" onClick={() => goTo("group")}>
        Back to group
      </button>
      {/* Delete everything and start again */}
      <button onClick={startOver}>Delete group and start over</button>
    </div>
  )
}

// Default export so App.tsx can import it
export default ResultsPage
