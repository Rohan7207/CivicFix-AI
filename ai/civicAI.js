const analyzeImage = require("./imageAnalysis/analyzeImage");
const analyzeComplaint = require("./complaintAnalysis/analyzeComplaint");
const processVoiceComplaint = require("./voiceAnalysis/transcribeVoice");
const fuseIssues = require("./issueFusion/fuseIssues");
const calculateEvidence = require("./evidenceEngine/calculateEvidence");
const calculatePriority = require("./priorityEngine/calculatePriority");

async function processCivicIssue(input) {
  if (!input) {
    throw new Error("Input is required.");
  }

  // ---------------------------------------------
  // REQUIRED INPUTS
  // ---------------------------------------------

  if (!input.photo) {
    throw new Error("Photo is required.");
  }

  if (!input.location) {
    throw new Error("Location is required.");
  }

  const { latitude, longitude } = input.location;

  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error("Valid latitude and longitude are required.");
  }

  // ---------------------------------------------
  // OPTIONAL INPUT VALIDATION
  // ---------------------------------------------

  if (
    input.description !== undefined &&
    input.description !== null &&
    typeof input.description !== "string"
  ) {
    throw new Error("Description must be a string.");
  }

  if (
    input.description !== undefined &&
    input.description !== null &&
    input.description.length > 5000
  ) {
    throw new Error("Description must not exceed 5000 characters.");
  }

  // ---------------------------------------------
  // PRIORITY INPUT VALIDATION
  // ---------------------------------------------

  if (
    input.reportCount !== undefined &&
    input.reportCount !== null
  ) {
    const reportCount = Number(input.reportCount);

    if (!Number.isInteger(reportCount) || reportCount < 1) {
      throw new Error("reportCount must be a positive integer.");
    }
  }

  if (
    input.durationDays !== undefined &&
    input.durationDays !== null
  ) {
    const durationDays = Number(input.durationDays);

    if (!Number.isFinite(durationDays) || durationDays < 0) {
      throw new Error("durationDays must be a non-negative number.");
    }
  }

  if (
    input.importantLocation !== undefined &&
    input.importantLocation !== null &&
    typeof input.importantLocation !== "boolean"
  ) {
    throw new Error("importantLocation must be a boolean.");
  }

  // ---------------------------------------------
  // IMAGE ANALYSIS
  // ---------------------------------------------

  const imageAnalysis = await analyzeImage(input.photo);

  if (!imageAnalysis.isCivicIssue) {
    return {
      success: false,
      error: {
        code: "NOT_CIVIC_ISSUE",
        message: "The uploaded photo does not appear to show a civic issue.",
      },
    };
  }

  // ---------------------------------------------
  // OPTIONAL VOICE TRANSCRIPTION
  // ---------------------------------------------

  let voiceTranscription = null;

  if (input.voice) {
    voiceTranscription = await processVoiceComplaint(input.voice);

    if (
      !voiceTranscription ||
      typeof voiceTranscription.transcription !== "string" ||
      !voiceTranscription.transcription.trim()
    ) {
      throw new Error("Voice transcription returned an empty result.");
    }
  }

  // ---------------------------------------------
  // TEXT + VOICE COMPLAINT ANALYSIS
  // ---------------------------------------------

  let textAnalysis = null;
  let voiceAnalysis = null;

  const hasDescription =
    typeof input.description === "string" &&
    input.description.trim().length > 0;

  const hasVoiceTranscription =
    voiceTranscription &&
    typeof voiceTranscription.transcription === "string" &&
    voiceTranscription.transcription.trim().length > 0;

  if (hasDescription || hasVoiceTranscription) {
    const complaintText = hasDescription
      ? input.description.trim()
      : voiceTranscription.transcription.trim();

    const analysis = await analyzeComplaint({
      complaintText,
      imageUrl: input.photo,
      voiceText: hasVoiceTranscription
        ? voiceTranscription.transcription.trim()
        : "",
    });

    if (hasDescription) {
      textAnalysis = analysis;
    }

    if (hasVoiceTranscription) {
      voiceAnalysis = {
        ...analysis,
        transcription: voiceTranscription.transcription.trim(),
        language: voiceTranscription.language || "unknown",
      };
    }
  }

  // ---------------------------------------------
  // CREATE ANALYZED REPORTS
  // ---------------------------------------------

  const reports = [];

  // Photo is always one evidence source
  reports.push({
    location: `${input.location.latitude},${input.location.longitude}`,
    description: imageAnalysis.visualDescription,
    category: imageAnalysis.category,
    severity: imageAnalysis.severity,
    safetyRisk: imageAnalysis.safetyRisk,
    confidence: imageAnalysis.confidence,
    source: "IMAGE",
  });

  // Optional text evidence
  if (textAnalysis) {
    if (
      typeof textAnalysis.shortSummary !== "string" ||
      !textAnalysis.shortSummary.trim()
    ) {
      throw new Error(
        "Complaint analysis returned an empty shortSummary."
      );
    }

    reports.push({
      location: `${input.location.latitude},${input.location.longitude}`,
      description: textAnalysis.shortSummary.trim(),
      category: textAnalysis.category,
      severity: textAnalysis.severity,
      safetyRisk: textAnalysis.safetyRisk,
      confidence: textAnalysis.confidence,
      source: "TEXT",
    });
  }

  // Optional voice evidence
  if (voiceAnalysis) {
    if (
      typeof voiceAnalysis.shortSummary !== "string" ||
      !voiceAnalysis.shortSummary.trim()
    ) {
      throw new Error(
        "Voice complaint analysis returned an empty shortSummary."
      );
    }

    reports.push({
      location: `${input.location.latitude},${input.location.longitude}`,
      description: voiceAnalysis.shortSummary.trim(),
      category: voiceAnalysis.category,
      severity: voiceAnalysis.severity,
      safetyRisk: voiceAnalysis.safetyRisk,
      confidence: voiceAnalysis.confidence,
      source: "VOICE",
    });
  }

  // ---------------------------------------------
  // EVIDENCE CONFLICT HANDLING
  // ---------------------------------------------

  const evidenceConflict =
  textAnalysis?.evidenceConflict === true ||
  voiceAnalysis?.evidenceConflict === true;

if (evidenceConflict) {
    return {
      success: true,

      location: input.location,

      imageAnalysis,

      textAnalysis,

      voiceAnalysis,

      issueStatus: "MULTIPLE_ISSUES_DETECTED",

      message:
        "The supplied evidence contains conflicting civic issues.",

      reports,

      fusion: null,

      masterIssue: null,

      evidence: null,

      priority: null,
    };
  }

  // ---------------------------------------------
  // ISSUE FUSION
  // ---------------------------------------------

  let fusionResult;

  if (reports.length === 1) {
    fusionResult = {
      isSameIssue: true,

      confidence: reports[0].confidence,

      masterIssue: {
        category: reports[0].category,

        title: reports[0].description,

        summary: reports[0].description,
      },

      reason:
        "The civic issue is currently supported by the mandatory photo evidence.",
    };
  } else {
    fusionResult = await fuseIssues(reports);
  }

  // ---------------------------------------------
  // DIFFERENT ISSUE HANDLING
  // ---------------------------------------------

  if (reports.length > 1 && fusionResult.isSameIssue === false) {
    return {
      success: true,

      location: input.location,

      imageAnalysis,

      textAnalysis,

      voiceAnalysis,

      issueStatus: "MULTIPLE_ISSUES_DETECTED",

      message: "The supplied evidence describes different civic issues.",

      reports,

      fusion: fusionResult,

      masterIssue: null,

      evidence: null,

      priority: null,
    };
  }

  // ---------------------------------------------
  // SAME ISSUE → EVIDENCE
  // ---------------------------------------------

  const evidenceResult = calculateEvidence(reports);

  // ---------------------------------------------
  // AVERAGE SEVERITY
  // ---------------------------------------------

  const averageSeverity =
    reports.reduce(
      (sum, report) => sum + Number(report.severity || 0),
      0
    ) / reports.length;

  // ---------------------------------------------
  // AVERAGE CONFIDENCE
  // ---------------------------------------------

  const averageConfidence =
    reports.reduce(
      (sum, report) => sum + Number(report.confidence || 0),
      0
    ) / reports.length;

  // ---------------------------------------------
  // HIGHEST SAFETY RISK
  // ---------------------------------------------

  let safetyRisk = "LOW";

  if (reports.some((report) => report.safetyRisk === "HIGH")) {
    safetyRisk = "HIGH";
  } else if (
    reports.some((report) => report.safetyRisk === "MEDIUM")
  ) {
    safetyRisk = "MEDIUM";
  }

  // ---------------------------------------------
  // DEPARTMENT
  // ---------------------------------------------

  const department =
    textAnalysis?.department ||
    voiceAnalysis?.department ||
    "Other";

  // ---------------------------------------------
  // PRIORITY
  // ---------------------------------------------

  const priorityInput = {
    severity: Math.round(averageSeverity),

    safetyRisk,

    reportCount: Number(input.reportCount || 1),

    importantLocation:
      input.importantLocation === true ? "YES" : "NO",

    durationDays: Number(input.durationDays || 0),

    confidence: averageConfidence,
  };

  const priorityResult = calculatePriority(priorityInput);

  // ---------------------------------------------
  // FINAL RESULT
  // ---------------------------------------------

  return {
    success: true,

    location: input.location,

    imageAnalysis,

    textAnalysis,

    voiceAnalysis,

    issueStatus: "SINGLE_MASTER_ISSUE",

    reports,

    masterIssue: fusionResult.masterIssue,

    fusion: fusionResult,

    evidence: evidenceResult,

    priority: priorityResult,

    department,
  };
}

module.exports = processCivicIssue;