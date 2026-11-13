import { useEffect, useState } from "react"
import MemberRow from "../components/MemberRow"
import { API_URL, GROUP_ID } from "../constants/consts"
import { Member, Page } from "../types"

type Props = {
  readonly goTo: (page: Page) => void
}

const GroupPage = ({ goTo }: Props) => {
  const [members] = useState<Member[]>([
    { id: "1", name: "Person 1" },
    { id: "2", name: "Person 2" },
  ])

  useEffect(() => {
    fetch(`${API_URL}/groups/${GROUP_ID}`)
      .then((res) => res.json())
      .then((data) => console.log(data))
  }, [])

  const renameMember = (memberId: string, name: string) => {
    fetch(`${API_URL}/groups/${GROUP_ID}/members/${memberId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
  }

  const removeMember = (memberId: string) => {
    fetch(`${API_URL}/groups/${GROUP_ID}/members/${memberId}`, {
       method: "DELETE" 
      })
      .then((res) => res.json())
      .then((data) => console.log(data))
  }

  const assign = () => {
    fetch(`${API_URL}/groups/${GROUP_ID}/assign`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => console.log(data))
    goTo("results")
  }

  return (
    <div>
      <h1>Group</h1>
      {members.map((member) => (
        <MemberRow key={member.id} member={member} onRename={renameMember} onRemove={removeMember} />
      ))}
      <button onClick={assign}>Go!</button>
      <button onClick={() => goTo("create")}>Back</button>
    </div>
  )
}

export default GroupPage
