// Import packages
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static("public"));

app.post('/chat', async (req, res) => {
  console.log("📩 Received:", req.body);

  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ reply: "Please type a message!" });
    }

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama-3.3-70b-versatile",   // or "mixtral-8x7b-32768"
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        }
      }
    );

    const aiReply = response.data.choices[0].message.content;
    res.json({ reply: aiReply });

  } catch (error) {
    console.error("Groq Error:", error.message);
    res.json({ reply: "Sorry, the AI is having trouble right now. Please try again." });
  }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});