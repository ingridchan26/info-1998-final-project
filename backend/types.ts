// One person in a Secret Santa group
export type Member = {
  // Random id, so we can find this exact person even if two people share a name
  id: string
  // The name shown on screen
  name: string
  // The id of the person they give a gift to (only exists after "Go!" is pressed)
  assignedTo?: string
}

// One user's group, stored in Firestore at groups/{uid}
export type Group = {
  // Everyone in the group
  members: Member[]
  // true once "Go!" has been pressed
  assigned: boolean
}

// One giver -> receiver pair, shown on the Results page
export type Assignment = {
  // Name of the person giving the gift
  giver: string
  // Name of the person receiving the gift
  receiver: string
}
