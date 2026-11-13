import { Button } from "semantic-ui-react"
import { UserData } from "../types"

type Props = {
  myUser: UserData
  fetchedUser: UserData
  setMyUser: (user: UserData) => void
}

const PanelButtons = ({ myUser, fetchedUser, setMyUser }: Props) => {
  return (
    <Button.Group vertical>
      <Button secondary basic onClick={() => setMyUser({...myUser, picture: fetchedUser.picture})}>
        Steal Picture
      </Button>
      <Button secondary basic onClick={() => setMyUser({...myUser, name: {...myUser.name, title: fetchedUser.name.title}})}>
        Steal Title
      </Button>
      <Button secondary basic onClick={() => setMyUser({...myUser, name: {...myUser.name, first: fetchedUser.name.first}})}>
        Steal First Name
      </Button>
      <Button secondary basic onClick={() => setMyUser({...myUser, name: {...myUser.name, last: fetchedUser.name.last}})}>
        Steal Last Name
      </Button>
    </Button.Group>
  )
}

export default PanelButtons
