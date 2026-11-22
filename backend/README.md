# Sarthi backend (Node.js + Express + PostgreSQL)

## Setup

```bash
cd backend
npm install
cp .env.example .env      # then fill in DB_* and JWT_SECRET (32+ characters)
npm run migrate           # creates or upgrades the database
npm run dev               # http://localhost:5000
npm test                  # unit + API tests, no database needed
```

The server refuses to start if `JWT_SECRET` (32+ characters), `DB_NAME` or `DB_USER` is missing.
Generate a secret with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.

## API (so far)

| Method | Route | What it returns |
|---|---|---|
| GET | `/api/health` | `ok` (200) or `degraded` (503) with database / Redis status and scheme count |
| GET | `/api/schemes?state=&category=&benefit=&scope=` | Schemes, filtered like the website's Explore page |
| GET | `/api/schemes/:id` | One scheme, or 404 |
| GET | `/api/meta/profile-fields` | Allowed profile values, and for each rule field the profile columns it comes from and how many schemes use it |

Responses always have the shape `{ success, message, data }` or `{ success: false, message, error? }`.

## Database

- `database/schema.sql` is the full, latest schema. `database/migrations/NNN_*.sql` upgrade older databases.
- `npm run migrate` keeps a log in `schema_migrations`: an empty database gets `schema.sql`, an existing one gets only
  the migrations it has not run. Running it again is safe.
- Changing the schema: add the next numbered migration **and** update `schema.sql`.

## Profile fields and scheme rules

Scheme data lives in one place, `../public/data/schemes.json`, shared with the website. Each scheme has `criteria`
(rule rows such as `{ field: "age", op: "between", value: [18, 40] }`).

`src/eligibility/profileFacts.js` turns a `user_profiles` row into those rule fields (age from date of birth,
acres to hectares, ration card type to NFSA / BPL, and so on). `tests/profileFacts.test.js` fails if a scheme uses a
rule field the profile cannot answer, or a value (occupation, category, marital status...) the profile cannot hold.

The profile asks everything the official myScheme "find schemes" form asks (gender, age, state, rural / urban,
category, minority, disability, student, employment, BPL, income) plus the facts scheme rules actually check:
house type, ration card type, bank account, income tax, government job in the family, EPFO / ESIC / NPS,
pregnancy, school class, disability percentage, electricity connection and land size.

Every field is optional: `NULL` means "not answered / prefer not to say" and is evaluated as **UNKNOWN**, never as "no".
