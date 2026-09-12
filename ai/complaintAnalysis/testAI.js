// require("dotenv").config();

// const analyzeComplaint = require("./analyzeComplaint");

// async function test() {
//     const complaint =
//         "There is a huge pothole near the school gate and several bikes are falling.";

//     try {
//         const result = await analyzeComplaint(complaint);

//         console.log("AI RESULT:");
//         console.log(result);

//         console.log("\nCategory:", result.category);
//         console.log("Severity:", result.severity);
//         console.log("Safety Risk:", result.safetyRisk);
//         console.log("Confidence:", result.confidence);
//         console.log("Department:", result.department);
//         console.log("Summary:", result.shortSummary);

//     } catch (error) {
//         console.error("AI ERROR:", error.message);
//     }
// }

// test();

const analyzeComplaint =
    require("./analyzeComplaint");

async function test() {
    const result = await analyzeComplaint(
        "ಶಾಲೆಯ ಮುಂದೆ ದೊಡ್ಡ ಗುಂಡಿ ಇದೆ. ಬೈಕ್ ಸವಾರರು ಬೀಳುತ್ತಿದ್ದಾರೆ."
    );

    console.log("AI RESULT:");
    console.log(JSON.stringify(result, null, 2));
}

test();