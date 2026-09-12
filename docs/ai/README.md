# CivicFix AI — AI Architecture

## 1. Overview

CivicFix AI is an AI-powered civic issue intelligence platform designed to transform citizen complaints into structured civic information, consolidate reports that describe the same real-world issue, and assign an explainable priority to issues.

**Member 3 responsibility:** AI development.

The current AI foundation consists of:

1. Complaint Analysis
2. Issue Fusion
3. Priority Engine

The AI layer is developed separately from the frontend and backend. Backend/API integration is pending and is handled by the backend team.

## 2. Current AI Architecture

```text
Citizen Complaint
       |
       v
+----------------------+
| Complaint Analysis   |
+----------+-----------+
           |
           v
   Structured Complaint
           |
           v
+----------------------+
| Issue Fusion         |
+----------+-----------+
           |
           v
      Master Issue
           |
           v
+----------------------+
| Priority Engine      |
+----------+-----------+
           |
           v
Priority Score
+ Priority Level
+ Explanation
```

### Component responsibilities

| Component | Location | Purpose | Current status |
|---|---|---|---|
| Complaint Analysis | `ai/complaintAnalysis/` | Converts a complaint into structured civic information | Implemented and tested |
| Issue Fusion | `ai/issueFusion/` | Determines whether multiple reports describe the same physical issue and creates a master issue | Implemented and tested |
| Priority Engine | `ai/priorityEngine/` | Calculates a deterministic 0–100 priority score and explanation | Implemented; test available |
| Evidence Engine | `ai/evidenceEngine/` | Additional evidence scoring | In development / not treated as completed |
| Voice Analysis | `ai/voiceAnalysis/` | Voice-related processing | Not treated as completed |
| AI orchestration | `ai/civicAI.js` | Coordinates AI components | Not treated as completed |

## 3. AI Data Flow

```text
Raw Citizen Complaint
        |
        v
Complaint Analysis
        |
        v
Structured Complaint
(category, severity, safety risk,
 confidence, department, summary, language)
        |
        v
Issue Fusion
        |
        v
Master Issue
        |
        v
Priority Calculation
        |
        v
Priority Score + Level + Explanation
```

The exact integration of these components with the backend is still pending.

## 4. Technology Stack

The current AI implementation uses:

- JavaScript / Node.js
- Groq SDK
- Groq LLM
- `dotenv` for environment configuration
- JSON responses

The Complaint Analysis and Issue Fusion components use the Groq API with the `openai/gpt-oss-120b` model in the current implementation.

## 5. AI Folder Structure

The AI layer is organized as separate components:

```text
ai/
├── complaintAnalysis/
├── issueFusion/
├── priorityEngine/
├── evidenceEngine/
├── voiceAnalysis/
└── civicAI.js
```

Only the components confirmed as implemented should be treated as part of the completed AI workflow.

## 6. Documentation Navigation

- [Complaint Analysis](./complaint-analysis.md)
- [Issue Fusion](./issue-fusion.md)
- [Priority Engine](./priority-engine.md)

## 7. Member 3 vs Other Team Responsibilities

### AI — Member 3

- Complaint understanding and classification
- Issue Fusion
- Priority calculation
- AI-side testing and documentation

### Backend team

- Server
- API routes
- Database integration
- Backend-to-AI integration

### Frontend team

- Citizen interface
- Authority interface
- User-facing UI

## 8. Current Status

### Completed / tested

- Complaint Analysis
- Multilingual complaint understanding in Complaint Analysis
- Issue Fusion
- Priority scoring logic

### In development / pending

- Evidence Engine
- Voice/speech processing
- Full AI orchestration
- Backend integration
- Production deployment

This document intentionally does not represent unfinished features as completed.
