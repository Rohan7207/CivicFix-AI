# CivicFix AI — Priority Engine

## 1. Purpose

Calculates the urgency of a civic issue using a deterministic 0–100 score.

## 2. Factors

| Factor | Maximum |
|---|---:|
| Severity | 30 |
| Safety Risk | 25 |
| Report Count | 15 |
| Important Location | 10 |
| Duration | 10 |
| AI Confidence | 10 |
| **Total** | **100** |

## 3. Scoring

```text
severityScore = (severity / 10) × 30
```

```text
reportScore = min(reportCount / 7, 1) × 15
```

```text
durationScore = min(durationDays / 7, 1) × 10
```

```text
confidenceScore = confidence × 10
```

Safety risk:

```text
HIGH   → 25
MEDIUM → 15
LOW    → 5
```

Important location:

```text
YES → 10
NO  → 0
```

Final score:

```text
priorityScore =
    severityScore
  + safetyScore
  + reportScore
  + locationScore
  + durationScore
  + confidenceScore
```

## 4. Priority Levels

| Score | Level |
|---:|---|
| 85–100 | CRITICAL |
| 70–84 | HIGH |
| 40–69 | MEDIUM |
| 0–39 | LOW |

## 5. Output

```json
{
  "priorityScore": 0,
  "priorityLevel": "LOW",
  "explanation": "string",
  "breakdown": {
    "severityScore": 0,
    "safetyScore": 0,
    "reportScore": 0,
    "locationScore": 0,
    "durationScore": 0,
    "confidenceScore": 0
  }
}
```

## 6. Implementation Files

```text
ai/priorityEngine/
├── calculatePriority.js
└── testPriority.js
```

## 7. Testing

The deterministic priority calculation was tested successfully with civic issue inputs.

## 8. Current Status

**Implemented and tested.**
