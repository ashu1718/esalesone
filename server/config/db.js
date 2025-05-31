const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

// Log environment variables (excluding password)
console.log("Database Configuration:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === "true",
});

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to the database:", {
      message: err.message,
      code: err.code,
      detail: err.detail,
      stack: err.stack,
    });
  } else {
    console.log("Successfully connected to database");
    // Test a simple query
    client.query("SELECT NOW()", (err, result) => {
      if (err) {
        console.error("Error executing test query:", err);
      } else {
        console.log("Test query successful:", result.rows[0]);
      }
      release();
    });
  }
});

// Add error handler for the pool
pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
});

module.exports = pool;
