import "./HowItWorks.css";
import { Calendar, Zap, CheckCircle, Plane } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      title: "Fill the Form",
      desc: "Tell us your dates, destination, and preferences.",
      icon: <Calendar size={32} />,
    },
    {
      title: "Expert Planning",
      desc: "Our experts craft a custom day-wise itinerary.",
      icon: <Zap size={32} />,
    },
    {
      title: "Confirm & Customize",
      desc: "Review, tweak, and lock your perfect plan.",
      icon: <CheckCircle size={32} />,
    },
    {
      title: "Enjoy the Journey",
      desc: "Travel stress-free with 24/7 support.",
      icon: <Plane size={32} />,
    },
  ];

  return (
    <section className="how-it-works">
      <div className="how-container">
        <h2>Your Trip in 4 Simple Steps</h2>
        <p className="subtitle">
          From dream to destination, we handle everything.
        </p>

        <div className="steps-grid">
          {steps.map((step, i) => (
            <div key={i} className="step-card">
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
