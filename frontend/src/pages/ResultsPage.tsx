import { useEffect, useState } from "react"
import RevealCard from "../components/RevealCard"
import { API_URL, GROUP_ID } from "../constants/consts"
import { Assignment, Page } from "../types"

type Props = {
  readonly goTo: (page: Page) => void
}

const ResultsPage = ({ goTo }: Props) => {
  const [assignments] = useState<Assignment[]>([
    { giver: "Person 1", receiver: "Person 2" },
    { giver: "Person 2", receiver: "Person 1" },
  ])

  useEffect(() => {
    fetch(`${API_URL}/groups/${GROUP_ID}/assignments`)
      .then((res) => res.json())
      .then((data) => console.log(data))
  }, [])

  const deleteGroup = () => {
    fetch(`${API_URL}/groups/${GROUP_ID}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => console.log(data))
    goTo("create")
  }

  return (
    <div>
      <h1>Results</h1>
      {assignments.map((assignment) => (
        <RevealCard key={assignment.giver} assignment={assignment} />
      ))}
      <button onClick={deleteGroup}>Start over</button>
    </div>
  )
}

export default ResultsPage
