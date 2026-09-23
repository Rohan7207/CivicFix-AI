const calculatePriority = require("./calculatePriority");

const issue = {
  severity: 9,
  safetyRisk: "HIGH",
  reportCount: 7,
  importantLocation: "YES",
  durationDays: 10,
  confidence: 0.96,
};

const result = calculatePriority(issue);
