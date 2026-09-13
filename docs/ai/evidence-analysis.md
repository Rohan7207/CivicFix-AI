# CivicFix AI — Evidence Analysis Engine

## 1. Purpose

Calculates how strongly the available evidence supports a civic issue.

## 2. Current Factors

```text
Evidence-source count
Location consistency
Safety-risk agreement
Average AI confidence
```

## 3. Processing Flow

```text
Evidence Sources
      ↓
Evidence Calculation
      ↓
Evidence Score + Level + Explanation
```

## 4. Output

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

## 5. Multimodal Rule

Evidence sources and citizen report count are different concepts.

```text
One citizen report
├── Photo
├── Description
└── Voice

= multiple evidence sources
= one citizen report
```

## 6. Implementation Files

```text
ai/evidenceEngine/
├── calculateEvidence.js
└── testEvidence.js
```

## 7. Testing

The engine was tested with multiple civic evidence inputs and returned a structured evidence score and breakdown.

## 8. Current Status

**Implemented and tested.**
