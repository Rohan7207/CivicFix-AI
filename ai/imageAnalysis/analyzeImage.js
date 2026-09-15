const Groq = require("groq-sdk");
const imagePrompt = require("./imagePrompt");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function analyzeImage(imageUrl) {
  if (!imageUrl) {
    throw new Error("Image URL is required.");
  }

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
              url: imageUrl,
            },
          },
        ],
      },
    ],
  });

  const result = completion.choices[0].message.content;

  return JSON.parse(result);
}

module.exports = analyzeImage;
