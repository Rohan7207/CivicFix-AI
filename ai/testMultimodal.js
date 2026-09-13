require("dotenv").config({
    path: "./ai/complaintAnalysis/.env"
});

const processCivicIssue =
    require("./civicAI");


const input = {

    photo:
        "./ai/imageAnalysis/test.jpg",

    location: {
        latitude: 16.2000,
        longitude: 77.3600
    },

    // Optional
    description:
        "Traffic signal hanging precariously by a single wire from a metal pole.",

    // Optional
    voice:
        null,

    importantLocation:
        true,

    durationDays:
        5
};


async function test() {

    try {

        const result =
            await processCivicIssue(input);

        console.log(
            "\n================================"
        );

        console.log(
            "     CIVICFIX MULTIMODAL AI"
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
            "\nMULTIMODAL AI ERROR:"
        );

        console.error(
            error.message
        );
    }
}


test();