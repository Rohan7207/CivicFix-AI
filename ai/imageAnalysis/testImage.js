require("dotenv").config({
    path: "./ai/complaintAnalysis/.env"
});

const analyzeImage =
    require("./analyzeImage");

const imagePath =
    "./ai/imageAnalysis/test.jpg";

async function test() {

    try {

        const result =
            await analyzeImage(imagePath);

        console.log(
            "\n================================"
        );

        console.log(
            "       CIVICFIX IMAGE AI"
        );

        console.log(
            "================================\n"
        );

        console.log(
            JSON.stringify(result, null, 2)
        );

    } catch (error) {

        console.error(
            "\nIMAGE AI ERROR:"
        );

        console.error(
            error.message
        );
    }
}

test();