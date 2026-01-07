import React from "react";
import "./custom-trip-form.css";

export default function CustomTripForm({ onSubmit }) {
  return (
    <section className="custom-form-section">
      <div className="custom-form-container">
        <h2>Your Custom Journey.</h2>

        <form onSubmit={onSubmit} className="custom-form">
          <div className="form-grid">
            <input name="name" required placeholder="Full Name" />
            <input name="phone" required placeholder="Phone Number" />
            <input name="email" required type="email" placeholder="Email Address" />
            <input name="destination" required placeholder="Where do you want to go?" />
          </div>

          <textarea
            name="notes"
            placeholder="Traveler count, Budget, Hotel preference, etc."
            rows="5"
          />

          <button type="submit">
            Get My Masterpiece Itinerary
          </button>
        </form>
      </div>
    </section>
  );
}
