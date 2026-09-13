const analyzeImage =
    require("./imageAnalysis/analyzeImage");

const analyzeComplaint =
    require("./complaintAnalysis/analyzeComplaint");

const processVoiceComplaint =
    require("./voiceAnalysis/processVoice");

const fuseIssues =
    require("./issueFusion/fuseIssues");

const calculateEvidence =
    require("./evidenceEngine/calculateEvidence");

const calculatePriority =
    require("./priorityEngine/calculatePriority");


async function processCivicIssue(input) {

    if (!input) {
        throw new Error("Input is required.");
    }

    // ---------------------------------------------
    // REQUIRED INPUTS
    // ---------------------------------------------

    if (!input.photo) {
        throw new Error("Photo is required.");
    }

    if (!input.location) {
        throw new Error("Location is required.");
    }

    if (
        typeof input.location.latitude !== "number" ||
        typeof input.location.longitude !== "number"
    ) {
        throw new Error(
            "Valid latitude and longitude are required."
        );
    }


    // ---------------------------------------------
    // IMAGE ANALYSIS
    // ---------------------------------------------

    const imageAnalysis =
        await analyzeImage(input.photo);

    if (!imageAnalysis.isCivicIssue) {
        return {
            success: false,
            error: {
                code: "NOT_CIVIC_ISSUE",
                message:
                    "The uploaded photo does not appear to show a civic issue."
            }
        };
    }


    // ---------------------------------------------
    // OPTIONAL TEXT ANALYSIS
    // ---------------------------------------------

    let textAnalysis = null;

    if (
        typeof input.description === "string" &&
        input.description.trim()
    ) {

        textAnalysis =
            await analyzeComplaint(
                input.description
            );
    }


    // ---------------------------------------------
    // OPTIONAL VOICE ANALYSIS
    // ---------------------------------------------

    let voiceAnalysis = null;

    if (input.voice) {

        voiceAnalysis =
            await processVoiceComplaint(
                input.voice
            );
    }


    // ---------------------------------------------
    // CREATE ANALYZED REPORTS
    // ---------------------------------------------

    const reports = [];


    // Photo is always one evidence source
    reports.push({

        location:
            `${input.location.latitude},${input.location.longitude}`,

        description:
            imageAnalysis.visualDescription,

        category:
            imageAnalysis.category,

        severity:
            imageAnalysis.severity,

        safetyRisk:
            imageAnalysis.safetyRisk,

        confidence:
            imageAnalysis.confidence,

        source:
            "IMAGE"
    });


    // Optional text evidence
    if (textAnalysis) {

        reports.push({

            location:
                `${input.location.latitude},${input.location.longitude}`,

            description:
                textAnalysis.shortSummary,

            category:
                textAnalysis.category,

            severity:
                textAnalysis.severity,

            safetyRisk:
                textAnalysis.safetyRisk,

            confidence:
                textAnalysis.confidence,

            source:
                "TEXT"
        });
    }


    // Optional voice evidence
    if (voiceAnalysis) {

        reports.push({

            location:
                `${input.location.latitude},${input.location.longitude}`,

            description:
                voiceAnalysis.shortSummary,

            category:
                voiceAnalysis.category,

            severity:
                voiceAnalysis.severity,

            safetyRisk:
                voiceAnalysis.safetyRisk,

            confidence:
                voiceAnalysis.confidence,

            source:
                "VOICE"
        });
    }


    // ---------------------------------------------
    // ISSUE FUSION
    // ---------------------------------------------

    let fusionResult;


    // Only one evidence source:
    // no fusion is required.
    if (reports.length === 1) {

        fusionResult = {

            isSameIssue: true,

            confidence:
                reports[0].confidence,

            masterIssue: {

                category:
                    reports[0].category,

                title:
                    reports[0].description,

                summary:
                    reports[0].description
            },

            reason:
                "The civic issue is currently supported by the mandatory photo evidence."
        };

    } else {

        fusionResult =
            await fuseIssues(reports);
    }


    // ---------------------------------------------
    // DIFFERENT ISSUE HANDLING
    // ---------------------------------------------

    if (
        reports.length > 1 &&
        fusionResult.isSameIssue === false
    ) {

        return {

            success: true,

            location:
                input.location,

            imageAnalysis,

            textAnalysis,

            voiceAnalysis,

            issueStatus:
                "MULTIPLE_ISSUES_DETECTED",

            message:
                "The supplied evidence describes different civic issues.",

            reports,

            fusion:
                fusionResult,

            masterIssue:
                null,

            evidence:
                null,

            priority:
                null
        };
    }


    // ---------------------------------------------
    // SAME ISSUE → EVIDENCE
    // ---------------------------------------------

    const evidenceResult =
        calculateEvidence(reports);


    // ---------------------------------------------
    // AVERAGE SEVERITY
    // ---------------------------------------------

    const averageSeverity =
        reports.reduce(
            (sum, report) =>
                sum + Number(report.severity || 0),
            0
        ) / reports.length;


    // ---------------------------------------------
    // AVERAGE CONFIDENCE
    // ---------------------------------------------

    const averageConfidence =
        reports.reduce(
            (sum, report) =>
                sum + Number(report.confidence || 0),
            0
        ) / reports.length;


    // ---------------------------------------------
    // HIGHEST SAFETY RISK
    // ---------------------------------------------

    let safetyRisk = "LOW";

    if (
        reports.some(
            report =>
                report.safetyRisk === "HIGH"
        )
    ) {

        safetyRisk = "HIGH";

    } else if (
        reports.some(
            report =>
                report.safetyRisk === "MEDIUM"
        )
    ) {

        safetyRisk = "MEDIUM";
    }


    // ---------------------------------------------
    // DEPARTMENT
    // ---------------------------------------------

    const department =
        textAnalysis?.department ||
        voiceAnalysis?.department ||
        "Other";


    // ---------------------------------------------
    // PRIORITY
    // ---------------------------------------------

    const priorityInput = {

        severity:
            Math.round(averageSeverity),

        safetyRisk,

       reportCount:
    Number(input.reportCount || 1),

        importantLocation:
            input.importantLocation === true
                ? "YES"
                : "NO",

        durationDays:
            Number(input.durationDays || 0),

        confidence:
            averageConfidence
    };


    const priorityResult =
        calculatePriority(
            priorityInput
        );


    // ---------------------------------------------
    // FINAL RESULT
    // ---------------------------------------------

    return {

        success: true,

        location:
            input.location,

        imageAnalysis,

        textAnalysis,

        voiceAnalysis,

        issueStatus:
            "SINGLE_MASTER_ISSUE",

        reports,

        masterIssue:
            fusionResult.masterIssue,

        fusion:
            fusionResult,

        evidence:
            evidenceResult,

        priority:
            priorityResult,

        department
    };
}


module.exports =
    processCivicIssue;