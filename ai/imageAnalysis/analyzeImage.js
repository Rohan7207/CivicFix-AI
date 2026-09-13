const Groq = require("groq-sdk");
const fs = require("fs");
const path = require("path");

const imagePrompt = require("./imagePrompt");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

function getMimeType(imagePath) {

    const extension =
        path.extname(imagePath).toLowerCase();

    if (extension === ".png") {
        return "image/png";
    }

    if (extension === ".webp") {
        return "image/webp";
    }

    if (extension === ".jpg" || extension === ".jpeg") {
        return "image/jpeg";
    }

    throw new Error(
        "Unsupported image format. Use JPG, JPEG, PNG or WEBP."
    );
}

async function analyzeImage(imagePath) {

    if (!imagePath) {
        throw new Error("Image path is required.");
    }

    if (!fs.existsSync(imagePath)) {
        throw new Error("Image file not found.");
    }

    const imageBuffer =
        fs.readFileSync(imagePath);

    if (imageBuffer.length === 0) {
        throw new Error("Image file is empty.");
    }

    const mimeType =
        getMimeType(imagePath);

    const base64Image =
        imageBuffer.toString("base64");

    const imageDataUrl =
        `data:${mimeType};base64,${base64Image}`;

   const completion =
    await groq.chat.completions.create({

        model:
            process.env.GROQ_VISION_MODEL,

        temperature: 0.2,

        reasoning_effort: "none",

        max_completion_tokens: 400,

        response_format: {
            type: "json_object"
        },

        messages: [
            {
                role: "user",

                content: [
                    {
                        type: "text",
                        text: imagePrompt
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: imageDataUrl
                        }
                    }
                ]
            }
        ]
    });
    const result =
        completion.choices[0].message.content;

    return JSON.parse(result);
}

module.exports = analyzeImage;