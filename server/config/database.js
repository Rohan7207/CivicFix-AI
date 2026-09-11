const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'civicfix',
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  charset: 'utf8mb4',
});

async function testDatabaseConnection() {
  const [rows] = await pool.query('SELECT 1 AS connection_ok');
  return rows[0];
}

module.exports = {
  pool,
  testDatabaseConnection,
};
