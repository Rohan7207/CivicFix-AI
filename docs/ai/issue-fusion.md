# CivicFix AI — Issue Fusion Engine

## 1. Purpose

Determines whether multiple evidence sources describe the **same real-world physical civic issue**.

## 2. Factors Considered

- Issue category
- Physical location
- Description similarity
- Keywords
- Landmarks
- Severity
- Physical problem similarity

## 3. Core Rules

- Same category alone is not enough.
- Different physical locations normally indicate different issues.
- Small wording differences are acceptable.
- Insufficient evidence should avoid incorrect merging.

## 4. Processing Flow

```text
Multiple Evidence Sources
          ↓
      AI Comparison
          ↓
   Same Physical Issue?
      /          \
    Yes          No
     ↓            ↓
Master Issue   Separate Issues
```

## 5. Output

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

## 6. Implementation Files

```text
ai/issueFusion/
├── fuseIssues.js
├── fusionPrompt.js
└── testFusion.js
```

## 7. Testing

Tested for:

```text
Matching evidence     → same issue
Conflicting evidence  → different issues
```

## 8. Current Status

**Implemented and tested.**
