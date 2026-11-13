// Keep in sync with backend/types.ts

// One person in the group
export type Member = {
  id: string
  name: string
  assignedTo?: string // id of the person they give a gift to
}

// A whole Secret Santa group
export type Group = {
  id: string
  members: Member[]
  assigned: boolean
}

// One giver -> receiver pair shown on the Results page
export type Assignment = {
  giver: string
  receiver: string
}

// Which page is showing (a union of literal types, Unit 1)
export type Page = "create" | "group" | "results"
