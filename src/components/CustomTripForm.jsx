import { useLocation } from "react-router-dom";
import { useState } from "react";
import "./custom-trip-form.css";
import CustomSelect from "./CustomSelect";

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
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/custom-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Failed");

      setSuccess(true);
      setForm(initialState);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="custom-form-section">
      <div className="custom-form-container">
        <h2>Your Custom Journey</h2>

        <form className="custom-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
            <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
            <input name="departureCity" placeholder="Departure City" value={form.departureCity} onChange={handleChange} required />
          </div>

          <div className="form-grid">
            <input name="destination" placeholder="Destination" value={form.destination} onChange={handleChange} required />

            <select name="tripType" value={form.tripType} onChange={handleChange} required>
              <option value="">Trip Type</option>
              <option value="Domestic">Domestic (India)</option>
              <option value="International">International</option>
            </select>

            {/* 🔥 REAL CUSTOM DROPDOWN */}
            <CustomSelect
              placeholder="Trip Purpose"
              value={form.tripPurpose}
              onChange={value => setForm(prev => ({ ...prev, tripPurpose: value }))}
              options={[
                { value: "Leisure", label: "Leisure" },
                { value: "Honeymoon", label: "Honeymoon" },
                { value: "Family", label: "Family" },
                { value: "Adventure", label: "Adventure" },
                { value: "Spirituality", label: "Spirituality" },
                { value: "Workation", label: "Workation" }
              ]}
            />

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

            <input name="travelers" type="number" placeholder="Number of Travelers" value={form.travelers} onChange={handleChange} required />

            <div className="date-field">
              <label>Departure Date</label>
              <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
            </div>

            <input name="durationDays" type="number" placeholder="Trip Duration (Days)" value={form.durationDays} onChange={handleChange} required />
          </div>

          <textarea name="notes" placeholder="Preferences, must-see places, special requests" value={form.notes} onChange={handleChange} />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Get My Custom Itinerary"}
          </button>

          {success && (
            <div className="form-success">
              <strong>Inquiry submitted successfully</strong>
              <span>Our travel expert will contact you shortly.</span>
            </div>
          )}

          {error && !success && <div className="form-error">{error}</div>}
        </form>
      </div>
    </section>
  );
}
