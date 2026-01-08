import { useEffect, useState } from "react";
import "./admin-dashboard.css";

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/inquiries")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setInquiries(data.inquiries);
        } else {
          setError("Failed to load inquiries");
        }
      })
      .catch(() => {
        setError("Server error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="admin-page">
      <h1 className="admin-title">Admin · Inquiries</h1>

      {loading && <p>Loading inquiries...</p>}
      {error && <p className="admin-error">{error}</p>}

      {!loading && !error && inquiries.length === 0 && (
        <p>No inquiries found.</p>
      )}

      {!loading && inquiries.length > 0 && (
        <div className="admin-table">
          <div className="admin-row header">
            <div>Name</div>
            <div>Email</div>
            <div>Phone</div>
            <div>Destination</div>
            <div>Start Date</div>
          </div>

          {inquiries.map((item) => (
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
      )}

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
