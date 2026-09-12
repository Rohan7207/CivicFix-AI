const calculateEvidence =
    require("./calculateEvidence");

const reports = [
    {
        location: "Near City School Gate",
        safetyRisk: "HIGH",
        confidence: 0.98
    },
    {
        location: "Near City School Gate",
        safetyRisk: "HIGH",
        confidence: 0.98
    },
    {
        location: "Near City School Gate",
        safetyRisk: "HIGH",
        confidence: 0.96
    }
];

const result =
    calculateEvidence(reports);

console.log("EVIDENCE RESULT:");

console.log(
    JSON.stringify(result, null, 2)
);