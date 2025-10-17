import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSyncExternalStore } from "react";
import { isAuthed, isAdmin, getRoles } from "@/auth.ts";

// Single source of truth for login path
const LOGIN_PATH = "/login";

// Re-render guards when auth changes
function useAuthStoreSnapshot() {
  return useSyncExternalStore(
    (cb) => {
      const onChange = () => cb();
      window.addEventListener("auth:changed", onChange);
      window.addEventListener("storage", onChange);
      return () => {
        window.removeEventListener("auth:changed", onChange);
        window.removeEventListener("storage", onChange);
      };
    },
    () => localStorage.getItem("jwt") || ""
  );
}

/** Must be logged in */
export function RequireAuth() {
  useAuthStoreSnapshot();
  const loc = useLocation();
  if (!isAuthed()) {
    return <Navigate to={LOGIN_PATH} replace state={{ from: loc }} />;
  }
  return <Outlet />;
}

/** Must be Admin */
export function RequireAdmin() {
  useAuthStoreSnapshot();
  const loc = useLocation();
  if (!isAuthed()) {
    return <Navigate to={LOGIN_PATH} replace state={{ from: loc }} />;
  }
  if (!isAdmin()) {
    return (
      <Navigate
        to="/dashboard"
        replace
        state={{ flash: "Admin permission required.", from: loc }}
      />
    );
  }
  return <Outlet />;
}

/** Flexible role gate */
type RoleGuardProps = {
  anyOf?: string[]; // have ANY of these
  allOf?: string[]; // have ALL of these
  redirectTo?: string;
};

export function RequireRole({ anyOf, allOf, redirectTo = "/dashboard" }: RoleGuardProps) {
  useAuthStoreSnapshot();
  const loc = useLocation();

  if (!isAuthed()) {
    return <Navigate to={LOGIN_PATH} replace state={{ from: loc }} />;
  }

  const roles = getRoles();
  const okAny = !anyOf || anyOf.some((r) => roles.includes(r));
  const okAll = !allOf || allOf.every((r) => roles.includes(r));

  if (okAny && okAll) return <Outlet />;

  return (
    <Navigate
      to={redirectTo}
      replace
      state={{ flash: "You don't have permission.", from: loc }}
    />
  );
}
