import { useEffect, useState } from "react";

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
    <div style={styles.page}>
      <h1 style={styles.title}>Admin · Inquiries</h1>

      {loading && <p>Loading inquiries...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && inquiries.length === 0 && (
        <p>No inquiries found.</p>
      )}

      {!loading && inquiries.length > 0 && (
        <div style={styles.table}>
          <div style={{ ...styles.row, ...styles.head }}>
            <div>Name</div>
            <div>Email</div>
            <div>Phone</div>
            <div>Destination</div>
            <div>Start Date</div>
          </div>

          {inquiries.map((item) => (
            <div key={item.id} style={styles.row}>
              <div>{item.name || "-"}</div>
              <div>{item.email || "-"}</div>
              <div>{item.phone || "-"}</div>
              <div>{item.destination || "-"}</div>
              <div>{formatDate(item.startDate || item.createdAt)}</div>
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

  // ISO string
  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  // Firestore timestamp
  if (value._seconds) {
    return new Date(value._seconds * 1000).toISOString().slice(0, 10);
  }

  return "-";
}

/* -------- styles -------- */

const styles = {
  page: {
    padding: "40px",
    fontFamily: "Inter, system-ui, sans-serif",
    background: "#f8f9fb",
    minHeight: "100vh"
  },
  title: {
    marginBottom: "24px"
  },
  error: {
    color: "red"
  },
  table: {
    background: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)"
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1.2fr 2fr 1.2fr 2fr 1fr",
    padding: "14px 16px",
    borderBottom: "1px solid #eee",
    fontSize: "14px"
  },
  head: {
    fontWeight: 600,
    background: "#f1f3f6"
  }
};
