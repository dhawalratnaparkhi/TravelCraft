import { useEffect, useState } from "react";
import "./admin-dashboard.css";

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState([]);
  const [tours, setTours] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
  }, []);

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

  return (
    <div className="admin-page">
      <h1 className="admin-title">Admin Dashboard</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="admin-error">{error}</p>}

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
              <div className="admin-cell">${tour.price}</div>
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

/* -------- helpers -------- */

function formatDate(value) {
  if (!value) return "-";

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

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
