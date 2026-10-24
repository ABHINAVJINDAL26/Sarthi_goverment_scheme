# Sarthi - Product Requirements Document (PRD.md)

| Field | Value |
|---|---|
| Product | Sarthi - AI-Powered Government Scheme Assistance Platform |
| Version | 1.0 |
| Date | 21 October 2026 |
| Context | Capstone project |
| Source material | Sarthi Feature Specification v1.0 (17 October 2026) |
| Status | Final. All open decisions in Section 12 are resolved with defaults and can be changed later without redoing the document |

**Conventions used in this document**

- This PRD says **what** is built and **why**. It contains no code, no tech stack, no schema and no endpoint design. Those belong to ARCHITECTURE.md, DATABASE.md and API.md.
- Tiers: **MVP-Core** (must be built and demonstrated), **MVP-Simplified** (smaller working version for the demo), **Future** (documented only, no build time now).
- **[A#]** marks an assumption (Section 11). **[D#]** marks a decision that was open in the spec and is now resolved with a default (Section 12).
- Requirement IDs: FR-x.y for functional requirements of feature Fx, NFR-n for non-functional requirements, US-n for user stories.
- "Shall" means mandatory for the tier the feature belongs to.

---

## 1. Problem, Value Proposition and Target Users

### 1.1 Problem

- India has more than 3,000 central and state welfare schemes, yet many eligible citizens never receive a benefit.
- Scheme information is scattered across many sites, and eligibility language is complex.
- Citizens do not know which documents they need, where to get a missing one, or how to complete the application.
- Family members who live in another city cannot easily track opportunities for their parents.
- Many users are low-literacy, use low-cost Android phones, share devices and have limited bandwidth.
- The official portal (myScheme) offers profile-based discovery and a three-step flow (enter details, search, select and apply), but it largely stops at showing matching schemes. A user who sees "Not eligible" gets no explanation and no path to fix it.

### 1.2 Value proposition

> Sarthi tells you which schemes you may qualify for, why, what is missing, and exactly where to fix it - in your language, for your whole family - and then guides you to the official application.

What Sarthi adds on top of discovery:

1. **Explainable eligibility.** Every result is shown criterion by criterion (PASS, FAIL, UNKNOWN).
2. **Document-backed scoring.** The user's own documents are read, validated and compared to each criterion, giving a partial confidence score instead of a plain Yes or No (F8).
3. **Show the gap, not just the verdict.** Each missing item comes with a localized fix: which office or portal, what to carry, typical time and fee.
4. **Family-level tracking and alerts.** One account manages parents, spouse and children.
5. **Trust.** Every scheme shows its official link and last-verified date. Results are always labelled preliminary.

### 1.3 Product principles

1. **Rules decide, AI explains.** Eligibility is computed only by a deterministic rule engine. The AI assistant retrieves and explains verified content and never decides eligibility.
2. **Preliminary, never final.** The government authority makes the final decision.
3. **Official sources first.** Every scheme and every assistant answer shows its source and last-verified date.
4. **Low-friction for low-literacy users.** Short steps, plain language, Hindi and English, large touch targets, low-bandwidth mode.
5. **Minimum data, maximum consent.** Collect only what is needed, explain why, let the user delete it.
6. **Guide, do not act.** Sarthi never submits an application and never stores portal passwords.

### 1.4 Target users

| User | What they do | Typical device | Tier |
|---|---|---|---|
| Citizen / applicant (primary) | Builds a profile, finds schemes, checks documents, follows guidance, applies on the official portal | Low-cost Android phone, sometimes shared | MVP |
| Family manager (primary) | Keeps profiles for parents, spouse and children, often from another city, and receives alerts for them | Smartphone or laptop | MVP-Simplified |
| CSC / NGO helper | Helps several citizens on a shared device, including offline | Shared tablet or kiosk | Future |
| Admin / Editor / Reviewer (internal) | Maintains scheme data, rules, sources and reviews user-reported errors | Desktop browser | MVP (minimal) |

**Other stakeholders (not product users):** capstone reviewers (demo audience) and the patent agent (F8 candidate module).

### 1.5 Product boundaries (what Sarthi is not)

- It does not give a final eligibility decision, legal advice or a guarantee of any benefit.
- It does not submit applications on behalf of users.
- It does not store government-portal passwords.
- It does not sell personal data or use it for advertising.
- It does not require an Aadhaar number to sign up.

---

## 2. Core User Journeys and User Stories

### 2.1 Core journeys

**Journey A - Farmer on a low-cost phone (guest to saved result)**
1. Opens the site in Hindi, taps "Check my schemes", continues as guest.
2. Answers four short questions: age, state, occupation (farmer), land size.
3. Sees three eligible and two almost-eligible schemes with reasons.
4. Opens a scheme, sees the income certificate is missing, reads where to get it in his district.
5. Signs in with an OTP to save the result and receives a reminder when the certificate needs renewing.

**Journey B - Student checking documents (patent-candidate flow)**
1. Signs in, completes the profile, opens a scholarship scheme.
2. Taps "Check my documents" and photographs the Aadhaar, income certificate and category certificate.
3. Corrects one low-confidence field and sees the report: 75 percent, category certificate missing.
4. Follows the fix steps, uploads the certificate and sees 100 percent.
5. Opens the Apply guide, applies on the official portal and records the application number.

**Journey C - Son in another city managing his parents**
1. Adds his father and mother in the Family tab and confirms he has their permission.
2. Sees that his mother may be eligible for a pension scheme and his father for a health scheme.
3. A week later receives a notification: a new scheme opens and his mother may be eligible.
4. Uses the checklist to arrange documents and asks the assistant about the deadline.

### 2.2 User stories

| ID | As a... | I want to... | So that... | Feature | Tier |
|---|---|---|---|---|---|
| US-1 | visitor | switch between Hindi and English on any screen | I can read in my own language | F1 | Core |
| US-2 | visitor | check my eligibility without creating an account | I can try Sarthi before sharing details | F1, F2 | Core |
| US-3 | citizen | sign in with an OTP and accept clear consents | my data is saved safely and I stay in control | F1, F16 | Core |
| US-4 | citizen | answer a short questionnaire that skips irrelevant questions | I am not overwhelmed | F2 | Core |
| US-5 | citizen | choose "Prefer not to say" on sensitive fields | I am not forced to disclose, and it is not treated as a "No" | F2 | Core |
| US-6 | visitor | search and browse schemes by keyword, category, life event and filters | I can find relevant schemes even without a profile | F3 | Core |
| US-7 | citizen | see, for each scheme, whether I may be eligible and why, criterion by criterion | I trust the result | F4 | Core |
| US-8 | citizen | be told exactly which missing detail would confirm an unknown criterion | I can complete it in one tap | F4 | Core |
| US-9 | citizen | see the best matches first, grouped sensibly | I do not scroll through everything | F5 | Core |
| US-10 | visitor | open one page with benefits, eligibility, documents, steps and sources | I have everything about a scheme in one place | F6 | Core |
| US-11 | citizen | get a document checklist and know how and where to get each missing document in my district | I can act without guessing | F7 | Core |
| US-12 | citizen | upload or photograph my documents, review what was read and correct mistakes | the system works with accurate data | F8 | Core |
| US-13 | citizen | see a partial confidence score, the exact gaps and how to fix each locally | I know what to do next, instead of just "Not eligible" | F8 | Core |
| US-14 | citizen | upload a missing document and see the score update | I can see my progress | F8 | Core |
| US-15 | citizen | follow a step-by-step guide, open the official portal and record my application status | I do not get lost during applying | F9 | Simplified |
| US-16 | visitor | ask questions in Hindi, English or Hinglish and see sources for each answer | I get trustworthy answers in my language | F10 | Simplified |
| US-17 | citizen | save schemes, add notes and compare two schemes | I can decide and come back later | F11 | Simplified |
| US-18 | citizen | export my checklist and report as a PDF | I can carry or share it with family or a helper | F7, F8 | Core |
| US-19 | family manager | add family members with their permission and see a household overview | I can manage everyone in one place | F12 | Simplified |
| US-20 | family manager | switch the app to a member's context | I can review that member's schemes and documents | F12 | Simplified |
| US-21 | family manager | receive alerts that name the member ("Mom may be eligible") | nobody misses an opportunity or deadline | F13 | Simplified |
| US-22 | citizen | view or withdraw consents, export my data and delete my account | I stay in control of my information | F16 | Core |
| US-23 | visitor | report wrong information and rate answers | data quality improves | F17 | Simplified |
| US-24 | editor | add and update a scheme, its rules, documents and sources from an official source | the data stays accurate | F15 | Core (minimal) |
| US-25 | reviewer | check the source and approve before a scheme is published | wrong data does not reach users | F15 | Core (minimal) |
| US-26 | editor | work through user-reported errors | reports lead to fixes | F15, F17 | Core (minimal) |

---

## 3. Features and Functional Requirements

### F1. Onboarding, Authentication and Language - MVP-Core

- FR-1.1 The landing page shall show a one-line promise, a primary "Check my schemes" button, a search box, category tiles and a trust strip (official sources, last-verified date).
- FR-1.2 The app shall support Hindi and English. All user-facing text shall come from translation resources. The choice shall be saved in the browser and, for signed-in users, in the profile.
- FR-1.3 Users shall be able to sign in with a one-time code (channel per [D1]). The code shall expire, resend shall be rate-limited per user identifier and per device, and a retry timer shall be shown on delivery failure.
- FR-1.4 Guest mode shall allow the eligibility check without an account. Guest results shall exist only in browser memory, and the user shall be asked to sign in to save them.
- FR-1.5 After first sign-in, a plain-language consent screen shall be shown once with separate consents for profile data, document processing and notifications. Consent purpose, version and time shall be recorded.
- FR-1.6 The app shall sign the user out after inactivity and provide a "clear all data from this device" action.
- FR-1.7 Sign-up shall not require an Aadhaar number.

### F2. Profile and Smart Questionnaire - MVP-Core

- FR-2.1 A step-by-step wizard (5-6 steps, one topic per screen, progress bar) shall collect basics, location, income and occupation, category and special status, education and family.
- FR-2.2 Progress shall be saved after every step and the user shall be able to resume on another day.
- FR-2.3 The questions shown shall be driven by the scheme rules (for example, land size only for farmers).
- FR-2.4 Every field shall have a plain-language helper where useful (for example, what BPL means, how to estimate household income).
- FR-2.5 Every sensitive field shall offer "Prefer not to say", stored as unknown and never as a negative answer.
- FR-2.6 Inputs shall be validated with friendly messages (age 0-120, income not negative). Income ranges shall be normalised to numbers.
- FR-2.7 A completeness meter shall show the percentage complete and name the missing field that would unlock the most extra matches.
- FR-2.8 Editing the profile shall automatically re-run matching, and the previous profile snapshot shall be kept for audit.
- FR-2.9 An empty optional field shall never block the user; affected criteria shall show as unknown ("Needs verification").
- FR-2.10 Voice input is **Future**.

### F3. Scheme Discovery and Search - MVP-Core

- FR-3.1 Keyword search shall work in Hindi and English with autocomplete and typo tolerance, over scheme name, benefits and description. Each scheme shall hold both language names.
- FR-3.2 Browse by category (Education, Health, Agriculture, Employment, Housing, Women and Child, Senior Citizens, Disability, Business) and by life event (for example Having a baby, Starting a business, Losing a job, Getting married).
- FR-3.3 Filters: Central or State, target group, benefit type (cash, subsidy, loan, insurance), deadline soon, and a "Matches my profile" toggle.
- FR-3.4 Each scheme card shall show name, ministry or state, a one-line benefit, a match badge (when a profile exists), the last-verified date, an "Official source" link and a Save icon.
- FR-3.5 Sorting: best match, closest deadline, newest.
- FR-3.6 Search and browse shall work without an account.
- FR-3.7 The empty-result state shall suggest removing filters and offer the assistant.

### F4. Deterministic Eligibility Engine and Explainable Results - MVP-Core

- FR-4.1 Each scheme shall have structured criteria: field, operator, value, mandatory flag and weight, with grouping by AND, OR and NOT (for example "(Farmer OR Tenant farmer) AND NOT income-tax payer").
- FR-4.2 The engine shall support greater-or-equal, less-or-equal, equals, IN, BETWEEN, AND, OR, NOT and shall handle missing values.
- FR-4.3 Each criterion shall evaluate to PASS, FAIL or UNKNOWN. Missing data or unsafe automated verification shall yield UNKNOWN.
- FR-4.4 Overall status shall be Eligible, Likely eligible (needs verification) or Not eligible, always labelled "Preliminary" [A3][D13].
- FR-4.5 A scheme with a failed mandatory criterion shall never be shown as Eligible, whatever the other scores are.
- FR-4.6 Every result shall expose a "Why this result?" explanation listing each criterion with its outcome and the reason (for example "Age 18-25: PASS - you are 21").
- FR-4.7 Each UNKNOWN criterion shall produce a one-tap prompt to supply the missing detail.
- FR-4.8 Each evaluation shall record the profile snapshot, the rule version and the timestamp. The user shall see their own evaluations and snapshots in History; this is separate from staff access. In the staff audit view, an Eligibility Auditor or Admin may see only the profile fields needed to reproduce the evaluation (age or date-of-birth band, state, district, occupation, income band, and criterion inputs and outcomes), with income, category, disability and other sensitive values masked unless the role is explicitly authorized for that field by a server-side policy. Staff shall not see uploaded documents or extracted document fields by default. Every audit-view request shall be authorized server-side and logged; users shall never see other users' History.
- FR-4.9 Evaluation shall re-run automatically when the profile changes or a published rule changes.
- FR-4.10 The AI model shall never be used to decide an eligibility outcome.

### F5. Recommendation Ranking - MVP-Core

- FR-5.1 Each scheme shall get a match score: the weighted share of PASS criteria [A4]. For an OR group, the group is PASS when at least one alternative is PASS; its numerator is the greatest weight among the PASS alternatives and its denominator is the greatest weight among all alternatives, so a satisfied alternative can receive full credit. An OR group with no PASS and at least one UNKNOWN is UNKNOWN; otherwise it is FAIL. AND groups sum the recursively calculated child numerators and denominators, and NOT groups use the negated outcome with the group's configured weight. The same rule shall be used for nested groups and for the document-confidence score in FR-8.7. It shall be used for ordering and display only.
- FR-5.2 Schemes failing a mandatory criterion shall be placed in the lower group regardless of score.
- FR-5.3 Schemes closing soon shall be boosted within their group and tagged "Closing soon".
- FR-5.4 Results shall be grouped as Eligible now, Almost eligible and Explore later [A5].
- FR-5.5 Each card shall show reason chips (for example "Matches: Age, State, Occupation").
- FR-5.6 The match score shall never be worded as a guarantee, and shall be visibly distinct from the document confidence score in F8.
- FR-5.7 Criterion weights shall be editable by staff without code changes.

### F6. Scheme Detail Page - MVP-Core

- FR-6.1 The header shall show name, ministry or state, status (active or closed), last-verified date, official link, Save and Share.
- FR-6.2 Five tabs: Overview and benefits, Eligibility, Documents, How to apply, Sources and FAQs.
- FR-6.3 The Overview shall give a plain-language summary, with the original wording available on request.
- FR-6.4 The Eligibility tab shall show the user's PASS, FAIL or UNKNOWN per criterion (from F4).
- FR-6.5 Primary actions: "Check my documents" (F8), "Ask about this scheme" (F10, with scheme context), "Apply" (F9).
- FR-6.6 A banner shall be shown when the scheme is closed or its data is older than the freshness limit [A10].
- FR-6.7 A "Report wrong information" link shall send the page and issue to the admin feedback queue.
- FR-6.8 The Share action shall open a public scheme link that exposes no private user data.

### F7. Document Checklist and Local Document Guide - MVP-Core

- FR-7.1 A checklist shall be generated automatically from the scheme's required documents.
- FR-7.2 Each item shall have a status: Have it, Don't have it, Needs renewal. Items verified earlier in F8 shall be pre-ticked.
- FR-7.3 Each item shall have a "How to get it" panel: issuing office, official portal link, supporting documents to carry, typical processing time and fee, all from verified data.
- FR-7.4 An office directory (name, address, timings, map link) shall show data for the user's district, falling back to state-level guidance with a clear note when district data is missing. Data shall never be guessed.
- FR-7.5 Reminders shall be created for documents that expire and shall appear as in-app notifications and checklist badges.
- FR-7.6 The checklist shall be exportable as a PDF and shareable with a family member.
- FR-7.7 Local data shall be provided for the pilot geography [D2].

### F8. Document Verification and Partial-Eligibility Scoring - MVP-Core (basic working version, highest polish priority) - Patent-candidate module

- FR-8.1 **Upload and capture.** The user shall pick a document type and take a photo or upload JPG, PNG or PDF (multi-page supported, size limits enforced, on-screen guidance for edges and lighting). Files shall be stored encrypted.
- FR-8.2 **Pre-processing and OCR.** The backend shall pre-process the image (deskew, denoise, contrast, resolution) and extract text in Hindi and English. Per-document-type extraction rules shall pull out the relevant fields (name, date of birth, address, income figure, category, issuing authority, issue date, certificate number).
- FR-8.3 **User confirmation.** Each extracted field shall show a confidence indicator. Low-confidence fields shall be highlighted and every field shall be editable. User corrections shall be stored.
- FR-8.4 **Manual-entry fallback.** If OCR fails or confidence is too low, the user shall be able to enter the fields manually and never be stuck.
- FR-8.5 **Validation.** The system shall check expiry or currency, name match across documents (fuzzy), numeric plausibility and format patterns. For Aadhaar, only the last four digits shall be kept.
- FR-8.6 **Criterion comparison.** Validated fields shall be mapped to the scheme's criteria. Each criterion shall become Satisfied, Unmet or Uncertain [A6].
- FR-8.7 **Weighted partial confidence score.** Apply the same recursive weighting rule as FR-5.1 to the Satisfied, Unmet and Uncertain outcomes: for an OR group, a Satisfied alternative contributes the greatest passing weight and the denominator is the greatest alternative weight, allowing a valid alternative to receive 100 percent credit; AND and nested groups use their recursively aggregated weights. Before calculating either score, every participating criterion weight shall be finite and non-negative, and the total denominator shall be greater than zero. If validation fails, no numeric score shall be produced and the report shall show "Score unavailable: invalid criterion weights" with the affected rule version. A hard-disqualifier shall be reported separately so a high score never implies eligibility.
- FR-8.8 **Gap identification.** Each Unmet or Uncertain criterion shall appear as a "What's missing" card with the reason.
- FR-8.9 **Localized resolution path.** Each gap card shall contain a "How to fix this" panel: what to obtain, where (office or portal for the user's district), what to carry, typical time, fee and link, from F7 data.
- FR-8.10 **Re-score.** Uploading a corrected or missing document shall recompute only the affected criteria and update the score (for example 75 to 100 percent).
- FR-8.11 **Report.** The Eligibility report shall show the Preliminary label, the score gauge with a one-line message, the criteria table with evidence used, the gap cards and the official link. It shall be exportable as PDF.
- FR-8.12 **Retention.** Uploaded images shall be deleted per the retention rule [D6]. Extracted fields shall be kept only if the user chooses to save them.
- FR-8.13 The score shall never be presented as an approval.
- FR-8.14 Demos and tests shall use sample or dummy documents only [A8].

### F9. Guided Application Assistance - MVP-Simplified

- FR-9.1 A readiness check shall show which mandatory documents are ready or missing, linking to F7 and F8.
- FR-9.2 A step-by-step guide shall mirror the official form section by section, showing what to enter in each field from profile data with copy buttons. MVP covers two schemes.
- FR-9.3 The primary button shall open the official application page in a new tab with a reminder that Sarthi does not submit on the user's behalf.
- FR-9.4 An offline route shall show the nearest CSC or government office with address, timings and a map link.
- FR-9.5 A self-reported application tracker shall record status (Not started, Applied, In review, Approved, Rejected), application number and date.
- FR-9.6 No portal password shall ever be stored or requested.
- FR-9.7 Assisted apply by a trained helper is **Future**.

### F10. AI Assistant (RAG Chatbot) - MVP-Simplified

- FR-10.1 The assistant shall answer in Hindi, English or Hinglish, from the floating chat button on every page, the Assistant tab, and "Ask about this scheme".
- FR-10.2 Answers shall be grounded only in verified scheme content, using structured filters (state, category) before semantic retrieval. MVP covers 5-10 schemes.
- FR-10.3 Every answer shall end with source chips: scheme name, section, official URL and last-verified date.
- FR-10.4 When the retrieved evidence is weak, the assistant shall say it cannot confirm and point to the official source instead of guessing.
- FR-10.5 For eligibility questions the assistant shall call the rule-engine result and explain it, and shall offer a "Check my eligibility" button.
- FR-10.6 The assistant shall be forbidden from inventing criteria, benefits, documents or links.
- FR-10.7 Context-aware suggested questions shall appear above the input box.
- FR-10.8 Each answer shall have thumbs up or down; down-votes go to the admin queue.
- FR-10.9 Unanswered questions shall be logged (without personal data) so editors can add missing content.
- FR-10.10 When offline or unavailable, the assistant shall say "Assistant needs internet" or show a retry message rather than fail silently.
- FR-10.11 A test set of 30-50 questions with known answers shall exist and be run before the demo.

### F11. Saved Schemes, Notes and Comparison - MVP-Simplified

- FR-11.1 Users shall save and unsave a scheme from any card or detail page; saved schemes shall sync across devices for signed-in users.
- FR-11.2 Each saved scheme shall support a private note and an optional family-member tag.
- FR-11.3 Users shall compare two saved schemes side by side (benefits, eligibility, documents).
- FR-11.4 Users shall share a public scheme link by WhatsApp or SMS share sheet.
- FR-11.5 Changes to a saved scheme shall trigger an alert (F13).

### F12. Family Dashboard - MVP-Simplified (UI and data model)

- FR-12.1 An owner shall add a family member with name, relationship, date of birth and the fields needed for matching. Household fields (address, state, household income) shall be inherited and editable.
- FR-12.2 A required permission checkbox shall confirm the owner has the member's permission to store their details.
- FR-12.3 The Family tab shall show a card per member: counts of eligible schemes, almost-eligible schemes and pending documents.
- FR-12.4 A member switcher shall change the whole app context (schemes, checklist, document check, notifications) to the selected member.
- FR-12.5 A "Household top opportunities" list shall combine the best schemes across members, with the member name on each card.
- FR-12.6 Notification text shall name the member.
- FR-12.7 Any member shall be deletable at any time. Minimum data shall be collected per member [D7].
- FR-12.8 Co-manager invitations are **Future**.

### F13. Proactive Notifications - MVP-Simplified (in-app first)

- FR-13.1 A scheduled job (daily, also triggerable manually [A13]) shall detect new, updated or closing schemes and re-run eligibility for every saved profile and family member.
- FR-13.2 Triggers: new scheme, changed criteria, deadline in 15, 7 and 1 days, saved scheme updated, document about to expire.
- FR-13.3 Notifications shall appear in the bell dropdown and the Notifications page, grouped by type, each deep-linking to the scheme or result.
- FR-13.4 Wording shall say "may be eligible" and never promise a benefit.
- FR-13.5 Preferences shall allow choosing channels, quiet hours, language, which family members to follow and instant versus daily digest.
- FR-13.6 Notification deduplication shall be event-aware and idempotent. The deduplication key shall include member, notification trigger, scheme version, and deadline occurrence (for example, the 15-, 7- or 1-day occurrence). Thus distinct reminders, scheme updates and expiry notifications shall not suppress one another, while retries of the same event do not create duplicates. Daily send limits shall still apply across all event types.
- FR-13.7 Notifications shall be sent only on channels the user consented to, with opt-out always available.
- FR-13.8 SMS and WhatsApp delivery are **Future** [D10].

### F14. Offline-First Mode - Future

- FR-14.1 Documented in the report only. Includes installable PWA, offline app shell, local rule pack by state, on-device evaluation with identical logic, status strip, sync on reconnect, and clear "Needs internet" states for the assistant, OCR and notifications.
- FR-14.2 **Design constraint for MVP:** scheme rules shall be kept as portable structured data so offline evaluation can be added later without redefining rules.

### F15. Admin Console - MVP-Core (minimal)

- FR-15.1 Staff shall have a separate site with its own login.
- FR-15.2 Scheme create, edit, publish and retire, with names in two languages, benefits, target group, scope, status and official URL.
- FR-15.3 A rule builder for criteria rows (field, operator, value, mandatory, weight) with AND/OR grouping. Preview on sample profiles is **Should-have**.
- FR-15.4 An editor for required documents and district-level resolution paths (office, address, timings, link, time, fee, last verified).
- FR-15.5 A sources record: official URL, source type, who verified it and when.
- FR-15.6 Verification workflow with statuses Draft, In review and Published [D11].
- FR-15.7 A feedback queue showing user reports with status and assignee.
- FR-15.8 Role-based access (Admin, Editor, Reviewer) and an audit log of every change.
- FR-15.9 Every rule change shall create a new version, and evaluations shall record the version used. Rollback and the freshness dashboard (unverified schemes, broken links) are **Should-have**.
- FR-15.10 There shall be no silent edits to production data. Seed data may be loaded from a file.
- FR-15.11 At least 30-50 schemes shall be hand-verified from official sources. AI-generated scheme data shall not be published without human verification [A12].

### F16. Trust, Privacy and Safety - MVP-Core (basics)

- FR-16.1 Every scheme and assistant answer shall show an official source link and last-verified date.
- FR-16.2 A "Preliminary result" banner shall appear on My Schemes, the Eligibility tab and the Eligibility report.
- FR-16.3 Settings > Privacy shall let users view, change or withdraw each consent, download their data and delete their account and documents.
- FR-16.4 Sensitive numbers shall be masked and uploaded images deleted per the retention rule.
- FR-16.5 Accessibility settings: large-text mode, high contrast, screen-reader labels and a low-bandwidth mode that skips heavy images.
- FR-16.6 Security basics shall apply (see NFR-7).
- FR-16.7 Personal data shall not be sold or used for advertising.

### F17. Feedback, Community Proof and Help - MVP-Simplified (feedback); Future (success stories)

- FR-17.1 A "Was this correct?" thumbs control shall appear on every scheme page and assistant answer; down-votes ask for a short reason.
- FR-17.2 A "Report an error" form shall send the page and issue to the admin queue.
- FR-17.3 A Help centre shall cover how it works, FAQs, language help and contact details.
- FR-17.4 A "Nearest helper" link shall find a CSC or helper (Help tab and Apply guide).
- FR-17.5 Verified success stories are **Future** and shall never be published without written consent and removal of personal details.

---

## 4. Non-Functional Requirements

| ID | Area | Requirement |
|---|---|---|
| NFR-1 | Performance | Primary screens usable within 3 s on a mid-range Android phone over 4G. Eligibility evaluation returns within 2 s for the full published set. OCR and extraction within 15 s per single-page document. Assistant answer within 8 s [A10]. |
| NFR-2 | Low bandwidth | A low-bandwidth mode shall avoid heavy images. Core flows shall remain usable on slow connections. |
| NFR-3 | Responsive design | One responsive web app for desktop and mobile. Large touch targets. Filters as a bottom sheet on mobile. |
| NFR-4 | Accessibility | Target WCAG 2.1 AA. Large-text, high-contrast, screen-reader labels, keyboard navigation. |
| NFR-5 | Localization | Hindi and English across all MVP screens. No hard-coded user-facing text. Indian number and date conventions (for example lakh). Simple reading level. |
| NFR-6 | Browser support | Latest two versions of Chrome, Edge, Safari and Firefox on desktop; Chrome on Android [A10]. |
| NFR-7 | Security | HTTPS everywhere. Hashed staff passwords. Role-based access enforced server-side. Input validation. Rate limiting on OTP, uploads and assistant. No secrets in the client. No sensitive data in logs. Uploaded files encrypted at rest. |
| NFR-8 | Privacy and compliance | Designed with India's DPDP Act and 2025 Rules in mind. Consent per purpose, data minimisation, export and delete. Legal review of consent text, children's data, retention and Aadhaar masking before any real launch. |
| NFR-9 | Auditability | Every evaluation stores the profile snapshot, rule version and timestamp. Every staff change is logged and attributable. |
| NFR-10 | AI safety | The assistant answers only from verified content, cites sources, refuses when evidence is weak and never decides eligibility. |
| NFR-11 | Graceful failure | If OCR, SMS, the assistant or an external link fails, the user can still continue (manual entry, retry, alternative channel, official link). |
| NFR-12 | Data freshness | Each scheme shows a last-verified date. Schemes older than the freshness limit show a stale-data banner [A10]. |
| NFR-13 | Testability | Every engine operator unit-tested. Assistant evaluated on a 30-50 question test set. Critical journeys covered by automated tests. |
| NFR-14 | Maintainability | Schemes, rules, weights, documents and offices are editable by staff without code changes. |
| NFR-15 | Observability (basic) | Errors captured without personal data. Failed external calls visible. |

---

## 5. Pages and Screens

### 5.1 Citizen-facing

| Screen | Route | Access | Purpose | Tier |
|---|---|---|---|---|
| Landing / Home | / | Everyone | Promise, search, categories, life events, start check | Core |
| Sign in / Sign up | /login | Everyone | OTP login, guest option, language choice | Core |
| Consent | /consent | New users | Plain-language consent, shown once | Core |
| Profile wizard | /onboarding | Signed-in (guest flow also allowed) | Step-by-step questionnaire | Core |
| Profile | /profile | Signed-in | View and edit profile, completeness meter, history | Core |
| Explore | /explore | Everyone | Search, filters, categories | Core |
| My Schemes | /my-schemes | Signed-in (guest sees in-memory result) | Ranked results with status and reasons | Core |
| Scheme detail | /schemes/:id | Everyone | Five-tab scheme page | Core |
| Document check | /schemes/:id/check | Signed-in | Upload, extracted details, score, gaps, fixes (F8) | Core |
| Checklist | /checklist | Signed-in | Checklist across saved schemes | Core |
| Apply guide | /schemes/:id/apply | Signed-in | Step-by-step guide, portal handoff, tracker | Simplified |
| Assistant | /assistant | Everyone | Full-page chat (also floating button) | Simplified |
| Saved | /saved | Signed-in | Bookmarks, notes, compare | Simplified |
| Family | /family | Signed-in | Household dashboard and members | Simplified |
| Notifications | /notifications | Signed-in | Alert centre | Simplified |
| Settings | /settings | Signed-in | Language, notifications, privacy, accessibility, delete account | Core |
| Help | /help | Everyone | FAQs, how it works, contact, report a problem | Simplified |

### 5.2 Admin console (/admin/*, staff only)

| Screen | Purpose | Tier |
|---|---|---|
| Dashboard | Freshness overview, queue counts | Should-have |
| Schemes (list and edit) | Scheme CRUD, publish and retire | Core |
| Rules tab | Rule builder with weights | Core |
| Documents and Offices | Required documents and district-level resolution paths | Core |
| Sources | Official sources and provenance | Core |
| Verification queue | Draft, In review, Published | Core |
| Feedback | User reports and bad-answer reports | Core |
| Users and Roles | Staff accounts and roles | Core |
| Audit log | Record of every change | Core |

### 5.3 Global elements

- Top bar (desktop): logo, language switch, search, notification bell, member switcher, account menu. Mobile: bottom navigation with Home, Explore, My Schemes, Family, Assistant, plus a top bar with language switch, bell and account.
- Floating chat button on every page.
- Preliminary-result disclaimer on result screens.
- Footer: Help, Privacy, Terms, official-source note.
- Offline or online status strip is **Future** (F14).

---

## 6. Roles and Permissions

**Roles:** Guest (not signed in), Citizen (signed in; the owner of an account and its household), Editor, Reviewer (Eligibility Auditor), Admin. CSC / NGO Helper is **Future**.

| Capability | Guest | Citizen | Editor | Reviewer | Admin |
|---|---|---|---|---|---|
| Browse and search schemes, read scheme pages | Yes | Yes | n/a | n/a | n/a |
| Run eligibility check (guest result not stored) | Yes | Yes | - | - | - |
| Save profile, results, saved schemes, notes, tracker | No | Yes (own) | - | - | - |
| Upload documents and run document check (F8) | No | Yes (own and own household) | - | - | - |
| Manage family members and per-member views | No | Yes (own household only) | - | - | - |
| Use assistant | Yes | Yes | - | - | - |
| Submit feedback or report an error | Yes | Yes | - | - | - |
| View or delete own data and consents | - | Yes | - | - | - |
| Create and edit draft schemes, rules, documents, offices, sources | - | - | Yes | No | Yes |
| Review and publish | - | - | No | Yes | Yes |
| Triage feedback queue | - | - | Yes | Yes | Yes |
| Manage staff users and roles | - | - | No | No | Yes |
| View audit log | - | - | No | Yes (read) | Yes |
| View the scoped eligibility audit view in FR-4.8 | - | Own History only | No | Yes (read, server-authorized) | Yes (server-authorized) |

**Rules**

- A citizen may access only their own data and their own household members' data. Ownership shall be checked on the server for every request.
- Staff accounts are created by Admin; there is no self-signup for staff [A11].
- By default, no staff role can view citizens' uploaded documents or personal profiles [A11].
- The eligibility audit view is not the citizen History view: Reviewer and Admin access is limited to the fields and roles specified in FR-4.8, is authorized server-side for every request, and is logged.
- Two-person approval (Editor cannot publish own change) is configurable [D11].

---

## 7. Data Requirements

Conceptual only. Table design is defined in DATABASE.md.

### 7.1 Data entities

| Group | Entity | Purpose and key content |
|---|---|---|
| Identity | User account, session, consent record | Sign-in identifier, language, session; consent purpose, version, timestamp |
| People | Profile; family member profile | Matching attributes (7.2); relation; consent flag for members; household fields inherited |
| Scheme content | Scheme | Bilingual names, description, benefits, target group, scope (central or state), state, category tags, benefit type, status, deadline, official URL, last-verified date |
| | Eligibility criterion | Field, operator, value, mandatory flag, weight, group logic; versioned |
| | Document type; document requirement | Documents and which scheme needs which |
| | Resolution path | Document type, state, district, issuing office, address, timings, portal link, items to carry, time, fee, last-verified date |
| | Application step | Ordered steps per scheme, online and offline |
| | Source | Official URL, source type, verified by, verified on |
| | Scheme and rule versions | History for rollback and audit |
| Evaluations | Eligibility evaluation | Member, profile snapshot, rule version, per-criterion outcome, overall status, match score, timestamp |
| | Document evaluation | Per-criterion Satisfied, Unmet or Uncertain, evidence reference, confidence score, gaps |
| Documents | Uploaded document | Owner or member, document type, processing status, retention date, encrypted file |
| | Extracted field | Value, confidence, corrected-by-user flag |
| User activity | Saved scheme | Scheme, member tag, note |
| | Checklist item status | Document status per scheme and member |
| | Application tracker entry | Scheme, member, status, application number, date |
| | Notification; preferences | Type, member, scheme, status, sent time, read state; channels, quiet hours, digest choice |
| | Feedback | Type, scheme, message, status, assignee |
| Assistant | Scheme content index | Derived only from verified scheme content |
| | Query log | Question text without personal data, answered or unanswered flag, feedback |
| Admin | Staff user and role; audit log; data request | Role; every change with who and when; export or delete requests |

### 7.2 Profile attributes

Date of birth or age, gender, state, district, rural or urban, annual household income, occupation, education, category (General, OBC, SC, ST), minority status, disability, BPL card, marital status, land holding, family size.

### 7.3 Sensitivity and handling

- **Public:** scheme content, sources, office directory.
- **Personal:** account identifier, profile, family members.
- **Sensitive personal:** income, category, minority status, disability, uploaded documents and extracted fields. These require explicit consent, encryption at rest, masking, access only by the owner except for the narrowly scoped, server-authorized staff audit view in FR-4.8, and exclusion from logs.
- Aadhaar: only the last four digits are ever stored. The full number is not stored.
- Guest data stays in browser memory only.
- The assistant query log contains no personal data.
- Children's data (under 18) needs extra care [D7].

### 7.4 Retention and deletion

- Uploaded images: deleted after processing per [D6].
- Extracted fields: kept only if the user chooses to save.
- Account deletion shall remove the account's profile and profile snapshots, family members, eligibility evaluations and evaluation history, document evaluations, extracted fields, uploaded documents, saved items, tracker entries and notifications. Any retained operational or audit record shall be irreversibly anonymized so it cannot be linked to the account, and shall contain only the minimum event type, rule or scheme version, timestamp and aggregate outcome needed for system audit; it shall not retain profile fields, document data, extracted values or identifiers.
- A user's data export shall include the profile and profile snapshots, family members, eligibility evaluations and evaluation history, document evaluations, extracted fields, uploaded-document metadata that is still retained under the retention rule, saved items, tracker entries, notifications and consents. If deletion has already occurred, the export shall also identify any retained anonymized audit aggregates and explicitly state that the corresponding personal records were removed.

### 7.5 Seed and reference data required before demo

- 30-50 schemes hand-verified from official sources, each with official URL and last-verified date [D3].
- Document requirements and resolution paths for the pilot state and a few districts [D2].
- 5-10 schemes prepared for the assistant, plus the 30-50 question test set.
- Sample or dummy documents for 3-4 document types [D4].
- Step-by-step guides for two schemes.

---

## 8. Integrations

| Integration | Purpose | MVP position | Tier |
|---|---|---|---|
| One-time-code delivery (SMS gateway or email) | Login | Channel per [D1]; sandbox acceptable | Core |
| OCR engine | Read uploaded documents in Hindi and English | Open-source engine preferred [D5]; confirmed in ARCHITECTURE.md | Core |
| Language model, embeddings and vector search | Assistant answers grounded in verified content | Provider chosen in ARCHITECTURE.md; must meet FR-10.2 to FR-10.6 | Simplified |
| Official government portals | Source links and application handoff | Outbound links only; no API; no submission; no credentials | Core |
| Map links | Office directory | Outbound map link only | Core |
| PDF generation | Checklist and report export | Internal capability | Core |
| Scheduler | Daily notification watcher | Internal capability | Simplified |
| Email notifications | Optional channel | Optional [D10] | Simplified |
| SMS and WhatsApp notifications | Delivery channels | Needs paid providers and approvals | Future |
| DigiLocker (through API Setu partner onboarding) | Fetch verified documents; reduces OCR errors | Needs approval time; OCR stays as fallback | Future |
| Hindi voice input | Fill fields by speech | - | Future |

**Integration rules:** external failures shall degrade gracefully (NFR-11); no secrets in the client; no personal data sent to the language model beyond what a question requires [A12].

---

## 9. Loading, Empty and Error States

**Global rules:** loading shows skeletons or a short progress message in the selected language and never blocks the whole page. Empty states explain why and offer a next action. Errors use plain language, say what happened and what to do, offer retry, and never show raw technical messages.

| Screen or feature | Loading | Empty | Error |
|---|---|---|---|
| Landing, Explore, search | Skeleton cards | "No schemes found": suggest removing filters, offer assistant | "Could not load schemes" with retry |
| Sign in and OTP | "Sending code" | - | Wrong or expired code; resend timer; delivery failure offers alternative channel; rate-limit message |
| Profile wizard | Saving progress indicator | - | Friendly validation messages; if saving fails, keep answers on screen and retry |
| My Schemes | "Checking schemes" while evaluating | No profile: prompt to complete it. No matches: show Explore later and the completeness card | Evaluation failed: retry, show last result with a note |
| Scheme detail | Skeleton tabs | - | Not found: back to Explore. Closed or stale: banner |
| Checklist and local guide | Skeleton list | No saved schemes: explain and link to Explore | District data missing: show state-level steps with a clear note |
| Document check | "Reading your document" | No upload yet: show capture guidance | Unreadable image: retake tips or manual entry; unsupported or oversized file: clear message; low-confidence fields highlighted |
| Eligibility report | "Calculating score" | No gaps: "No gaps found" (still Preliminary) | Hard-disqualifier banner shown separately from score; re-score failure: keep previous score and retry |
| Apply guide | Skeleton steps | - | Official link unavailable: show last-verified date and the offline route |
| Assistant | Typing indicator | Suggested questions | Weak evidence: safe refusal with official link. Unavailable or offline: "Assistant needs internet" or retry |
| Saved | Skeleton list | "No saved schemes yet" | Sync failure: retry |
| Family | Skeleton cards | "Add your first member" | Save failure: retry; permission checkbox required message |
| Notifications | Skeleton list | "Nothing new" | Load failure: retry |
| Export (PDF) | "Preparing file" | - | Export failed: retry |
| Admin screens | Skeleton lists | Empty queue messages | Validation errors on forms; save conflict message; permission denied page |

---

## 10. MVP Scope, Out-of-Scope Items and Success Criteria

### 10.1 In scope

**MVP-Core (build fully)**
- F1 Onboarding, login and language (simplified login per [D1])
- F2 Profile wizard (six steps, dynamic skipping for a few fields)
- F3 Discovery and search (basic full-text search is enough)
- F4 Eligibility engine
- F5 Ranking (weighted score and mandatory gate)
- F6 Scheme detail (five tabs)
- F7 Checklist and local guide (one pilot state, a few districts)
- F8 Document verification and scoring (3-4 document types, sample documents)
- F15 Admin console (minimal: scheme form and rule rows; seed file allowed)
- F16 Trust and privacy basics (disclaimers, consent, delete account, masking)

**MVP-Simplified (working demo, reduced scope)**
- F9 Guided application (two schemes, self-reported tracker)
- F10 Assistant (5-10 schemes)
- F11 Saved schemes (save, note, compare two)
- F12 Family dashboard (member profiles and per-member results; no co-manager invites)
- F13 Notifications (in-app only)
- F17 Feedback (thumbs and report form)

### 10.2 Out of scope

- F14 Offline-first mode and installable PWA (documented as future scope; the rules-as-portable-data constraint in FR-14.2 still applies)
- WhatsApp bot, SMS and WhatsApp notification delivery
- DigiLocker integration
- Helper mode and assisted apply
- Voice input
- Verified success stories
- Additional languages beyond Hindi and English
- Co-manager invitations for family accounts
- Real submission of applications to government portals
- Real users' documents in any public demo

### 10.3 Success criteria

| ID | Criterion | Target [D12] |
|---|---|---|
| SC-1 | Journeys A, B and C demonstrable end to end on seeded data | All three pass |
| SC-2 | Eligibility engine unit tests cover every operator and missing values; mandatory-fail never yields Eligible | 100 percent of tests pass |
| SC-3 | Verified scheme data | At least 30 schemes verified, each with official URL and last-verified date |
| SC-4 | Local guidance | Resolution paths for at least one state and two to three districts |
| SC-5 | F8 flow works for 3 document types and at least 2 schemes: upload, correct, validate, score, gaps, fix steps, re-score | Full flow works; score updates after missing document is uploaded |
| SC-6 | OCR field accuracy on sample documents after pre-processing | At least 85 percent of fields correct without manual edits, and manual fallback works in 100 percent of failures |
| SC-7 | Assistant on the 30-50 question test set | At least 90 percent grounded with correct citations; zero invented criteria, documents or links; weak-evidence questions refused |
| SC-8 | Preliminary label and official source link on every result screen and report | 100 percent of screens |
| SC-9 | Privacy basics: consent recorded, delete account works, uploaded images deleted per rule, Aadhaar masked | All verified |
| SC-10 | Usability: a first-time tester completes the wizard and sees results | Within 5 minutes for at least 4 of 5 testers |
| SC-11 | Language coverage | All MVP screens usable in Hindi and English |
| SC-12 | No open critical or high-severity security issues at demo time | Zero |

---

## 11. Assumptions

| ID | Assumption |
|---|---|
| A1 | Capstone scale: fewer than about 500 users, about 100 schemes at most, one pilot geography, a single deployment. |
| A2 | Languages are Hindi and English only. Scheme content is bilingual for the verified set only. |
| A3 | Overall status rule: **Eligible** = no mandatory criterion FAIL and none UNKNOWN. **Likely eligible** = no mandatory FAIL and at least one mandatory UNKNOWN. **Not eligible** = at least one mandatory FAIL. |
| A4 | Match score (F5) uses the recursive weighted rule in FR-5.1. For an OR group, use the greatest passing alternative weight as the numerator and the greatest alternative weight as the denominator; UNKNOWN counts as not satisfied unless no alternative passes and at least one is UNKNOWN, in which case the group is UNKNOWN. All weights must be finite and non-negative and the total denominator must be greater than zero; otherwise no numeric score is produced. |
| A5 | **Almost eligible** = Likely eligible with exactly one mandatory criterion unresolved (UNKNOWN or documentary gap). **Explore later** = every other scheme not in Eligible now. |
| A6 | The three criterion outcomes are the same in both evaluations, with different wording: PASS = Satisfied, FAIL = Unmet, UNKNOWN = Uncertain. |
| A7 | Document confidence score (F8) uses the same recursive weighted rule as A4, with Satisfied, Unmet and Uncertain corresponding to PASS, FAIL and UNKNOWN. A hard-disqualifier is a failed mandatory criterion that no document can fix (for example age outside range); the report shows it separately from the score. Invalid weights produce no numeric score as specified in FR-8.7. |
| A8 | Demos and tests use only sample or dummy documents and dummy persons. |
| A9 | Offline mode and PWA installation are Future; the MVP is a responsive web app. |
| A10 | Numeric targets in NFR-1, NFR-6 and NFR-12 are working values: 3 s, 2 s, 15 s, 8 s; latest two browser versions; stale-data limit of 90 days. |
| A11 | Staff accounts are created by Admin. Staff cannot view citizens' documents or personal profiles by default. Only Reviewer (Eligibility Auditor) and Admin may use the narrowly scoped, server-authorized audit view in FR-4.8, and every access is logged. |
| A12 | Scheme data and rules are authored by humans from official sources. AI never creates or publishes them unverified. Assistant prompts contain only the question and verified content, not personal profile data. |
| A13 | The notification job runs daily and can be triggered manually for demos. |

---

## 12. Decisions (resolved with defaults)

These were open in the specification. Each now has a default applied so that the later documents (DESIGN, ARCHITECTURE, DATABASE, API) can proceed. Any of them can be swapped later.

| ID | Decision | Options | Decision applied |
|---|---|---|---|
| D1 | Login channel for the MVP | Mobile OTP with a sandbox SMS provider, or email OTP | Email OTP for the demo; keep the channel swappable so mobile OTP can be added |
| D2 | Pilot geography for local data (F7, F8) | Which state and which 2-3 districts | Punjab, with the districts Ludhiana, Jalandhar and Amritsar. The data structure is state-agnostic, so another state can be swapped in later |
| D3 | Scheme set | Which 30-50 schemes to verify; which 5-10 for the assistant; which 2-3 for the full F8 flow | 30-50 schemes spread across the nine categories, mostly central schemes plus Punjab state schemes. Flagship schemes for the full F8 flow and the assistant: PM-KISAN (farmer, Journey A), Post Matric Scholarship for Scheduled Castes (scholarship, Journey B), Indira Gandhi National Old Age Pension Scheme (pension, Journey C) and Ayushman Bharat PM-JAY (health, Journey C). These are candidates only: every criterion, document and link must come from the official source, never from this PRD |
| D4 | F8 document types | Aadhaar (masked), income certificate, category certificate, plus an optional fourth (for example domicile or residence certificate) | Build the first three; add the fourth only if time allows |
| D5 | OCR direction | Open-source engine or a cloud OCR service | Open-source engine; final choice in ARCHITECTURE.md |
| D6 | Uploaded-image retention | Delete on confirmation, or after a fixed number of days | Delete when the user confirms or discards the extraction, with a hard maximum of 7 days; confirm with legal review before real launch |
| D7 | Family members under 18 | Allow with dummy data in the demo, or restrict to adults | Allow with dummy data, minimum fields and permission checkbox; legal review before storing real children's data |
| D8 | Public disclosure of F8 | Private demos only, or public repository and video | Private demos and private repository until the patent agent advises; do not publish F8 before the filing decision |
| D9 | Product name | Keep "Sarthi" or rename | Keep for the capstone; rename before any public launch or trademark filing |
| D10 | Notification channels in MVP | In-app only, or add email | In-app only; email optional if time allows |
| D11 | Two-person approval for publishing | Required, or optional | Keep the Draft, In review and Published statuses; make two-person approval configurable and off by default for a small team |
| D12 | Success-criteria thresholds in Section 10.3 | Accept or change numbers | Accept as written |
| D13 | Eligibility status and grouping definitions (A3 to A7) | Accept or change | Accept as written |

---

## 13. Risks and Open Items

| ID | Risk or open item | Mitigation |
|---|---|---|
| R1 | F8 has High effort and depends on verified local data and tuned OCR | Limit to 3-4 document types and sample documents; manual-entry fallback; start data collection early |
| R2 | Scheme data accuracy and staleness | Hand-verify from official sources; show last-verified dates; freshness banner; feedback queue |
| R3 | OCR quality on phone photos | Capture guidance, pre-processing, confidence indicators, user correction |
| R4 | Assistant giving wrong or invented answers | Grounding, citations, safe refusal, do-not-invent rule, test set before demo |
| R5 | DPDP and children's data compliance | Consent per purpose, minimisation, retention rules, legal review before real launch |
| R6 | Patent novelty: similar public projects already show OCR, partial scoring and explainable rules | Keep the claim focused on the F8 combination, especially localized resolution; professional prior-art search and patent agent review |
| R7 | Public disclosure could affect patent options | Follow [D8] |
| R8 | Scope breadth (17 features) against capstone time | Respect tiers; cut Simplified features before Core |
| R9 | The name "Sarthi" is already used by other products in India | Follow [D9] |
| R10 | Local office and process data is missing for most districts | Pilot geography only; state-level fallback guidance |
| R11 | DigiLocker onboarding needs calendar time | Future; plan early if used after the capstone |

---

## 14. Glossary

- **Preliminary result:** a screening outcome from Sarthi, not an approval. The government authority decides.
- **Mandatory criterion:** a criterion that must pass for a scheme to be shown as Eligible.
- **Match score:** the F5 ordering score based on the profile. Not a confidence measure.
- **Document confidence score:** the F8 score based on the user's verified documents.
- **Hard-disqualifier:** a failed mandatory criterion that no document can fix.
- **Resolution path:** verified guidance on where and how to obtain a missing document in the user's district.
- **Resolution data:** the office, link, time, fee and items-to-carry content behind a resolution path.
- **CSC:** Common Service Centre, an assisted access point for government services.
- **RAG:** retrieval-augmented generation, where answers are written from retrieved verified content.
