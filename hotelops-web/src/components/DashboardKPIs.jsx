import { useEffect, useState } from "react";
import { getKpisSummary } from "../api/client";

export default function DashboardKPIs() {
  const [kpis, setKpis] = useState(null);
  const [err, setErr] = useState(null);

  async function reloadKpis() {
    try {
      const data = await getKpisSummary();
      setKpis(data);
      setErr(null);
    } catch (e) {
      setErr(e.message || String(e));
    }
  }

  useEffect(() => {
    reloadKpis(); // initial load
    const onCreated = () => reloadKpis();
    window.addEventListener("booking:created", onCreated);
    return () => window.removeEventListener("booking:created", onCreated);
  }, []);

  if (err) return <div style={{color:'crimson'}}>Error: {err}</div>;
  if (!kpis) return <div>Loading KPIs…</div>;

  const pct = Math.round((kpis.occupancy ?? 0) * 100);

  return (
    <div className="row g-3">
      <div className="col-6 col-md-3">
        <div className="card p-3">
          <div>Occupancy</div>
          <div className="fs-2 fw-bold">{pct}%</div>
        </div>
      </div>
      <div className="col-6 col-md-3">
        <div className="card p-3">
          <div>7-day Pickup</div>
          <div className="fs-2 fw-bold">{kpis.pickup7d ?? 0}</div>
        </div>
      </div>
      <div className="col-6 col-md-3">
        <div className="card p-3">
          <div>ARR</div>
          <div className="fs-2 fw-bold">₹ {kpis.arr ?? 0}</div>
        </div>
      </div>
      <div className="col-6 col-md-3">
        <div className="card p-3">
          <div>Revenue</div>
          <div className="fs-2 fw-bold">₹ {kpis.revenue ?? 0}</div>
        </div>
      </div>
    </div>
  );
}