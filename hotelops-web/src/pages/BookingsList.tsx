// src/pages/BookingsList.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listBookings, type Booking } from "../api/bookings";

export default function BookingsList() {
  const [rows, setRows] = useState<Booking[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setBusy(true);
        setErr(null);
        const data = await listBookings();
        setRows(data);
      } catch (e: any) {
        setErr(e?.message || "Failed to load bookings.");
      } finally {
        setBusy(false);
      }
    })();
  }, []);

  return (
    <section style={{ maxWidth: 780 }}>
      <header style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <h2 style={{ margin: "8px 0 20px" }}>Bookings</h2>
        <Link
          to="/bookings/new"
          style={{
            marginLeft: "auto",
            display: "inline-block",
            padding: "8px 12px",
            borderRadius: 8,
            background: "#000",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          New
        </Link>
      </header>

      {busy && <p>Loading…</p>}
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      {!busy && !err && rows.length === 0 && <p>No bookings yet.</p>}

      {!busy && !err && rows.length > 0 && (
        <ul style={{ padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
          {rows.map((b) => (
            <li
              key={b.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: 12,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>{b.guestName}</div>
                <div style={{ fontSize: 13, color: "#475569" }}>
                  {new Date(b.checkIn).toLocaleDateString()} →{" "}
                  {new Date(b.checkOut).toLocaleDateString()}
                </div>
              </div>
              <div style={{ opacity: 0.5, fontSize: 12 }}>{b.id}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
