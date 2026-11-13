import { useState } from "react"
import { Assignment } from "../types"

type Props = {
  readonly assignment: Assignment
}

const RevealCard = ({ assignment }: Props) => {
  const [revealed, setRevealed] = useState(false)

  return (
    <div>
      <h3>{assignment.giver}</h3>
      {revealed && <p>{assignment.receiver}</p>}
      <button onClick={() => setRevealed(!revealed)}>{revealed ? "Hide" : "Reveal"}</button>
    </div>
  )
}

export default RevealCard
