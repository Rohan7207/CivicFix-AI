# Complaints API

This document describes the currently implemented complaint and evidence endpoints and data model in the backend. It is intentionally minimal and hackathon-focused — AI, Issue Fusion, Master Issues, Priority, Department Assignment, Workflow, and Verification are not implemented here.

## 1. Purpose

Provide endpoints for citizens to submit civic complaints with photo evidence (optionally voice), and for authenticated users to read complaint records and associated evidence metadata.

## 2. Authentication

- Backend uses JWT stored in an HttpOnly cookie (see authentication docs).
- `CITIZEN` and `ADMIN` are the supported roles in this MVP.
- Only authenticated requests are accepted for the complaint endpoints.

## 3. Complaint Input

POST `/api/complaints` accepts `multipart/form-data` with the following fields:

- `photo` — required (file)
- `description` — optional (string)
- `voice` — optional (file)
- `latitude` — required (number)
- `longitude` — required (number)
- `address` — optional (string)

Notes:

- Location may also be supplied under a `location` object; latitude/longitude are mandatory values used by the backend.

## 4. File Validation

Photo

- Supported MIME types: `image/jpeg`, `image/png`, `image/webp`
- Maximum file size: 10 MB

Voice (optional)

- Supported MIME types: `audio/mpeg`, `audio/mp3`, `audio/wav`, `audio/x-wav`, `audio/webm`, `audio/ogg`, `audio/mp4`, `audio/m4a`
- Maximum file size: 25 MB

Description

- Maximum length: 1000 characters

Errors follow the standard response format (see section 11). Typical validation error codes used: `VALIDATION_ERROR`, `UNSUPPORTED_FILE_TYPE`, `FILE_TOO_LARGE`.

## 5. Photo Optimization

Before upload to ImageKit the backend applies a best-effort optimization step using Sharp with these parameters:

- Rotate to correct orientation
- Resize to fit within 1600x1600 (no enlargement)
- Output JPEG with quality 80 (mozjpeg enabled)

This optimization is applied only for image MIME types and happens in-memory before the ImageKit upload.

## 6. Evidence Storage

- Binary files (photo/voice) are stored in ImageKit.
- MySQL stores only evidence metadata:
  - `imagekit_url` (public URL returned by ImageKit)
  - `imagekit_file_id` (ImageKit file identifier)
  - `original_filename`
  - `mime_type`
  - `file_size`
  - `type` (`PHOTO` / `VOICE`)
- The backend never stores raw binary file content in MySQL.

## 7. Database Tables (implemented fields)

### `complaints`

- `id` (PK)
- `citizen_id` (FK → `users.id`)
- `description` (nullable)
- `latitude`
- `longitude`
- `address` (nullable)
- `master_issue_id` (nullable)
- `status` (string; initial value `PENDING_AI_ANALYSIS`)
- `created_at`
- `updated_at`

### `complaint_evidence`

- `id` (PK)
- `complaint_id` (FK → `complaints.id`)
- `type` (`PHOTO` / `VOICE`)
- `imagekit_url`
- `imagekit_file_id`
- `original_filename`
- `mime_type`
- `file_size`
- `created_at`

## 8. Endpoints (implemented)

- POST `/api/complaints` — Create a complaint with evidence (multipart/form-data). `CITIZEN` only.
- GET `/api/complaints` — List complaints visible to the caller. `CITIZEN` sees their own complaints; `ADMIN` can view across the system.
- GET `/api/complaints/:id` — Retrieve a complaint and its evidence metadata if the caller is authorized.

> The implementation also mounts the complaints router at `/complaints` for convenience; the canonical documented endpoints use `/api/complaints`.

## 9. Complaint Creation Flow

Authentication → Validation → File optimization (Sharp) → ImageKit upload → MySQL transaction → Create `complaints` row and `complaint_evidence` rows → Commit → return created complaint + evidence metadata.

- If ImageKit upload fails, the complaint is not created.
- If the DB transaction fails after upload, the current implementation attempts best-effort cleanup of uploaded ImageKit files and returns an error.

## 10. Authorization

- Only `CITIZEN` may create complaints.
- `CITIZEN` may only access their own complaints.
- `ADMIN` may view complaints across the system.

Authorization decisions live in the service/controller layer.

## 11. Response Format

All endpoints follow the project standard JSON wrapper.

Success:

```json
{
  "success": true,
  "data": {
    /* endpoint-specific payload */
  }
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR" /* or other error code */,
    "message": "..."
  }
}
```

POST `/api/complaints` success example:

```json
{
  "success": true,
  "data": {
    "complaint": {
      "id": 123,
      "citizen_id": 10,
      "status": "PENDING_AI_ANALYSIS",
      "created_at": "..."
    },
    "evidence": [
      {
        "id": 1,
        "type": "PHOTO",
        "imagekit_url": "...",
        "imagekit_file_id": "..."
      }
    ]
  }
}
```

## 12. Current Status

These endpoints and validations have been implemented in the backend and exercised by the project's current tests and manual checks. AI analysis, Issue Fusion, Master Issue linking, Priority Engine, Department Assignment, Workflow transitions, and Verification are NOT implemented in these endpoints and are explicitly out-of-scope for the current MVP.

---

Document maintained for the hackathon MVP. Keep concise; if you extend the complaint workflow (AI, fusion, master issues), document those features separately when implemented.
