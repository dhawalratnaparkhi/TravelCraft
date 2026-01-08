import { useLocation } from "react-router-dom";
import { useState } from "react";
import "/src/components/custom-trip-form.css";


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
    departureCity: prefill.departureCity || ""
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

      if (!res.ok) throw new Error();

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

            <input name="destination" placeholder="Destination" value={form.destination} onChange={handleChange} required />

            <select name="tripType" value={form.tripType} onChange={handleChange} required>
              <option value="">Trip Type</option>
              <option value="Domestic">Domestic (India)</option>
              <option value="International">International</option>
            </select>

            <select name="tripPurpose" value={form.tripPurpose} onChange={handleChange} required>
              <option value="">Trip Purpose</option>
              <option value="Leisure">Leisure</option>
              <option value="Honeymoon">Honeymoon</option>
              <option value="Family">Family</option>
              <option value="Adventure">Adventure</option>
              <option value="Spirituality">Spirituality</option>
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

            <input name="travelers" type="number" placeholder="Number of Travelers" value={form.travelers} onChange={handleChange} required />
            <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
            <input name="durationDays" type="number" placeholder="Trip Duration (Days)" value={form.durationDays} onChange={handleChange} required />
          </div>

          <textarea
            name="notes"
            placeholder="Preferences, must-see places, special requests"
            value={form.notes}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Get My Custom Itinerary"}
          </button>

          {success && <div className="form-success">Inquiry submitted successfully</div>}
          {error && <div className="form-error">{error}</div>}
        </form>
      </div>
    </section>
  );
}
