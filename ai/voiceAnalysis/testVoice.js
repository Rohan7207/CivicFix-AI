require("dotenv").config({
    path: "./ai/complaintAnalysis/.env"
});

const processVoiceComplaint =
    require("./processVoice");


const audioPath =
    "./ai/voiceAnalysis/test.wav";


async function test() {

    try {

        const result =
            await processVoiceComplaint(
                audioPath
            );

        console.log(
            "\n================================"
        );

        console.log(
            "       VOICE AI RESULT"
        );

        console.log(
            "================================\n"
        );

        console.log(
            JSON.stringify(
                result,
                null,
                2
            )
        );

    } catch (error) {

        console.error(
            "\nVOICE AI ERROR:"
        );

        console.error(
            error.message
        );
    }
}


test();