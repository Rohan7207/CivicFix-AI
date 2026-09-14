# CivicFix — FRONTEND.md

**Project:** CivicFix
**Frontend Responsibility:** Citizen UI + Admin UI
**Status:** Frontend Source of Truth

---

# 1. Purpose

The frontend provides the user interface for CivicFix.

It communicates **only with the backend API**.

```text
Frontend → Backend → AI / MySQL / ImageKit
```

The frontend must never directly communicate with:

- MySQL
- AI service
- ImageKit private APIs

---

# 2. Core Citizen Flow

```text
Login
  ↓
Dashboard
  ↓
Report Issue
  ↓
Photo + Location
  ↓
Optional Description / Voice
  ↓
Submit
  ↓
AI Analysis
  ↓
Master Issue
  ↓
Priority + Department
  ↓
Track Status
  ↓
Fixed
  ↓
Verify
  ↓
Closed / Reopened
```

---

# 3. Complaint Form

The complaint form must contain:

### Required

- Photo
- Location

### Optional

- Description
- Voice

Valid combinations:

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

---

# 4. Photo

Photo upload is mandatory.

Frontend should provide:

- Image selection
- Preview
- Remove/replace
- Upload validation feedback

Backend performs the final validation and uploads the file to ImageKit.

Frontend must **not** contain ImageKit private credentials.

---

# 5. Voice

Voice recording/upload is optional.

Frontend should support:

- Record voice
- Stop recording
- Preview/playback
- Remove/replace

Backend handles validation and ImageKit storage.

---

# 6. Description

Description is optional.

Do not force the citizen to write text.

Example:

```text
Photo only → Valid
Photo + description → Valid
```

---

# 7. Location

Location is required.

Frontend should allow:

- Current location
- Map/location selection where applicable
- Latitude
- Longitude
- Address/location text when available

Backend validates the final coordinates.

---

# 8. Category

Do **not** make category selection mandatory.

The citizen reports the problem.

AI determines the category.

Frontend displays the AI-classified category after analysis.

---

# 9. Authentication

Use backend JWT authentication through **HttpOnly cookies**.

Do not store JWT in:

```text
localStorage
sessionStorage
```

Frontend handles:

- Register
- Login
- Logout
- Protected routes
- Authentication loading states
- Authentication errors

---

# 10. Roles

Supported roles in the current MVP:

```text
CITIZEN
ADMIN
```

There is no Department Admin or Super Admin role in the current active schema. Frontend role-based UI is only for display/navigation. Backend remains responsible for authorization.

---

# 11. Citizen Dashboard

Dashboard should show:

- Complaint/report count
- Active issues
- Recent reports
- Status
- Priority
- Category
- Department
- Nearby civic issues

Keep the dashboard simple and useful.

---

# 12. Complaint Details

Complaint detail should display:

```text
Photo / Evidence
Description
Location
Category
AI Summary
AI Severity
Safety Risk
AI Confidence
Priority
Department
Master Issue status/details, when applicable
Related report count, when applicable
Internal AI grouping logic should not be exposed to citizens.
Current Status
```

AI confidence comes from backend as:

```text
0–1
```

Frontend may display it as a percentage.

---

# 13. Master Issues

The current MVP does not automate Master Issue creation or AI-based issue fusion. The database supports a complaint-to-master-issue relationship through `complaints.master_issue_id`, but that relationship is not yet the result of a full AI grouping workflow.

Example conceptually:

```text
Several citizen reports
       ↓
One real-world civic problem
       ↓
One Master Issue record
```

Frontend should treat the Master Issue as a consolidated operational concept, while citizens continue to interact primarily with their own complaint status and evidence.

---

# 14. Nearby Issue Map

Citizen dashboard should support a nearby civic issue view.

Display:

- Issue location
- Category
- Priority
- Status
- Report count
- Short summary

Use:

```http
GET /issues/nearby
```

Frontend does not perform duplicate detection.

---

# 15. Status Tracking

Frontend displays the backend workflow:

```text
PENDING_AI_ANALYSIS
AI_ANALYZED
MASTER_LINKED
ASSIGNED
IN_PROGRESS
FIXED
AWAITING_VERIFICATION
CLOSED
```

Reopened flow:

```text
NOT_FIXED
   ↓
REOPENED
   ↓
IN_PROGRESS
```

Do not allow users to arbitrarily change status.

---

# 16. Citizen Verification

When an issue reaches:

```text
AWAITING_VERIFICATION
```

show:

```text
✓ Issue Fixed
✗ Issue Not Fixed
```

Optional verification comment may be provided.

Backend decides the resulting status.

---

# 17. API Contract

Frontend uses the backend response format.

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

Frontend should display useful error messages instead of exposing raw server errors.

---

# 18. Features NOT Currently Required

Do not implement:

```text
Phone number
Profile pictures
Moderator role
Refresh-token UI
JWT localStorage
Custom categories
Rich-text editor
Weather information
Time-of-day information
Estimated resolution time
Generic citizen comments
Full notification system
```

These can be added later only through an explicit requirement change.

---

# 19. Frontend Design Principles

Frontend should be:

- Responsive
- Mobile-friendly
- Accessible
- Simple
- Fast
- Consistent
- Component-based

Both desktop and mobile layouts must be considered.

Do not optimize only for desktop.

---

# 20. Frontend Responsibility Boundary

Frontend

↓

Collects citizen input

↓

Displays backend results

↓

Handles UI state

Backend

↓

Validates requests

↓

Stores complaint and evidence data

↓

Manages complaint and Master Issue relationships

↓

Controls authorization and workflow

↓

[Planned] Calls AI

↓

[Planned] Handles AI-based issue fusion

↓

[Planned] Applies AI priority recommendation

↓

## [Planned] Applies AI department recommendation

# 21. Development Rule

Implement frontend features according to the backend API contract.

Do not invent:

- New API fields
- New statuses
- New roles
- New AI outputs
- New workflow states

without updating the agreed contract first.

---

# 22. Cursor / VS Code Rule

When using an AI coding assistant:

1. Read `FRONTEND.md`.
2. Inspect the existing frontend.
3. Change only the required files.
4. Do not rewrite unrelated components.
5. Do not add unapproved features.
6. Test desktop and mobile.
7. Review the diff before committing.

---

# 23. One Rule to Remember

> **Frontend collects and displays. Backend decides. AI analyzes.**

---

**END OF FRONTEND.md**
