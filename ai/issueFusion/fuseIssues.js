const Groq = require("groq-sdk");
const fusionPrompt = require("./fusionPrompt");
const {
  assertReports,
  assertFusionResult,
} = require("../validation/aiSchemas");

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not configured.");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function fuseIssues(reports) {
  assertReports(reports);

  const reportsText = reports
    .map((report, index) => {
      return `
Report ${index + 1}:
Category: ${report.category}
Location: ${report.location}
Description: ${report.description}
Severity: ${report.severity}
Safety Risk: ${report.safetyRisk}
Confidence: ${report.confidence}
Source: ${report.source}
`;
    })
    .join("\n");

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: fusionPrompt,
        },
        {
          role: "user",
          content: reportsText,
        },
      ],
      model: "openai/gpt-oss-120b",
      temperature: 0.1,
      response_format: {
        type: "json_object",
      },
    });

    const content = completion?.choices?.[0]?.message?.content;

    if (!content || typeof content !== "string") {
      throw new Error("AI returned an empty fusion result.");
    }

    let result;

    try {
      result = JSON.parse(content);
    } catch (error) {
      throw new Error("AI returned invalid JSON for issue fusion.");
    }

    return assertFusionResult(result);
  } catch (error) {
    if (error?.name === "AISchemaError") {
      throw error;
    }

    throw new Error(`Issue fusion failed: ${error.message}`);
  }
}

module.exports = fuseIssues;
