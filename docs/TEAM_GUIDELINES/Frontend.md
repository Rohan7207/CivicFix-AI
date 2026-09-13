# CivicFix — BACKEND.md

**Role:** Member 2 — Backend, Database & Civic Workflow
**Stack:** Node.js + Express.js + MySQL + JWT + ImageKit
**Purpose:** Backend implementation source of truth

---

# 1. Architecture

```text
Frontend
   ↓
Backend API
   ├── MySQL       → structured data
   ├── ImageKit    → photos / voice
   └── AI Service  → analysis
```

### Responsibility

**Frontend**

- Collect input
- Display results
- Handle UI state

**Backend**

- Auth
- Validation
- Database
- ImageKit
- AI orchestration
- Issue Fusion
- Master Issues
- Priority
- Department assignment
- Workflow
- Verification

**AI**

- Analyze complaints/evidence
- Return recommendations/signals

> Backend is always authoritative.

---

# 2. Complaint Contract

### Required

```text
photo
location
  ├── latitude
  └── longitude
```

### Optional

```text
description
voice
address
```

Valid:

```text
Photo
Photo + Description
Photo + Voice
Photo + Description + Voice
```

Invalid:

```text
No Photo
No Location
```

Category is **not selected by the citizen**. AI determines it.

---

# 3. Evidence Storage

Use **ImageKit** for:

```text
PHOTO
VOICE
```

MySQL stores only:

```text
imagekit_url
imagekit_file_id
original_filename
mime_type
file_size
type
```

Never store binary files in MySQL.

### Photo

- Mandatory
- JPEG / PNG / WEBP
- Maximum 10 MB initially

### Voice

- Optional
- Validate MIME type and size

ImageKit private credentials stay in `.env`.

---

# 4. Authentication

Use:

```text
JWT + HttpOnly Cookie
```

Do **not** use:

```text
localStorage
sessionStorage
```

Roles:

```text
CITIZEN
ADMIN
```

No Moderator role.

Backend must enforce authorization; frontend role checks are only for UI.

---

# 5. Main Database Tables

```text
users
departments
complaints
complaint_evidence
complaint_ai_analysis
master_issues
issue_status_history
issue_verifications
```

### complaints

```text
id
citizen_id
description        nullable
latitude
longitude
address            nullable
master_issue_id    nullable
status
created_at
updated_at
```

### complaint_evidence

```text
id
complaint_id
type               PHOTO / VOICE
imagekit_url
imagekit_file_id
original_filename
mime_type
file_size
created_at
```

### complaint_ai_analysis

```text
id
complaint_id
category
severity
safety_risk
confidence
recommended_department
summary
detected_language
analysis_version
created_at
updated_at
```

### master_issues

```text
id
category
title/summary
latitude
longitude
priority
status
department_id
created_at
updated_at
```

---

# 6. Complaint API

### Create

```http
POST /complaints
```

`multipart/form-data`

```text
photo       required
description optional
voice       optional
latitude    required
longitude   required
address     optional
```

### List

```http
GET /complaints
```

Support pagination and useful filters.

### Details

```http
GET /complaints/:id
```

Return complaint, evidence, AI analysis, Master Issue, priority, department and status.

---

# 7. Complaint Creation Flow

```text
Authenticate
    ↓
Validate input
    ↓
Validate photo/voice
    ↓
Upload evidence → ImageKit
    ↓
Create complaint + evidence → MySQL
    ↓
Commit
    ↓
AI analysis
    ↓
Issue Fusion
    ↓
Master Issue
    ↓
Priority
    ↓
Department assignment
```

If ImageKit fails:

```text
Do not create the complaint.
```

If AI fails:

```text
Keep complaint + evidence.
Allow AI retry.
```

---

# 8. AI Contract

Backend calls AI. Frontend never calls AI directly.

AI returns:

```json
{
  "category": "ROAD_DAMAGE",
  "severity": "HIGH",
  "safetyRisk": true,
  "confidence": 0.91,
  "recommendedDepartment": "ROADS",
  "summary": "Large pothole creating a traffic safety risk.",
  "detectedLanguage": "en"
}
```

### Confidence

Always:

```text
0–1
```

Example:

```text
0.91
```

### Important

AI severity ≠ final priority.

Backend validates every AI response before storing it.

---

# 9. Issue Fusion

Issue Fusion determines whether multiple reports represent the same real-world issue.

Consider:

```text
location
category
description
photo/evidence
AI analysis
nearby existing issues
```

Multiple complaints may connect to one:

```text
Master Issue
```

Do not merge issues using only category or distance.

---

# 10. Master Issue

A Master Issue represents the real civic problem.

Example:

```text
Master Issue
├── Category: ROAD_DAMAGE
├── Reports: 7
├── Priority: HIGH
├── Department: Roads
└── Status: IN_PROGRESS
```

Multiple complaints can belong to one Master Issue.

`reportCount` should be available through the API.

---

# 11. Priority Engine

Final priority is determined by the **backend**, not AI.

Possible inputs:

```text
AI severity
AI safety risk
AI confidence
report count
issue context
```

Output:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

The scoring formula must be explicitly defined before implementation.

Do not invent a complex formula without agreement.

---

# 12. Department Assignment

AI can recommend a department.

Backend validates and performs the final assignment.

```text
AI recommendation
       ↓
Backend rules
       ↓
Department assignment
```

---

# 13. Civic Workflow

Allowed flow:

```text
PENDING_AI_ANALYSIS
        ↓
AI_ANALYZED
        ↓
MASTER_LINKED
        ↓
ASSIGNED
        ↓
IN_PROGRESS
        ↓
FIXED
        ↓
AWAITING_VERIFICATION
        ↓
CLOSED
```

Failed verification:

```text
AWAITING_VERIFICATION
        ↓
REOPENED
        ↓
IN_PROGRESS
```

Frontend cannot arbitrarily change status.

Backend validates every transition.

---

# 14. Verification

Table:

```text
issue_verifications
├── id
├── master_issue_id
├── citizen_id
├── result
├── comment
└── created_at
```

Results:

```text
VERIFIED
NOT_FIXED
```

`NOT_FIXED` causes the issue to reopen.

---

# 15. Nearby Issues

Endpoint:

```http
GET /issues/nearby?latitude=&longitude=&radius=
```

Return Master Issues containing:

```text
masterIssueId
latitude
longitude
category
priority
status
reportCount
summary
```

Frontend only displays them.

Backend performs the actual geographic filtering.

---

# 16. Dashboard

```http
GET /dashboard
```

Can provide:

```text
Complaint counts
Status counts
Recent reports
Active issues
```

Keep the response structured and frontend-independent.

---

# 17. API Response Format

### Success

```json
{
  "success": true,
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Photo is required."
  }
}
```

Common errors:

```text
VALIDATION_ERROR
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
CONFLICT
FILE_TOO_LARGE
UNSUPPORTED_FILE_TYPE
UPLOAD_FAILED
AI_ANALYSIS_FAILED
INVALID_STATUS_TRANSITION
INTERNAL_SERVER_ERROR
```

---

# 18. Security

Must have:

- Password hashing
- JWT HttpOnly cookies
- Input validation
- Parameterized SQL
- Authorization middleware
- Ownership checks
- File validation
- AI response validation
- Secure production cookies
- Explicit CORS origin

Never expose:

```text
JWT_SECRET
IMAGEKIT_PRIVATE_KEY
AI_API_KEY
password hashes
```

---

# 19. Environment Variables

```env
PORT=

DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=

JWT_SECRET=
JWT_EXPIRES_IN=

IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=

AI_BASE_URL=
AI_API_KEY=

FRONTEND_URL=
```

Never commit `.env`.

---

# 20. Frontend Compatibility

Preferred complaint routes:

```http
POST /complaints
GET /complaints
GET /complaints/:id
```

If the existing frontend already uses:

```http
/issues/report
/issues
/issues/:id
```

do not break it accidentally.

Migrate frontend and backend together or temporarily alias the route.

Do not maintain two separate implementations.

---

# 21. Development Order

Implement in this order:

```text
1. Backend foundation
2. Authentication
3. ImageKit evidence
4. Complaint APIs
5. AI integration
6. Issue Fusion
7. Master Issues
8. Priority Engine
9. Department Assignment
10. Civic Workflow
11. Verification
12. Dashboard / Nearby Issues
```

Do not implement future phases early.

---

# 22. Cursor / VS Code Rules

When using Cursor/Copilot:

1. Read `BACKEND.md`.
2. Inspect the existing code first.
3. Identify exact files to change.
4. Explain why those files need changes.
5. Implement only the current requirement.
6. Do not rewrite unrelated code.
7. Do not add unapproved features.
8. Test the change.
9. Review `git diff`.
10. Commit only related changes.

### Never ask AI to:

```text
"Rewrite the whole backend."
"Improve everything."
"Add all CivicFix features."
```

Instead:

```text
Implement only Phase X from BACKEND.md.
```

---

# 23. Features Currently Out of Scope

Do not implement unless explicitly approved:

```text
Phone number
Profile pictures
Moderator role
Refresh tokens
JWT localStorage
Custom citizen categories
Rich text editor
Weather integration
Time-of-day analysis
Estimated resolution time
Generic comments
Full notification system
```

---

# 24. Definition of Done

A backend feature is complete when:

```text
✓ Requirement implemented
✓ Validation added
✓ Authorization checked
✓ Database consistency maintained
✓ Error handling added
✓ API contract followed
✓ Tests pass
✓ No secrets committed
✓ No unrelated code changed
✓ Git diff reviewed
```

---

# 25. Core Rule

> **Citizen reports. AI analyzes. Backend decides and orchestrates. MySQL stores structured data. ImageKit stores evidence. Frontend displays the result.**

**END OF BACKEND.md**
