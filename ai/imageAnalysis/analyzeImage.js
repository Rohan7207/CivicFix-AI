const Groq = require("groq-sdk");
const imagePrompt = require("./imagePrompt");
const toImageInput = require("../utils/normalizeImage");
const { assertImageAnalysis } = require("../validation/aiSchemas");

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not configured.");
}

if (!process.env.GROQ_VISION_MODEL) {
  throw new Error("GROQ_VISION_MODEL is not configured.");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function analyzeImage(imageUrl) {
  if (!imageUrl) {
    throw new Error("Image URL is required.");
  }

  let normalizedImage;

  try {
    normalizedImage = toImageInput(imageUrl);
  } catch (error) {
    throw new Error(`Image input error: ${error.message}`);
  }

  try {
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_VISION_MODEL,
      temperature: 0.2,
      reasoning_effort: "none",
      max_completion_tokens: 400,
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: imagePrompt,
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
      throw new Error("AI returned an empty image analysis.");
    }

    let result;

    try {
      result = JSON.parse(content);
    } catch (error) {
      throw new Error("AI returned invalid JSON for image analysis.");
    }

    return assertImageAnalysis(result);
  } catch (error) {
    if (error?.name === "AISchemaError") {
      throw error;
    }

    throw new Error(`Image analysis failed: ${error.message}`);
  }
}

module.exports = analyzeImage;
