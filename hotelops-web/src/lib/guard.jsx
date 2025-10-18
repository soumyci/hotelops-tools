// src/routes/guards.jsx
import { Navigate, Outlet } from "react-router-dom";

function isSigned() {
  return !!localStorage.getItem("token") || !!localStorage.getItem("demoAuth");
}

function rolesFromStorage() {
  try { return JSON.parse(localStorage.getItem("roles") || "[]"); }
  catch { return []; }
}

function roleFromDemoHeader() {
  const demo = localStorage.getItem("demoAuth") || "";
  const m = demo.match(/role=([^;]+)/i);
  return m ? m[1] : null;
}

function hasAnyRole(need) {
  const have = rolesFromStorage();
  if (have.length) return need.some(r => have.includes(r));
  const one = roleFromDemoHeader();
  return one ? need.includes(one) : false;
}

export function RequireAuth() {
  return isSigned() ? <Outlet /> : <Navigate to="/login" replace />;
}

export function RequireRole({ roles = [], role }) {
  const required = role ? [role] : roles;
  return hasAnyRole(required) ? <Outlet /> : <Navigate to="/login" replace />;
}
