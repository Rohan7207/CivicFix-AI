const processCivicIssue = require("../../../ai/civicAI");
const { createAIAnalysis } = require("../../models/aiAnalysisModel");
const { updateStatus } = require("../../models/complaintModel");
const { attachOrCreateMasterIssue } = require("../masterIssueService");

const ALLOWED_SAFETY_RISKS = ["LOW", "MEDIUM", "HIGH"];

function validateAIResult(result) {
  if (!result || typeof result !== "object" || Array.isArray(result)) {
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

  if (typeof result.isCivicIssue !== "boolean") {
    const error = new Error("AI returned an invalid civic issue value.");
    error.code = "AI_INVALID_RESPONSE";
    throw error;
  }

  if (
    !Number.isInteger(result.severity) ||
    result.severity < 1 ||
    result.severity > 10
  ) {
    const error = new Error("AI returned an invalid severity.");
    error.code = "AI_INVALID_RESPONSE";
    throw error;
  }

  if (
    typeof result.confidence !== "number" ||
    !Number.isFinite(result.confidence) ||
    result.confidence < 0 ||
    result.confidence > 1
  ) {
    const error = new Error("AI returned an invalid confidence.");
    error.code = "AI_INVALID_RESPONSE";
    throw error;
  }

  if (typeof result.evidenceConflict !== "boolean") {
    const error = new Error("AI returned an invalid evidence conflict value.");
    error.code = "AI_INVALID_RESPONSE";
    throw error;
  }

  if (
    typeof result.safetyRisk !== "string" ||
    !ALLOWED_SAFETY_RISKS.includes(result.safetyRisk.toUpperCase())
  ) {
    const error = new Error("AI returned an invalid safety risk.");
    error.code = "AI_INVALID_RESPONSE";
    throw error;
  }

  const stringFields = [
    "category",
    "department",
    "shortSummary",
    "language",
    "englishTranslation",
  ];

  for (const field of stringFields) {
    if (typeof result[field] !== "string" || result[field].trim() === "") {
      const error = new Error(`AI returned an invalid ${field}.`);
      error.code = "AI_INVALID_RESPONSE";
      throw error;
    }
  }

  const safetyRisk = result.safetyRisk.toUpperCase();

  return {
    isCivicIssue: result.isCivicIssue,
    category: result.category.trim(),
    severity: result.severity,
    safetyRisk,
    confidence: result.evidenceConflict
      ? Math.min(result.confidence, 0.7)
      : result.confidence,
    evidenceConflict: result.evidenceConflict,
    department: result.department.trim(),
    shortSummary: result.shortSummary.trim(),
    language: result.language.trim(),
    englishTranslation: result.englishTranslation.trim(),
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
  // console.log("AI SERVICE IMAGE URL:", imageUrl);
  if (!imageUrl) {
    throw new Error("Image URL is required for complaint analysis.");
  }

  let aiResult;

  try {
    aiResult = await processCivicIssue({
      photo: imageUrl,
      description: complaintText,
      voice: voiceText,
      location: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
    });
    // console.log("AI RESULT:", JSON.stringify(aiResult, null, 2));
  } catch (error) {
    // console.error("AI PIPELINE ERROR:", error);
    const aiError = new Error(error.message || "Complaint analysis failed.");
    aiError.statusCode = 502;
    aiError.code = "AI_ANALYSIS_FAILED";
    throw aiError;
  }

  if (!aiResult || typeof aiResult !== "object") {
    const error = new Error("Invalid AI pipeline response.");
    error.statusCode = 502;
    error.code = "AI_INVALID_RESPONSE";
    throw error;
  }

  if (!aiResult.success) {
    await updateStatus(complaintId, "REJECTED_NOT_CIVIC");

    const error = new Error(
      aiResult.error?.message || "The submitted evidence is not a civic issue.",
    );

    error.statusCode = 422;
    error.code = aiResult.error?.code || "AI_ANALYSIS_FAILED";

    throw error;
  }

  const primaryAnalysis = aiResult.textAnalysis || aiResult.imageAnalysis;

  const validatedResult = validateAIResult({
    ...primaryAnalysis,
    evidenceConflict: primaryAnalysis?.evidenceConflict ?? false,
    department: primaryAnalysis?.department || aiResult.department,
    shortSummary:
      primaryAnalysis?.shortSummary ||
      aiResult.masterIssue?.summary ||
      aiResult.imageAnalysis?.visualDescription,
    language: primaryAnalysis?.language || "English",
    englishTranslation:
      primaryAnalysis?.englishTranslation ||
      aiResult.masterIssue?.summary ||
      aiResult.imageAnalysis?.visualDescription,
  });

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
    title: aiResult.masterIssue?.title || validatedResult.shortSummary,
    summary:
      aiResult.masterIssue?.summary || validatedResult.englishTranslation,
    severity: validatedResult.severity,
    priorityScore: aiResult.priority.priorityScore,
    priorityLevel: aiResult.priority.priorityLevel,
    evidenceScore: aiResult.evidence.evidenceScore,
    evidenceLevel: aiResult.evidence.evidenceLevel,
  });

  await updateStatus(complaintId, "REPORTED");

  return {
    ...aiAnalysis,
    evidenceConflict: validatedResult.evidenceConflict,
    evidence: aiResult.evidence,
    priority: aiResult.priority,
    masterIssue: masterIssueResult,
  };
}

module.exports = {
  analyzeAndStoreComplaint,
};
