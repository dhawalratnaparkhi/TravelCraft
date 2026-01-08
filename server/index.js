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

const ADMIN_TOKEN = process.env.ADMIN_PIN;

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
    console.log("Incoming inquiry payload:", req.body);

    // 🔒 Firestore-safe sanitization
    const cleanData = Object.fromEntries(
      Object.entries(req.body).map(([key, value]) => [
        key,
        value === undefined || value === null ? "" : value
      ])
    );

    const ref = await db.collection("inquiries").add({
      ...cleanData,
      createdAt: new Date().toISOString()
    });

    console.log("Inquiry saved:", ref.id);
    res.status(200).json({ success: true, id: ref.id });
  } catch (err) {
    console.error("❌ FIRESTORE WRITE FAILED:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

function requireAdmin(req, res, next) {
  const token = req.headers["x-admin-pin"];

  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized"
    });
  }

  next();
}

/* ---------------- ADMIN: GET ALL INQUIRIES ---------------- */
app.get("/api/admin/inquiries", requireAdmin, async (req, res) => {

  try {
    const snapshot = await db
      .collection("inquiries")
      .orderBy("createdAt", "desc")
      .get();

    const inquiries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ success: true, inquiries });
  } catch (err) {
    console.error("❌ ADMIN FETCH FAILED:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/* ---------------- ADMIN: GET GROUP TOURS ---------------- */
app.get("/api/admin/inquiries", requireAdmin, async (req, res) => {

  try {
    const snapshot = await db.collection("groupTours").get();

    const tours = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ success: true, tours });
  } catch (err) {
    console.error("❌ ADMIN GROUP TOURS FETCH FAILED:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/* ---------------- ADMIN: TOGGLE GROUP TOUR ---------------- */
app.get("/api/admin/inquiries", requireAdmin, async (req, res) => {

  try {
    const { id } = req.params;

    const ref = db.collection("groupTours").doc(id);
    const doc = await ref.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, error: "Tour not found" });
    }

    const current = doc.data().active === true;

    await ref.update({ active: !current });

    res.json({ success: true, active: !current });
  } catch (err) {
    console.error("❌ TOGGLE FAILED:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/* ---------------- GROUP TOURS (PUBLIC) ---------------- */
app.get("/api/group-tours", async (req, res) => {
  try {
    const snapshot = await db.collection("groupTours").get();

    const tours = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ success: true, tours });
  } catch (err) {
    console.error("❌ GROUP TOURS FETCH FAILED:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/* ---------------- ADMIN: CREATE GROUP TOUR ---------------- */
app.get("/api/admin/inquiries", requireAdmin, async (req, res) => {

  try {
    const {
      name = "",
      cat = "",
      price = 0,
      days = "",
      img = "",
      active = true
    } = req.body || {};

    if (!name || !cat || !price || !days || !img) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }

    const ref = await db.collection("groupTours").add({
      name,
      cat,
      price: Number(price),
      days,
      img,
      active: Boolean(active),
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      id: ref.id
    });
  } catch (err) {
    console.error("❌ CREATE TOUR FAILED:", err);
    res.status(500).json({
      success: false,
      error: err.message
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
