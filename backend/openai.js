// backend/openai.js
const OpenAI = require("openai");
require("dotenv").config();

// Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to get a habit suggestion
const getHabitSuggestion = async (prompt) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (err) {
    console.error("OpenAI error:", err);
    return "Could not get a suggestion at this time.";
  }
};

module.exports = { getHabitSuggestion };
