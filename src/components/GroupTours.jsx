import { Clock } from "lucide-react";
import "./GroupTours.css";

export default function GroupTours({ activeCat, setActiveCat, tours }) {
  const categories = ["Trending", "International", "Domestic", "Weekend"];

  return (
    <section className="group-tours">
      {/* HEADER */}
      <div className="group-container">
        <h2>Upcoming Group Tours</h2>
        <p className="subtitle">
          Fixed departures with curated stays and expert planning
        </p>
      </div>

      {/* TABS */}
      <div className="tour-tabs">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`tab-btn ${activeCat === cat ? "active" : ""}`}
          >
            {cat}
          </button> 

        ))}
      </div>

      {/* GRID */}
      <div className="tour-grid">
        {tours.map(tour => (
          <div className="tour-card" key={tour.id}>
            <div className="tour-image">
              <img src={tour.img} alt={tour.name} />
              <div className="price">${tour.price}</div>
            </div>

            <div className="tour-body">
              <h3>{tour.name}</h3>

              <div className="days">
                <Clock size={16} /> {tour.days}
              </div>

              <button>Inquire Now</button>
            </div>
    

          </div>
        ))}
      </div>
      
    </section>
  );
}
