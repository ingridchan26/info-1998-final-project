// Keep in sync with frontend/types/index.ts
export type Member = {
  id: string
  name: string
  assignedTo?: string // id of the person they give a gift to
}

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
