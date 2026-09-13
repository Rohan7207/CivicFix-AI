const Groq = require("groq-sdk");
const fs = require("fs");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});


async function transcribeVoice(audioPath) {

    if (!audioPath) {
        throw new Error("Audio file path is required.");
    }

    if (!fs.existsSync(audioPath)) {
        throw new Error("Audio file not found.");
    }

    const transcription =
        await groq.audio.transcriptions.create({

            file: fs.createReadStream(audioPath),

            model: "whisper-large-v3",

            response_format: "verbose_json"
        });


    return {
        transcription:
            transcription.text,

        language:
            transcription.language || "unknown"
    };
}


module.exports = transcribeVoice;