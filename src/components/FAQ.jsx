import { useState } from "react";
import { ChevronDown } from "lucide-react";
import "./faq.css";

export default function FAQ() {
  const faqs = [
    {
      q: "Do you provide fully customized trips?",
      a: "Yes. Every custom trip is planned from scratch based on your dates, budget, and preferences."
    },
    {
      q: "What’s included in group tours?",
      a: "Accommodation, transport, sightseeing, and a fixed itinerary. Flights depend on the package."
    },
    {
      q: "Can I modify the itinerary after booking?",
      a: "For custom trips, yes. For group tours, changes depend on availability and timing."
    },
    {
      q: "Do you provide support during the trip?",
      a: "Yes. You get dedicated assistance before and during your journey."
    },
    {
      q: "How early should I book?",
      a: "Custom trips: 2–3 weeks. Group tours: as early as possible due to limited seats."
    }
  ];

  const [open, setOpen] = useState(null);

  return (
    <section className="faq-section">
      <div className="faq-container">
        <h2>Frequently Asked Questions</h2>
        <p className="subtitle">
          Everything you need to know before planning your trip
        </p>

        <div className="faq-list">
          {faqs.map((item, i) => (
            <div
              key={i}
              className={`faq-item ${open === i ? "open" : ""}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="faq-question">
                <span>{item.q}</span>
                <ChevronDown />
              </div>

              {open === i && (
                <div className="faq-answer">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
