import { useEffect, useState } from "react";
import { getUpcomingBookings } from "../api/client";

export default function RecentBookings() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState(null);

  async function reloadUpcoming() {
    try {
      const data = await getUpcomingBookings();
      setRows(data);
      setErr(null);
    } catch (e) {
      setErr(e.message || String(e));
    }
  }

  useEffect(() => {
    reloadUpcoming();
    const onCreated = () => reloadUpcoming();
    window.addEventListener("booking:created", onCreated);
    return () => window.removeEventListener("booking:created", onCreated);
  }, []);

  if (err) return <div className="text-danger">Error: {err}</div>;

  return (
    <table className="table">
      <thead>
      <tr><th>ID</th><th>Guest</th><th>Check-in</th><th>Check-out</th><th>Room</th><th>Status</th></tr>
      </thead>
      <tbody>
      {rows.length === 0 ? (
        <tr><td colSpan="6" className="text-muted">No upcoming bookings (next 7 days).</td></tr>
      ) : rows.map(r => (
        <tr key={r.id}>
          <td>{r.id}</td>
          <td>{r.guest}</td>
          <td>{new Date(r.checkIn).toLocaleString()}</td>
          <td>{new Date(r.checkOut).toLocaleString()}</td>
          <td>{r.room}</td>
          <td>{r.status}</td>
        </tr>
      ))}
      </tbody>
    </table>
  );
}