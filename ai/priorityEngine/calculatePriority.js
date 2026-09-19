const {
  assertPriorityInput,
  assertPriorityResult,
} = require("../validation/aiSchemas");

function calculatePriority(issue) {
  assertPriorityInput(issue);

  const severityScore = (issue.severity / 10) * 30;

  let safetyScore = 0;

  if (issue.safetyRisk === "HIGH") {
    safetyScore = 25;
  } else if (issue.safetyRisk === "MEDIUM") {
    safetyScore = 15;
  } else {
    safetyScore = 5;
  }

  const reportScore = Math.min(issue.reportCount / 7, 1) * 15;
  const locationScore = issue.importantLocation === "YES" ? 10 : 0;
  const durationScore = Math.min(issue.durationDays / 7, 1) * 10;
  const confidenceScore = issue.confidence * 10;

  const priorityScore = Math.round(
    Math.min(
      severityScore +
        safetyScore +
        reportScore +
        locationScore +
        durationScore +
        confidenceScore,
      100,
    ),
  );

  let priorityLevel;

  if (priorityScore >= 85) {
    priorityLevel = "CRITICAL";
  } else if (priorityScore >= 70) {
    priorityLevel = "HIGH";
  } else if (priorityScore >= 40) {
    priorityLevel = "MEDIUM";
  } else {
    priorityLevel = "LOW";
  }

  const reasons = [];

  if (issue.severity >= 8) {
    reasons.push("High issue severity");
  }

  if (issue.safetyRisk === "HIGH") {
    reasons.push("High safety risk");
  } else if (issue.safetyRisk === "MEDIUM") {
    reasons.push("Moderate safety risk");
  }

  if (issue.reportCount >= 5) {
    reasons.push(`${issue.reportCount} citizen reports`);
  }

  if (issue.importantLocation === "YES") {
    reasons.push("Affects an important public location");
  }

  if (issue.durationDays >= 7) {
    reasons.push(`Issue has existed for ${issue.durationDays} days`);
  }

  if (issue.confidence >= 0.9) {
    reasons.push("High AI evidence confidence");
  }

  const result = {
    priorityScore,
    priorityLevel,
    explanation:
      reasons.length > 0 ? reasons.join(". ") + "." : "Low available evidence.",
    breakdown: {
      severityScore: Math.round(severityScore),
      safetyScore,
      reportScore: Math.round(reportScore),
      locationScore,
      durationScore: Math.round(durationScore),
      confidenceScore: Math.round(confidenceScore),
    },
  };

  return assertPriorityResult(result);
}

module.exports = calculatePriority;
