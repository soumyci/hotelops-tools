// src/pages/BookingForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../api/bookings";

export default function BookingForm() {
  const nav = useNavigate();
  const [guestName, setGuestName] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!guestName || !checkIn || !checkOut) {
      setErr("Please fill all fields.");
      return;
    }
    if (new Date(checkOut) < new Date(checkIn)) {
      setErr("Check-out must be after check-in.");
      return;
    }

    try {
      setBusy(true);
      await createBooking({
        guestName,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
      });
      nav("/bookings");
    } catch (e: any) {
      setErr(e?.message || "Failed to create booking.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section style={{ maxWidth: 640 }}>
      <h2 style={{ margin: "8px 0 20px" }}>New booking</h2>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Guest name</span>
          <input
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Guest name"
            style={{ padding: 10, borderRadius: 8, border: "1px solid #e5e7eb" }}
          />
        </label>

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Check-in</span>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              style={{ padding: 10, borderRadius: 8, border: "1px solid #e5e7eb" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Check-out</span>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              style={{ padding: 10, borderRadius: 8, border: "1px solid #e5e7eb" }}
            />
          </label>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="submit"
            disabled={busy}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              background: "#000",
              color: "#fff",
              border: 0,
              fontWeight: 600,
            }}
          >
            {busy ? "Creating…" : "Create"}
          </button>

          <button
            type="button"
            onClick={() => nav("/bookings")}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              background: "#e5e7eb",
              border: 0,
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
