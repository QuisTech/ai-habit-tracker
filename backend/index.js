const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Pool } = require("pg");
const { getHabitSuggestion } = require("./openai");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "habitdb",
  password: process.env.DB_PASSWORD || "your_password_here",
  port: process.env.DB_PORT || 5432,
});

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// ✅ Test database connection
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// ✅ CRUD Routes for habits
app.get("/habits", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM habits ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch habits" });
  }
});

app.post("/habits", async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO habits (name, description, completed) VALUES ($1, $2, $3) RETURNING *",
      [name, description, false]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add habit" });
  }
});

app.put("/habits/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  try {
    const result = await pool.query(
      "UPDATE habits SET completed = $1 WHERE id = $2 RETURNING *",
      [completed, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update habit" });
  }
});

app.delete("/habits/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM habits WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete habit" });
  }
});

// ✅ OpenAI habit suggestion
app.get("/suggest-habit", async (req, res) => {
  try {
    const suggestion = await getHabitSuggestion(
      "Give me a simple habit suggestion for productivity."
    );
    res.json({ suggestion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get suggestion" });
  }
});

// ✅ Start server (keep this LAST)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
