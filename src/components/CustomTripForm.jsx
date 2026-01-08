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

  // Auto-filled from AI Planner (if present)
  destination: prefill.destination || "",
  departureCity: prefill.departureCity || "",
  tripType: prefill.tripType || "",
  travelMode: prefill.travelMode || "",
  pace: prefill.pace || "",
  durationDays: prefill.durationDays || "",
  tripPurpose: prefill.tripPurpose || "",
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
  console.log("Sending payload:", form);

  try {
    const res = await fetch("/api/custom-trip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    console.log("HTTP STATUS:", res.status);

    const data = await res.json();
    console.log("API RESPONSE:", data);

    alert("Request completed. Check console.");
  } catch (err) {
    console.error("FETCH ERROR:", err);
    alert("Fetch failed. Check console.");
  }
}




  return (
    <section className="custom-form-section">
      <div className="custom-form-container">
        <h2>Your Custom Journey</h2>

        <form className="custom-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            
            <input
              name="name"
              placeholder="Full Name *"
              value={form.name}
              onChange={handleChange}
              required
    
            />

            <input
              name="phone"
              placeholder="Phone Number *"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address *"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              name="departureCity"
              placeholder="Departure City *"
              value={form.departureCity}
              onChange={handleChange}
              required
            />

            <input
              name="destination"
              placeholder="Destination *"
              value={form.destination}
              onChange={handleChange}
              required
            />

            {/* Trip Type */}
            <CustomSelect
              placeholder="Trip Type"
              value={form.tripType}
              onChange={value =>
                setForm(prev => ({ ...prev, tripType: value }))
              }
              options={[
                { value: "Domestic", label: "Domestic (India)" },
                { value: "International", label: "International" }
              ]}
            />

            {/* Trip Purpose */}
            <CustomSelect
              placeholder="Trip Purpose"
              value={form.tripPurpose}
              onChange={value =>
                setForm(prev => ({ ...prev, tripPurpose: value }))
              }
              options={[
                { value: "Leisure", label: "Leisure" },
                { value: "Honeymoon", label: "Honeymoon" },
                { value: "Family", label: "Family" },
                { value: "Adventure", label: "Adventure" },
                { value: "Spirituality", label: "Spirituality" },
                { value: "Workation", label: "Workation" }
              ]}
            />

            {/* Travel Mode */}
            <CustomSelect
              placeholder="Preferred Travel Mode"
              value={form.travelMode}
              onChange={value =>
                setForm(prev => ({ ...prev, travelMode: value }))
              }
              options={[
                { value: "Flight", label: "Flight" },
                { value: "Train", label: "Train" },
                { value: "Road", label: "Road Trip" }
              ]}
            />

            {/* Pace */}
            <CustomSelect
              placeholder="Travel Pace"
              value={form.pace}
              onChange={value =>
                setForm(prev => ({ ...prev, pace: value }))
              }
              options={[
                { value: "Relaxed", label: "Relaxed" },
                { value: "Balanced", label: "Balanced" },
                { value: "Fast", label: "Fast-paced" }
              ]}
            />

            <input
              name="travelers"
              type="number"
              placeholder="Number of Travelers"
              value={form.travelers}
              onChange={handleChange}
              required
            />

            <input
              name="startDate"
              type="date"
              placeholder="Departure Date"
              value={form.startDate}
              onChange={handleChange}
              required
            />
              
            <input
              name="durationDays"
              type="number"
              placeholder="Trip Duration (Days)"
              value={form.durationDays}
              onChange={handleChange}
              required
            />
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

          {success && (
            <div className="form-success">
              Inquiry submitted successfully
            </div>
          )}

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
