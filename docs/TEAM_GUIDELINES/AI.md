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
- Image Analysis
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

The current AI workflow is:

```text
Citizen Input
   ↓
Photo Analysis
   ↓
Optional Text / Voice Analysis
   ↓
Combined Evidence
   ↓
Issue Fusion
   ↓
Master Issue
   ↓
Evidence Analysis
   ↓
Priority Engine
   ↓
Priority Score + Level + Explanation
```

Photo and location are required by the application flow. Description and voice are optional.

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

### Image Analysis

Location:

```text
ai/imageAnalysis/
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

**Implemented and tested.**

### Evidence Engine

Location:

```text
ai/evidenceEngine/
```

Status:

**Implemented and tested.**

### Voice Analysis

Location:

```text
ai/voiceAnalysis/
```

Status:

**Implemented and tested.**

### AI orchestration

Location:

```text
ai/civicAI.js
```

Status:

**Implemented and tested for multimodal same-issue and conflicting-issue cases.**

---

## Pending

The following remain separate from the AI-side implementation:

```text
Backend integration
Production deployment
```

---

# 4. Complaint Analysis

Complaint Analysis converts citizen-provided complaint text into structured civic information.

The current implementation uses:

```text
Groq API
openai/gpt-oss-120b
```

The current output contains:

```json
{
  "category": "string",
  "severity": 1,
  "safetyRisk": "LOW",
  "confidence": 0.0,
  "department": "string",
  "shortSummary": "string",
  "language": "string",
  "englishTranslation": "string"
}
```

The implementation supports multilingual text complaints and has been tested with Kannada input.

---

# 5. Image Analysis

Image Analysis processes the mandatory complaint photo.

Location is not inferred from the image. Location is supplied separately by the application/backend flow.

The current output contains:

```json
{
  "isCivicIssue": true,
  "category": "Pothole",
  "severity": 8,
  "safetyRisk": "HIGH",
  "confidence": 0.95,
  "visualDescription": "string",
  "visibleEvidence": [
    "string"
  ]
}
```

The image layer has been tested with a civic road-damage image.

---

# 6. Issue Fusion

Issue Fusion determines whether multiple evidence sources describe the **same real-world physical issue**.

The current implementation considers:

- Category
- Physical location
- Description similarity
- Important keywords
- Physical landmarks
- Severity
- Physical issue similarity

Different categories or different physical problems should not be merged merely because the coordinates are the same.

The engine returns:

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

It has been tested with both matching and conflicting multimodal evidence.

---

# 7. Priority Engine

The Priority Engine calculates a deterministic priority score from **0–100**.

Current factors:

| Factor | Maximum |
|---|---:|
| Severity | 30 |
| Safety Risk | 25 |
| Report Count | 15 |
| Important Location | 10 |
| Duration | 10 |
| AI Confidence | 10 |
| **Total** | **100** |

Priority levels:

| Score | Level |
|---:|---|
| 85–100 | CRITICAL |
| 70–84 | HIGH |
| 40–69 | MEDIUM |
| 0–39 | LOW |

The deterministic scoring methodology remains unchanged.

---

# 8. Evidence Analysis

Evidence Analysis calculates a supporting-evidence score from the currently implemented factors.

The current implementation uses:

- Evidence-source count
- Location consistency
- Safety-risk agreement
- Average AI confidence

The engine returns:

```json
{
  "evidenceScore": 0,
  "evidenceLevel": "WEAK",
  "explanation": "string",
  "breakdown": {
    "reportScore": 0,
    "locationScore": 0,
    "safetyScore": 0,
    "confidenceScore": 0
  }
}
```

For multimodal input, evidence sources are distinct from citizen report count. One citizen can provide photo, text, and voice as multiple evidence sources for one report.

---

# 9. Voice Analysis

Voice processing is optional.

Current flow:

```text
Citizen Voice
      ↓
Speech-to-text
      ↓
Complaint Analysis
      ↓
Structured Complaint Information
```

The implemented flow supports spoken civic complaints in different languages and has been tested with a real audio input.

---

# 10. AI Orchestration

`ai/civicAI.js` coordinates the AI components.

Input rules:

```text
Photo       REQUIRED
Location    REQUIRED
Description OPTIONAL
Voice       OPTIONAL
```

Valid combinations:

```text
Photo + Location
Photo + Location + Description
Photo + Location + Voice
Photo + Location + Description + Voice
```

The orchestrator:

```text
Photo
  ↓
Image Analysis
  ↓
Optional Text / Voice Analysis
  ↓
Issue Fusion
  ↓
Evidence Analysis
  ↓
Priority Engine
  ↓
Master Issue / Final AI Result
```

When multimodal evidence describes different physical problems, the orchestrator returns the evidence separately instead of creating an empty Master Issue or treating the inputs as supporting evidence for one issue.

Citizen report count is kept separate from the number of evidence sources.

---

# 11. Backend Integration Boundary

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

AI must **not directly modify the MySQL database**.

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

# 12. Frontend Boundary

Member 3 must not directly modify frontend functionality unless the team explicitly agrees.

The frontend collects the mandatory Photo and Location and the optional Description and Voice.

AI provides analysis results that the Backend can expose through APIs.

---

# 13. File Ownership

Member 3 primarily works inside:

```text
ai/
docs/ai/
docs/TEAM_GUIDELINES/AI.md
```

Changes outside these areas require discussion with the responsible team member.

---

# 14. Technology Rules

Current AI implementation uses:

- JavaScript
- Node.js
- Groq SDK
- Groq LLM
- Vision-capable Groq model
- dotenv
- JSON

Text analysis currently uses:

```text
openai/gpt-oss-120b
```

The Image Analysis model is configured separately through the environment.

API keys must always be stored in environment variables.

Never commit:

```text
GROQ_API_KEY
```

---

# 15. Testing Requirements

Every AI component must have a dedicated or appropriate test.

The current Member 3 work has been tested for:

- Complaint analysis
- Multilingual complaint analysis
- Issue Fusion
- Evidence calculation
- Priority calculation
- Voice processing
- Image analysis
- Multimodal orchestration
- Same-issue evidence
- Conflicting-issue evidence

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

# 16. AI Output Contract

AI outputs must remain structured and predictable.

Do not casually change field names or data types.

The current implementation and the Backend contract still contain some field-name/type differences. These must be resolved with the Backend team before changing the shared integration contract.

---

# 17. Change Management

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

---

# 18. No Independent Feature Expansion

Do not add AI features simply because they seem useful.

The current implementation should remain focused on the approved CivicFix workflow.

---

# 19. Documentation Requirements

Whenever an AI component is completed or significantly changed:

1. Update its documentation.
2. Document its input.
3. Document its output.
4. Document important assumptions.
5. Document its implementation status.
6. Ensure documentation matches the actual code.

---

# 20. Git Rules

Member 3 must work on the assigned AI branch.

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

---

# 21. Pull Request Requirements

Every AI PR should clearly state:

- What was implemented
- What files were changed
- How it was tested
- Any API/output contract changes
- Any dependency changes
- Any remaining limitations

---

# 22. Definition of Done

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

# 23. Final Rule

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
