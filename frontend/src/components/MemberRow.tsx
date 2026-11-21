// useState stores the text in the rename box (Unit 2)
import { useState } from "react"
// The shape of one member
import { Member } from "../types"

// What GroupPage passes in (readonly props, Unit 2)
type Props = {
  // The person this row shows
  readonly member: Member
  // Called when "Rename" is clicked
  readonly onRename: (memberId: string, name: string) => void
  // Called when "Remove" is clicked
  readonly onRemove: (memberId: string) => void
}

// One person on the Group page: name box, Rename and Remove
const MemberRow = ({ member, onRename, onRemove }: Props) => {
  // What's typed in the box, starting as their current name
  const [name, setName] = useState(member.name)

  // What the row shows
  return (
    <div className="row">
      {/* Editable name */}
      <input value={name} onChange={(e) => setName(e.target.value)} />
      {/* Rename; greyed out until the name actually changes */}
      <button onClick={() => onRename(member.id, name)} disabled={name === member.name}>
        Rename
      </button>
      {/* Remove this person */}
      <button onClick={() => onRemove(member.id)}>Remove</button>
    </div>
  )
}

// Default export so GroupPage can import it
export default MemberRow
