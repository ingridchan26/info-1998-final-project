import express, { Express } from "express"
import cors from "cors"

const app: Express = express()
const port = 8080

app.use(cors())
app.use(express.json())

app.post("/groups", async (req, res) => {
  res.json({ message: "create group" })
})

app.get("/groups/:id", async (req, res) => {
  res.json({ message: `get group ${req.params.id}` })
})

app.put("/groups/:id/members/:memberId", async (req, res) => {
  res.json({ message: `rename member ${req.params.memberId}` })
})

app.delete("/groups/:id/members/:memberId", async (req, res) => {
  res.json({ message: `remove member ${req.params.memberId}` })
})

app.post("/groups/:id/assign", async (req, res) => {
  res.json({ message: `assign group ${req.params.id}` })
})

app.get("/groups/:id/assignments", async (req, res) => {
  res.json({ message: `assignments for group ${req.params.id}` })
})

app.delete("/groups/:id", async (req, res) => {
  res.json({ message: `delete group ${req.params.id}` })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
