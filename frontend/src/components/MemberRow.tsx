import { useState } from "react"
import { Member } from "../types"

type Props = {
  readonly member: Member
  readonly onRename: (memberId: string, name: string) => void
  readonly onRemove: (memberId: string) => void
}

const MemberRow = ({ member, onRename, onRemove }: Props) => {
  const [name, setName] = useState(member.name)

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={() => onRename(member.id, name)}>Rename</button>
      <button onClick={() => onRemove(member.id)}>Remove</button>
    </div>
  )
}

export default MemberRow
