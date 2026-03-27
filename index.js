const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors"); // Best practice for CORS

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.use(cors()); // This handles the "Allow-Origin" for you automatically
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "Picachu AI Backend is running!" });
});

app.post("/api/gemini", async (req, res) => {
  try {
    // FIX 1: Look for "message" (matching what your frontend sends)
    const { message } = req.body; 
    
    if (!message) return res.status(400).json({ error: "No message provided" });
    
    // Note: If 'gemini-2.5-flash' doesn't work, use 'gemini-1.5-flash'
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );
    
    const data = await response.json();
    
    // Check if Gemini returned an error
    if (data.error) {
        return res.status(500).json({ error: data.error.message });
    }

    // Send the raw data back to the frontend
    res.json(data);
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
