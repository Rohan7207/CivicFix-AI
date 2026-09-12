# CivicFix AI — Priority Engine

## 1. Purpose

The Priority Engine calculates how urgently a civic issue should be handled.

Instead of asking an LLM to return only a label such as `CRITICAL`, the current implementation uses a deterministic scoring system. This makes the priority calculation transparent and reproducible.

The final score ranges from **0 to 100**.

## 2. Design Approach

The engine combines multiple factors:

```text
Severity
   +
Safety Risk
   +
Citizen Report Count
   +
Important Location
   +
Issue Duration
   +
AI Confidence
   |
   v
Priority Score (0–100)
   |
   +--> Priority Level
   |
   +--> Explanation
   |
   +--> Score Breakdown
```

## 3. Scoring Model

The implemented scoring model assigns:

| Factor | Maximum points |
|---|---:|
| Severity | 30 |
| Safety Risk | 25 |
| Report Count | 15 |
| Important Location | 10 |
| Duration | 10 |
| AI Confidence | 10 |
| **Total** | **100** |

## 4. Severity Score — 30 Points

Severity is supplied on a scale from 1 to 10.

The implementation converts it to a maximum of 30 points:

```text
severityScore = (severity / 10) × 30
```

Therefore:

- Severity 10 → 30 points
- Severity 5 → 15 points
- Severity 1 → 3 points

The final breakdown rounds this component to a whole number.

## 5. Safety Risk Score — 25 Points

The current implementation assigns:

| Safety risk | Points |
|---|---:|
| HIGH | 25 |
| MEDIUM | 15 |
| LOW | 5 |

A high safety risk therefore has a strong influence on the final priority.

## 6. Report Count Score — 15 Points

Multiple citizen reports provide additional evidence that an issue is affecting people.

The implementation caps the report-count contribution at 15 points:

```text
reportScore = min(reportCount / 7, 1) × 15
```

Therefore, seven or more reports reach the maximum report-count contribution.

## 7. Important Location Score — 10 Points

If an issue affects an important public location:

```text
importantLocation = "YES"
```

the engine assigns:

```text
10 points
```

Otherwise:

```text
0 points
```

## 8. Duration Score — 10 Points

Long-running issues receive additional priority.

The implementation caps this contribution at 10 points:

```text
durationScore = min(durationDays / 7, 1) × 10
```

Therefore, seven or more days reach the maximum duration contribution.

## 9. AI Confidence Score — 10 Points

The AI confidence value contributes up to 10 points:

```text
confidenceScore = confidence × 10
```

A confidence value of `1.0` contributes 10 points.

## 10. Final Priority Score

The six components are added:

```text
priorityScore =
    severityScore
  + safetyScore
  + reportScore
  + locationScore
  + durationScore
  + confidenceScore
```

The implementation then keeps the result within 100 and rounds it to a whole number.

## 11. Priority Levels

The current thresholds are:

| Score | Level |
|---:|---|
| 85–100 | CRITICAL |
| 70–84 | HIGH |
| 40–69 | MEDIUM |
| 0–39 | LOW |

These levels provide an easy way for an authority to understand the urgency represented by the numeric score.

## 12. Explainable Priority

The engine also generates an explanation instead of returning only a score.

Depending on the input, reasons can include:

- High issue severity
- High safety risk
- Multiple citizen reports
- Affects an important public location
- Issue has existed for a specified duration
- High AI evidence confidence

The reasons are joined into a human-readable explanation.

This makes the score more transparent for authority users.

## 13. Output Structure

The implementation returns:

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

The `breakdown` allows the individual contributions to be inspected rather than hiding the calculation behind a single number.

## 14. Implementation Files

The component is organized as:

```text
ai/priorityEngine/
├── calculatePriority.js
└── testPriority.js
```

### `calculatePriority.js`

Contains the deterministic scoring logic, priority thresholds, explanation generation, and returned breakdown.

### `testPriority.js`

Provides a direct way to run the Priority Engine with a sample issue object and inspect the result.

## 15. Example Input

A test input can contain:

```javascript
{
  severity: 9,
  safetyRisk: "HIGH",
  reportCount: 7,
  importantLocation: "YES",
  durationDays: 10,
  confidence: 0.96
}
```

The exact output should be obtained by running the current implementation rather than manually assuming a test result.

## 16. Testing

The Priority Engine has a dedicated test file:

```text
ai/priorityEngine/testPriority.js
```

The test supplies the required scoring factors and prints the returned result as formatted JSON.

## 17. Why This Approach Is Useful

A deterministic scoring layer provides:

- Explainability
- Consistent calculations
- Easy debugging
- Transparent score breakdown
- Predictable priority thresholds

The AI model supplies information such as severity, safety risk, and confidence, while the Priority Engine converts those values into an explicit priority score.

## 18. Current Status

**Status: Implemented; dedicated test available.**

The Priority Engine is an AI-side component. Backend/API integration is separate work and is not represented as completed here.

## 19. Security

The Priority Engine itself does not require an API key because its current scoring logic is deterministic.

Any API credentials used by other AI components must remain in environment variables and must never be placed in documentation.
