// src/App.jsx
import { NavLink, Outlet } from "react-router-dom";

export default function App() {
  return (
    <div>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 20px",
          borderBottom: "1px solid #eee",
        }}
      >
        <strong style={{ marginRight: 10 }}>HotelOps</strong>

        <NavLink to="/bookings" style={linkStyle}>
          Bookings
        </NavLink>
        <NavLink to="/payments" style={linkStyle}>
          Payments
        </NavLink>

        <span style={{ marginLeft: "auto", fontSize: 12, opacity: 0.7 }}>
          Demo · Admin / CorporateAdmin / Staff
        </span>
      </header>

      <main style={{ padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}

function linkStyle({ isActive }) {
  return {
    padding: "6px 10px",
    borderRadius: 8,
    textDecoration: "none",
    color: isActive ? "#0f172a" : "#334155",
    background: isActive ? "#e2e8f0" : "transparent",
    fontWeight: 600,
  };
}
