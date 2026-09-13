# CivicFix AI — Team Guidelines

> **This document is the single source of truth for the CivicFix AI team.**
>
> Team members must follow the approved requirements here. Do not independently add, remove, or redesign major features without discussing them with the team first.

---

## 1. Core Product Goal

CivicFix AI is a civic issue reporting and resolution platform that helps citizens report problems, combines duplicate reports into real-world issues, assigns them to the appropriate authority, and allows citizens to verify whether the issue was actually resolved.

---

## 2. Core Workflow

```text
Citizen
   ↓
Report / Existing Issue
   ↓
AI Analysis
   ↓
Location
   ↓
Issue Fusion / Duplicate Detection
   ↓
Master Issue
   ↓
Priority
   ↓
Department Assignment
   ↓
In Progress
   ↓
Fixed / Resolved
   ↓
Citizen Verification
   ↓
Closed
   ↓
Reopened (if not actually fixed)
```

---

# 3. Citizen Features

### 3.1 Authentication

- Register
- Login
- Logout

### 3.2 Nearby Public Issues

Citizens can see nearby active/public civic issues on a map.

Each issue should expose basic information such as:

- Category
- Location
- Status
- Priority
- Number of related citizen reports

### 3.3 Report an Issue

A new complaint must contain:

- **Photo — mandatory**
- Text description — optional
- Voice — optional
- Location — required

Supported submission combinations:

```text
Photo
Photo + Text
Photo + Voice
Photo + Text + Voice
```

### 3.4 Existing Issue Support

Before creating a completely new issue, a citizen should be able to identify an already reported nearby issue.

If the same real-world issue already exists:

```text
Citizen → Existing Issue → Add Evidence / Support
```

If it is genuinely different:

```text
Citizen → New Complaint
```

This prevents multiple independent complaints for the same pothole, garbage pile, broken streetlight, etc.

### 3.5 Complaint Tracking

Citizens can:

- View their complaints
- Open complaint details
- See current status
- Track progress

### 3.6 Resolution Verification

After an authority marks an issue as resolved:

```text
Resolved
   ↓
Citizen Verification
   ↓
 ┌───────────────┐
 │               │
Fixed         Not Fixed
 │               │
Closed         Reopened
```

---

# 4. Important Rule

All future frontend, backend, and AI implementation must support this workflow.

If a proposed feature changes the workflow, data model, API contract, or responsibilities of another team member, discuss it with the team before implementation.

---

# 5. AI Requirements

CivicFix AI will use AI at multiple stages of the civic issue workflow.

## 5.1 Complaint Analysis

Analyze the citizen's complaint and determine:

- Category
- Severity
- Safety risk
- Confidence
- Recommended department
- Short summary
- Detected language

Supported categories:

- Pothole
- Garbage
- Streetlight
- Water Leakage
- Drainage
- Road Damage
- Traffic Signal
- Public Property Damage
- Other

---

## 5.2 Evidence / Image Analysis

Analyze the mandatory complaint photo to determine useful evidence about the reported civic issue.

The result should contribute to the overall complaint/issue assessment.

---

## 5.3 Voice Analysis

If the citizen provides voice:

```text
Voice → Transcription / Voice Analysis → Complaint Information

The resulting information can be used together with the citizen's text and photo.

Voice is optional.

---

## 6.4 Issue Fusion / Duplicate Detection

Determine whether multiple citizen reports refer to the same real-world civic issue.

The decision should consider:

Category
Physical location
Description similarity
Keywords
Landmarks
Severity
Evidence

If reports describe the same physical issue, they should contribute to the same Master Issue instead of creating unnecessary separate issues.

## 6.5 Priority Engine

Calculate the final priority of an issue using available information such as:

Severity
Safety risk
Evidence
Number of related reports
Other approved civic factors

The calculated priority is used by the backend workflow for handling and assignment.

## 6.6 AI Integration Rule

AI provides analysis and recommendations.

The Backend remains responsible for business logic, database updates, authentication, workflow transitions, and final data persistence.

AI must not independently modify the database.

This is enough for the **central README**. Detailed model/prompt/input-output implementation will go into `AI.md` later, after you give me the remaining AI documentation.
```
