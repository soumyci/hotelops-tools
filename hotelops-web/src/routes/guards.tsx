// src/routes/guards.tsx
import * as React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

type UiRole = "admin" | "corporate" | "staff";
const LOGIN_PATH = "/login";

/* ---------- tiny auth store (localStorage) ---------- */
function readRole(): UiRole | null {
  const r = localStorage.getItem("role");
  return r === "admin" || r === "corporate" || r === "staff" ? r : null;
}
function readToken(): string | null {
  return localStorage.getItem("token");
}

function subscribe(cb: () => void) {
  const onStorage = () => cb();
  const onAuthChanged = () => cb();
  window.addEventListener("storage", onStorage);
  window.addEventListener("auth-changed", onAuthChanged);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("auth-changed", onAuthChanged);
  };
}
function useAuthSnapshot() {
  return React.useSyncExternalStore(
    subscribe,
    () => ({ role: readRole(), token: readToken() }),
    () => ({ role: readRole(), token: readToken() })
  );
}

/* ---------- Guards you import in routes ---------- */

// Require any authenticated user (token present)
export function RequireAuth() {
  const { token } = useAuthSnapshot();
  const location = useLocation();
  return token ? <Outlet /> : <Navigate to={LOGIN_PATH} state={{ from: location }} replace />;
}

// Require a specific UI role
export function RequireRole({ role }: { role: UiRole }) {
  const { role: currentRole } = useAuthSnapshot();
  const location = useLocation();
  return currentRole === role
    ? <Outlet />
    : <Navigate to={LOGIN_PATH} state={{ from: location }} replace />;
}

/* ---------- Optional shorthands ---------- */
export function RequireAdmin()   { return <RequireRole role="admin" />; }
export function RequireCorporate(){ return <RequireRole role="corporate" />; }
export function RequireStaff()   { return <RequireRole role="staff" />; }


