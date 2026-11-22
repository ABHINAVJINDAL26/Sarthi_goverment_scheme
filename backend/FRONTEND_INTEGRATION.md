# SARTHI Backend – Frontend Integration Guide

This guide is designed for the frontend developer to connect the Sarthi User Interface to the backend REST APIs.

---

## 1. Base Configuration

- **Base URL:** `http://localhost:5000`
- **Default Content Type:** `application/json`
- **Authentication Header:** `Authorization: Bearer <JWT_TOKEN>`

---

## 2. Standard Response Structure

### Success Response (HTTP 200 / 201)
```json
{
  "success": true,
  "message": "Description of the operation",
  "data": { ... }
}
```

### Validation Error (HTTP 400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "date_of_birth",
      "message": "Date of birth must be a valid date in YYYY-MM-DD format and cannot be in the future"
    }
  ]
}
```

### Authorization Error (HTTP 401 / 403)
```json
{
  "success": false,
  "message": "Authentication required. No token provided."
}
```

---

## 3. Endpoints & Integration Flow

### Step 1: Authentication (Mobile OTP)

#### A. Send OTP
- **Endpoint:** `POST /api/auth/otp/send`
- **Body:**
  ```json
  {
    "mobileNumber": "9876543210"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "OTP sent successfully",
    "data": {
      "mobileNumber": "9876543210",
      "expiresInSeconds": 300,
      "devOtp": "123456"
    }
  }
  ```
- **Note:** In development mode, `devOtp` is provided for testing convenience.

#### B. Verify OTP & Obtain Token
- **Endpoint:** `POST /api/auth/otp/verify`
- **Body:**
  ```json
  {
    "mobileNumber": "9876543210",
    "otp": "123456"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "OTP verified successfully",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "2",
        "mobileNumber": "9876543210",
        "mobileVerifiedAt": "2026-11-19T16:00:00.000Z",
        "preferredLanguage": "en"
      }
    }
  }
  ```
- **Frontend Action:** Store `data.token` and `data.user.id` in `localStorage` or session state. Pass `Authorization: Bearer <token>` in all subsequent requests.

---

### Step 2: Onboarding & Dashboard

#### A. Fetch Complete Profile & Card Statuses
- **Endpoint:** `GET /api/profile/:userId`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Returns `data.profile` (all saved fields) and `data.progress` (array of all 7 card statuses).

#### B. Fetch Live Card Progress Badges
- **Endpoint:** `GET /api/profile/:userId/progress`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Profile progress retrieved successfully",
    "data": {
      "userId": 2,
      "progress": [
        { "section_key": "basics", "status": "completed", "last_saved_at": "...", "completed_at": "..." },
        { "section_key": "location", "status": "in_progress", "last_saved_at": "...", "completed_at": null },
        { "section_key": "education", "status": "not_started", "last_saved_at": null, "completed_at": null },
        { "section_key": "employment", "status": "not_started", "last_saved_at": null, "completed_at": null },
        { "section_key": "income", "status": "not_started", "last_saved_at": null, "completed_at": null },
        { "section_key": "social_category", "status": "not_started", "last_saved_at": null, "completed_at": null },
        { "section_key": "family", "status": "not_started", "last_saved_at": null, "completed_at": null }
      ]
    }
  }
  ```

#### C. Fetch Overall Completion Percentage
- **Endpoint:** `GET /api/profile/:userId/completeness`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Profile completeness calculated successfully",
    "data": {
      "totalSections": 7,
      "completedCount": 3,
      "pendingCount": 4,
      "percentage": 43,
      "isFullyComplete": false,
      "isSubmitted": false,
      "completedSections": ["basics", "location", "education"],
      "pendingSections": ["employment", "income", "social_category", "family"],
      "missingFieldsBySection": {
        "employment": ["occupation"],
        "income": ["annual_household_income"],
        "social_category": ["social_category"],
        "family": ["marital_status", "family_size"]
      }
    }
  }
  ```

---

### Step 3: Profile Cards Autosave (`PATCH /api/profile/:userId/sections/:sectionKey`)

Every card saves independently to:
`PATCH /api/profile/:userId/sections/:sectionKey`

| Card | `:sectionKey` | Allowed Fields | Required for Completion | Allowed Values / Formats |
|---|---|---|---|---|
| **Card 1: Personal** | `basics` | `full_name`, `date_of_birth`, `gender` | All 3 | `gender`: `'male'`, `'female'`, `'other'`, `'prefer_not_to_say'`. `date_of_birth`: `'YYYY-MM-DD'` (cannot be in future). |
| **Card 2: Location** | `location` | `state`, `district`, `residence_type` | All 3 | `residence_type`: `'rural'`, `'urban'`. State & District: Strings <= 100 chars. |
| **Card 3: Education** | `education` | `education_level` | `education_level` | String <= 100 chars (e.g. `'10th Pass'`, `'Graduate'`). |
| **Card 4: Employment** | `employment` | `occupation` | `occupation` | String <= 100 chars (e.g. `'Farmer'`, `'Student'`, `'Self-Employed'`). |
| **Card 5: Income** | `income` | `annual_household_income`, `land_holding_acres` | `annual_household_income` | Numbers `>= 0` (zero is accepted!). `land_holding_acres` is optional. |
| **Card 6: Social Category** | `social_category` | `social_category`, `minority_status`, `disability_status`, `bpl_card` | `social_category` | `social_category`: `'general'`, `'obc'`, `'sc'`, `'st'`, `'ews'`, `'other'`, `'prefer_not_to_say'`. Boolean flags: `true`, `false`, or `null` (unanswered). |
| **Card 7: Family** | `family` | `marital_status`, `family_size`, `land_holding_acres`, `bpl_card` | `marital_status`, `family_size` | `marital_status`: `'single'`, `'married'`, `'divorced'`, `'widowed'`, `'separated'`, `'other'`. `family_size`: Integer `>= 1`. |

#### Example Card Save Request
```json
// PATCH /api/profile/2/sections/basics
{
  "full_name": "Priya Sharma",
  "date_of_birth": "1998-08-15",
  "gender": "female"
}
```

---

### Step 4: Card 8 – Review & Final Submission

#### A. Final Review Screen
- **Endpoint:** `GET /api/profile/:userId/review`
- **Response:** Delivers an array of all 7 cards with their display titles, saved values, completion statuses, and `canSubmit: true/false`.

#### B. Final Submission
- **Endpoint:** `POST /api/profile/:userId/submit`
- **Headers:** `Authorization: Bearer <token>`
- **Response if all cards complete (200 OK):**
  ```json
  {
    "success": true,
    "message": "Profile submitted successfully",
    "data": {
      "isSubmitted": true,
      "submittedAt": "2026-11-19T16:30:00.000Z"
    }
  }
  ```
- **Response if any card is incomplete (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Cannot submit profile: all 7 sections must be completed first",
    "errors": {
      "percentage": 86,
      "pendingSections": ["family"],
      "missingFieldsBySection": {
        "family": ["family_size"]
      }
    }
  }
  ```

---

## 4. Frontend Code Snippets (JavaScript / Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Autosave a card
export const autosaveCard = async (userId, sectionKey, cardData) => {
  try {
    const res = await api.patch(`/profile/${userId}/sections/${sectionKey}`, cardData);
    return res.data;
  } catch (err) {
    if (err.response && err.response.data) {
      throw err.response.data; // contains { success: false, errors: [...] }
    }
    throw err;
  }
};
```
