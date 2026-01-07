import React from "react";
import "./home-cta.css";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function HomeCTA({ onCustom }) {
  return (
    <section className="home-cta">
      <div className="home-cta-container">
        <h2>
          Ready to craft your <span>perfect journey?</span>
        </h2>

        <p>
          From luxury escapes to budget-friendly adventures,  
          we design trips exactly the way you want.
        </p>

        <div className="cta-actions">
          <button className="primary" onClick={onCustom}>
            Plan My Trip <ArrowRight />
          </button>

          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noreferrer"
            className="secondary"
          >
            WhatsApp Us <MessageCircle />
          </a>
        </div>
      </div>
    </section>
  );
}

