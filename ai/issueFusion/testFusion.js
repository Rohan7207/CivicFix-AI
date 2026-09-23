require("dotenv").config();

const fuseIssues = require("./fuseIssues");

async function test() {
  const reports = [
    {
      category: "Pothole",
      location: "Near City School Gate",
      description:
        "There is a huge pothole near the school gate and bikes are falling.",
      severity: 8,
    },
    {
      category: "Pothole",
      location: "Near City School Gate",
      description:
        "Large pothole outside the school entrance causing accidents.",
      severity: 8,
    },
    {
      category: "Road Damage",
      location: "Near City School Gate",
      description: "Dangerous damaged road near the school gate.",
      severity: 7,
    },
  ];

  try {
    const result = await fuseIssues(reports);
  } catch (error) {
    console.error("FUSION ERROR:", error.message);
  }
}

test();
