const Groq = require("groq-sdk");
const fusionPrompt = require("./fusionPrompt");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function fuseIssues(reports) {

    const reportsText = reports
        .map((report, index) => {
            return `
Report ${index + 1}:
Category: ${report.category}
Location: ${report.location}
Description: ${report.description}
Severity: ${report.severity}
`;
        })
        .join("\n");

    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: fusionPrompt
            },
            {
                role: "user",
                content: reportsText
            }
        ],
        model: "openai/gpt-oss-120b",
        temperature: 0.1,
        response_format: {
            type: "json_object"
        }
    });

    return JSON.parse(
        completion.choices[0].message.content
    );
}

module.exports = fuseIssues;