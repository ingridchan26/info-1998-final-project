import express, { Express } from "express"
import cors from "cors"
import { db } from "./firebase"
import { Assignment, Group, Member } from "./types"

// Create the server
const app: Express = express()
// Use the port the host gives us when deployed, otherwise 8080 locally
const port = process.env.PORT ?? 8080

// Allow requests from the frontend
app.use(cors())
// Turn JSON request bodies into req.body
app.use(express.json())

// Shortcut to the "groups" collection; each user's group is the document groups/{uid}
const groups = db.collection("groups")

// Make a short random id like "k3j9x2" for each member
const makeId = () => Math.random().toString(36).slice(2, 8)

// Read one user's group, or throw an error if they don't have one yet
const getGroup = async (uid: string): Promise<Group> => {
  // Read the document (Lecture 7: Read)
  const doc = await groups.doc(uid).get()
  // Stop if it doesn't exist
  if (!doc.exists) throw new Error("Group not found")
  // Return the data inside the document
  return doc.data() as Group
}

// Assign everyone to the next person in the list, so nobody gets themselves
const assignMembers = (members: Member[]): Member[] => {
  // Each person gives to the next one; % makes the last person wrap around to the first
  return members.map((member, i) => ({
    ...member,
    assignedTo: members[(i + 1) % members.length].id,
  }))
}

// POST /groups/:uid - create (or replace) this user's group
app.post("/groups/:uid", async (req, res) => {
  try {
    // Clean up the names: trim spaces and drop empty ones (map + filter, Unit 1)
    const names: string[] = (req.body.names ?? [])
      .map((name: string) => name.trim())
      .filter((name: string) => name !== "")
    // A Secret Santa needs at least 2 people
    if (names.length < 2) throw new Error("Enter at least 2 names")
    // Build the new group, giving each person a random id
    const group: Group = {
      members: names.map((name) => ({ id: makeId(), name })),
      assigned: false,
    }
    await groups.doc(req.params.uid).set(group)
    // Send the new group back to the frontend
    res.json(group)
  } catch (e: any) {
    // 400 = the request was bad
    res.status(400).json({ error: e.message })
  }
})

// GET /groups/:uid - get this user's group
app.get("/groups/:uid", async (req, res) => {
  try {
    // Read the group and send it back
    res.json(await getGroup(req.params.uid))
  } catch (e: any) {
    // 404 = not found
    res.status(404).json({ error: e.message })
  }
})

// PUT /groups/:uid/members/:memberId - rename one member
app.put("/groups/:uid/members/:memberId", async (req, res) => {
  try {
    // Read the group
    const group = await getGroup(req.params.uid)
    // Read and clean the new name from the request body
    const name: string = (req.body.name ?? "").trim()
    // Don't allow blank names
    if (!name) throw new Error("Name can't be empty")
    // Replace only the matching member's name (map returns a new array)
    const members = group.members.map((member) =>
      member.id === req.params.memberId ? { ...member, name } : member
    )
    // Save only the members field (Lecture 7: Update)
    await groups.doc(req.params.uid).update({ members })
    // Send back the updated group
    res.json({ ...group, members })
  } catch (e: any) {
    // 400 = the request was bad
    res.status(400).json({ error: e.message })
  }
})

// DELETE /groups/:uid/members/:memberId - remove one member
app.delete("/groups/:uid/members/:memberId", async (req, res) => {
  try {
    // Read the group
    const group = await getGroup(req.params.uid)
    // Keep everyone except the removed person, and clear old assignments (they'd point at the removed person)
    const members = group.members
      .filter((member) => member.id !== req.params.memberId)
      .map((member) => ({ id: member.id, name: member.name }))
    // Save the new list; the group has to be assigned again
    await groups.doc(req.params.uid).update({ members, assigned: false })
    // Send back the updated group
    res.json({ members, assigned: false })
  } catch (e: any) {
    // 400 = the request was bad
    res.status(400).json({ error: e.message })
  }
})

// POST /groups/:uid/assign - randomly pick who gives to whom
app.post("/groups/:uid/assign", async (req, res) => {
  try {
    // Read the group
    const group = await getGroup(req.params.uid)
    // Need at least 2 people to assign
    if (group.members.length < 2) throw new Error("Need at least 2 people")
    // Do the random assignment
    const members = assignMembers(group.members)
    // Save the assignments and mark the group as assigned
    await groups.doc(req.params.uid).update({ members, assigned: true })
    // Send back the updated group
    res.json({ members, assigned: true })
  } catch (e: any) {
    // 400 = the request was bad
    res.status(400).json({ error: e.message })
  }
})

// GET /groups/:uid/assignments - every giver -> receiver pair
app.get("/groups/:uid/assignments", async (req, res) => {
  try {
    // Read the group
    const group = await getGroup(req.params.uid)
    // Can't show results before "Go!" is pressed
    if (!group.assigned) throw new Error("Press Go! first")
    // Turn each member into { giver, receiver }, looking up the receiver's name by id
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

// DELETE /groups/:uid - delete this user's whole group
app.delete("/groups/:uid", async (req, res) => {
  try {
    // Delete the document (Lecture 7: Delete)
    await groups.doc(req.params.uid).delete()
    // Confirm it's gone
    res.json({ message: "Group deleted" })
  } catch (e: any) {
    // 400 = the request was bad
    res.status(400).json({ error: e.message })
  }
})

// Start the server
app.listen(port, () => {
  // Shows in the terminal so you know it's running
  console.log(`Listening on port ${port}`)
})