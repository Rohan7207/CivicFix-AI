const { pool } = require('../config/database');

async function createEvidence({ complaint_id, type, imagekit_url, imagekit_file_id, original_filename, mime_type, file_size }, connection = pool) {
  const [result] = await connection.execute(
    'INSERT INTO complaint_evidence (complaint_id, type, imagekit_url, imagekit_file_id, original_filename, mime_type, file_size) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [complaint_id, type, imagekit_url, imagekit_file_id, original_filename, mime_type, file_size],
  );

  return {
    id: result.insertId,
    complaint_id,
    type,
    imagekit_url,
    imagekit_file_id,
    original_filename,
    mime_type,
    file_size,
  };
}

async function findByComplaintId(complaintId, connection = pool) {
  const [rows] = await connection.execute(
    'SELECT * FROM complaint_evidence WHERE complaint_id = ? ORDER BY created_at ASC',
    [complaintId],
  );

  return rows;
}

module.exports = {
  createEvidence,
  findByComplaintId,
};
