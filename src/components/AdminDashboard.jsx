import { useEffect, useState } from "react";
import "./admin-dashboard.css";

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState([]);
  const [tours, setTours] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newTour, setNewTour] = useState({
    name: "",
    cat: "Trending",
    price: "",
    days: "",
    img: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/admin/inquiries").then(res => res.json()),
      fetch("/api/admin/group-tours").then(res => res.json())
    ])
      .then(([inqRes, tourRes]) => {
        if (inqRes.success) setInquiries(inqRes.inquiries);
        if (tourRes.success) setTours(tourRes.tours);
      })
      .catch(() => {
        setError("Failed to load admin data");
      })
      .finally(() => setLoading(false));
  };

  const toggleTour = async (id) => {
    await fetch(`/api/admin/group-tours/${id}/toggle`, {
      method: "PATCH"
    });

    setTours(prev =>
      prev.map(t =>
        t.id === id ? { ...t, active: !t.active } : t
      )
    );
  };

  const createTour = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/admin/group-tours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTour)
    });

    const data = await res.json();

    if (data.success) {
      setNewTour({
        name: "",
        cat: "Trending",
        price: "",
        days: "",
        img: ""
      });
      loadData();
    } else {
      alert("Failed to create tour");
    }
  };

  return (
    <div className="admin-page">
      <h1 className="admin-title">Admin Dashboard</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="admin-error">{error}</p>}

      {/* CREATE TOUR */}
      <section className="admin-section">
        <h2>Add New Group Tour</h2>

        <form className="admin-form" onSubmit={createTour}>
          <input
            placeholder="Tour name"
            value={newTour.name}
            onChange={e => setNewTour({ ...newTour, name: e.target.value })}
            required
          />

          <select
            value={newTour.cat}
            onChange={e => setNewTour({ ...newTour, cat: e.target.value })}
          >
            <option>Trending</option>
            <option>International</option>
            <option>Domestic</option>
            <option>Weekend</option>
          </select>

          <input
            type="number"
            placeholder="Price"
            value={newTour.price}
            onChange={e => setNewTour({ ...newTour, price: e.target.value })}
            required
          />

          <input
            placeholder="Days (e.g. 6D/5N)"
            value={newTour.days}
            onChange={e => setNewTour({ ...newTour, days: e.target.value })}
            required
          />

          <input
            placeholder="Image URL"
            value={newTour.img}
            onChange={e => setNewTour({ ...newTour, img: e.target.value })}
            required
          />

          <button type="submit">Create Tour</button>
        </form>
      </section>

      {/* GROUP TOURS */}
      <section className="admin-section">
        <h2>Group Tours</h2>

        <div className="admin-table">
          <div className="admin-row header">
            <div>Name</div>
            <div>Category</div>
            <div>Price</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {tours.map(tour => (
            <div key={tour.id} className="admin-row">
              <div className="admin-cell">{tour.name}</div>
              <div className="admin-cell">{tour.cat}</div>
              <div className="admin-cell">₹{tour.price}</div>
              <div className="admin-cell">
                {tour.active ? "Active" : "Inactive"}
              </div>
              <div className="admin-cell">
                <button
                  onClick={() => toggleTour(tour.id)}
                  className={tour.active ? "btn-off" : "btn-on"}
                >
                  {tour.active ? "Disable" : "Enable"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INQUIRIES */}
      <section className="admin-section">
        <h2>Inquiries</h2>

        <div className="admin-table">
          <div className="admin-row header">
            <div>Name</div>
            <div>Email</div>
            <div>Phone</div>
            <div>Destination</div>
            <div>Start Date</div>
          </div>

          {inquiries.map(item => (
            <div
              key={item.id}
              className="admin-row"
              onClick={() => setSelected(item)}
              style={{ cursor: "pointer" }}
            >
              <div className="admin-cell">{item.name || "-"}</div>
              <div className="admin-cell">{item.email || "-"}</div>
              <div className="admin-cell">{item.phone || "-"}</div>
              <div className="admin-cell">{item.destination || "-"}</div>
              <div className="admin-cell">
                {formatDate(item.startDate || item.createdAt)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {selected && (
        <div className="admin-detail">
          <h2>Inquiry Details</h2>

          <div className="detail-grid">
            {Object.entries(selected).map(([key, value]) => (
              <div key={key} className="detail-row">
                <strong>{key}</strong>
                <span>{formatValue(value)}</span>
              </div>
            ))}
          </div>

          <button className="detail-close" onClick={() => setSelected(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

/* helpers */

function formatDate(value) {
  if (!value) return "-";
  if (typeof value === "string") return value.slice(0, 10);
  if (value._seconds) {
    return new Date(value._seconds * 1000).toISOString().slice(0, 10);
  }
  return "-";
}

function formatValue(value) {
  if (value === null || value === undefined) return "-";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}
