const analyzeImage = require("../../../ai/imageAnalysis/analyzeImage");

const ALLOWED_SAFETY_RISKS = ["LOW", "MEDIUM", "HIGH"];

const ALLOWED_CATEGORIES = [
  "Pothole",
  "Garbage",
  "Streetlight",
  "Water Leakage",
  "Drainage",
  "Road Damage",
  "Traffic Signal",
  "Public Property Damage",
  "Other",
];

function validateAIResult(result) {
  if (!result || typeof result !== "object") {
    const error = new Error("Invalid AI image analysis response.");
    error.code = "AI_INVALID_RESPONSE";
    throw error;
  }

  const requiredFields = [
    "isCivicIssue",
    "category",
    "severity",
    "safetyRisk",
    "confidence",
    "visualDescription",
    "visibleEvidence",
  ];

  for (const field of requiredFields) {
    if (result[field] === undefined || result[field] === null) {
      const error = new Error(`AI image response missing field: ${field}.`);
      error.code = "AI_INVALID_RESPONSE";
      throw error;
    }
  }

  const severity = Number(result.severity);
  const confidence = Number(result.confidence);
  const safetyRisk = String(result.safetyRisk).toUpperCase();
  const category = String(result.category).trim();

  if (typeof result.isCivicIssue !== "boolean") {
    const error = new Error("AI returned an invalid civic issue value.");
    error.code = "AI_INVALID_RESPONSE";
    throw error;
  }

  if (!ALLOWED_CATEGORIES.includes(category)) {
    const error = new Error("AI returned an invalid category.");
    error.code = "AI_INVALID_RESPONSE";
    throw error;
  }

  if (!Number.isInteger(severity) || severity < 1 || severity > 10) {
    const error = new Error("AI returned an invalid severity.");
    error.code = "AI_INVALID_RESPONSE";
    throw error;
  }

  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
    const error = new Error("AI returned an invalid confidence.");
    error.code = "AI_INVALID_RESPONSE";
    throw error;
  }

  if (!ALLOWED_SAFETY_RISKS.includes(safetyRisk)) {
    const error = new Error("AI returned an invalid safety risk.");
    error.code = "AI_INVALID_RESPONSE";
    throw error;
  }

  if (!Array.isArray(result.visibleEvidence)) {
    const error = new Error("AI returned invalid visible evidence.");
    error.code = "AI_INVALID_RESPONSE";
    throw error;
  }

  return {
    isCivicIssue: result.isCivicIssue,
    category,
    severity,
    safetyRisk,
    confidence,
    visualDescription: String(result.visualDescription).trim(),
    visibleEvidence: result.visibleEvidence
      .slice(0, 4)
      .map((item) => String(item).trim()),
  };
}

async function analyzeAndValidateImage({ complaintId, imageUrl }) {
  if (!imageUrl) {
    return null;
  }

  let aiResult;

  try {
    aiResult = await analyzeImage(imageUrl);
  } catch (error) {
    const aiError = new Error(error.message || "Image analysis failed.");

    aiError.statusCode = 502;
    aiError.code = "AI_IMAGE_ANALYSIS_FAILED";

    throw aiError;
  }

  return {
    complaintId,
    ...validateAIResult(aiResult),
  };
}

module.exports = {
  analyzeAndValidateImage,
};
