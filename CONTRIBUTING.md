# Contributing to Sarthi

## Before you start

```bash
git checkout main
git pull origin main
git checkout -b your-branch-name
```

Always branch from an up-to-date `main`. Never work directly on `main`.

## Branch naming

| Type | Pattern | Example |
|---|---|---|
| Feature | `feat/<short-description>` | `feat/scheme-filter` |
| Bug fix | `fix/<short-description>` | `fix/otp-timeout` |
| Data / content | `data/<short-description>` | `data/update-schemes` |

## Folder ownership

| Area | Owner | Notes |
|---|---|---|
| `backend/` | Backend dev | Do not edit without coordination |
| `src/` (root) | Frontend dev | React / Vite source |
| `public/data/` | Shared | Schemes JSON — coordinate changes |
| `backend/database/` | Backend dev | Never edit schema without a migration |

## Shared files — coordinate first

These files are edited by both sides. Open a quick chat before changing them to avoid conflicts:

- `public/data/schemes.json` — notify the team before adding/removing schemes
- `backend/src/eligibility/profileFacts.js` — enum values must stay in sync with the DB and validator
- `backend/src/validators/profileValidator.js` — same

## API contract

The API contract lives in `API.md` (local only, never committed).  
If you change a request/response shape, update `API.md` and `backend/FRONTEND_INTEGRATION.md`
**before** merging, and tell the other side.

## Keeping up to date

Pull `main` at the start of every session and before opening a PR:

```bash
git fetch origin
git rebase origin/main   # or: git merge origin/main
```

Rebase is preferred for feature branches; merge is fine for long-running branches.

## Small PRs

One logical change per PR. A PR that touches both `backend/` and `src/` needs a good reason.

## Tests

```bash
# Backend unit tests (no DB needed)
cd backend && npm test

# Frontend type-check + unit tests
npx tsc --noEmit && npm test

# Backend integration tests (needs PostgreSQL running)
cd backend && npm run test:db:setup && npm run test:db
```

All tests must pass before requesting a review.

## Commit messages

```
type(scope): short imperative summary

Optional longer explanation.
```

Types: `feat`, `fix`, `chore`, `data`, `test`, `docs`, `refactor`.
