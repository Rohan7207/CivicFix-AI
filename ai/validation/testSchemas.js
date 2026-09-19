const {
  assertComplaintAnalysis,
  assertImageAnalysis,
  assertFusionResult,
  assertEvidenceResult,
  assertPriorityResult,
  assertPriorityInput,
  assertReports,
  assertEvidenceReports,
} = require("./aiSchemas");

function expectFailure(name, fn) {
  try {
    fn();
    throw new Error(`${name} should have failed.`);
  } catch (error) {
    if (error.message === `${name} should have failed.`) {
      throw error;
    }
    console.log(`PASS: ${name}`);
  }
}

assertComplaintAnalysis({
  isCivicIssue: true,
  category: "Pothole",
  severity: 8,
  safetyRisk: "HIGH",
  confidence: 0.98,
  evidenceConflict: false,
  department: "Public Works Department",
  shortSummary: "Large pothole near school gate.",
  language: "en",
  englishTranslation: "Large pothole near school gate.",
});

assertImageAnalysis({
  isCivicIssue: true,
  category: "Pothole",
  severity: 8,
  safetyRisk: "HIGH",
  confidence: 0.95,
  visualDescription: "Large pothole visible in the road.",
  visibleEvidence: ["Large road cavity"],
});

assertFusionResult({
  isSameIssue: true,
  confidence: 0.95,
  masterIssue: {
    category: "Pothole",
    title: "Large pothole near school gate",
    summary: "Multiple reports describe the same pothole.",
  },
  reason: "Reports describe the same physical location and issue.",
});

assertEvidenceResult({
  evidenceScore: 78,
  evidenceLevel: "MODERATE",
  explanation: "Reports have consistent locations. High AI confidence.",
  breakdown: {
    reportScore: 13,
    locationScore: 25,
    safetyScore: 20,
    confidenceScore: 24,
  },
});

const validPriorityInput = {
  severity: 9,
  safetyRisk: "HIGH",
  reportCount: 7,
  importantLocation: "YES",
  durationDays: 10,
  confidence: 0.96,
};

assertPriorityInput(validPriorityInput);

assertPriorityResult({
  priorityScore: 100,
  priorityLevel: "CRITICAL",
  explanation: "High issue severity. High safety risk.",
  breakdown: {
    severityScore: 27,
    safetyScore: 25,
    reportScore: 15,
    locationScore: 10,
    durationScore: 10,
    confidenceScore: 10,
  },
});

assertReports([
  {
    location: "16.2,77.36",
    description: "Large pothole near school gate.",
    category: "Pothole",
    severity: 8,
    safetyRisk: "HIGH",
    confidence: 0.95,
    source: "IMAGE",
  },
]);

assertEvidenceReports([
  {
    location: "16.2,77.36",
    safetyRisk: "HIGH",
    confidence: 0.95,
  },
]);

expectFailure("Invalid priority severity", () =>
  assertPriorityInput({ ...validPriorityInput, severity: "x" }),
);

expectFailure("Invalid priority confidence", () =>
  assertPriorityInput({ ...validPriorityInput, confidence: 2 }),
);

expectFailure("Invalid evidence confidence", () =>
  assertEvidenceReports([
    {
      location: "16.2,77.36",
      safetyRisk: "HIGH",
      confidence: 2,
    },
  ]),
);

console.log("\nAll schema validation checks passed.");
