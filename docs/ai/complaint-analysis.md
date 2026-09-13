# CivicFix AI — Complaint Analysis Engine

## 1. Purpose

Converts citizen-provided complaint text into structured civic information.

## 2. Input

```text
Complaint text
```

Multilingual complaint text is supported.

## 3. Processing Flow

```text
Complaint Text
      ↓
Groq LLM
      ↓
Structured JSON
```

Current text model:

```text
openai/gpt-oss-120b
```

## 4. Output

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

## 5. Supported Categories

```text
Pothole
Garbage
Streetlight
Water Leakage
Drainage
Road Damage
Traffic Signal
Public Property Damage
Other
```

## 6. Multilingual Support

The engine detects the complaint language and produces an English translation/summary for downstream use.

A Kannada complaint was successfully tested.

## 7. Implementation Files

```text
ai/complaintAnalysis/
├── prompt.js
├── analyzeComplaint.js
└── testAI.js
```

## 8. Current Status

**Implemented and tested.**

Backend integration is separate work.
