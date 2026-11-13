import { useState } from "react"
import { API_URL } from "../constants/consts"
import { Page } from "../types"

type Props = {
  readonly goTo: (page: Page) => void
}

const CreatePage = ({ goTo }: Props) => {
  const [names, setNames] = useState("")

  const createGroup = () => {
    fetch(`${API_URL}/groups`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ names: names.split(",") }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
    goTo("group")
  }

  return (
    <div>
      <h1>Secret Santa</h1>
      <input
        placeholder="Names, separated by commas"
        value={names}
        onChange={(e) => setNames(e.target.value)}
      />
      <button onClick={createGroup}>Create group</button>
    </div>
  )
}

export default CreatePage
