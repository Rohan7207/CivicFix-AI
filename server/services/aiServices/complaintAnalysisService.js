const analyzeComplaint = require("../../../ai/complaintAnalysis/analyzeComplaint");
const { createAIAnalysis } = require("../../models/aiAnalysisModel");

const ALLOWED_SAFETY_RISKS = ["LOW", "MEDIUM", "HIGH"];

function validateAIResult(result) {
  if (!result || typeof result !== "object") {
    const error = new Error("Invalid AI analysis response.");
    error.code = "AI_INVALID_RESPONSE";
    throw error;
  }

  const requiredFields = [
    "category",
    "severity",
    "safetyRisk",
    "confidence",
    "department",
    "shortSummary",
    "language",
    "englishTranslation",
  ];

  for (const field of requiredFields) {
    if (result[field] === undefined || result[field] === null) {
      const error = new Error(`AI response missing field: ${field}.`);
      error.code = "AI_INVALID_RESPONSE";
      throw error;
    }
  }

  const severity = Number(result.severity);
  const confidence = Number(result.confidence);
  const safetyRisk = String(result.safetyRisk).toUpperCase();

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

  return {
    category: String(result.category).trim(),
    severity,
    safetyRisk,
    confidence,
    department: String(result.department).trim(),
    shortSummary: String(result.shortSummary).trim(),
    language: String(result.language).trim(),
    englishTranslation: String(result.englishTranslation).trim(),
  };
}

async function analyzeAndStoreComplaint({ complaintId, complaintText }) {
  if (!complaintText || !complaintText.trim()) {
    return null;
  }

  let aiResult;

  try {
    aiResult = await analyzeComplaint(complaintText);
  } catch (error) {
    const aiError = new Error(error.message || "Complaint analysis failed.");
    aiError.statusCode = 502;
    aiError.code = "AI_ANALYSIS_FAILED";
    throw aiError;
  }

  const validatedResult = validateAIResult(aiResult);

  return createAIAnalysis({
    complaint_id: complaintId,
    category: validatedResult.category,
    severity: validatedResult.severity,
    safety_risk: validatedResult.safetyRisk,
    confidence: validatedResult.confidence,
    department: validatedResult.department,
    short_summary: validatedResult.shortSummary,
    language: validatedResult.language,
    english_translation: validatedResult.englishTranslation,
  });
}

module.exports = {
  analyzeAndStoreComplaint,
};
