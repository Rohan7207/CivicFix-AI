# CivicFix AI — Image Analysis Engine

## 1. Purpose

Analyzes the mandatory complaint photo and extracts visible civic-issue evidence.

## 2. Input

```text
Civic issue image
```

The image may show road damage, garbage, streetlight problems, drainage, water leakage, or another civic issue.

## 3. Processing Flow

```text
Complaint Photo
      ↓
Vision-capable Groq Model
      ↓
Structured JSON
```

The image engine does not determine GPS/location from the image.

## 4. Output

```json
{
  "isCivicIssue": true,
  "category": "Pothole",
  "severity": 8,
  "safetyRisk": "HIGH",
  "confidence": 0.95,
  "visualDescription": "string",
  "visibleEvidence": [
    "string"
  ]
}
```

## 5. Rules

- Describe only visible evidence.
- Do not invent information.
- Do not infer geographic location from the image.
- Keep visible evidence concise.

## 6. Implementation Files

```text
ai/imageAnalysis/
├── imagePrompt.js
├── analyzeImage.js
├── testImage.js
└── test.jpg
```

## 7. Testing

A civic road-damage image was successfully analyzed and returned structured issue information, severity, safety risk, confidence, and visible evidence.

## 8. Current Status

**Implemented and tested.**

Backend integration is separate work.
