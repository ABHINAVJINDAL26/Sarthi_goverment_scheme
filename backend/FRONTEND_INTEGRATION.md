# SARTHI Backend — Frontend Integration Guide

This guide is for the frontend developer connecting the Sarthi UI to the backend REST APIs.

---

## 1. Base Configuration

- **Base URL:** `http://localhost:5000`
- **Default Content Type:** `application/json`
- **Authentication Header:** `Authorization: Bearer <JWT_TOKEN>`

---

## 2. Standard Response Structure

### Success (HTTP 200 / 201)
```json
{ "success": true, "message": "...", "data": { ... } }
```

### Validation Error (HTTP 400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "date_of_birth", "message": "..." }]
}
```

### Auth Error (HTTP 401 / 403)
```json
{ "success": false, "message": "Authentication required. No token provided." }
```

---

## 3. Canonical Enum Values

All enum fields must use these exact strings. The backend accepts common aliases
(e.g. `"sc"` → `"SC"`, `"single"` → `"unmarried"`, `"self_employed"` → `"entrepreneur"`)
and normalises on write, but send canonical values to avoid confusion.

| Field | Accepted values |
|---|---|
| `gender` | `"male"` `"female"` `"other"` `"prefer_not_to_say"` |
| `residence_type` | `"rural"` `"urban"` |
| `social_category` | `"General"` `"OBC"` `"SC"` `"ST"` `"EWS"` `"prefer_not_to_say"` |
| `marital_status` | `"unmarried"` `"married"` `"divorced"` `"widow"` `"separated"` `"other"` |
| `occupation` | `"farmer"` `"salaried"` `"entrepreneur"` `"daily_wage"` `"student"` `"homemaker"` `"unemployed"` `"retired"` `"other"` |
| `ration_card_type` | `"APL"` `"BPL"` `"AAY"` `"PHH"` `"none"` |

### "Prefer not to say"
Sending `"prefer_not_to_say"` for any **declinable** enum field stores `null` in the database
and records the field name in `declined_fields`. The card still counts as completed.
The field is excluded from eligibility checks (treated as unknown).
To un-decline, simply send a real value later — the field is removed from `declined_fields`.
`full_name` is **not** declinable.

---

## 4. Endpoints & Integration Flow

### Step 1: Authentication (Mobile OTP)

#### A. Send OTP
```
POST /api/auth/otp/send
{ "mobileNumber": "9876543210" }
```
Response:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": { "mobileNumber": "9876543210", "expiresInSeconds": 300 }
}
```
> `devOtp` is **only** included when the server was started with `OTP_DEV_ECHO=true`
> (never in production). Do not rely on its presence in production builds.

#### B. Verify OTP & Obtain Token
```
POST /api/auth/otp/verify
{ "mobileNumber": "9876543210", "otp": "123456" }
```
Response:
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { "id": "2", "mobileNumber": "9876543210", "mobileVerifiedAt": "...", "preferredLanguage": "en" }
  }
}
```
Store `data.token` and `data.user.id`. Pass `Authorization: Bearer <token>` in all subsequent requests.

---

### Step 2: Onboarding & Dashboard

#### A. Full Profile + Card Statuses
```
GET /api/profile/:userId
```
Returns `data.profile` (all saved fields, with `declined_fields` array) and `data.progress`.

#### B. Live Card Progress Badges
```
GET /api/profile/:userId/progress
```
```json
{ "data": { "progress": [
  { "section_key": "basics", "status": "completed", "last_saved_at": "...", "completed_at": "..." },
  { "section_key": "location", "status": "in_progress", ... },
  { "section_key": "education", "status": "not_started", ... }
]}}
```

#### C. Overall Completion Percentage
```
GET /api/profile/:userId/completeness
```
```json
{ "data": {
  "totalSections": 7, "completedCount": 3, "pendingCount": 4, "percentage": 43,
  "isFullyComplete": false, "isSubmitted": false,
  "completedSections": ["basics", "location", "education"],
  "pendingSections": ["employment", "income", "social_category", "family"],
  "missingFieldsBySection": { "employment": ["occupation"] }
}}
```

---

### Step 3: Profile Cards Autosave

```
PATCH /api/profile/:userId/sections/:sectionKey
```

| Card | `sectionKey` | Required for completion |
|---|---|---|
| Personal | `basics` | `full_name`, `date_of_birth`, `gender` |
| Location | `location` | `state`, `district`, `residence_type` |
| Education | `education` | `education_level` |
| Employment | `employment` | `occupation` |
| Income | `income` | `annual_household_income` |
| Social Category | `social_category` | `social_category` |
| Family | `family` | `marital_status`, `family_size` |

#### All allowed fields per section

**basics:** `full_name` (string ≤100), `date_of_birth` (YYYY-MM-DD, past), `gender`

**location:** `state`, `district` (strings ≤100), `residence_type`, `has_pucca_house` (bool), `owns_house` (bool), `has_electricity_connection` (bool)

**education:** `education_level` (string ≤100), `is_student` (bool), `current_class` (integer 1–12)

**employment:** `occupation` (enum — see §3), `govt_employee_in_family` (bool), `epfo_esic_nps_member` (bool)

**income:** `annual_household_income` (number ≥0), `monthly_personal_income` (number ≥0), `land_holding_acres` (number ≥0), `income_tax_payer` (bool), `has_bank_account` (bool)

**social_category:** `social_category` (enum), `minority_status` (bool), `disability_status` (bool), `disability_percent` (integer 0–100), `bpl_card` (bool), `ration_card_type` (enum), `in_secc_list` (bool)

**family:** `marital_status` (enum), `family_size` (integer ≥1), `pregnant_or_lactating` (bool), `land_holding_acres` (number ≥0), `bpl_card` (bool)

#### Example request
```json
// PATCH /api/profile/2/sections/basics
{ "full_name": "Priya Sharma", "date_of_birth": "1998-08-15", "gender": "female" }
```

#### Partial save / prefer-not-to-say
```json
// PATCH /api/profile/2/sections/basics
{ "gender": "prefer_not_to_say" }
```
Response includes `data.profile.gender = null` and `data.profile.declined_fields = ["gender"]`.

---

### Step 4: Review & Final Submission

#### A. Review Screen
```
GET /api/profile/:userId/review
```
Returns all 7 cards with display titles, saved values (including `declined`), statuses, and `canSubmit`.

#### B. Submit
```
POST /api/profile/:userId/submit
```
Success (200):
```json
{ "data": { "isSubmitted": true, "submittedAt": "..." } }
```
Incomplete (400):
```json
{ "success": false, "message": "Cannot submit profile: all 7 sections must be completed first",
  "errors": { "percentage": 86, "pendingSections": ["family"], "missingFieldsBySection": { "family": ["family_size"] } } }
```

---

## 5. Frontend Code Snippet (Axios)

```javascript
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const autosaveCard = async (userId, sectionKey, cardData) => {
  try {
    const res = await api.patch(`/profile/${userId}/sections/${sectionKey}`, cardData);
    return res.data;
  } catch (err) {
    throw err.response?.data ?? err;
  }
};
```
