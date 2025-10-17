// src/pages/hotel/HotelHome.jsx
import React from "react";

export default function HotelHome() {
  // mock data for demo
  const arrivals = [
    { resNo: "R-1201", guest: "Karthik S", room: "DLX-101", eta: "14:00" },
    { resNo: "R-1205", guest: "Anusha P", room: "STD-202", eta: "16:30" },
  ];
  const inhouse = [
    { room: "SUI-501", guest: "Mr. & Mrs. Rao", nights: 3 },
    { room: "DLX-103", guest: "Maya D", nights: 1 },
  ];

  return (
    <div className="container p-4">
      <h1>Hotel • Operations</h1>
      <p>Snapshot for front desk / ops.</p>

      <section style={{marginTop:16}}>
        <h3>Arrivals today</h3>
        <table>
          <thead><tr><th>Res #</th><th>Guest</th><th>Room</th><th>ETA</th></tr></thead>
          <tbody>
            {arrivals.map(a => (
              <tr key={a.resNo}>
                <td>{a.resNo}</td><td>{a.guest}</td><td>{a.room}</td><td>{a.eta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{marginTop:16}}>
        <h3>In-house</h3>
        <table>
          <thead><tr><th>Room</th><th>Guest</th><th>Nights</th></tr></thead>
          <tbody>
            {inhouse.map((r,i) => (
              <tr key={i}>
                <td>{r.room}</td><td>{r.guest}</td><td>{r.nights}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
