import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// ✅ SERVE FRONTEND BUILD
app.use(express.static(path.join(__dirname, "../dist")));

// ✅ OPENAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/ai-trip", async (req, res) => {
  try {
    const { style, budget, days, from } = req.body;

    const prompt = `
Suggest 3 travel destinations.
Style: ${style}
Budget: ${budget}
Days: ${days}
From: ${from}
Short reasons only.
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8
    });

    res.json({ result: response.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "AI failed" });
  }
});

// ✅ SPA FALLBACK (CRITICAL)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
