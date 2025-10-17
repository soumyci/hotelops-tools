import { useEffect, useState } from "react";
import { getAvailability } from "../api/client";

export default function AvailabilityGrid({ year, month }) {
  const [grid, setGrid] = useState(null);
  const [err, setErr] = useState(null);

  async function reloadAvailability() {
    try {
      const data = await getAvailability(year, month);
      setGrid(data);
      setErr(null);
    } catch (e) {
      setErr(e.message || String(e));
    }
  }

  useEffect(() => { reloadAvailability(); }, [year, month]);

  useEffect(() => {
    const onCreated = () => reloadAvailability();
    window.addEventListener("booking:created", onCreated);
    return () => window.removeEventListener("booking:created", onCreated);
  }, []);

  if (err) return <div style={{color:'crimson'}}>Error: {err}</div>;
  if (!grid) return <div>Loading availability…</div>;

  return (
    <div className="mt-2">
      <div className="text-muted small mb-2">Legend: <span className="text-success">Available</span> <span className="ms-3 text-danger">Booked</span></div>
      <div className="d-flex flex-wrap gap-2">
        {grid.days.map(d => (
          <div key={d.date} className={`border rounded px-2 py-1 ${d.booked ? 'bg-danger-subtle' : 'bg-success-subtle'}`}>
            {d.day}
          </div>
        ))}
      </div>
    </div>
  );
}