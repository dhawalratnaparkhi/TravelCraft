import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/ai-trip", async (req, res) => {
  try {
    const { style, budget, days, from } = req.body;

    const prompt = `
Suggest 3 travel destinations.
Travel style: ${style}
Budget: ${budget}
Trip length: ${days} days
Departure city: ${from}

Return short bullet points with reasons.
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8
    });

    res.json({
      result: response.choices[0].message.content
    });
  } catch (err) {
    res.status(500).json({ error: "AI failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("AI server running on port", PORT);
});
