import { useLocation } from "react-router-dom";
import { useState } from "react";
import "./custom-trip-form.css";

const initialState = {
  name: "",
  phone: "",
  email: "",
  departureCity: "",
  destination: "",
  tripType: "",
  tripPurpose: "",
  travelMode: "",
  pace: "",
  hotel: "",
  budgetRange: "",
  travelers: "",
  startDate: "",
  durationDays: "",
  notes: ""
};

export default function CustomTripForm() {
  const location = useLocation();
  const prefill = location.state || {};

  const [form, setForm] = useState({
    ...initialState,
    destination: prefill.destination || "",
    departureCity: prefill.departureCity || "",
    notes: prefill.notes || ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/custom-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Request failed");

      setSuccess(true);
      setForm(initialState);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="custom-form-section">
      <div className="custom-form-container">
        <h2>Your Custom Journey</h2>

        {success && (
          <p className="form-success">
            ✅ Inquiry received. Our travel expert will contact you shortly.
          </p>
        )}

        {error && (
          <p className="form-error">
            ❌ {error}
          </p>
        )}

        <form className="custom-form" onSubmit={handleSubmit}>
          <div className="form-grid">
  <input
    name="name"
    required
    placeholder="Full Name"
    value={form.name}
    onChange={handleChange}
  />

  <input
    name="phone"
    required
    placeholder="Phone Number"
    value={form.phone}
    onChange={handleChange}
  />

  <input
    name="email"
    type="email"
    required
    placeholder="Email Address"
    value={form.email}
    onChange={handleChange}
  />

  <input
    name="departureCity"
    required
    placeholder="Departure City"
    value={form.departureCity}
    onChange={handleChange}
  />
</div>

            <div className="form-grid">
  <input
    name="destination"
    required
    placeholder="Destination"
    value={form.destination}
    onChange={handleChange}
  />

  <select name="tripType" required value={form.tripType} onChange={handleChange}>
    <option value="">Trip Type</option>
    <option value="Domestic">Domestic (India)</option>
    <option value="International">International</option>
  </select>

  <select name="tripPurpose" required value={form.tripPurpose} onChange={handleChange}>
    <option value="">Trip Purpose</option>
    <option value="Leisure">Leisure</option>
    <option value="Honeymoon">Honeymoon</option>
    <option value="Family">Family</option>
    <option value="Adventure">Adventure</option>
    <option value="Workation">Workation</option>
  </select>



            <select name="travelMode" value={form.travelMode} onChange={handleChange}>
              <option value="">Preferred Travel Mode</option>
              <option value="Flight">Flight</option>
              <option value="Train">Train</option>
              <option value="Road">Road Trip</option>
            </select>

            <select name="pace" value={form.pace} onChange={handleChange}>
              <option value="">Travel Pace</option>
              <option value="Relaxed">Relaxed</option>
              <option value="Balanced">Balanced</option>
              <option value="Fast">Fast-paced</option>
            </select>

            <select name="hotel" value={form.hotel} onChange={handleChange}>
              <option value="">Hotel Preference</option>
              <option value="3 Star">3 Star</option>
              <option value="4 Star">4 Star</option>
              <option value="5 Star">5 Star</option>
              <option value="Boutique">Boutique</option>
            </select>

            <select
              name="budgetRange"
              required
              value={form.budgetRange}
              onChange={handleChange}
            >
              <option value="">Budget Range (per person)</option>
              <option value="Economy">Economy</option>
              <option value="Mid-range">Mid-range</option>
              <option value="Luxury">Luxury</option>
              <option value="Ultra Luxury">Ultra Luxury</option>
            </select>

            <input
              name="travelers"
              type="number"
              min="1"
              required
              placeholder="Number of Travelers"
              value={form.travelers}
              onChange={handleChange}
            />

            <div className="date-field">
  <label>Departure Date</label>
  <input
    name="startDate"
    type="date"
    required
    value={form.startDate}
    onChange={handleChange}
  />
</div>


            <input
              name="durationDays"
              type="number"
              min="1"
              required
              placeholder="Trip Duration (Days)"
              value={form.durationDays}
              onChange={handleChange}
            />
          </div>

          <textarea
            name="notes"
            placeholder="Preferences, must-see places, budget notes, special requests"
            rows="5"
            value={form.notes}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Get My Custom Itinerary"}
          </button>
        </form>
      </div>
    </section>
  );
}
