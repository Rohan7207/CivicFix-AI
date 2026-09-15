const Groq = require("groq-sdk");
const fs = require("fs");
const path = require("path");
const os = require("os");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function transcribeVoice(audioBuffer, originalFilename) {
  if (!audioBuffer) {
    throw new Error("Audio buffer is required.");
  }

  const extension = path.extname(originalFilename) || ".webm";

  const tempPath = path.join(os.tmpdir(), `civicfix-${Date.now()}${extension}`);

  fs.writeFileSync(tempPath, audioBuffer);

  try {
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(tempPath),
      model: "whisper-large-v3",
      response_format: "verbose_json",
    });

    return {
      transcription: transcription.text,
      language: transcription.language || "unknown",
    };
  } finally {
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }
}

module.exports = transcribeVoice;
