// One person in a Secret Santa group (same as backend/types.ts)
export type Mem
b
er = {
// Random id made
by the
backend
id
: string
// The name shown on screen
name
: string
// The id of the person they give a gift to (only after "Go!")
assignedTo?: string
}
// The signed-in user's group (same as backend/types.ts)
export type Group = {
// Everyone in the group
b
mem
ers: Mem
b
er[]
// true once "Go!" has b
een pressed
assigned
: boolean
}
// One giver -> receiver pair from GET /groups/:uid/assignments
export type Assignment = {
// Name of the person giving the gift
giver: string
// Name of the person receiving the gift
receiver: string
}