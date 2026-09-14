# CivicFix Master Issue

## 1. Purpose

A complaint is a single citizen report. A Master Issue represents the real-world civic problem behind one or more related complaints.

Example:

- Complaint 101: pothole on Main Street
- Complaint 108: large pothole nearby
- Complaint 115: road damage near same location
- Complaint 127: another report for the same road defect

These may later be treated as one Master Issue: a single road defect that multiple citizens reported.

The Master Issue is therefore the consolidated representation of the underlying civic problem. The complaint remains the individual report, with its own evidence and status history.

## 2. Relationship

Current relationship in the codebase:

```text
Citizen Complaint
      ↓
complaints.master_issue_id
      ↓
master_issues.id
```

Important points:

- A complaint is an individual report submitted by a citizen.
- A Master Issue represents the larger real-world issue being tracked.
- Multiple complaints can point to the same Master Issue.
- `complaints.master_issue_id` is nullable, so a complaint may exist independently before it is grouped.
- The current implementation does not assume every complaint already belongs to a Master Issue.

## 3. Current database schema

This reflects the actual schema in `database/schema.sql`.

### `master_issues`

```sql
CREATE TABLE IF NOT EXISTS master_issues (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  department_id BIGINT UNSIGNED NOT NULL,
  code VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  severity ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_master_issues_code (code),
  KEY idx_master_issues_department_id (department_id),
  KEY idx_master_issues_severity (severity),
  CONSTRAINT fk_master_issues_department FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### `complaints`

```sql
CREATE TABLE IF NOT EXISTS complaints (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  citizen_id BIGINT UNSIGNED NOT NULL,
  description TEXT NULL,
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  address VARCHAR(255) NULL,
  master_issue_id BIGINT UNSIGNED DEFAULT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING_AI_ANALYSIS',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_complaints_citizen_id (citizen_id),
  KEY idx_complaints_status (status),
  KEY idx_complaints_created_at (created_at),
  CONSTRAINT fk_complaints_citizen FOREIGN KEY (citizen_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_complaints_master_issue FOREIGN KEY (master_issue_id) REFERENCES master_issues (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### `complaint_evidence`

```sql
CREATE TABLE IF NOT EXISTS complaint_evidence (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  complaint_id BIGINT UNSIGNED NOT NULL,
  type ENUM('PHOTO','VOICE') NOT NULL,
  imagekit_url VARCHAR(2048) NOT NULL,
  imagekit_file_id VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_complaint_evidence_complaint_id (complaint_id),
  CONSTRAINT fk_complaint_evidence_complaint FOREIGN KEY (complaint_id) REFERENCES complaints (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Users and roles

The current schema uses only:

```text
CITIZEN
ADMIN
```

There is no `DEPARTMENT_ADMIN` or `SUPER_ADMIN` in the current active schema.

## 4. Master Issue lifecycle

The intended civic workflow is:

```text
Citizen Report
    ↓
Evidence stored
    ↓
AI Analysis
    ↓
Duplicate / related issue detection
    ↓
Existing Master Issue OR create new Master Issue
    ↓
Priority
    ↓
Department handling
    ↓
In Progress
    ↓
Fixed
    ↓
Citizen Verification
    ↓
Closed / Reopened
```

### CURRENT backend capability

At the time of this document, the backend currently supports:

- complaint creation
- evidence upload and metadata storage
- complaint records with an optional `master_issue_id`
- admin-managed master-issue records in MySQL
- complaint lookup by complaint or by `master_issue_id` grouping

The schema and backend do not currently implement end-to-end AI-driven grouping, duplicate detection, or automated master issue creation.

### PLANNED workflow

The following is the intended future flow for the project, but it is not yet automated in the current implementation:

- AI analyzes complaint and evidence
- AI identifies whether multiple reports refer to the same real-world issue
- Backend validates the AI result
- Backend links one or more complaints to an existing Master Issue or creates a new one
- Priority and department handling follow later backend workflow steps

This should remain backend-owned and database-authoritative.

## 5. Complaint ↔ Master Issue behavior

The current MVP keeps these responsibilities separate:

- Complaint = one citizen report
- Master Issue = the consolidated real-world civic problem

Behavior:

- A complaint may start as a standalone issue with `master_issue_id = NULL`.
- A complaint may later be associated with a Master Issue when backend logic or future AI grouping determines it belongs there.
- A Master Issue can accumulate multiple complaints that describe the same underlying issue.
- The complaint keeps its own evidence, status, and citizen ownership.
- The Master Issue is the shared grouped representation, not a replacement for the complaint row itself.

## 6. Evidence relationship

The current evidence architecture is fixed and minimal:

- Photo is mandatory for complaint submission.
- Voice is optional.
- Description is optional.
- Location is required.
- Binary files are stored in ImageKit.
- MySQL stores only metadata and file references.

Current stored metadata in `complaint_evidence` includes:

- `type` (`PHOTO` or `VOICE`)
- `imagekit_url`
- `imagekit_file_id`
- `original_filename`
- `mime_type`
- `file_size`

No binary evidence is stored directly in MySQL.

This separation remains true even when multiple complaints are connected to one Master Issue. The evidence stays with the original complaint; the Master Issue is a higher-level grouping concept.

## 7. Visibility rules

### Citizen

Citizens should see:

- their own complaint submission
- complaint status and progress
- evidence/status updates relevant to their report
- not internal AI-grouping logic or backend internals

Citizens should not be expected to understand or manage the internal Master Issue structure.

### Admin

Admins may review:

- Master Issue records
- linked complaints under a Master Issue
- issue grouping, when the backend supports it
- complaint details that are relevant to operational review

The current admin visibility is operational and backend-focused. It does not expose unnecessary internal AI processing details to normal citizens.

## 8. Current vs Future

### CURRENT

- complaint creation works
- evidence upload/storage works
- ImageKit + MySQL evidence split is in place
- `complaints.master_issue_id` relationship exists in the schema
- admin-facing master issue records can be managed at the backend/database level
- current Master Issue behavior is minimal and data-relationship focused

### FUTURE / TOMORROW

The following are planned but not implemented in the current codebase:

- AI analysis
- damage / non-damage classification
- duplicate detection
- issue fusion / grouping
- automatic Master Issue creation or selection
- AI priority recommendation
- department recommendation

These should be added only when the backend contract and schema are explicitly extended.

## 9. API

The current backend includes the following admin-only Master Issue management endpoints:

- `POST /api/master-issues`
- `GET /api/master-issues`
- `GET /api/master-issues/:id`
- `GET /api/master-issues/:id/complaints`
- `PATCH /api/master-issues/:id`

These endpoints manage the MySQL `master_issues` records and complaint grouping metadata. They are not a substitute for AI issue-fusion automation.

No AI API calls or AI integration are implemented in this part of the backend.

## 10. Design principles

- Keep the MVP minimal.
- Do not add unnecessary entities or duplication.
- Keep `users`, `complaints`, and `master_issues` separate but connected by `master_issue_id`.
- Keep complaint evidence in ImageKit and metadata in MySQL.
- Do not force citizen users to consume internal Master Issue logic.
- Keep the backend authoritative over data relationships.
- Use the current schema, not older assumptions.

## 11. Summary

The Master Issue model in CivicFix is a backend-level representation of a real civic problem that may include multiple individual complaint reports. The current schema already supports the relationship through `complaints.master_issue_id` pointing to `master_issues.id`, but the full AI-powered grouping workflow remains future work.

This keeps the MVP stable: complaints are recorded individually, evidence is stored safely, and master issue grouping remains a clear future step rather than an invented feature.
