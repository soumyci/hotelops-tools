// src/pages/corporate/CorporateHome.jsx
import React from "react";

export default function CorporateHome() {
  const spend = [
    { month: "Aug", nights: 42, spend: 212000 },
    { month: "Sep", nights: 55, spend: 278000 },
  ];
  const favHotels = [
    { name: "HotelOps Residency", city: "BLR", lastStay: "2025-09-28" },
    { name: "HotelOps Central", city: "HYD", lastStay: "2025-09-15" },
  ];

  return (
    <div className="container p-4">
      <h1>Corporate • Reports</h1>
      <p>Company travel insights and preferred hotels.</p>

      <section style={{marginTop:16}}>
        <h3>Monthly spend (demo)</h3>
        <table>
          <thead><tr><th>Month</th><th>Nights</th><th>Spend (₹)</th></tr></thead>
          <tbody>
            {spend.map((s,i) => (
              <tr key={i}>
                <td>{s.month}</td><td>{s.nights}</td><td>₹ {s.spend.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{marginTop:16}}>
        <h3>Preferred hotels</h3>
        <ul>
          {favHotels.map((h,i) => (
            <li key={i}>{h.name} • {h.city} • last stay {h.lastStay}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
