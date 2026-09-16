const { pool } = require("../config/database");

async function createMasterIssue(
  {
    department_id,
    code,
    title,
    description,
    severity = "medium",
    is_active = true,
  },
  connection = pool,
) {
  const [result] = await connection.execute(
    "INSERT INTO master_issues (department_id, code, title, description, severity, is_active) VALUES (?, ?, ?, ?, ?, ?)",
    [department_id, code, title, description, severity, is_active ? 1 : 0],
  );

  return {
    id: result.insertId,
    department_id,
    code,
    title,
    description,
    severity,
    is_active: Boolean(is_active),
  };
}

async function findById(id, connection = pool) {
  const [rows] = await connection.execute(
    `SELECT
      mi.*, d.name AS department_name,
      d.code AS department_code
    FROM master_issues mi
    LEFT JOIN departments d ON d.id = mi.department_id
    WHERE mi.id = ?`,
    [id],
  );

  return rows[0] || null;
}

async function findByCode(code, connection = pool) {
  const [rows] = await connection.execute(
    "SELECT * FROM master_issues WHERE code = ?",
    [code],
  );

  return rows[0] || null;
}

async function findDepartmentById(id, connection = pool) {
  const [rows] = await connection.execute(
    "SELECT * FROM departments WHERE id = ?",
    [id],
  );

  return rows[0] || null;
}

async function countComplaintsByMasterIssueId(
  masterIssueId,
  connection = pool,
) {
  const [rows] = await connection.execute(
    "SELECT COUNT(*) AS complaint_count FROM complaints WHERE master_issue_id = ?",
    [masterIssueId],
  );

  return Number(rows[0]?.complaint_count || 0);
}

async function findAll(
  { department_id = null, limit = 20, offset = 0 } = {},
  connection = pool,
) {
  let query = `
    SELECT
      mi.*,
      d.name AS department_name,
      d.code AS department_code,
      COUNT(c.id) AS complaint_count
    FROM master_issues mi
    LEFT JOIN departments d ON d.id = mi.department_id
    LEFT JOIN complaints c ON c.master_issue_id = mi.id
  `;

  const params = [];
  const conditions = [];

  if (
    department_id !== null &&
    department_id !== undefined &&
    department_id !== ""
  ) {
    conditions.push("mi.department_id = ?");
    params.push(Number(department_id));
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  query += " GROUP BY mi.id ORDER BY mi.created_at DESC LIMIT ? OFFSET ?";
  params.push(Number(limit), Number(offset));

  const [rows] = await connection.execute(query, params);
  return rows;
}

async function findComplaintsForMasterIssue(masterIssueId, connection = pool) {
  const [rows] = await connection.execute(
    "SELECT * FROM complaints WHERE master_issue_id = ? ORDER BY created_at DESC",
    [masterIssueId],
  );

  return rows;
}

async function updateById(id, fields, connection = pool) {
  const entries = Object.entries(fields);
  if (!entries.length) {
    return null;
  }

  const setClause = entries.map(([key]) => `${key} = ?`).join(", ");
  const values = entries.map(([, value]) => {
    if (value === true || value === false) {
      return value ? 1 : 0;
    }
    return value;
  });

  values.push(id);

  await connection.execute(
    `UPDATE master_issues SET ${setClause} WHERE id = ?`,
    values,
  );

  return findById(id, connection);
}

async function findCandidateMasterIssues({
  category,
  latitude,
  longitude,
  radiusKm = 2,
}) {
  const [rows] = await pool.execute(
    `
    SELECT DISTINCT
      mi.*,
      c.latitude AS complaint_latitude,
      c.longitude AS complaint_longitude,
      aa.short_summary AS ai_summary,
      aa.category AS ai_category,
      aa.severity AS ai_severity
    FROM master_issues mi
    JOIN complaints c
      ON c.master_issue_id = mi.id
    JOIN ai_analysis aa
      ON aa.complaint_id = c.id
    WHERE mi.is_active = 1
      AND aa.category = ?
      AND c.latitude IS NOT NULL
      AND c.longitude IS NOT NULL
      AND (
        6371 * ACOS(
          LEAST(
            1,
            GREATEST(
              -1,
              COS(RADIANS(?))
              * COS(RADIANS(c.latitude))
              * COS(RADIANS(c.longitude) - RADIANS(?))
              + SIN(RADIANS(?))
              * SIN(RADIANS(c.latitude))
            )
          )
        )
      ) <= ?
    ORDER BY mi.created_at DESC
    `,
    [category, latitude, longitude, latitude, radiusKm],
  );

  return rows;
}

async function findDepartmentByCode(code, connection = pool) {
  const [rows] = await connection.execute(
    "SELECT * FROM departments WHERE code = ?",
    [code],
  );

  return rows[0] || null;
}

async function updateComplaintMasterIssue(
  complaintId,
  masterIssueId,
  connection = pool,
) {
  await connection.execute(
    "UPDATE complaints SET master_issue_id = ? WHERE id = ?",
    [masterIssueId, complaintId],
  );
}

module.exports = {
  createMasterIssue,
  findById,
  findByCode,
  findDepartmentById,
  countComplaintsByMasterIssueId,
  findAll,
  findComplaintsForMasterIssue,
  updateById,
  findCandidateMasterIssues,
  findDepartmentByCode,
  updateComplaintMasterIssue,
};
