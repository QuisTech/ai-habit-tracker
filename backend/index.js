const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getHabitSuggestion } = require("./openai");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

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

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});

// ✅ Health check
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

//
// 🧠 AUTH ROUTES (Register + Login)
//
app.post("/auth/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hashed]
    );
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "User already exists or invalid input" });
  }
});

app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

//
// ✅ HABIT ROUTES
//
app.get("/habits", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM habits ORDER BY id ASC");
    res.json(result.rows); // ✅ always return an array
  } catch (err) {
    console.error("❌ Failed to fetch habits:", err);
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
    console.error("❌ Failed to add habit:", err);
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
    console.error("❌ Failed to update habit:", err);
    res.status(500).json({ error: "Failed to update habit" });
  }
});

app.delete("/habits/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM habits WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Failed to delete habit:", err);
    res.status(500).json({ error: "Failed to delete habit" });
  }
});

//
// ✅ OpenAI Habit Suggestion
//
app.get("/suggest-habit", async (req, res) => {
  try {
    const suggestion = await getHabitSuggestion(
      "Suggest a short new daily habit for health or productivity."
    );
    res.json({ suggestion });
  } catch (err) {
    console.error("❌ Failed to get suggestion:", err);
    res.status(500).json({ error: "Failed to get suggestion" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
