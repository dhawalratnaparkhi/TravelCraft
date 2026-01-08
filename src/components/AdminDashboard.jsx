import { useEffect, useState } from "react";
import "./admin-dashboard.css";

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState([]);
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
            <div key={item.id} className="admin-row">
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
