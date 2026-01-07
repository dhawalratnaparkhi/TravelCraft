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
    const {
  tripType = "Not Sure",
  travelMode = "Doesn't matter",
  style = "Balanced",
  pace = "Balanced",
  days = "5",
  from = "India",
  budget = "Mid-range"
} = req.body || {};


    const prompt = `
You are an experienced travel consultant.

User preferences:
- Trip type: ${tripType}
- Departure city: ${from}
- Travel mode preference: ${travelMode}
- Travel style: ${style}
- Travel pace: ${pace}
- Trip duration: ${days} days
- Budget category: ${budget}

Rules:
- Suggest only realistic destinations
- If Domestic, suggest Indian destinations only
- If International, suggest destinations with easy travel and visas
- Match destination to travel mode and duration
- Avoid impractical or extreme itineraries

Return exactly 3 suggestions in this format:
1. Destination – short practical reason (travel time, experience, or suitability)

Example:
1. Kerala – Short flights, relaxed pace, great for a 6–7 day trip
2. Bali – Affordable resorts, good flight connectivity, ideal for couples
3. Dubai – Easy visa, luxury hotels, perfect for a compact international trip

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
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
try {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: USER_PROMPT }
    ]
  });

  res.json({
    result: completion.choices[0].message.content
  });

} catch (error) {
  console.error("AI ERROR:", error.message);

  res.status(500).json({
    error: "AI generation failed"
  });
}
