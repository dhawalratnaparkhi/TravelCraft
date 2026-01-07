import React from "react";
import "./service-cards.css";
import { Map, Users } from "lucide-react";

export default function ServiceCards({ onCustom, onGroup }) {
  return (
    <section className="services-section">
      <div className="services-container">
        
        {/* Custom Tours */}
        <div className="service-card" onClick={onCustom}>
          <img
            src="https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900"
            alt="Custom Tours"
          />
          <div className="service-overlay blue">
            <Map className="service-icon" />
            <h3>Customized Tours</h3>
            <p>
              100% bespoke plans based on your dates, budget, and travel style.
            </p>
            <span>Customize My Trip</span>
          </div>
        </div>

        {/* Group Tours */}
        <div className="service-card" onClick={onGroup}>
          <img
            src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900"
            alt="Group Tours"
          />
          <div className="service-overlay orange">
            <Users className="service-icon dark" />
            <h3>Group Tours</h3>
            <p>
              Fixed departure tours with curated itineraries and premium stays.
            </p>
            <span>See Group Tours</span>
          </div>
        </div>

      </div>
    </section>
  );
}
