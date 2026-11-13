// Keep in sync with backend/types.ts
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
