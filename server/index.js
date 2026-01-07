import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";
import { db } from "./firebase.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

/* ---------------- FRONTEND BUILD ---------------- */
app.use(express.static(path.join(__dirname, "../dist")));

/* ---------------- OPENAI CLIENT ---------------- */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* ---------------- AI ROUTE ---------------- */
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
- Avoid impractical itineraries

Return exactly 3 suggestions in this format:
1. Destination – short practical reason
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8
    });

    res.json({
      result: response.choices[0].message.content
    });
  } catch (error) {
    console.error("AI ERROR:", error);
    res.status(500).json({ error: "AI generation failed" });
  }
});

/* ---------------- FIREBASE TEST ROUTE ---------------- */
app.get("/api/firebase-test", async (req, res) => {
  try {
    const ref = await db.collection("healthcheck").add({
      ok: true,
      time: new Date().toISOString()
    });

    res.json({ success: true, id: ref.id });
  } catch (err) {
    console.error("🔥 FIREBASE TEST FAILED:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ---------------- CUSTOM TRIP FORM ---------------- */
app.post("/api/custom-trip", async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      departureCity,
      destination,
      tripType,
      tripPurpose,
      travelMode,
      pace,
      hotel,
      budgetRange,
      travelers,
      startDate,
      durationDays,
      notes
    } = req.body || {};

    // Basic required field validation
    if (
      !name ||
      !phone ||
      !email ||
      !departureCity ||
      !destination ||
      !tripType ||
      !tripPurpose ||
      !budgetRange ||
      !travelers ||
      !startDate ||
      !durationDays
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }

    const inquiryData = {
      name,
      phone,
      email,
      departureCity,
      destination,
      tripType,
      tripPurpose,
      travelMode: travelMode || null,
      pace: pace || null,
      hotel: hotel || null,
      budgetRange,
      travelers: Number(travelers),
      startDate,
      durationDays: Number(durationDays),
      notes: notes || "",
      source: "custom-trip-form",
      createdAt: new Date()
    };

    const ref = await db.collection("inquiries").add(inquiryData);

    console.log("✅ Inquiry saved:", ref.id);

    res.status(201).json({
      success: true,
      id: ref.id
    });
  } catch (err) {
    console.error("❌ FIRESTORE WRITE FAILED:", err);
    res.status(500).json({
      success: false,
      error: "Failed to save inquiry"
    });
  }
});

/* ---------------- SPA FALLBACK (ALWAYS LAST) ---------------- */
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
