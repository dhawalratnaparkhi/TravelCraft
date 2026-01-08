import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ai-planner.css";

export default function AiPlanner() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const [form, setForm] = useState({
    tripType: "",
    travelMode: "",
    style: "",
    pace: "",
    days: "",
    from: "",
    budget: ""
  });

  function updateForm(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    const cards = document.querySelectorAll(".ai-card");

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, [results]);

  async function generate() {
    setLoading(true);
    setResults([]);

    try {
      const res = await fetch("/api/ai-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      const parsed = data.result
        .split("\n")
        .filter(Boolean)
        .map((line, i) => {
          const [place, reason] = line.split("–");
          return {
            id: i,
            title: place?.replace(/^\d+\.\s*/, "").trim(),
            reason: reason?.trim() || "Well suited to your preferences",
            days: form.days ? `${form.days} Days` : "Custom",
            budget: form.budget || "AI Suggested"
          };
        });

      setResults(parsed);
    } catch (err) {
      console.error(err);
      alert("AI could not generate results. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="ai-planner">
      <div className="ai-container">
        <h1>AI Travel Planner</h1>
        <p className="subtitle">
          Get destination ideas crafted around your preferences.
        </p>

        <div className="ai-form">
          <select name="tripType" onChange={updateForm}>
            <option value="">Trip Type</option>
            <option value="Domestic">Domestic (India)</option>
            <option value="International">International</option>
            <option value="Not Sure">Not sure</option>
          </select>

          <select name="travelMode" onChange={updateForm}>
            <option value="">Preferred Travel Mode</option>
            <option value="Flight">Flight</option>
            <option value="Train">Train</option>
            <option value="Road">Road Trip</option>
            <option value="Doesn't matter">Doesn't matter</option>
          </select>

          <select name="style" onChange={updateForm}>
            <option value="">Travel Style</option>
            <option value="Luxury">Luxury</option>
            <option value="Relaxed">Relaxed</option>
            <option value="Adventure">Adventure</option>
            <option value="Honeymoon">Honeymoon</option>
            <option value="Family">Family</option>
          </select>

          <select name="pace" onChange={updateForm}>
            <option value="">Travel Pace</option>
            <option value="Slow & Relaxed">Slow & Relaxed</option>
            <option value="Balanced">Balanced</option>
            <option value="Fast">Fast & Packed</option>
          </select>

          <input
            type="number"
            name="days"
            placeholder="Number of days"
            onChange={updateForm}
          />

          <input
            type="text"
            name="from"
            placeholder="Departure city"
            onChange={updateForm}
          />

          <button className="ai-btn" onClick={generate}>
            {loading ? "AI is thinking..." : "Generate with AI"}
          </button>
        </div>

        {results.length > 0 && (
          <div className="ai-results">
            {results.map(item => (
              <div key={item.id} className="ai-card">
                <div className="ai-body">
                  <h3>{item.title}</h3>
                  <p>{item.reason}</p>

                  <div className="ai-meta">
                    <span>{item.days}</span>
                    <span>{item.budget}</span>
                  </div>

                  <button
  className="ai-use-btn"
  onClick={() =>
    navigate("/custom", {
      state: {
        // Core
        destination: item.title,
        notes: `AI Suggested Plan:\n${item.reason}`,

        // AI form context
        tripType: form.tripType,
        travelMode: form.travelMode,
        pace: form.pace,
        durationDays: form.days,
        departureCity: form.from,

        // Best guess mappings
        tripPurpose: form.style || "",
      }
    })
  }
>
  Use this plan
</button>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
