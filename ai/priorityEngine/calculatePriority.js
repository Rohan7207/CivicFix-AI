function calculatePriority(issue) {

    // --------------------------------
    // 1. Severity Score — 30 points
    // --------------------------------

    const severityScore =
        (issue.severity / 10) * 30;


    // --------------------------------
    // 2. Safety Risk Score — 25 points
    // --------------------------------

    let safetyScore = 0;

    if (issue.safetyRisk === "HIGH") {
        safetyScore = 25;
    } else if (issue.safetyRisk === "MEDIUM") {
        safetyScore = 15;
    } else {
        safetyScore = 5;
    }


    // --------------------------------
    // 3. Report Count Score — 15 points
    // --------------------------------

    const reportScore =
        Math.min(issue.reportCount / 7, 1) * 15;


    // --------------------------------
    // 4. Important Location Score — 10 points
    // --------------------------------

    const locationScore =
        issue.importantLocation === "YES"
            ? 10
            : 0;


    // --------------------------------
    // 5. Duration Score — 10 points
    // --------------------------------

    const durationScore =
        Math.min(issue.durationDays / 7, 1) * 10;


    // --------------------------------
    // 6. AI Confidence Score — 10 points
    // --------------------------------

    const confidenceScore =
        issue.confidence * 10;


    // --------------------------------
    // Final Priority Score
    // --------------------------------

    let priorityScore =
        severityScore +
        safetyScore +
        reportScore +
        locationScore +
        durationScore +
        confidenceScore;


    // Keep score between 0 and 100
    priorityScore = Math.round(
        Math.min(priorityScore, 100)
    );


    // --------------------------------
    // Priority Level
    // --------------------------------

    let priorityLevel;

    if (priorityScore >= 85) {

        priorityLevel = "CRITICAL";

    } else if (priorityScore >= 70) {

        priorityLevel = "HIGH";

    } else if (priorityScore >= 40) {

        priorityLevel = "MEDIUM";

    } else {

        priorityLevel = "LOW";
    }


    // --------------------------------
    // Explainable AI Reasons
    // --------------------------------

    const reasons = [];


    if (issue.severity >= 8) {
        reasons.push("High issue severity");
    }


    if (issue.safetyRisk === "HIGH") {
        reasons.push("High safety risk");
    }


    if (issue.reportCount >= 5) {
        reasons.push(
            `${issue.reportCount} citizen reports`
        );
    }


    if (issue.importantLocation === "YES") {
        reasons.push(
            "Affects an important public location"
        );
    }


    if (issue.durationDays >= 7) {
        reasons.push(
            `Issue has existed for ${issue.durationDays} days`
        );
    }


    if (issue.confidence >= 0.9) {
        reasons.push(
            "High AI evidence confidence"
        );
    }


    return {

        priorityScore,

        priorityLevel,

        explanation:
            reasons.length > 0
                ? reasons.join(". ") + "."
                : "Low available evidence.",

        breakdown: {

            severityScore:
                Math.round(severityScore),

            safetyScore,

            reportScore:
                Math.round(reportScore),

            locationScore,

            durationScore:
                Math.round(durationScore),

            confidenceScore:
                Math.round(confidenceScore)
        }
    };
}


module.exports = calculatePriority;