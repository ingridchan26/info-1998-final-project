import { useEffect, useState } from "react"
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Segment,
} from "semantic-ui-react"
import { UserData, RandomUserAPIResponse } from "../types"
import PanelButtons from "./PanelButtons"
import UserDisplay from "./UserDisplay"

const IdentityPicker = () => {
  const [myUser, setMyUser] = useState<UserData | null>(null)
  const [fetchedUser, setFetchedUser] = useState<UserData | null>(null)

  const fetchRandomUser = (): Promise<UserData> => {
    return fetch("https://randomuser.me/api").then((response) => response.json()).then((data: RandomUserAPIResponse) => data.results[0])
  }

  useEffect(() => {
    fetchRandomUser().then((user) => setMyUser(user))
    fetchRandomUser().then((user) => setFetchedUser(user))
  }, [])
  
  const summarizeUser = (user: UserData) => {
    if (!user) return "Hello!"
    const { title, first, last } = user.name
    return `Hello, I am ${title} ${first} ${last}.`
  }

  return (
    <Container textAlign="center" style={{ marginTop: "3em" }}>
      <Header as="h1">
        Identity Picker
        <Header.Subheader>{summarizeUser(myUser)}</Header.Subheader>
      </Header>
      <Divider />
      <Grid container columns={3} relaxed stackable>
        <Grid.Column>
          <UserDisplay header="Me" user={myUser} />
        </Grid.Column>
        <Grid.Column>
          <Button color="green" attached="top" onClick={() => fetchRandomUser().then((user) => setFetchedUser(user))}>
            Refresh
          </Button>
          <Header as="h2" attached content="Control Panel" />
          <Segment attached="bottom">
            {myUser && fetchedUser && (
              <PanelButtons myUser={myUser} fetchedUser={fetchedUser} setMyUser={setMyUser} />
            )}
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <UserDisplay header="Fetched User" user={fetchedUser} />
        </Grid.Column>
      </Grid>
    </Container>
  )
}

export default IdentityPicker
