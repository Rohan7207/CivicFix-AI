# CivicFix AI — Member 3 Guidelines

> **This document is the mandatory work contract for Member 3 (AI).**
>
> Member 3 must follow these requirements when developing, modifying, testing, or integrating the AI layer.
>
> The centralized `docs/TEAM_GUIDELINES/README.md` is the overall project source of truth. If this document conflicts with the central README, the team must discuss and resolve the conflict before implementation.

---

# 1. Member 3 Responsibility

Member 3 is responsible for the **AI layer of CivicFix AI**.

The AI layer is responsible for:

- Complaint Analysis
- Issue Fusion / Duplicate Detection
- Priority Engine
- Evidence Analysis
- Voice Analysis
- AI orchestration
- AI-side testing
- AI-side documentation

Backend/API integration is owned by the Backend team.

Frontend/UI implementation is owned by the Frontend team.

---

# 2. Current AI Architecture

The intended AI workflow is:

```text
Citizen Complaint
       ↓
Complaint Analysis
       ↓
Structured Complaint
       ↓
Issue Fusion
       ↓
Master Issue
       ↓
Priority Engine
       ↓
Priority Score + Level + Explanation
```

Additional AI components may provide evidence or voice information to this workflow.

---

# 3. Current Implementation Status

## Completed

### Complaint Analysis

Location:

```text
ai/complaintAnalysis/
```

Status:

**Implemented and tested.**

### Issue Fusion

Location:

```text
ai/issueFusion/
```

Status:

**Implemented and tested.**

### Priority Engine

Location:

```text
ai/priorityEngine/
```

Status:

**Implemented with dedicated testing.**

---

## Not Completed

The following must **not** be represented as completed until properly implemented and tested:

```text
Evidence Engine
Voice Analysis
AI orchestration
Backend integration
Production deployment
```

Locations:

```text
ai/evidenceEngine/
ai/voiceAnalysis/
ai/civicAI.js
```

---

# 4. Complaint Analysis

Complaint Analysis converts citizen-provided complaint information into structured civic information.

The current implementation uses:

```text
Groq API
openai/gpt-oss-120b
```

### Expected information

The analysis should provide:

```json
{
  "category": "string",
  "severity": 1,
  "safetyRisk": "LOW",
  "confidence": 0.0,
  "department": "string",
  "shortSummary": "string",
  "language": "string"
}
```

### Supported categories

- Pothole
- Garbage
- Streetlight
- Water Leakage
- Drainage
- Road Damage
- Traffic Signal
- Public Property Damage
- Other

### Rules

- `severity` must follow the agreed 1–10 scale.
- `safetyRisk` must use the agreed risk values.
- `confidence` must represent the model's confidence.
- `shortSummary` should be concise and useful for downstream processing.
- Multilingual complaints must be supported.
- The AI must not assume that all complaints are written in English.

---

# 5. Issue Fusion

Issue Fusion determines whether multiple citizen reports describe the **same real-world physical issue**.

Location:

```text
ai/issueFusion/
```

The decision should consider:

- Category
- Physical location
- Description similarity
- Keywords
- Landmarks
- Severity
- Other relevant evidence

### Core rule

Different wording does **not** automatically mean different issues.

Different physical locations normally indicate different issues.

If evidence is insufficient, the system should avoid incorrectly merging reports.

### Expected output

```json
{
  "isSameIssue": true,
  "confidence": 0.0,
  "masterIssue": {
    "category": "string",
    "title": "string",
    "summary": "string"
  },
  "reason": "string"
}
```

The `reason` must explain why the reports were considered the same or different.

---

# 6. Priority Engine

The Priority Engine calculates the urgency of a civic issue.

It is currently **deterministic**, not an LLM-generated priority label.

The score ranges from:

```text
0–100
```

### Factors

| Factor             | Maximum |
| ------------------ | ------: |
| Severity           |      30 |
| Safety Risk        |      25 |
| Report Count       |      15 |
| Important Location |      10 |
| Duration           |      10 |
| AI Confidence      |      10 |
| **Total**          | **100** |

### Priority levels

|  Score | Level    |
| -----: | -------- |
| 85–100 | CRITICAL |
|  70–84 | HIGH     |
|  40–69 | MEDIUM   |
|   0–39 | LOW      |

The engine must provide:

- Priority score
- Priority level
- Explanation
- Score breakdown

The deterministic calculation must remain transparent and reproducible.

---

# 7. Evidence Analysis

Evidence Analysis is part of the planned AI architecture but is **not currently considered completed**.

The mandatory rule is:

> Do not mark or document Evidence Analysis as completed until implementation and testing are finished.

When implemented, it must integrate with the approved CivicFix workflow without independently changing backend records.

---

# 8. Voice Analysis

Voice processing is planned but **not currently considered completed**.

When implemented:

```text
Citizen Voice
      ↓
Voice Processing / Transcription
      ↓
Complaint Information
      ↓
Complaint Analysis
```

Voice is optional for a complaint.

The AI member must not assume that voice processing is complete merely because the folder or prompt exists.

---

# 9. AI Orchestration

`ai/civicAI.js` is intended to coordinate the AI components.

However, orchestration must not be treated as completed until it is actually implemented, tested, and integrated with the agreed workflow.

The intended flow is:

```text
Input
 ↓
Complaint Analysis
 ↓
Issue Fusion
 ↓
Priority
 ↓
Final AI Result
```

The exact orchestration contract must be discussed with the Backend team before backend integration.

---

# 10. Backend Integration Boundary

The Backend team owns:

- Express routes
- Controllers
- Services
- Database operations
- Authentication
- Authorization
- Validation
- Workflow state changes
- API responses
- Persistence

The AI member owns:

- AI logic
- AI prompts
- AI models
- AI processing
- AI outputs
- AI-side validation
- AI tests

### Important

AI must **not directly modify the MySQL database**.

AI should return structured results to the Backend.

```text
Backend
   ↓
AI
   ↓
Structured Result
   ↓
Backend validation
   ↓
Database
```

---

# 11. Frontend Boundary

Member 3 must not directly modify frontend functionality unless the team explicitly agrees.

Frontend owns:

```text
client/
```

AI provides data/results that the Backend can expose through APIs.

The AI member must not create frontend-specific logic inside the AI layer.

---

# 12. File Ownership

Member 3 primarily works inside:

```text
ai/
docs/ai/
docs/TEAM_GUIDELINES/AI.md
```

Changes outside these areas require discussion with the responsible team member.

Do not modify Backend or Frontend files merely to make AI development easier.

If integration requires changes outside the AI area, coordinate with the relevant member first.

---

# 13. Technology Rules

Current AI implementation uses:

- JavaScript
- Node.js
- Groq SDK
- Groq LLM
- dotenv
- JSON

Current LLM:

```text
openai/gpt-oss-120b
```

API keys must always be stored in environment variables.

Never commit:

```text
GROQ_API_KEY
```

or any other secret/API credential.

---

# 14. Testing Requirements

Every AI component must have a dedicated or appropriate test.

At minimum, testing should verify:

- Valid input
- Expected structured output
- Invalid/unexpected model output
- JSON parsing
- Important boundary conditions
- Multilingual input where applicable
- Confidence/severity/risk values
- Fusion decisions
- Priority calculations

A feature is not considered completed merely because the source file exists.

It must be:

```text
Implemented
   ↓
Tested
   ↓
Verified
   ↓
Documented
```

---

# 15. AI Output Contract

AI outputs must remain structured and predictable.

Do not casually change field names or data types.

For example, changing:

```text
severity
```

to:

```text
severityScore
```

can break Backend integration.

Any change to an agreed AI output contract must be discussed with the Backend member before implementation.

---

# 16. Change Management

Member 3 must discuss before:

- Changing AI output fields
- Changing major AI workflow
- Changing model
- Changing scoring methodology
- Changing priority thresholds
- Changing Issue Fusion rules
- Adding a new AI component
- Removing an existing AI component
- Changing integration contracts
- Modifying Backend-owned files
- Modifying Frontend-owned files

Small internal improvements that do not affect contracts may be implemented normally.

---

# 17. No Independent Feature Expansion

Do not add AI features simply because they seem useful.

Examples:

- New AI agents
- Chatbot
- Recommendation system
- Sentiment analysis
- Predictive maintenance
- New scoring factors
- New categories

These require team discussion first.

The hackathon implementation should prioritize the approved CivicFix workflow.

---

# 18. Documentation Requirements

Whenever an AI component is completed or significantly changed:

1. Update its documentation.
2. Document its input.
3. Document its output.
4. Document important assumptions.
5. Document its implementation status.
6. Ensure documentation matches the actual code.

Never document unfinished work as completed.

---

# 19. Git Rules

Member 3 must work on the assigned AI branch.

Do not directly push AI work to `main`.

Before creating a Pull Request:

```text
Test the implementation
        ↓
Review changed files
        ↓
Remove unrelated changes
        ↓
Commit
        ↓
Push branch
        ↓
Create Pull Request
```

The PR should contain only the intended AI work.

---

# 20. Pull Request Requirements

Every AI PR should clearly state:

- What was implemented
- What files were changed
- How it was tested
- Any API/output contract changes
- Any dependency changes
- Any remaining limitations

Do not include unrelated frontend/backend changes in an AI PR.

---

# 21. Definition of Done

An AI feature is considered **DONE** only when:

- [ ] Implementation is complete
- [ ] Expected input/output is defined
- [ ] Tests are available
- [ ] Tests pass
- [ ] Error/invalid output handling is considered
- [ ] Documentation is updated
- [ ] Backend integration contract is agreed where required
- [ ] No unrelated files are changed
- [ ] PR is reviewed and merged

---

# 22. Final Rule

> **Do not assume. Do not independently change shared contracts. Do not mark unfinished work as completed.**

When a change affects another team member's work:

```text
Discuss
   ↓
Agree
   ↓
Implement
   ↓
Test
   ↓
Document
   ↓
PR
```

The goal is not simply to build individual AI components.

The goal is to make the AI layer work reliably as one part of the complete CivicFix workflow.
