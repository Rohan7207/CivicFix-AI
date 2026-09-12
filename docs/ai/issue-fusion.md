# CivicFix AI — Issue Fusion Engine

## 1. Purpose

The Issue Fusion Engine determines whether multiple citizen reports describe the **same real-world civic issue**.

Citizens may describe the same problem using different wording. Treating every report as a separate issue can make an authority dashboard noisy and can split evidence about one physical problem across multiple records.

Issue Fusion combines supporting reports into a master issue when the evidence indicates that they refer to the same physical problem.

## 2. Real-World Example

Consider these reports:

```text
Report 1:
Large pothole near the school gate.

Report 2:
Big pothole in front of the school.

Report 3:
People are falling because of the pothole near the school entrance.
```

Although the wording differs, the reports can refer to one physical pothole.

The engine can therefore produce one master issue instead of treating the reports as unrelated issues.

## 3. Why Category Matching Is Not Enough

Two reports having the same category does not automatically mean they describe the same issue.

For example:

```text
Pothole on Street A
        !=
Pothole on Street B
```

The Issue Fusion prompt therefore instructs the model not to merge reports only because their categories match.

Location and other contextual evidence are important.

## 4. Factors Considered

The current Issue Fusion prompt instructs the model to consider:

1. Issue category
2. Physical location
3. Description similarity
4. Important keywords
5. Physical landmarks
6. Severity
7. Whether the reports describe the same physical problem

The prompt also states:

- Small wording differences are acceptable.
- Different locations should normally not be merged.
- Insufficient evidence should result in `false`.
- Multiple reports can act as supporting evidence.

## 5. Processing Flow

```text
Multiple Citizen Reports
          |
          v
   AI Comparison
          |
          v
  Same Physical Issue?
       /            Yes        No
      |          |
      v          v
Master Issue   Separate Issues
      |
      v
Confidence + Reason
```

## 6. Output

The current implementation requests:

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

### Fields

| Field | Meaning |
|---|---|
| `isSameIssue` | Whether the supplied reports describe the same physical issue |
| `confidence` | AI confidence in the fusion decision |
| `masterIssue.category` | Category selected for the consolidated issue |
| `masterIssue.title` | Short title representing the master issue |
| `masterIssue.summary` | Consolidated description |
| `reason` | Explanation for the fusion decision |

## 7. Implementation Files

The component is organized under:

```text
ai/issueFusion/
├── fuseIssues.js
├── fusionPrompt.js
└── testFusion.js
```

The current prompt filename is `fusionPrompt.js`.

## 8. `fusionPrompt.js`

The prompt defines the rules used by the AI to decide whether multiple reports represent the same real-world issue.

It explicitly prevents category-only merging and directs the model to consider physical location, descriptions, landmarks, keywords, severity, and physical-issue similarity.

It also requires a JSON-only response.

## 9. `fuseIssues.js`

The implementation:

1. Receives an array of reports.
2. Converts each report into structured text.
3. Includes category, location, description, and severity.
4. Sends the reports to the Groq model.
5. Requests a JSON response.
6. Parses the returned JSON.
7. Returns the fusion result.

## 10. `testFusion.js`

This file is used to test the Issue Fusion component independently.

A test scenario was built around multiple reports describing a pothole near a school gate.

The expected behavior was for the reports to be recognized as the same physical issue and represented as a master issue.

## 11. Development Issue

During development, the prompt filename and import initially differed:

```text
fusionPrompt.js
```

versus the earlier filename:

```text
fussionPrompt.js
```

The import was corrected to match the current prompt filename.

This illustrates the importance of keeping file names and `require()` paths consistent.

## 12. Design Benefit

Issue Fusion provides a stronger concept than simple duplicate detection:

> Multiple citizen reports can become supporting evidence for one master civic issue.

This can reduce fragmented issue records and provide a more useful representation of the real-world problem.

## 13. Security

The Groq API key must remain in an environment variable.

Example:

```env
GROQ_API_KEY=YOUR_GROQ_API_KEY
```

Never include the real key in this documentation.

## 14. Current Status

**Status: Implemented and tested.**

Backend integration is separate work and is not represented as completed here.
