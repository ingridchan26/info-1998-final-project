// useState stores what the user types (Unit 2)
import { useState } from "react"
// Where the backend lives
import { API_URL } from "../constants/consts"
// The list of page names
import { Page } from "../types"

// What App.tsx passes in (readonly props, Unit 2)
type Props = {
  // Switch to another page
  readonly goTo: (page: Page) => void
  // The signed-in user's id; their group is stored under it
  readonly uid: string
}

// Page 1: type everyone's names and create the group
const CreatePage = ({ goTo, uid }: Props) => {
  // The names as typed, e.g. "Alex, Sam, Lee"
  const [names, setNames] = useState("")
  // Error message from the backend, if any
  const [error, setError] = useState("")

  // POST /groups/:uid with the names (Lecture 5: fetch)
  const createGroup = () => {
    // Send the request
    fetch(`${API_URL}/groups/${uid}`, {
      // POST because we're creating something
      method: "POST",
      // Tell the server the body is JSON
      headers: { "Content-Type": "application/json" },
      // Split "Alex, Sam" into ["Alex", " Sam"]; the backend trims the spaces
      body: JSON.stringify({ names: names.split(",") }),
    })
      // Turn the reply into a JS object
      .then((res) => res.json())
      // Show the error, or go to the Group page if it worked
      .then((data) => (data.error ? setError(data.error) : goTo("group")))
  }

  // What the page shows
  return (
    <div className="page">
      {/* Page title */}
      <h1>Secret Santa</h1>
      {/* Instructions */}
      <p>Enter everyone's names, separated by commas. This replaces any group you made before.</p>
      {/* The names box */}
      <input
        placeholder="a,b,c"
        value={names}
        onChange={(e) => setNames(e.target.value)}
      />
      {/* Create the group */}
      <button onClick={createGroup}>Create group</button>
      {/* Only show an error if there is one (conditional rendering, Unit 2) */}
      {error && <p className="error">{error}</p>}
    </div>
  )
}

// Default export so App.tsx can import it
export default CreatePage
