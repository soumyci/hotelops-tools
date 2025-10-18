import { Navigate, Outlet } from "react-router-dom";

/** For now: only require “some” auth marker so deep-links don’t bounce. */
function isSigned() {
  // treat presence of demoAuth OR token as signed-in
  return !!localStorage.getItem("demoAuth") || !!localStorage.getItem("token");
}

export function RequireAuth() {
  // TEMP: allow even if not signed, so nothing blocks navigation
  return <Outlet />;
}

/** TEMP: role checks disabled so nothing 403s from the client side */
export function RequireRole(/* { roles = [], role } */) {
  return <Outlet />;
}
