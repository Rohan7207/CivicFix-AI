require("dotenv").config({
    path: "./ai/complaintAnalysis/.env"
});


const processCivicIssue =
    require("./civicAI");


const input = {

    importantLocation:
        true,

    durationDays:
        5,

    reports: [

        {
            location:
                "Near City School Gate",

            description:
                "There is a large pothole near the school gate. Bikes are falling."
        },

        {
            location:
                "Near City School Gate",

            description:
                "Big road pothole outside the school entrance is causing accidents."
        },

        {
            location:
                "Near City School Gate",

            description:
                "A dangerous pothole is present near the school gate and two-wheelers are falling."
        }

    ]
};


async function test() {

    try {

        const result =
            await processCivicIssue(
                input
            );


        console.log(
            "\n================================"
        );

        console.log(
            "      CIVICFIX AI RESULT"
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
            "\nAI PIPELINE ERROR:"
        );

        console.error(
            error
        );
    }
}


test();