import { useLocation } from "react-router-dom";
import { useState } from "react";
import "./custom-trip-form.css";

export default function CustomTripForm() {
  const location = useLocation();
  const prefill = location.state || {};

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = Object.fromEntries(new FormData(e.target));

    try {
      const res = await fetch("/api/custom-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Failed");

      setSuccess(true);
      e.target.reset();
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="custom-form-section">
      <div className="custom-form-container">
        <h2>Your Custom Journey.</h2>

        {success && (
          <p className="form-success">
            ✅ Inquiry received. Our travel expert will contact you shortly.
          </p>
        )}

        <form className="custom-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <input name="name" required placeholder="Full Name" />
            <input name="phone" required placeholder="Phone Number" />
            <input name="email" required type="email" placeholder="Email Address" />
            <input
              name="destination"
              required
              placeholder="Where do you want to go?"
              defaultValue={prefill.destination || ""}
            />
          </div>

          <div className="form-grid">
            <select name="tripType" required>
              <option value="">Trip Type</option>
              <option value="Domestic">Domestic (India)</option>
              <option value="International">International</option>
            </select>

            <select name="travelMode">
              <option value="">Preferred Travel Mode</option>
              <option value="Flight">Flight</option>
              <option value="Train">Train</option>
              <option value="Road">Road Trip</option>
            </select>

            <select name="hotel">
              <option value="">Hotel Preference</option>
              <option value="3 Star">3 Star</option>
              <option value="4 Star">4 Star</option>
              <option value="5 Star">5 Star</option>
              <option value="Boutique">Boutique</option>
            </select>

            <input
              name="travelers"
              type="number"
              placeholder="Number of Travelers"
              required
            />

            <input name="startDate" type="date" required />
            <input name="endDate" type="date" required />
          </div>

          <textarea
            name="notes"
            placeholder="Budget, preferences, special requests, etc."
            rows="5"
            defaultValue={prefill.notes || ""}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Get My Masterpiece Itinerary"}
          </button>
        </form>
      </div>
    </section>
  );
}
