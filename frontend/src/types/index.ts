// One person in a Secret Santa group (same as backend/types.ts)
export type Member = {
  // Random id made by the backend
  id: string
  // The name shown on screen
  name: string
  // The id of the person they give a gift to (only after "Go!")
  assignedTo?: string
}

// The signed-in user's group (same as backend/types.ts)
export type Group = {
  // Everyone in the group
  members: Member[]
  // true once "Go!" has been pressed
  assigned: boolean
}

// One giver -> receiver pair from GET /groups/:uid/assignments
export type Assignment = {
  // Name of the person giving the gift
  giver: string
  // Name of the person receiving the gift
  receiver: string
}

// Which page is showing (a union of string literal types, Unit 1)
export type Page = "create" | "group" | "results"
