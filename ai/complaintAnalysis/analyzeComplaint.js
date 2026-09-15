const Groq = require("groq-sdk");
const complaintAnalysisPrompt = require("./prompt");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function analyzeComplaint({
  complaintText = "",
  imageUrl,
  voiceText = "",
}) {
  if (!imageUrl) {
    throw new Error("Image URL is required for complaint analysis.");
  }

  const supportingText = [
    complaintText
      ? `CITIZEN DESCRIPTION:\n${complaintText}`
      : "CITIZEN DESCRIPTION:\nNot provided.",
    voiceText
      ? `VOICE TRANSCRIPT:\n${voiceText}`
      : "VOICE TRANSCRIPT:\nNot provided.",
  ].join("\n\n");

  const completion = await groq.chat.completions.create({
    model: process.env.GROQ_VISION_MODEL,

    temperature: 0.1,

    reasoning_effort: "none",

    max_completion_tokens: 500,

    response_format: {
      type: "json_object",
    },

    messages: [
      {
        role: "system",
        content: complaintAnalysisPrompt,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: supportingText,
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl,
            },
          },
        ],
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error("AI returned an empty complaint analysis.");
  }

  return JSON.parse(content);
}

module.exports = analyzeComplaint;
