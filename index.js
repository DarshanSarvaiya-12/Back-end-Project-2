import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = `
You are a helpful, friendly assistant who talks like a real human.

Rules you must always follow:
- Never use ** (stars) or any markdown formatting
- Never use bold, italics, or headers
- Always reply in bullet points using the • symbol
- Keep answers short and to the point
- Sound natural, warm, and conversational
- Each bullet point should be one clear idea
- Maximum 5 to 6 bullet points per answer
`;

app.post("/api/gemini", async (req, res) => {
  try {
    const { message } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-04-17",
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(message);
    const response = result.response.text();

    res.json({ reply: response });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
