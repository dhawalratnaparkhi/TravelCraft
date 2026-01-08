import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";
import { db } from "./firebase.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* ---------------- GLOBAL MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());
app.set("etag", false); // ⛔ disable 304 caching

/* ---------------- FRONTEND BUILD ---------------- */
app.use(express.static(path.join(__dirname, "../dist")));

/* ---------------- DISABLE CACHE FOR ADMIN ---------------- */
app.use("/api/admin", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

/* ---------------- ADMIN AUTH ---------------- */
function requireAdmin(req, res, next) {
  const token = String(req.headers["x-admin-pin"] || "").trim();
  const adminPin = String(process.env.ADMIN_PIN || "").trim();

  if (!token || token !== adminPin) {
    return res.status(401).json({ success: false });
  }
  next();
}

/* ---------------- OPENAI ---------------- */
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
Trip type: ${tripType}
From: ${from}
Mode: ${travelMode}
Style: ${style}
Pace: ${pace}
Days: ${days}
Budget: ${budget}
Return 3 destinations.
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    res.json({ result: response.choices[0].message.content });
  } catch {
    res.status(500).json({ error: "AI failed" });
  }
});

/* ---------------- CUSTOM TRIP ---------------- */
app.post("/api/custom-trip", async (req, res) => {
  const cleanData = Object.fromEntries(
    Object.entries(req.body).map(([k, v]) => [k, v ?? ""])
  );

  const ref = await db.collection("inquiries").add({
    ...cleanData,
    createdAt: new Date().toISOString()
  });

  res.json({ success: true, id: ref.id });
});

/* ---------------- ADMIN VERIFY PIN ---------------- */
app.post("/api/admin/verify-pin", (req, res) => {
  const pin = String(req.body?.pin || "").trim();
  const adminPin = String(process.env.ADMIN_PIN || "").trim();

  if (pin === adminPin) return res.json({ success: true });
  res.status(401).json({ success: false });
});

/* ---------------- ADMIN INQUIRIES ---------------- */
app.get("/api/admin/inquiries", requireAdmin, async (req, res) => {
  const snap = await db
    .collection("inquiries")
    .orderBy("createdAt", "desc")
    .get();

  res.json({
    success: true,
    inquiries: snap.docs.map(d => ({ id: d.id, ...d.data() }))
  });
});

/* ---------------- ADMIN GROUP TOURS ---------------- */
app.get("/api/admin/group-tours", requireAdmin, async (req, res) => {
  const snap = await db.collection("groupTours").get();

  res.json({
    success: true,
    tours: snap.docs.map(d => ({ id: d.id, ...d.data() }))
  });
});

/* ---------------- ADMIN TOGGLE TOUR ---------------- */
app.patch("/api/admin/group-tours/:id/toggle", requireAdmin, async (req, res) => {
  const ref = db.collection("groupTours").doc(req.params.id);
  const doc = await ref.get();

  if (!doc.exists) return res.status(404).json({ success: false });

  const active = doc.data().active === true;
  await ref.update({ active: !active });

  res.json({ success: true, active: !active });
});

/* ---------------- ADMIN CREATE TOUR ---------------- */
app.post("/api/admin/group-tours", requireAdmin, async (req, res) => {
  const { name, cat, price, days, img } = req.body || {};

  if (!name || !cat || !price || !days || !img) {
    return res.status(400).json({ success: false });
  }

  const ref = await db.collection("groupTours").add({
    name,
    cat,
    price: Number(price),
    days,
    img,
    active: true,
    createdAt: new Date().toISOString()
  });

  res.json({ success: true, id: ref.id });
});

/* ---------------- PUBLIC GROUP TOURS ---------------- */
app.get("/api/group-tours", async (req, res) => {
  const snap = await db.collection("groupTours").where("active", "==", true).get();

  res.json({
    success: true,
    tours: snap.docs.map(d => ({ id: d.id, ...d.data() }))
  });
});

/* ---------------- SPA FALLBACK ---------------- */
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

/* ---------------- START ---------------- */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server running on", PORT));
