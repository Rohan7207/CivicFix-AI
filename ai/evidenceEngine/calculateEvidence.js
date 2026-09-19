const { assertEvidenceReports, assertEvidenceResult } = require("../validation/aiSchemas");

function calculateEvidence(reports) {
  assertEvidenceReports(reports);

  // Number of evidence sources, not necessarily citizen reports
  const reportScore = Math.min(reports.length / 7, 1) * 30;

  const locations = reports.map((report) => report.location);
  const firstLocation = locations[0];
  const locationMatch = locations.every(
    (location) => location === firstLocation,
  );
  const locationScore = locationMatch ? 25 : 0;

  const safetyValues = {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
  };

  const numericRisks = reports.map((report) => safetyValues[report.safetyRisk]);
  const minRisk = Math.min(...numericRisks);
  const maxRisk = Math.max(...numericRisks);

  let safetyScore = 0;

  if (minRisk === maxRisk) {
    safetyScore = 20;
  } else if (maxRisk - minRisk === 1) {
    safetyScore = 15;
  } else {
    safetyScore = 5;
  }

  const totalConfidence = reports.reduce(
    (sum, report) => sum + report.confidence,
    0,
  );

  const averageConfidence = totalConfidence / reports.length;
  const confidenceScore = averageConfidence * 25;

  const evidenceScore = Math.round(
    Math.min(reportScore + locationScore + safetyScore + confidenceScore, 100),
  );

  let evidenceLevel;

  if (evidenceScore >= 80) {
    evidenceLevel = "STRONG";
  } else if (evidenceScore >= 50) {
    evidenceLevel = "MODERATE";
  } else {
    evidenceLevel = "WEAK";
  }

  const reasons = [];

  if (reports.length >= 5) {
    reasons.push(`${reports.length} supporting evidence sources`);
  }

  if (locationMatch) {
    reasons.push("Reports have consistent locations");
  }

  if (safetyScore === 20) {
    reasons.push("Reports agree on the safety risk");
  } else if (safetyScore === 15) {
    reasons.push("Reports show broadly consistent safety risk");
  }

  if (averageConfidence >= 0.9) {
    reasons.push("High AI confidence");
  }

  const result = {
    evidenceScore,
    evidenceLevel,
    explanation:
      reasons.length > 0
        ? reasons.join(". ") + "."
        : "Limited supporting evidence.",
    breakdown: {
      reportScore: Math.round(reportScore),
      locationScore,
      safetyScore,
      confidenceScore: Math.round(confidenceScore),
    },
  };

  return assertEvidenceResult(result);
}

module.exports = calculateEvidence;
