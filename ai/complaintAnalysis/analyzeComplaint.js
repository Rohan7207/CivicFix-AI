const Groq = require("groq-sdk");
const prompt = require("./prompt");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function analyzeComplaint(complaintText) {
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: prompt
            },
            {
                role: "user",
                content: complaintText
            }
        ],
        model: "openai/gpt-oss-120b",
        temperature: 0.2,
        response_format: {
            type: "json_object"
        }
    });

    const result = completion.choices[0].message.content;

    return JSON.parse(result);
}

module.exports = analyzeComplaint;