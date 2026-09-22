const { pool } = require("../config/database");

async function createComplaint(
  {
    citizen_id,
    description,
    latitude,
    longitude,
    address,
    master_issue_id = null,
    status = "PENDING_AI_ANALYSIS",
  },
  connection = pool,
) {
  const [result] = await connection.execute(
    "INSERT INTO complaints (citizen_id, description, latitude, longitude, address, master_issue_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      citizen_id,
      description,
      latitude,
      longitude,
      address,
      master_issue_id,
      status,
    ],
  );

  return {
    id: result.insertId,
    citizen_id,
    description,
    latitude,
    longitude,
    address,
    master_issue_id,
    status,
  };
}

async function findById(id, connection = pool) {
  const [rows] = await connection.execute(
    `SELECT
      c.*,
      aa.category AS category,
      mi.priority_level AS priority,
      COUNT(c2.id) AS similar_complaint_count
     FROM complaints c
     LEFT JOIN ai_analysis aa
       ON aa.complaint_id = c.id
     LEFT JOIN master_issues mi
       ON mi.id = c.master_issue_id
     LEFT JOIN complaints c2
       ON c2.master_issue_id = c.master_issue_id
     WHERE c.id = ?
     GROUP BY c.id`,
    [id],
  );

  return rows[0] || null;
}

async function findAllForUser(
  { user, status = null, limit = 20, offset = 0 },
  connection = pool,
) {
  let query = `
    SELECT
      c.*,
      aa.category AS category,
      mi.priority_level AS priority,
      COUNT(c2.id) AS similar_complaint_count
    FROM complaints c
    LEFT JOIN ai_analysis aa
      ON aa.complaint_id = c.id
    LEFT JOIN master_issues mi
      ON mi.id = c.master_issue_id
    LEFT JOIN complaints c2
      ON c2.master_issue_id = c.master_issue_id
  `;

  const params = [];
  const role = String(user && user.role ? user.role : "").toUpperCase();

  if (role === "CITIZEN") {
    query += " WHERE c.citizen_id = ?";
    params.push(user.id);
  }

  if (status) {
    if (params.length > 0) {
      query += " AND c.status = ?";
    } else {
      query += " WHERE c.status = ?";
    }
    params.push(status);
  }

  query += " GROUP BY c.id";
  query += " ORDER BY c.created_at DESC LIMIT ? OFFSET ?";

  params.push(Number(limit), Number(offset));

  const [rows] = await connection.execute(query, params);
  return rows;
}

async function updateStatus(complaintId, status, connection = pool) {
  const [result] = await connection.execute(
    "UPDATE complaints SET status = ? WHERE id = ?",
    [status, complaintId],
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return findById(complaintId, connection);
}

module.exports = {
  createComplaint,
  findById,
  findAllForUser,
  updateStatus,
};
