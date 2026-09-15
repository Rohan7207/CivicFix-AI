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
    "SELECT * FROM complaints WHERE id = ?",
    [id],
  );
  return rows[0] || null;
}

async function findAllForUser(
  { user, status = null, limit = 20, offset = 0 },
  connection = pool,
) {
  let query = "SELECT * FROM complaints";
  const params = [];
  const role = String(user && user.role ? user.role : "").toUpperCase();

  if (role === "CITIZEN") {
    query += " WHERE citizen_id = ?";
    params.push(user.id);
  }

  if (status) {
    if (params.length > 0) {
      query += " AND status = ?";
    } else {
      query += " WHERE status = ?";
    }
    params.push(status);
  }

  query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
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
