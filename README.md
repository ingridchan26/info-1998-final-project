# Secret Santa — INFO 1998 Final Project

## Structure
```
frontend/   Next.js + React + TypeScript (the 3 pages)
backend/    Express + TypeScript API (port 8080)
```

## Running locally
Run each in its own terminal:

```bash
cd backend && pnpm install && pnpm dev     # http://localhost:8080
cd frontend && pnpm install && pnpm dev    # http://localhost:3000
```

## Pages
| Page | Route | Purpose |
|---|---|---|
| Create | `/` | Enter number of people / names |
| Group | `/group/[id]` | Rename/remove members, press Go |
| Results | `/results/[id]` | Reveal each person's assignment |

## API
| Method | Route |
|---|---|
| POST | `/groups` |
| GET | `/groups/:id` |
| PUT | `/groups/:id/members/:memberId` |
| DELETE | `/groups/:id/members/:memberId` |
| POST | `/groups/:id/assign` |
| GET | `/groups/:id/assignments` |
| GET | `/groups/:id/assignments/:memberId` |
| DELETE | `/groups/:id` |

## Planned Firebase shape (Milestone 3)
```
groups/{groupId}                      { code, createdAt, assigned }
groups/{groupId}/members/{memberId}   { name, wishlist: [], assignedTo }
```
