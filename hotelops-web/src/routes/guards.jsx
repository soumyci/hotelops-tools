// src/routes/guards.jsx
import { Navigate, Outlet } from "react-router-dom";

export function RequireAuth() {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export function RequireRole({ role }) {
  const current = localStorage.getItem("role");
  return current === role ? <Outlet /> : <Navigate to="/login" replace />;
}
