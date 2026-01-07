import { useLocation } from "react-router-dom";
import "./custom-trip-form.css";

export default function CustomTripForm() {
  const location = useLocation();
  const prefill = location.state || {};

  return (
    <section className="custom-form-section">
      <div className="custom-form-container">
        <h2>Your Custom Journey.</h2>

        <form className="custom-form">
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

          <textarea
            name="notes"
            placeholder="Traveler count, Budget, Hotel preference, etc."
            rows="5"
            defaultValue={prefill.notes || ""}
          />

          <button type="submit">
            Get My Masterpiece Itinerary
          </button>
        </form>
      </div>
    </section>
  );
}
