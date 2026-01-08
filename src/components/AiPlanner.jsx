import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomSelect from "./CustomSelect";
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

  function updateField(name, value) {
    setForm(prev => ({ ...prev, [name]: value }));
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
          <CustomSelect
            placeholder="Trip Type"
            value={form.tripType}
            onChange={value => updateField("tripType", value)}
            options={[
              { value: "Domestic", label: "Domestic (India)" },
              { value: "International", label: "International" },
              { value: "Not Sure", label: "Not sure" }
            ]}
          />

          <CustomSelect
            placeholder="Preferred Travel Mode"
            value={form.travelMode}
            onChange={value => updateField("travelMode", value)}
            options={[
              { value: "Flight", label: "Flight" },
              { value: "Train", label: "Train" },
              { value: "Road", label: "Road Trip" },
              { value: "Doesn't matter", label: "Doesn't matter" }
            ]}
          />

          <CustomSelect
            placeholder="Travel Style"
            value={form.style}
            onChange={value => updateField("style", value)}
            options={[
              { value: "Luxury", label: "Luxury" },
              { value: "Relaxed", label: "Relaxed" },
              { value: "Adventure", label: "Adventure" },
              { value: "Honeymoon", label: "Honeymoon" },
              { value: "Family", label: "Family" }
            ]}
          />

          <CustomSelect
            placeholder="Travel Pace"
            value={form.pace}
            onChange={value => updateField("pace", value)}
            options={[
              { value: "Slow & Relaxed", label: "Slow & Relaxed" },
              { value: "Balanced", label: "Balanced" },
              { value: "Fast", label: "Fast & Packed" }
            ]}
          />

          <input
            type="number"
            placeholder="Number of days"
            value={form.days}
            onChange={e => updateField("days", e.target.value)}
          />

          <input
            type="text"
            placeholder="Departure city"
            value={form.from}
            onChange={e => updateField("from", e.target.value)}
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
                          destination: item.title,
                          notes: `AI Suggested Plan:\n${item.reason}`,
                          tripType: form.tripType,
                          travelMode: form.travelMode,
                          pace: form.pace,
                          durationDays: form.days,
                          departureCity: form.from,
                          tripPurpose: form.style
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
