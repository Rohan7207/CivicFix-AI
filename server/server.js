require("dotenv").config();

const app = require("./app");
const { pool } = require("./config/database");

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    const [rows] = await pool.query("SELECT 1 AS connection_ok");

    if (!rows || rows.length === 0 || rows[0].connection_ok !== 1) {
      throw new Error("Database connectivity check failed.");
    }

    console.log("MySQL connection verified.");

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
