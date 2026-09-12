const { pool } = require("../config/database");

function sanitizeUser(user) {
  if (!user) return null;

  const sanitizedUser = { ...user };
  delete sanitizedUser.password_hash;
  return sanitizedUser;
}

async function findByEmail(email) {
  const normalizedEmail = (email || "").trim().toLowerCase();

  const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
    normalizedEmail,
  ]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0] || null;
}

async function createUser({ full_name, email, password_hash, role }) {
  const [result] = await pool.execute(
    "INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    [full_name, email, password_hash, role],
  );

  return {
    id: result.insertId,
    full_name,
    email,
    role,
    password_hash,
  };
}

module.exports = {
  sanitizeUser,
  findByEmail,
  findById,
  createUser,
};
