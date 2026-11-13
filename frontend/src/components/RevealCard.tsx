// useState tracks whether this card is revealed (Unit 2)
import { useState } from "react"
// Shape of one giver -> receiver pair
import { Assignment } from "../types"

// Props this component receives, marked readonly (Unit 2 convention)
type Props = {
  // Who gives to whom
  readonly assignment: Assignment
}

// One giver on the Results page: their name + a Reveal/Hide button
const RevealCard = ({ assignment }: Props) => {
  // false = hidden, true = shown
  const [revealed, setRevealed] = useState(false)

  // What the card shows
  return (
    <div className="row">
      {/* The giver's name */}
      <h3>{assignment.giver}</h3>
      {/* Show the receiver only when revealed (ternary, Unit 1) */}
      <p>{revealed ? `You're giving a gift to ${assignment.receiver}` : "Hidden"}</p>
      {/* Flip between hidden and revealed */}
      <button onClick={() => setRevealed(!revealed)}>{revealed ? "Hide" : "Reveal"}</button>
    </div>
  )
}

// Default export so pages can import it by name
export default RevealCard
