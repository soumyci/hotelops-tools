// src/components/Header.jsx
import { Link, useNavigate } from "react-router-dom";
import ApiStatus from "../components/ApiStatus";

// ✅ use a single source for auth helpers
import {
  isAuthed, clearToken, isAdmin, isHotel, isCorporate,
  currentRole, setDevRole, clearDevRole,
} from "@/auth";

export default function Header() {
  const nav = useNavigate();
  const role = currentRole() ?? "Guest";

  const NavLink = ({ to, children }) => (
    <Link to={to} style={{ textDecoration: "none" }}>{children}</Link>
  );

  const handleLogout = () => {
    clearToken();
    clearDevRole();
    nav("/login", { replace: true }); // or "/dev/login" if that's your entry
  };

  return (
    <header style={{
      display: "flex", alignItems: "center", gap: 16,
      padding: "10px 16px", borderBottom: "1px solid #eee",
      position: "sticky", top: 0, background: "#fff", zIndex: 10
    }}>
      <div style={{ fontWeight: 700 }}>HotelOps</div>

      {/* Primary nav */}
      <nav style={{ display: "flex", gap: 12 }}>
        <NavLink to="/dashboard">Dashboard</NavLink>

        {/* Admin menu */}
        {isAdmin() && (
          <>
            <span style={{ opacity: .5 }}>•</span>
            <NavLink to="/admin/room-types">Room Types</NavLink>
            <NavLink to="/admin/rate-plans">Rate Plans</NavLink>
            <NavLink to="/admin/rooms">Rooms</NavLink>
            <NavLink to="/admin/rates">Rates</NavLink>
          </>
        )}

        {/* Corporate portal example */}
        <span style={{ opacity: .5 }}>•</span>
        <NavLink to="/corporate">Corporate</NavLink>

        {/* Dev login (when unauth) */}
        {!isAuthed() && (
          <>
            <span style={{ opacity: .5 }}>•</span>
            <NavLink to="/login">Login</NavLink> {/* or /dev/login */}
          </>
        )}
      </nav>

      {/* Right side */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
        <ApiStatus />

        <span title="Current role (JWT or dev override)"
          style={{ fontSize: 12, padding: "4px 8px", border: "1px solid #ddd",
                   borderRadius: 999, background: "#f7f7f7" }}>
          {role}
        </span>

        {/* Quick persona switches (dev only) */}
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setDevRole("Admin")}>Admin</button>
          <button onClick={() => setDevRole("Hotel")}>Hotel</button>
          <button onClick={() => setDevRole("Corporate")}>Corporate</button>
          <button onClick={() => clearDevRole()}>JWT</button>
        </div>

        {isAuthed()
          ? <button onClick={handleLogout}>Logout</button>
          : <NavLink to="/login">Login</NavLink>}
      </div>
    </header>
  );
}
