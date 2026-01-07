import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ai-planner.css";

const DESTINATION_IMAGES = {
  Switzerland:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200",
  Bali:
    "https://images.unsplash.com/photo-1546484959-f9a7d7cfa4f5?auto=format&fit=crop&w=1200",
  Iceland:
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200",
  Dubai:
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200",
  Paris:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200"
};

const MOCK_RESULTS = [
  {
    id: 1,
    title: "Switzerland",
    img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200",
    reason: "Scenic luxury, alpine trains, lakes, and calm premium travel.",
    days: "7 Days",
    budget: "Premium"
  },
  {
    id: 2,
    title: "Bali",
    img: "https://images.unsplash.com/photo-1546484959-f9a7d7cfa4f5?auto=format&fit=crop&w=1200",
    reason: "Beaches, culture, wellness retreats, and great value.",
    days: "6 Days",
    budget: "Mid-range"
  },
  {
    id: 3,
    title: "Iceland",
    img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200",
    reason: "Waterfalls, glaciers, northern lights, and raw adventure.",
    days: "8 Days",
    budget: "Premium"
  }
];

export default function AiPlanner() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

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

  const res = await fetch("/api/ai-trip", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      style: "Luxury",
      budget: "Premium",
      days: "7",
      from: "India"
    })
  });

  const data = await res.json();

 const parsed = data.result
  .split("\n")
  .filter(Boolean)
  .map((line, i) => {
    const [place, reason] = line.split("–");

    const destination =
      place?.replace(/^\d+\.\s*/, "").trim() || "Destination";

    return {
      id: i,
      title: destination,
      reason: reason?.trim() || "",
      days: "Custom",
      budget: "AI Suggested",
      img:
        DESTINATION_IMAGES[destination] ||
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200"
    };
  });


  setResults(parsed);
  setLoading(false);

  }

  return (
    <section className="ai-planner">
      <div className="ai-container">
        <h1>AI Travel Planner</h1>
        <p className="subtitle">
          Get destination ideas crafted around your preferences.
        </p>

        <div className="ai-form">
          <select><option>Travel Style</option><option>Luxury</option><option>Adventure</option><option>Relaxed</option></select>
          <select><option>Budget Range</option><option>Budget</option><option>Mid-range</option><option>Premium</option></select>
          <input type="number" placeholder="Number of days" />
          <input type="text" placeholder="Departure city" />
          <button className="ai-btn" onClick={generate}>
            {loading ? "AI is thinking..." : "Generate with AI"}
          </button>
        </div>

        {results.length > 0 && (
          <div className="ai-results">
            {results.map(item => (
              <div key={item.id} className="ai-card">
                <div className="ai-image">
                  <img src={item.img} alt={item.title} />
                  <span className="ai-badge">AI Recommended</span>
                </div>

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
                          notes: `AI Suggested Plan:\n${item.reason}\nDuration: ${item.days}\nBudget: ${item.budget}`
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
