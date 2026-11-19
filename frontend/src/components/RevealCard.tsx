// useState remembers whether this card is open (Unit 2)
import { useState } from "react"
// The shape of one giver -> receiver pair
import { Assignment } from "../types"

// What ResultsPage passes in (readonly props, Unit 2)
type Props = {
  // Who gives to whom
  readonly assignment: Assignment
}

// One giver on the Results page; their match stays hidden until they click Reveal
const RevealCard = ({ assignment }: Props) => {
  // false = hidden, true = shown
  const [revealed, setRevealed] = useState(false)

  // What the card shows
  return (
    <div className="card">
      {/* The giver's name */}
      <h3>{assignment.giver}</h3>
      {/* The receiver, only when revealed (conditional rendering, Unit 2) */}
      {revealed && <p>gives a gift to {assignment.receiver}</p>}
      {/* Flip between hidden and shown (ternary, Unit 1) */}
      <button onClick={() => setRevealed(!revealed)}>{revealed ? "Hide" : "Reveal"}</button>
    </div>
  )
}

// Default export so ResultsPage can import it
export default RevealCard