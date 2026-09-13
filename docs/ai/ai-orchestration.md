# CivicFix AI — AI Orchestration

## 1. Purpose

Coordinates the Member 3 AI components into one multimodal civic-issue analysis flow.

## 2. Input Rules

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

## 3. Processing Flow

```text
Photo + Location
      ↓
Image Analysis
      ↓
Optional Text Analysis
      ↓
Optional Voice Analysis
      ↓
Issue Fusion
      ↓
Evidence Analysis
      ↓
Priority Engine
      ↓
Final AI Result
```

Location is supplied by the surrounding application flow. The AI does not collect GPS permissions.

## 4. Same-Issue Handling

When the available evidence describes the same physical issue:

```text
Multiple evidence sources
          ↓
     Same issue = true
          ↓
     Master Issue
          ↓
Evidence + Priority
```

## 5. Conflicting-Issue Handling

When evidence describes different physical problems:

```text
Evidence sources
      ↓
Same issue = false
      ↓
Keep evidence separate
      ↓
No empty Master Issue
      ↓
No shared evidence/priority for one issue
```

## 6. Citizen Reports vs Evidence Sources

One citizen submission may contain multiple evidence sources:

```text
One citizen report
├── Photo
├── Description
└── Voice
```

These are not automatically counted as multiple citizen reports for priority scoring.

## 7. Implementation Files

```text
ai/civicAI.js
```

The orchestrator uses the existing:

```text
Image Analysis
Complaint Analysis
Voice Analysis
Issue Fusion
Evidence Engine
Priority Engine
```

## 8. Testing

The multimodal orchestration was tested for:

```text
Photo + Location + matching text
Photo + Location + conflicting text
```

Both same-issue and conflicting-issue behavior were verified.

## 9. Current Status

**Implemented and tested at the AI-side level.**

Backend/API integration is separate work.
