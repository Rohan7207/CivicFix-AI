# CivicFix AI — Complaint Analysis Engine

## 1. Purpose

The Complaint Analysis Engine converts a citizen's natural-language civic complaint into structured information that can be processed by the rest of CivicFix AI.

Instead of passing an unstructured sentence directly to later stages, the engine identifies important properties such as the civic category, severity, safety risk, responsible department, confidence, and a concise summary.

## 2. Processing Flow

```text
Citizen Complaint
       |
       v
Groq LLM
       |
       v
Structured JSON
```

The current implementation uses the Groq SDK and the `openai/gpt-oss-120b` model.

## 3. Input

The engine receives a complaint as text.

Example:

```text
Large pothole near the school gate causing bikes to fall.
```

The complaint can contain different descriptions and, with the multilingual prompt, can be written in languages other than English.

## 4. Output

The implemented prompt requests a JSON object containing:

```json
{
  "category": "string",
  "severity": 1,
  "safetyRisk": "LOW",
  "confidence": 0.0,
  "department": "string",
  "shortSummary": "string",
  "language": "string"
}
```

### Fields

| Field | Meaning |
|---|---|
| `category` | Civic issue category identified by the AI |
| `severity` | Estimated severity on a 1–10 scale |
| `safetyRisk` | Safety risk level: `LOW`, `MEDIUM`, or `HIGH` |
| `confidence` | AI confidence in the analysis |
| `department` | Department relevant to handling the issue |
| `shortSummary` | Concise English summary for authority-side understanding |
| `language` | Language associated with the submitted complaint |

## 5. Allowed Categories

The current prompt defines these categories:

- Pothole
- Garbage
- Streetlight
- Water Leakage
- Drainage
- Road Damage
- Traffic Signal
- Public Property Damage
- Other

The category list is intentionally constrained so the model produces a predictable classification vocabulary.

## 6. Severity

Severity is represented on a scale from **1 to 10**.

A higher value represents a more serious civic issue.

For example, a dangerous pothole causing people to fall can receive a high severity value.

## 7. Safety Risk

The engine uses three safety-risk levels:

- `LOW`
- `MEDIUM`
- `HIGH`

Safety risk is separate from severity. An issue can be important because it creates a direct danger to citizens even when other factors differ.

## 8. Department Classification

The AI identifies a relevant department from the complaint.

For example, a road or pothole complaint can be associated with a public-works-related department.

The department value is generated as part of the structured analysis.

## 9. Multilingual Complaint Analysis

The Complaint Analysis prompt was enhanced to support complaints written in different languages.

The intended flow is:

```text
Complaint in any supported language
          |
          v
AI understands the meaning
          |
          +----> Civic classification
          |
          +----> Severity / safety risk
          |
          +----> Language
          |
          +----> English short summary
```

A Kannada complaint was used during testing to verify multilingual understanding.

This functionality is **text-based multilingual analysis**. It should not be described as speech recognition or speech-to-text.

## 10. Implementation Files

The Complaint Analysis component contains:

```text
ai/complaintAnalysis/
├── prompt.js
├── analyzeComplaint.js
└── testAI.js
```

### `prompt.js`

Contains the system instructions for CivicFix AI.

The prompt:

- Defines the role of the AI
- Defines the civic categories
- Requests severity and safety-risk classification
- Requests confidence
- Requests department classification
- Requests a short English summary
- Requests language information
- Requires valid JSON
- Prevents additional explanatory text outside the JSON

### `analyzeComplaint.js`

Responsible for executing the analysis.

The implementation:

1. Loads the Complaint Analysis prompt.
2. Initializes the Groq client using `GROQ_API_KEY`.
3. Sends the system prompt.
4. Sends the citizen complaint.
5. Requests a JSON response.
6. Uses the returned message content.
7. Parses the JSON.
8. Returns the structured result.

### `testAI.js`

Used to run the Complaint Analysis independently and inspect the returned result.

## 11. Testing

Complaint Analysis was tested with civic complaints including a pothole scenario.

A multilingual test used a Kannada complaint describing a large pothole near a school and citizens falling because of it.

The test was intended to verify that the model could understand the meaning, classify the civic issue, and produce an English summary.

## 12. Development Issues

### Groq model availability

An earlier model, `llama-3.3-70b-versatile`, returned a model-not-found/deprecated-model error.

The implementation was updated to use:

```text
openai/gpt-oss-120b
```

### `groq-sdk` module not found

The test initially failed because the `groq-sdk` package was not installed in the environment.

The dependency was installed before testing again.

### Environment configuration

The Groq client requires:

```env
GROQ_API_KEY=YOUR_GROQ_API_KEY
```

Never place the real key in source code or documentation.

## 13. Security

API credentials must remain in environment variables and must not be committed to Git.

Never include the actual API key in this documentation.

## 14. Current Status

**Status: Implemented and tested.**

Backend integration is separate work and is not represented as completed here.
