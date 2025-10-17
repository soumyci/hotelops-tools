import { NavLink, Outlet } from "react-router-dom";
import useLogout from "@/hooks/useLogout";

const LINKS = {
  admin: [
    { to: "/dashboard",        label: "Dashboard" },
    { to: "/admin/rooms",      label: "Rooms" },
    { to: "/admin/roomtypes",  label: "Room Types" },
    { to: "/admin/rateplans",  label: "Rate Plans" },
    { to: "/admin/amenities",  label: "Amenities" }
  ],
  corporate: [
    { to: "/corporate",            label: "Overview" },          // same page for now
    { to: "/corporate/bookings",   label: "Bookings" },
    { to: "/corporate/approvals",  label: "Approvals" },
    { to: "/corporate/offers",     label: "Offers & Discounts" },
    { to: "/corporate/combos",     label: "Combos" },
    { to: "/corporate/invoices",   label: "Invoices / Balance" },
  ],
  staff: [
    { to: "/staff",                label: "Overview" },          // same page for now
    { to: "/staff/bookings",       label: "Bookings" },
    { to: "/staff/availability",   label: "Availability" },
    { to: "/staff/payments",       label: "Payments" },
    { to: "/staff/corporates",     label: "Corporate A/R" },
  ],
};

export default function App() {
  const logout = useLogout();
  const authed = !!localStorage.getItem("token");
  const role = localStorage.getItem("role"); // "admin" | "corporate" | "staff"
  const links = LINKS[role] ?? [];

  return (
    <div>
      <header style={{ display:'flex', gap:16, padding:'12px 20px', borderBottom:'1px solid #eee' }}>
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              padding: "6px 10px",
              borderRadius: 8,
              textDecoration: "none",
              color: isActive ? "#0f172a" : "#334155",
              background: isActive ? "#e2e8f0" : "transparent",
              fontWeight: 600,
            })}
          >
            {label}
          </NavLink>
        ))}

        <div style={{ marginLeft: "auto" }}>
          {authed ? (
            <button onClick={logout}>Logout</button>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </div>
      </header>

      <main style={{ padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}
