import { useEffect, useState } from "react";
import { getToken, clearToken, authFetch } from "../api/auth";

export default function RequireAuth({ role, children }) {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const t = getToken();
      if (!t) { location.href = "/login"; return; }
      const res = await authFetch("/api/auth/me");
      if (!res.ok) { clearToken(); location.href = "/login"; return; }
      const me = await res.json();
      const roles = (me.roles || []).map(r => r.toLowerCase());
      const need = (role || "").toLowerCase();
      if (need && !roles.includes(need)) { location.href = "/login"; return; }
      if (!cancelled) setOk(true);
    })();
    return () => { cancelled = true; };
  }, [role]);

  if (!ok) return null;
  return children;
}