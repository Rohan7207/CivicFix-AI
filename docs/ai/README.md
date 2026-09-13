# CivicFix AI — AI Architecture

## 1. Overview

CivicFix AI analyzes civic evidence, understands the reported issue, combines supporting evidence, and produces an explainable priority.

**Member 3 responsibility:** AI development.

Backend/API integration is separate work.

## 2. Current AI Architecture

```text
Photo + Location
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
Master Issue + Priority
```

## 3. Components

| Component | Location | Status |
|---|---|---|
| Complaint Analysis | `ai/complaintAnalysis/` | Implemented and tested |
| Image Analysis | `ai/imageAnalysis/` | Implemented and tested |
| Voice Analysis | `ai/voiceAnalysis/` | Implemented and tested |
| Issue Fusion | `ai/issueFusion/` | Implemented and tested |
| Evidence Engine | `ai/evidenceEngine/` | Implemented and tested |
| Priority Engine | `ai/priorityEngine/` | Implemented and tested |
| AI Orchestration | `ai/civicAI.js` | Implemented and tested |

## 4. Input Rules

```text
Photo       REQUIRED
Location    REQUIRED
Description OPTIONAL
Voice       OPTIONAL
```

## 5. Folder Structure

```text
ai/
├── complaintAnalysis/
├── imageAnalysis/
├── voiceAnalysis/
├── issueFusion/
├── evidenceEngine/
├── priorityEngine/
└── civicAI.js
```

## 6. Documentation Navigation

- [Complaint Analysis](./complaint-analysis.md)
- [Image Analysis](./image-analysis.md)
- [Voice Analysis](./voice-analysis.md)
- [Issue Fusion](./issue-fusion.md)
- [Evidence Analysis](./evidence-analysis.md)
- [Priority Engine](./priority-engine.md)
- [AI Orchestration](./ai-orchestration.md)

## 7. Current Status

All listed AI components have been implemented and tested at the AI-side level.

Backend integration and production deployment remain separate work.
