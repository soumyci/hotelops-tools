import { NavLink, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex items-center justify-between py-4">
      <nav className="space-x-4">
        {role === "admin" && (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/admin/rooms">Rooms</NavLink>
            <NavLink to="/admin/roomtypes">Room Types</NavLink>
            <NavLink to="/admin/rateplans">Rate Plans</NavLink>
          </>
        )}
        {role === "corporate" && <NavLink to="/corporate">Dashboard</NavLink>}
        {role === "staff" && <NavLink to="/staff">Dashboard</NavLink>}
      </nav>

      <button onClick={logout} className="px-3 py-1 rounded bg-slate-200">
        Logout
      </button>
    </div>
  );
}
