
const CATEGORIES = new Set([
  "Pothole",
  "Garbage",
  "Streetlight",
  "Water Leakage",
  "Drainage",
  "Road Damage",
  "Traffic Signal",
  "Public Property Damage",
  "Other",
]);

const SAFETY_RISKS = new Set(["LOW", "MEDIUM", "HIGH"]);
const PRIORITY_LEVELS = new Set(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
const EVIDENCE_LEVELS = new Set(["WEAK", "MODERATE", "STRONG"]);

class AISchemaError extends Error {
  constructor(message) {
    super(message);
    this.name = "AISchemaError";
    this.code = "AI_SCHEMA_VALIDATION_ERROR";
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assertPlainObject(value, name) {
  if (!isPlainObject(value)) {
    throw new AISchemaError(`${name} must be an object.`);
  }
}

function assertNonEmptyString(value, field) {
  if (typeof value !== "string" || !value.trim()) {
    throw new AISchemaError(`${field} must be a non-empty string.`);
  }
}

function assertNumberInRange(value, field, min, max) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < min ||
    value > max
  ) {
    throw new AISchemaError(
      `${field} must be a number between ${min} and ${max}.`
    );
  }
}

function assertIntegerInRange(value, field, min, max) {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new AISchemaError(
      `${field} must be an integer between ${min} and ${max}.`
    );
  }
}

function assertAllowed(value, field, allowed) {
  if (!allowed.has(value)) {
    throw new AISchemaError(`${field} contains an unsupported value.`);
  }
}

function assertComplaintAnalysis(result) {
  assertPlainObject(result, "Complaint analysis");

  if (typeof result.isCivicIssue !== "boolean") {
    throw new AISchemaError("isCivicIssue must be a boolean.");
  }

  assertAllowed(result.category, "category", CATEGORIES);

  if (result.isCivicIssue) {
    assertIntegerInRange(result.severity, "severity", 1, 10);
  } else {
    assertIntegerInRange(result.severity, "severity", 0, 10);
  }

  assertAllowed(result.safetyRisk, "safetyRisk", SAFETY_RISKS);
  assertNumberInRange(result.confidence, "confidence", 0, 1);

  if (typeof result.evidenceConflict !== "boolean") {
    throw new AISchemaError("evidenceConflict must be a boolean.");
  }

  assertNonEmptyString(result.department, "department");
  assertNonEmptyString(result.shortSummary, "shortSummary");
  assertNonEmptyString(result.language, "language");

  if (typeof result.englishTranslation !== "string") {
    throw new AISchemaError("englishTranslation must be a string.");
  }

  return result;
}

function assertImageAnalysis(result) {
  assertPlainObject(result, "Image analysis");

  if (typeof result.isCivicIssue !== "boolean") {
    throw new AISchemaError("isCivicIssue must be a boolean.");
  }

  assertAllowed(result.category, "category", CATEGORIES);

  if (result.isCivicIssue) {
    assertIntegerInRange(result.severity, "severity", 1, 10);
  } else {
    assertIntegerInRange(result.severity, "severity", 0, 10);
  }

  assertAllowed(result.safetyRisk, "safetyRisk", SAFETY_RISKS);
  assertNumberInRange(result.confidence, "confidence", 0, 1);
  assertNonEmptyString(result.visualDescription, "visualDescription");

  if (!Array.isArray(result.visibleEvidence)) {
    throw new AISchemaError("visibleEvidence must be an array.");
  }

  if (result.visibleEvidence.length > 4) {
    throw new AISchemaError(
      "visibleEvidence must contain at most 4 items."
    );
  }

  result.visibleEvidence.forEach((item, index) => {
    assertNonEmptyString(item, `visibleEvidence[${index}]`);
  });

  return result;
}

function assertVoiceTranscription(result) {
  assertPlainObject(result, "Voice transcription");
  assertNonEmptyString(result.transcription, "transcription");
  assertNonEmptyString(result.language, "language");
  return result;
}

function assertFusionResult(result) {
  assertPlainObject(result, "Fusion result");

  if (typeof result.isSameIssue !== "boolean") {
    throw new AISchemaError("isSameIssue must be a boolean.");
  }

  assertNumberInRange(result.confidence, "confidence", 0, 1);
  assertNonEmptyString(result.reason, "reason");

  if (result.isSameIssue) {
    assertPlainObject(result.masterIssue, "masterIssue");
    assertAllowed(
      result.masterIssue.category,
      "masterIssue.category",
      CATEGORIES
    );
    assertNonEmptyString(result.masterIssue.title, "masterIssue.title");
    assertNonEmptyString(result.masterIssue.summary, "masterIssue.summary");
  } else if (
    result.masterIssue !== null &&
    result.masterIssue !== undefined
  ) {
    if (!isPlainObject(result.masterIssue)) {
      throw new AISchemaError(
        "masterIssue must be null or an object."
      );
    }

    if (result.masterIssue.category !== undefined) {
      assertAllowed(
        result.masterIssue.category,
        "masterIssue.category",
        CATEGORIES
      );
    }
  }

  return result;
}

function assertEvidenceResult(result) {
  assertPlainObject(result, "Evidence result");

  assertNumberInRange(result.evidenceScore, "evidenceScore", 0, 100);
  assertAllowed(result.evidenceLevel, "evidenceLevel", EVIDENCE_LEVELS);
  assertNonEmptyString(result.explanation, "explanation");

  assertPlainObject(result.breakdown, "breakdown");

  assertNumberInRange(
    result.breakdown.reportScore,
    "breakdown.reportScore",
    0,
    30
  );

  assertNumberInRange(
    result.breakdown.locationScore,
    "breakdown.locationScore",
    0,
    25
  );

  assertNumberInRange(
    result.breakdown.safetyScore,
    "breakdown.safetyScore",
    0,
    20
  );

  assertNumberInRange(
    result.breakdown.confidenceScore,
    "breakdown.confidenceScore",
    0,
    25
  );

  return result;
}

function assertPriorityResult(result) {
  assertPlainObject(result, "Priority result");

  assertNumberInRange(result.priorityScore, "priorityScore", 0, 100);
  assertAllowed(result.priorityLevel, "priorityLevel", PRIORITY_LEVELS);
  assertNonEmptyString(result.explanation, "explanation");

  assertPlainObject(result.breakdown, "breakdown");

  assertNumberInRange(
    result.breakdown.severityScore,
    "breakdown.severityScore",
    0,
    30
  );

  assertNumberInRange(
    result.breakdown.safetyScore,
    "breakdown.safetyScore",
    0,
    25
  );

  assertNumberInRange(
    result.breakdown.reportScore,
    "breakdown.reportScore",
    0,
    15
  );

  assertNumberInRange(
    result.breakdown.locationScore,
    "breakdown.locationScore",
    0,
    10
  );

  assertNumberInRange(
    result.breakdown.durationScore,
    "breakdown.durationScore",
    0,
    10
  );

  assertNumberInRange(
    result.breakdown.confidenceScore,
    "breakdown.confidenceScore",
    0,
    10
  );

  return result;
}

function assertFusionReport(report, index) {
  assertPlainObject(report, `reports[${index}]`);

  assertNonEmptyString(
    report.location,
    `reports[${index}].location`
  );

  assertNonEmptyString(
    report.description,
    `reports[${index}].description`
  );

  assertAllowed(
    report.category,
    `reports[${index}].category`,
    CATEGORIES
  );

  assertIntegerInRange(
    report.severity,
    `reports[${index}].severity`,
    1,
    10
  );

  assertAllowed(
    report.safetyRisk,
    `reports[${index}].safetyRisk`,
    SAFETY_RISKS
  );

  assertNumberInRange(
    report.confidence,
    `reports[${index}].confidence`,
    0,
    1
  );

  assertNonEmptyString(
    report.source,
    `reports[${index}].source`
  );
}

function assertReports(reports) {
  if (!Array.isArray(reports) || reports.length === 0) {
    throw new AISchemaError(
      "reports must contain at least one report."
    );
  }

  reports.forEach(assertFusionReport);

  return reports;
}

function assertEvidenceReports(reports) {
  if (!Array.isArray(reports) || reports.length === 0) {
    throw new AISchemaError(
      "reports must contain at least one report."
    );
  }

  reports.forEach((report, index) => {
    assertPlainObject(report, `reports[${index}]`);

    assertNonEmptyString(
      report.location,
      `reports[${index}].location`
    );

    assertAllowed(
      report.safetyRisk,
      `reports[${index}].safetyRisk`,
      SAFETY_RISKS
    );

    assertNumberInRange(
      report.confidence,
      `reports[${index}].confidence`,
      0,
      1
    );
  });

  return reports;
}

function assertPriorityInput(issue) {
  assertPlainObject(issue, "Priority input");

  assertIntegerInRange(issue.severity, "severity", 1, 10);

  assertAllowed(
    issue.safetyRisk,
    "safetyRisk",
    SAFETY_RISKS
  );

  if (!Number.isInteger(issue.reportCount) || issue.reportCount < 0) {
    throw new AISchemaError(
      "reportCount must be a non-negative integer."
    );
  }

  assertAllowed(
    issue.importantLocation,
    "importantLocation",
    new Set(["YES", "NO"])
  );

  if (
    !Number.isFinite(issue.durationDays) ||
    issue.durationDays < 0
  ) {
    throw new AISchemaError(
      "durationDays must be a non-negative number."
    );
  }

  assertNumberInRange(issue.confidence, "confidence", 0, 1);

  return issue;
}

function assertCivicInput(input) {
  assertPlainObject(input, "Civic AI input");

  if (!input.photo) {
    throw new AISchemaError("Photo is required.");
  }

  assertPlainObject(input.location, "location");

  assertNumberInRange(
    input.location.latitude,
    "latitude",
    -90,
    90
  );

  assertNumberInRange(
    input.location.longitude,
    "longitude",
    -180,
    180
  );

  if (
    input.description !== undefined &&
    input.description !== null &&
    typeof input.description !== "string"
  ) {
    throw new AISchemaError(
      "description must be a string when provided."
    );
  }

  if (
    input.voice !== undefined &&
    input.voice !== null &&
    !Buffer.isBuffer(input.voice) &&
    typeof input.voice !== "string" &&
    typeof input.voice !== "object"
  ) {
    throw new AISchemaError(
      "voice must be a supported audio input when provided."
    );
  }

  if (
    input.reportCount !== undefined &&
    input.reportCount !== null
  ) {
    if (
      !Number.isInteger(Number(input.reportCount)) ||
      Number(input.reportCount) < 1
    ) {
      throw new AISchemaError(
        "reportCount must be a positive integer when provided."
      );
    }
  }

  if (
    input.durationDays !== undefined &&
    input.durationDays !== null
  ) {
    if (
      !Number.isFinite(Number(input.durationDays)) ||
      Number(input.durationDays) < 0
    ) {
      throw new AISchemaError(
        "durationDays must be a non-negative number when provided."
      );
    }
  }

  if (
    input.importantLocation !== undefined &&
    input.importantLocation !== null &&
    typeof input.importantLocation !== "boolean"
  ) {
    throw new AISchemaError(
      "importantLocation must be boolean when provided."
    );
  }

  return input;
}

function assertCivicResult(result) {
  assertPlainObject(result, "Civic AI result");

  if (typeof result.success !== "boolean") {
    throw new AISchemaError("success must be a boolean.");
  }

  if (!result.success) {
    assertPlainObject(result.error, "error");
    assertNonEmptyString(result.error.code, "error.code");
    assertNonEmptyString(result.error.message, "error.message");
    return result;
  }

  assertPlainObject(result.location, "location");

  assertNumberInRange(
    result.location.latitude,
    "location.latitude",
    -90,
    90
  );

  assertNumberInRange(
    result.location.longitude,
    "location.longitude",
    -180,
    180
  );

  assertImageAnalysis(result.imageAnalysis);

  if (
    result.textAnalysis !== null &&
    result.textAnalysis !== undefined
  ) {
    assertComplaintAnalysis(result.textAnalysis);
  }

  if (
    result.voiceAnalysis !== null &&
    result.voiceAnalysis !== undefined
  ) {
    assertVoiceTranscription(result.voiceAnalysis);
  }

  if (result.issueStatus === "MULTIPLE_ISSUES_DETECTED") {
    if (!Array.isArray(result.reports) || result.reports.length < 2) {
      throw new AISchemaError(
        "Multiple-issue results must contain at least two reports."
      );
    }

    assertReports(result.reports);

    // Fusion may be null when evidence conflict is detected
    // before the fusion stage.
    if (result.fusion !== null) {
      assertFusionResult(result.fusion);

      if (result.fusion.isSameIssue !== false) {
        throw new AISchemaError(
          "Multiple-issue result requires fusion.isSameIssue to be false."
        );
      }
    }

    if (result.masterIssue !== null) {
      throw new AISchemaError(
        "masterIssue must be null for multiple issues."
      );
    }

    if (result.evidence !== null) {
      throw new AISchemaError(
        "evidence must be null for multiple issues."
      );
    }

    if (result.priority !== null) {
      throw new AISchemaError(
        "priority must be null for multiple issues."
      );
    }

    assertNonEmptyString(result.message, "message");

    return result;
  }

  if (result.issueStatus !== "SINGLE_MASTER_ISSUE") {
    throw new AISchemaError(
      "issueStatus contains an unsupported value."
    );
  }

  assertReports(result.reports);
  assertFusionResult(result.fusion);

  if (result.fusion.isSameIssue !== true) {
    throw new AISchemaError(
      "Single-master-issue result requires fusion.isSameIssue to be true."
    );
  }

  assertPlainObject(result.masterIssue, "masterIssue");

  assertAllowed(
    result.masterIssue.category,
    "masterIssue.category",
    CATEGORIES
  );

  assertNonEmptyString(
    result.masterIssue.title,
    "masterIssue.title"
  );

  assertNonEmptyString(
    result.masterIssue.summary,
    "masterIssue.summary"
  );

  assertEvidenceResult(result.evidence);
  assertPriorityResult(result.priority);
  assertNonEmptyString(result.department, "department");

  return result;
}

module.exports = {
  AISchemaError,
  assertComplaintAnalysis,
  assertImageAnalysis,
  assertVoiceTranscription,
  assertFusionResult,
  assertEvidenceResult,
  assertPriorityResult,
  assertReports,
  assertEvidenceReports,
  assertPriorityInput,
  assertCivicInput,
  assertCivicResult,
};
