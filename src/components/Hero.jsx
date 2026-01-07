import "../styles/hero.css";

export default function Hero({ onPlan, onGroup }) {
  return (
    <header className="hero">
      <div
        className="hero-bg"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920)"
        }}
      />
      <div className="hero-overlay" />

      <div className="hero-content">
        <h1>
          Your Journey,<br />
          <span>Our Masterpiece.</span>
        </h1>

        <p>
          Bespoke travel experiences crafted for modern explorers.
          Fully customized or expertly curated group tours.
        </p>

        <div className="hero-actions">
          <button className="btn-primary" onClick={onPlan}>
            Design My Trip
          </button>
          <button className="btn-secondary" onClick={onGroup}>
            Explore Group Tours
          </button>
        </div>
      </div>
    </header>
  );
}
