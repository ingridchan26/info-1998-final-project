// useState stores data; useEffect loads it when the page opens (Unit 2, Lecture 5)
import { useEffect, useState } from "react"
// One row per person
import MemberRow from "../components/MemberRow"
// Where the backend lives
import { API_URL } from "../constants/consts"
// Data shapes
import { Group, Page } from "../types"

// What App.tsx passes in (readonly props, Unit 2)
type Props = {
  // Switch to another page
  readonly goTo: (page: Page) => void
  // The signed-in user's id
  readonly uid: string
}

// Page 2: see the group, rename or remove people, press Go!
const GroupPage = ({ goTo, uid }: Props) => {
  // The group from the backend (null until it loads)
  const [group, setGroup] = useState<Group | null>(null)
  // Error message from the backend, if any
  const [error, setError] = useState("")

  // Most routes reply with the updated group, so handle replies in one place
  const showReply = (data: any) => {
    // If the backend sent an error, show it
    if (data.error) {
      setError(data.error)
    } else {
      // Otherwise show the updated group and clear any old error
      setGroup(data)
      setError("")
    }
  }

  // When the page opens, GET /groups/:uid
  useEffect(() => {
    // Ask the backend for this user's group
    fetch(`${API_URL}/groups/${uid}`)
      // Turn the reply into a JS object
      .then((res) => res.json())
      // Show the group, or the error
      .then((data) => (data.error ? setError(data.error) : setGroup(data)))
  }, [uid])

  // PUT /groups/:uid/members/:memberId to rename someone
  const renameMember = (memberId: string, name: string) => {
    // Send the new name
    fetch(`${API_URL}/groups/${uid}/members/${memberId}`, {
      // PUT because we're changing something that exists
      method: "PUT",
      // The body is JSON
      headers: { "Content-Type": "application/json" },
      // The new name
      body: JSON.stringify({ name }),
    })
      // Turn the reply into a JS object
      .then((res) => res.json())
      // Show the updated group
      .then(showReply)
  }

  // DELETE /groups/:uid/members/:memberId to remove someone
  const removeMember = (memberId: string) => {
    // No body needed; the id is in the URL
    fetch(`${API_URL}/groups/${uid}/members/${memberId}`, { method: "DELETE" })
      // Turn the reply into a JS object
      .then((res) => res.json())
      // Show the updated group
      .then(showReply)
  }

  // POST /groups/:uid/assign to randomly assign everyone
  const assign = () => {
    // Ask the backend to do the assignment
    fetch(`${API_URL}/groups/${uid}/assign`, { method: "POST" })
      // Turn the reply into a JS object
      .then((res) => res.json())
      // Show the error, or go to the Results page if it worked
      .then((data) => (data.error ? setError(data.error) : goTo("results")))
  }

  // Before the group loads: show the error (e.g. no group yet) or "Loading..."
  if (!group) {
    return (
      <div className="page">
        {/* The error, or a loading message (ternary, Unit 1) */}
        <p className={error ? "error" : ""}>{error ? error : "Loading..."}</p>
        {/* Way back to the Create page */}
        <button onClick={() => goTo("create")}>Create a group</button>
      </div>
    )
  }

  // What the page shows once the group has loaded
  return (
    <div className="page">
      {/* Page title */}
      <h1>Your group</h1>
      {/* One row per person; key helps React track each row (Unit 2) */}
      {group.members.map((member) => (
        <MemberRow key={member.id} member={member} onRename={renameMember} onRemove={removeMember} />
      ))}
      {/* Only show an error if there is one */}
      {error && <p className="error">{error}</p>}
      {/* Assign everyone; needs at least 2 people */}
      <button onClick={assign} disabled={group.members.length < 2}>
        Go!
      </button>
      {/* Back to the Create page */}
      <button className="link" onClick={() => goTo("create")}>
        Back
      </button>
    </div>
  )
}

// Default export so App.tsx can import it
export default GroupPage
