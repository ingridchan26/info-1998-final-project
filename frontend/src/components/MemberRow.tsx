// useState keeps the text being typed in the rename box (Unit 2)
import { useState } from "react"
// Shape of one member
import { Member } from "../types"

// Props this component receives, marked readonly (Unit 2 convention)
type Props = {
  // The member to show
  readonly member: Member
  // Called with the member's id and new name when "Rename" is clicked
  readonly onRename: (memberId: string, name: string) => void
  // Called with the member's id when "Remove" is clicked
  readonly onRemove: (memberId: string) => void
}

// One member on the Group page: name box + Rename + Remove
const MemberRow = ({ member, onRename, onRemove }: Props) => {
  // What's currently typed in the box, starting as their name
  const [draft, setDraft] = useState(member.name)

  // What the row shows
  return (
    <div className="row">
      {/* Editable name */}
      <input value={draft} onChange={(e) => setDraft(e.target.value)} />
      {/* Tell the parent page to rename; disabled when nothing changed */}
      <button onClick={() => onRename(member.id, draft)} disabled={draft === member.name}>
        Rename
      </button>
      {/* Tell the parent page to remove this member */}
      <button onClick={() => onRemove(member.id)}>Remove</button>
    </div>
  )
}

// Default export so pages can import it by name
export default MemberRow
