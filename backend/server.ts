// Import express (the server framework) and its Express type (Lecture 6)
import express, { Express } from "express"
// Import cors so the frontend on port 5173 is allowed to call this server on 8080 (Lecture 6)
import cors from "cors"
// Import our shared data shapes so route code is type-checked (Unit 1: TypeScript)
import { Assignment, Group, Member } from "./types"

// Create the express app instance
const app: Express = express()
// The port this server listens on (same as the Lecture 6 demo)
const port = 8080

// Middleware: let browsers on other origins (our frontend) make requests
app.use(cors())
// Middleware: parse JSON request bodies into req.body
app.use(express.json())

// Temporary in-memory storage, keyed by group id (Milestone 3 replaces this with Firestore)
// Note: this resets every time the server restarts
const groups: { [id: string]: Group } = {}

// Make a short random id like "k3j9x2"
const makeId = () => Math.random().toString(36).slice(2, 8)

// Look up a group, or throw an error the route's catch block will send back
const getGroup = (id: string): Group => {
  // Find the group by its id
  const group = groups[id]
  // Stop here if it doesn't exist
  if (!group) throw new Error("Group not found")
  // Otherwise hand it back
  return group
}

// Shuffle everyone, then each person gives to the next person in the circle,
// so nobody ever gets themselves
const assignMembers = (members: Member[]): Member[] => {
  // Copy the array so we don't mutate the original (Unit 1: spread)
  const shuffled = [...members]
  // Fisher-Yates shuffle: walk backwards, swapping each spot with a random earlier one
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1))
    // Swap the two people
    const temp = shuffled[i]
    shuffled[i] = shuffled[j]
    shuffled[j] = temp
  }
  // Each person gives to the next one; the last wraps around to the first (% does the wrap)
  return shuffled.map((member, i) => ({
    ...member,
    assignedTo: shuffled[(i + 1) % shuffled.length].id,
  }))
}

// POST /groups: create a new group from a list of names
app.post("/groups", async (req, res) => {
  try {
    // Read the names, trim spaces, and drop empty boxes (map + filter, Unit 1)
    const names: string[] = (req.body.names ?? [])
      .map((name: string) => name.trim())
      .filter((name: string) => name !== "")
    // A Secret Santa needs at least 2 people
    if (names.length < 2) throw new Error("Enter at least 2 names")

    // Build the new group with one member per name
    const group: Group = {
      id: makeId(),
      members: names.map((name) => ({ id: makeId(), name })),
      assigned: false,
    }
    // Save it
    groups[group.id] = group
    // Send the new group back to the frontend
    res.json(group)
  } catch (e: any) {
    // 400 = the request was bad
    res.status(400).json({ error: e.message })
  }
})

// GET /groups/:id: get one group and its members
app.get("/groups/:id", async (req, res) => {
  try {
    // Find the group from the id in the URL and send it back
    res.json(getGroup(req.params.id))
  } catch (e: any) {
    // 404 = not found
    res.status(404).json({ error: e.message })
  }
})

// PUT /groups/:id/members/:memberId: rename one member
app.put("/groups/:id/members/:memberId", async (req, res) => {
  try {
    // Find the group
    const group = getGroup(req.params.id)
    // Read the new name from the body
    const name: string = (req.body.name ?? "").trim()
    // Don't allow blank names
    if (!name) throw new Error("Name can't be empty")

    // Replace only the matching member's name (map returns a new array)
    group.members = group.members.map((member) =>
      member.id === req.params.memberId ? { ...member, name } : member
    )
    // Send the updated group back
    res.json(group)
  } catch (e: any) {
    // 400 = the request was bad
    res.status(400).json({ error: e.message })
  }
})

// DELETE /groups/:id/members/:memberId: remove one member
app.delete("/groups/:id/members/:memberId", async (req, res) => {
  try {
    // Find the group
    const group = getGroup(req.params.id)
    // Keep everyone except the removed member (filter, Unit 1)
    group.members = group.members.filter((member) => member.id !== req.params.memberId)
    // Send the updated group back
    res.json(group)
  } catch (e: any) {
    // 404 = not found
    res.status(404).json({ error: e.message })
  }
})

// POST /groups/:id/assign: randomly pick who gives a gift to whom
app.post("/groups/:id/assign", async (req, res) => {
  try {
    // Find the group
    const group = getGroup(req.params.id)
    // Need at least 2 people to assign
    if (group.members.length < 2) throw new Error("Need at least 2 people")
    // Do the random assignment
    group.members = assignMembers(group.members)
    // Remember that this group is done
    group.assigned = true
    // Send the updated group back
    res.json(group)
  } catch (e: any) {
    // 400 = the request was bad
    res.status(400).json({ error: e.message })
  }
})

// GET /groups/:id/assignments: every giver -> receiver pair
app.get("/groups/:id/assignments", async (req, res) => {
  try {
    // Find the group
    const group = getGroup(req.params.id)
    // Can't show results before pressing Go
    if (!group.assigned) throw new Error("Not assigned yet")

    // Turn each member into { giver, receiver } by looking up who assignedTo points to
    const assignments: Assignment[] = group.members.map((member) => ({
      giver: member.name,
      receiver: group.members.find((m) => m.id === member.assignedTo)?.name ?? "?",
    }))
    // Send the list back
    res.json(assignments)
  } catch (e: any) {
    // 400 = the request was bad
    res.status(400).json({ error: e.message })
  }
})

// GET /groups/:id/assignments/:memberId: one person's assignment
app.get("/groups/:id/assignments/:memberId", async (req, res) => {
  try {
    // Find the group
    const group = getGroup(req.params.id)
    // Find this member
    const member = group.members.find((m) => m.id === req.params.memberId)
    // Stop if they don't exist or haven't been assigned
    if (!member || !member.assignedTo) throw new Error("No assignment found")
    // Find who they give to
    const receiver = group.members.find((m) => m.id === member.assignedTo)
    // Send back the pair
    res.json({ giver: member.name, receiver: receiver?.name ?? "?" })
  } catch (e: any) {
    // 404 = not found
    res.status(404).json({ error: e.message })
  }
})

// DELETE /groups/:id: delete the whole group
app.delete("/groups/:id", async (req, res) => {
  // Remove it from storage
  delete groups[req.params.id]
  // Confirm it's gone
  res.json({ message: `Deleted group ${req.params.id}` })
})

// Start the server and log once it's ready
app.listen(port, () => {
  // Shows in the terminal so you know the server is running
  console.log(`Listening on port ${port}`)
})
