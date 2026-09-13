function calculateEvidence(reports) {

    if (!Array.isArray(reports) || reports.length === 0) {
        return {
            evidenceScore: 0,
            evidenceLevel: "WEAK",
            explanation: "No supporting evidence available.",
            breakdown: {
                reportScore: 0,
                locationScore: 0,
                safetyScore: 0,
                confidenceScore: 0
            }
        };
    }

    // Number of evidence sources, not necessarily citizen reports
    const reportScore =
        Math.min(reports.length / 7, 1) * 30;


    // ---------------------------------------------
    // LOCATION CONSISTENCY
    // ---------------------------------------------

    const locations =
        reports.map(report => report.location);

    const firstLocation =
        locations[0];

    const locationMatch =
        locations.every(
            location => location === firstLocation
        );

    const locationScore =
        locationMatch ? 25 : 0;


    // ---------------------------------------------
    // SAFETY AGREEMENT
    // HIGH > MEDIUM > LOW
    //
    // We treat a higher risk assessment as compatible
    // with a lower one, rather than treating MEDIUM vs HIGH
    // as total disagreement.
    // ---------------------------------------------

    const safetyValues = {
        LOW: 1,
        MEDIUM: 2,
        HIGH: 3
    };

    const safetyRisks =
        reports
            .map(report => report.safetyRisk)
            .filter(Boolean);

    let safetyScore = 0;

    if (safetyRisks.length > 0) {

        const numericRisks =
            safetyRisks.map(
                risk => safetyValues[risk] || 0
            );

        const minRisk =
            Math.min(...numericRisks);

        const maxRisk =
            Math.max(...numericRisks);

        if (minRisk === maxRisk) {
            // Exact agreement
            safetyScore = 20;

        } else if (
            maxRisk - minRisk === 1
        ) {
            // Adjacent assessment, e.g. MEDIUM vs HIGH
            safetyScore = 15;

        } else {
            // LOW vs HIGH is a meaningful disagreement
            safetyScore = 5;
        }
    }


    // ---------------------------------------------
    // AI CONFIDENCE
    // ---------------------------------------------

    const totalConfidence =
        reports.reduce(
            (sum, report) =>
                sum + Number(report.confidence || 0),
            0
        );

    const averageConfidence =
        totalConfidence / reports.length;

    const confidenceScore =
        averageConfidence * 25;


    // ---------------------------------------------
    // FINAL SCORE
    // ---------------------------------------------

    let evidenceScore =
        reportScore +
        locationScore +
        safetyScore +
        confidenceScore;

    evidenceScore =
        Math.round(
            Math.min(evidenceScore, 100)
        );


    let evidenceLevel;

    if (evidenceScore >= 80) {

        evidenceLevel = "STRONG";

    } else if (evidenceScore >= 50) {

        evidenceLevel = "MODERATE";

    } else {

        evidenceLevel = "WEAK";
    }


    // ---------------------------------------------
    // EXPLANATION
    // ---------------------------------------------

    const reasons = [];

    if (reports.length >= 5) {
        reasons.push(
            `${reports.length} supporting evidence sources`
        );
    }

    if (locationMatch) {
        reasons.push(
            "Reports have consistent locations"
        );
    }

    if (
        safetyRisks.length > 0 &&
        safetyScore === 20
    ) {
        reasons.push(
            "Reports agree on the safety risk"
        );
    } else if (safetyScore === 15) {
        reasons.push(
            "Reports show broadly consistent safety risk"
        );
    }

    if (averageConfidence >= 0.9) {
        reasons.push(
            "High AI confidence"
        );
    }


    return {

        evidenceScore,

        evidenceLevel,

        explanation:
            reasons.length > 0
                ? reasons.join(". ") + "."
                : "Limited supporting evidence.",

        breakdown: {

            reportScore:
                Math.round(reportScore),

            locationScore,

            safetyScore,

            confidenceScore:
                Math.round(confidenceScore)
        }
    };
}


module.exports =
    calculateEvidence;