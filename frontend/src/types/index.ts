export type Member = {
  id: string
  name: string
  assignedTo?: string
}

export type Group = {
  id: string
  members: Member[]
  assigned: boolean
}

export type Assignment = {
  giver: string
  receiver: string
}

export type Page = "create" | "group" | "results"
