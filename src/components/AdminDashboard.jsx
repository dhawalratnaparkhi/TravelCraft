import { useEffect, useState } from "react";
import "./admin-dashboard.css";

export default function AdminDashboard() {
  /* ---------- AUTH ---------- */
  const [pin, setPin] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  /* ---------- DATA ---------- */
  const [inquiries, setInquiries] = useState([]);
  const [tours, setTours] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const [newTour, setNewTour] = useState({
    name: "",
    cat: "Trending",
    price: "",
    days: "",
    img: ""
  });

  /* ---------- VERIFY PIN ---------- */
  const verifyPin = async () => {
    setAuthError("");

    const res = await fetch("/api/admin/verify-pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin })
    });

    if (res.ok) {
      setAuthenticated(true);
      loadData(pin);
    } else {
      setAuthError("Invalid PIN");
    }
  };

  /* ---------- LOAD ADMIN DATA ---------- */
  const loadData = async (adminPin) => {
    setLoading(true);

    try {
      const [inqRes, tourRes] = await Promise.all([
        fetch("/api/admin/inquiries", {
          headers: { "x-admin-pin": adminPin }
        }).then(r => r.json()),

        fetch("/api/admin/group-tours", {
          headers: { "x-admin-pin": adminPin }
        }).then(r => r.json())
      ]);

      setInquiries(inqRes.inquiries || []);
      setTours(tourRes.tours || []);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- ACTIONS ---------- */
  const toggleTour = async (id) => {
    await fetch(`/api/admin/group-tours/${id}/toggle`, {
      method: "PATCH",
      headers: { "x-admin-pin": pin }
    });

    setTours(prev =>
      prev.map(t => (t.id === id ? { ...t, active: !t.active } : t))
    );
  };

  const createTour = async (e) => {
    e.preventDefault();

    await fetch("/api/admin/group-tours", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-pin": pin
      },
      body: JSON.stringify(newTour)
    });

    setNewTour({
      name: "",
      cat: "Trending",
      price: "",
      days: "",
      img: ""
    });

    loadData(pin);
  };

  /* ---------- LOGIN ---------- */
  if (!authenticated) {
    return (
      <div className="admin-page">
        <h1 className="admin-title">Admin Login</h1>

        <input
          type="password"
          placeholder="Enter Admin PIN"
          value={pin}
          onChange={e => setPin(e.target.value)}
          className="admin-pin-input"
        />

        <button className="admin-pin-btn" onClick={verifyPin}>
          Enter
        </button>

        {authError && <p className="admin-error">{authError}</p>}
      </div>
    );
  }

  /* ---------- DASHBOARD ---------- */
  return (
    <div className="admin-page">
      <h1 className="admin-title">Admin Dashboard</h1>

      {loading && <p>Loading...</p>}

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
    </div>
  );
}
