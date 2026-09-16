const analyzeComplaint = require("../../../ai/complaintAnalysis/analyzeComplaint");
const { createAIAnalysis } = require("../../models/aiAnalysisModel");
const { updateStatus } = require("../../models/complaintModel");
const { attachOrCreateMasterIssue } = require("../masterIssueService");

const ALLOWED_SAFETY_RISKS = ["LOW", "MEDIUM", "HIGH"];

function validateAIResult(result) {
  if (!result || typeof result !== "object") {
    const error = new Error("Invalid AI analysis response.");
    error.code = "AI_INVALID_RESPONSE";
    throw error;
  }

  const requiredFields = [
    "isCivicIssue",
    "category",
    "severity",
    "safetyRisk",
    "confidence",
    "evidenceConflict",
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

  if (typeof result.isCivicIssue !== "boolean") {
    const error = new Error("AI returned an invalid civic issue value.");
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

  return {
    isCivicIssue: result.isCivicIssue,
    category: String(result.category).trim(),
    severity,
    safetyRisk,
    confidence: result.evidenceConflict
      ? Math.min(confidence, 0.7)
      : confidence,
    evidenceConflict: result.evidenceConflict,
    department: String(result.department).trim(),
    shortSummary: String(result.shortSummary).trim(),
    language: String(result.language).trim(),
    englishTranslation: String(result.englishTranslation).trim(),
  };
}

async function analyzeAndStoreComplaint({
  complaintId,
  complaintText,
  imageUrl,
  voiceText,
  latitude,
  longitude,
}) {
  if (!imageUrl) {
    throw new Error("Image URL is required for complaint analysis.");
  }

  let aiResult;

  try {
    aiResult = await analyzeComplaint({
      complaintText,
      imageUrl,
      voiceText,
    });
    console.log("AI RESULT:", JSON.stringify(aiResult, null, 2));
  } catch (error) {
    const aiError = new Error(error.message || "Complaint analysis failed.");
    aiError.statusCode = 502;
    aiError.code = "AI_ANALYSIS_FAILED";
    throw aiError;
  }

  const validatedResult = validateAIResult(aiResult);

  if (!validatedResult.isCivicIssue) {
    await updateStatus(complaintId, "REJECTED_NOT_CIVIC");

    const error = new Error(
      "The submitted evidence does not appear to show a civic issue.",
    );
    error.statusCode = 422;
    error.code = "NOT_CIVIC_ISSUE";
    throw error;
  }

  const aiAnalysis = await createAIAnalysis({
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

  const masterIssueResult = await attachOrCreateMasterIssue({
    complaintId,
    category: validatedResult.category,
    department: validatedResult.department,
    latitude,
    longitude,
    title: validatedResult.shortSummary,
    summary: validatedResult.englishTranslation,
    severity: validatedResult.severity,
  });

  await updateStatus(complaintId, "REPORTED");

  return {
    ...aiAnalysis,
    evidenceConflict: validatedResult.evidenceConflict,
    masterIssue: masterIssueResult,
  };
}

module.exports = {
  analyzeAndStoreComplaint,
};
