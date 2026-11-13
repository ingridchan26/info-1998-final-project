# Secret Santa — INFO 1998 Final Project

## Structure
```
frontend/ Vite + React + TypeScript (the 3 pages) — built on the course frontend-starter
backend/  Express + TypeScript API in server.ts (port 8080) — same layout as the lec6/lec7 demos
```

## Running locally
Run each in its own terminal:

```bash
cd backend && pnpm install && pnpm dev    # http://localhost:8080
cd frontend && pnpm install && pnpm dev    # http://localhost:5173
```

## Pages
No router: `src/App.tsx` switches pages with `useState` (Unit 2).

| Page | File | Purpose |
|---|---|---|
| Create | `src/pages/CreatePage.tsx` | Enter number of people / names |
| Group | `src/pages/GroupPage.tsx` | Rename/remove members, press Go |
| Results | `src/pages/ResultsPage.tsx` | Reveal each person's assignment |

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
