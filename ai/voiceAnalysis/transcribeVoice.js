const Groq = require("groq-sdk");
const fs = require("fs");
const path = require("path");
const os = require("os");

if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured.");
}

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

function getAudioInput(audioInput, originalFilename) {
    // Multer file object
    if (audioInput && Buffer.isBuffer(audioInput.buffer)) {
        return {
            buffer: audioInput.buffer,
            filename: audioInput.originalname || originalFilename || "voice.webm",
        };
    }

    // Raw Buffer
    if (Buffer.isBuffer(audioInput)) {
        return {
            buffer: audioInput,
            filename: originalFilename || "voice.webm",
        };
    }

    throw new Error("Valid audio input is required.");
}

async function transcribeVoice(audioInput, originalFilename) {

    const { buffer, filename } = getAudioInput(
        audioInput,
        originalFilename
    );

    if (buffer.length === 0) {
        throw new Error("Audio file is empty.");
    }

    const extension =
        path.extname(filename).toLowerCase() || ".webm";

    const tempPath = path.join(
        os.tmpdir(),
        `civicfix-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}${extension}`
    );

    try {
        fs.writeFileSync(tempPath, buffer);

        const transcription =
            await groq.audio.transcriptions.create({
                file: fs.createReadStream(tempPath),
                model: "whisper-large-v3",
                response_format: "verbose_json",
            });

        if (!transcription || typeof transcription.text !== "string") {
            throw new Error("Voice transcription returned an invalid response.");
        }

        return {
            transcription: transcription.text.trim(),
            language: transcription.language || "unknown",
        };

    } catch (error) {
        throw new Error(
            `Voice transcription failed: ${error.message}`
        );
    } finally {
        if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
        }
    }
}

module.exports = transcribeVoice;