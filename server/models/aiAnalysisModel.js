const { pool } = require("../config/database");

async function createAIAnalysis(
  {
    complaint_id,
    category,
    severity,
    safety_risk,
    confidence,
    department,
    short_summary,
    language,
    english_translation,
  },
  connection = pool,
) {
  const [result] = await connection.execute(
    `INSERT INTO ai_analysis
    (
      complaint_id,
      category,
      severity,
      safety_risk,
      confidence,
      department,
      short_summary,
      language,
      english_translation
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      complaint_id,
      category,
      severity,
      safety_risk,
      confidence,
      department,
      short_summary,
      language,
      english_translation,
    ],
  );

  return {
    id: result.insertId,
    complaint_id,
    category,
    severity,
    safety_risk,
    confidence,
    department,
    short_summary,
    language,
    english_translation,
  };
}

async function findByComplaintId(complaintId, connection = pool) {
  const [rows] = await connection.execute(
    "SELECT * FROM ai_analysis WHERE complaint_id = ?",
    [complaintId],
  );

  return rows[0] || null;
}

module.exports = {
  createAIAnalysis,
  findByComplaintId,
};
