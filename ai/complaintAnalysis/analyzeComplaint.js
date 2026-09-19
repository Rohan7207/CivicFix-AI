const Groq = require("groq-sdk");
const complaintAnalysisPrompt = require("./prompt");
const toImageInput = require("../utils/normalizeImage");
const { assertComplaintAnalysis } = require("../validation/aiSchemas");

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not configured.");
}

if (!process.env.GROQ_VISION_MODEL) {
  throw new Error("GROQ_VISION_MODEL is not configured.");
}

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

  if (typeof complaintText !== "string") {
    throw new Error("Complaint text must be a string when provided.");
  }

  if (typeof voiceText !== "string") {
    throw new Error("Voice text must be a string when provided.");
  }

  let normalizedImage;

  try {
    normalizedImage = toImageInput(imageUrl);
  } catch (error) {
    throw new Error(`Complaint analysis image error: ${error.message}`);
  }

  const supportingText = [
    complaintText.trim()
      ? `CITIZEN DESCRIPTION:\n${complaintText.trim()}`
      : "CITIZEN DESCRIPTION:\nNot provided.",
    voiceText.trim()
      ? `VOICE TRANSCRIPT:\n${voiceText.trim()}`
      : "VOICE TRANSCRIPT:\nNot provided.",
  ].join("\n\n");

  try {
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
                url: normalizedImage,
              },
            },
          ],
        },
      ],
    });

    const content = completion?.choices?.[0]?.message?.content;

    if (!content || typeof content !== "string") {
      throw new Error("AI returned an empty complaint analysis.");
    }

    let result;

    try {
      result = JSON.parse(content);
    } catch (error) {
      throw new Error("AI returned invalid JSON for complaint analysis.");
    }

    return assertComplaintAnalysis(result);
  } catch (error) {
    if (error?.name === "AISchemaError") {
      throw error;
    }

    throw new Error(`Complaint analysis failed: ${error.message}`);
  }
}

module.exports = analyzeComplaint;
