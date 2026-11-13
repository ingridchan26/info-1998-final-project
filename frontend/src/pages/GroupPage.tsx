// useState stores data; useEffect runs code when the page loads (Unit 2, Lecture 5)
import { useEffect, useState } from "react"
// One row per member
import MemberRow from "../components/MemberRow"
// Where the backend lives
import { API_URL } from "../constants/consts"
// Shapes of a group and of the page names
import { Group, Page } from "../types"

// Props this page receives, marked readonly (Unit 2 convention)
type Props = {
  // Switch to another page
  readonly goTo: (page: Page) => void
  // Which group to show
  readonly groupId: string
}

// Page 2: Group, where you rename/remove members and press Go
const GroupPage = ({ goTo, groupId }: Props) => {
  // The group from the server (null until it loads)
  const [group, setGroup] = useState<Group | null>(null)
  // Error message to show, if any
  const [error, setError] = useState("")

  // Every route on this page sends back the updated group, so handle replies in one place
  const handleReply = async (res: Response) => {
    // Parse the JSON reply
    const data = await res.json()
    // If the server said no, show its error and stop
    if (!res.ok) return setError(data.error)
    // Otherwise show the updated group and clear any old error
    setGroup(data)
    setError("")
    // Hand the group back in case the caller needs it
    return data as Group
  }

  // When the page loads (or the group changes), GET the group
  useEffect(() => {
    // GET /groups/:id
    fetch(`${API_URL}/groups/${groupId}`).then(handleReply)
  }, [groupId])

  // PUT /groups/:id/members/:memberId to rename a member
  const renameMember = (memberId: string, name: string) => {
    // Send the new name in the body
    fetch(`${API_URL}/groups/${groupId}/members/${memberId}`, {
      // PUT because we're updating something that exists
      method: "PUT",
      // The body is JSON
      headers: { "Content-Type": "application/json" },
      // Turn the object into a JSON string
      body: JSON.stringify({ name }),
    }).then(handleReply)
  }

  // DELETE /groups/:id/members/:memberId to remove a member
  const removeMember = (memberId: string) => {
    // No body needed; the id is in the URL
    fetch(`${API_URL}/groups/${groupId}/members/${memberId}`, { method: "DELETE" }).then(handleReply)
  }

  // POST /groups/:id/assign to randomly assign everyone
  const assign = async () => {
    // POST because the server creates the assignments
    const res = await fetch(`${API_URL}/groups/${groupId}/assign`, { method: "POST" })
    // Update the page with the reply
    const updated = await handleReply(res)
    // If it worked, go see the results
    if (updated) goTo("results")
  }

  // Still waiting for the server
  if (!group) return <p>{error || "Loading..."}</p>

  // What the page shows
  return (
    <div className="card">
      {/* Page title */}
      <h1>Your group</h1>
      {/* One MemberRow per member, passing the handlers down as props */}
      {group.members.map((member) => (
        <MemberRow key={member.id} member={member} onRename={renameMember} onRemove={removeMember} />
      ))}
      {/* Run the random assignment; disabled with fewer than 2 people */}
      <button onClick={assign} disabled={group.members.length < 2}>
        Go!
      </button>
      {/* Only show an error if there is one */}
      {error && <p className="error">{error}</p>}
      {/* Back to the start */}
      <div className="row">
        <button onClick={() => goTo("create")}>← Start over</button>
      </div>
    </div>
  )
}

// Default export so App.tsx can import it by name
export default GroupPage
