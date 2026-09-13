const imagePrompt = `
Analyze this image for a civic issue.

Allowed categories:
Pothole
Garbage
Streetlight
Water Leakage
Drainage
Road Damage
Traffic Signal
Public Property Damage
Other

Return ONLY one valid JSON object.

Rules:
- Do not invent information.
- Describe only visible evidence.
- Do not determine location from the image.
- GPS location is handled separately.
- severity must be a number from 1 to 10.
- safetyRisk must be LOW, MEDIUM, or HIGH.
- confidence must be between 0 and 1.
- visibleEvidence must contain at most 4 short items.
- visualDescription must be short.

Use exactly these fields:

{
  "isCivicIssue": true,
  "category": "Pothole",
  "severity": 8,
  "safetyRisk": "HIGH",
  "confidence": 0.95,
  "visualDescription": "Large pothole visible in the road.",
  "visibleEvidence": [
    "Large road cavity",
    "Broken asphalt"
  ]
}
`;

module.exports = imagePrompt;