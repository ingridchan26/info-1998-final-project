// useState holds values that change as the user types (Unit 2)
import { FormEvent, useState } from "react"
// Where the backend lives
import { API_URL } from "../constants/consts"
// Shapes of a group and of the page names
import { Group, Page } from "../types"

// Props this page receives, marked readonly (Unit 2 convention)
type Props = {
  // Switch to another page
  readonly goTo: (page: Page) => void
  // Save the new group's id in App so the other pages can use it
  readonly setGroupId: (id: string) => void
}

// Page 1: Create, where you enter names and make a group
const CreatePage = ({ goTo, setGroupId }: Props) => {
  // One string per person; start with 3 empty boxes
  const [names, setNames] = useState<string[]>(["", "", ""])
  // Error message to show, if any
  const [error, setError] = useState("")

  // Change the number of name boxes, keeping names already typed
  const changeCount = (count: number) => {
    // Need at least 2 people for a Secret Santa
    if (count < 2) return
    // Build a new array of the right length, reusing old names where they exist (?? from Unit 1)
    setNames([...Array(count)].map((_, i) => names[i] ?? ""))
  }

  // Update one name without mutating the array (map returns a new array, Unit 1)
  const updateName = (index: number, value: string) =>
    // Replace only the box at this index
    setNames(names.map((name, i) => (i === index ? value : name)))

  // POST /groups with the names (Lecture 5: fetch + async/await)
  const createGroup = async (e: FormEvent) => {
    // Stop the browser from reloading the page on submit
    e.preventDefault()
    // try/catch handles network or server errors
    try {
      // Send the names to the backend as JSON
      const res = await fetch(`${API_URL}/groups`, {
        // POST because we're creating something
        method: "POST",
        // Tell the server the body is JSON
        headers: { "Content-Type": "application/json" },
        // Turn the JS object into a JSON string
        body: JSON.stringify({ names }),
      })
      // Parse the server's JSON reply
      const data = await res.json()
      // If the server said no (e.g. fewer than 2 names), show its error
      if (!res.ok) throw new Error(data.error)
      // Remember the new group's id
      setGroupId((data as Group).id)
      // Move on to the Group page
      goTo("group")
    } catch (e: any) {
      // Show what went wrong
      setError(e.message)
    }
  }

  // What the page shows
  return (
    <div className="card">
      {/* Page title */}
      <h1>Create a Secret Santa group</h1>
      {/* Submitting the form calls createGroup */}
      <form onSubmit={createGroup}>
        {/* How many people are in the group */}
        <label>
          Number of people{" "}
          <input
            type="number"
            min={2}
            value={names.length}
            onChange={(e) => changeCount(Number(e.target.value))}
          />
        </label>
        {/* One text box per person (lists with .map and a key, Unit 2) */}
        {names.map((name, i) => (
          <div key={i}>
            <input
              placeholder={`Person ${i + 1}`}
              value={name}
              onChange={(e) => updateName(i, e.target.value)}
            />
          </div>
        ))}
        {/* Submits the form */}
        <button type="submit">Create group</button>
      </form>
      {/* Only show an error if there is one (conditional rendering with &&, Unit 2) */}
      {error && <p className="error">{error}</p>}
    </div>
  )
}

// Default export so App.tsx can import it by name
export default CreatePage
