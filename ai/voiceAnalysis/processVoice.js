// ai/voiceAnalysis/processVoice.js

const transcribeVoice =
    require("./transcribeVoice");

const analyzeComplaint =
    require("../complaintAnalysis/analyzeComplaint");


async function processVoiceComplaint(audioPath) {

    const transcription =
        await transcribeVoice(audioPath);


    const analysis =
        await analyzeComplaint(
            transcription.transcription
        );


    return {

        inputType: "VOICE",

        transcription:
            transcription.transcription,

        detectedLanguage:
            transcription.language,

        englishTranslation:
            analysis.englishTranslation,

        category:
            analysis.category,

        severity:
            analysis.severity,

        safetyRisk:
            analysis.safetyRisk,

        confidence:
            analysis.confidence,

        department:
            analysis.department,

        shortSummary:
            analysis.shortSummary
    };
}


module.exports =
    processVoiceComplaint;